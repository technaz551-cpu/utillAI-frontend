"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Activity, ArrowDown, ArrowUp, Monitor, Server } from "lucide-react";
import { card } from "@/lib/utils";

type Phase = "idle" | "connecting" | "download" | "upload" | "done" | "error";

interface Results {
  idlePingMs: number;
  downloadPingMs: number;
  uploadPingMs: number;
  downloadMbps: number;
  uploadMbps: number;
}

interface ConnectionInfo {
  ip: string;
  colo: string;
  loc: string;
}

const CF_DOWN = "https://speed.cloudflare.com/__down";
const CF_UP = "https://speed.cloudflare.com/__up";
const CF_TRACE = "https://speed.cloudflare.com/cdn-cgi/trace";

const DOWNLOAD_STREAMS = 6;
const UPLOAD_STREAMS = 4;
const WARMUP_MS = 1500;
const TEST_MS = 12000;
const CHUNK_DOWN = 25_000_000;
const CHUNK_UP = 2_000_000;
const GAUGE_MARKS = [0, 5, 10, 50, 100, 250, 500, 750, 1000];

function formatMbps(mbps: number) {
  if (!mbps || !Number.isFinite(mbps)) return "—";
  return mbps >= 100 ? mbps.toFixed(0) : mbps >= 10 ? mbps.toFixed(1) : mbps.toFixed(2);
}

function speedToAngle(mbps: number): number {
  if (mbps <= 0) return -90;
  if (mbps >= 1000) return 90;
  for (let i = 0; i < GAUGE_MARKS.length - 1; i++) {
    const lo = GAUGE_MARKS[i];
    const hi = GAUGE_MARKS[i + 1];
    if (mbps <= hi) {
      const t = (mbps - lo) / (hi - lo);
      const aLo = -90 + (i / (GAUGE_MARKS.length - 1)) * 180;
      const aHi = -90 + ((i + 1) / (GAUGE_MARKS.length - 1)) * 180;
      return aLo + t * (aHi - aLo);
    }
  }
  return 90;
}

function parseTrace(text: string): ConnectionInfo {
  const map: Record<string, string> = {};
  for (const line of text.trim().split("\n")) {
    const i = line.indexOf("=");
    if (i > 0) map[line.slice(0, i)] = line.slice(i + 1);
  }
  return { ip: map.ip ?? "", colo: map.colo ?? "", loc: map.loc ?? "" };
}

async function fetchConnectionInfo(signal?: AbortSignal): Promise<ConnectionInfo> {
  const text = await fetch(`${CF_TRACE}?t=${Date.now()}`, { cache: "no-store", signal }).then((r) => r.text());
  return parseTrace(text);
}

async function pingOnce(signal?: AbortSignal): Promise<number> {
  const start = performance.now();
  await fetch(`${CF_TRACE}?t=${Date.now()}`, { cache: "no-store", signal });
  return performance.now() - start;
}

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function measureIdlePing(samples: number, signal: AbortSignal): Promise<number> {
  const times: number[] = [];
  for (let i = 0; i < samples; i++) {
    if (signal.aborted) break;
    times.push(await pingOnce(signal));
    await new Promise((r) => setTimeout(r, 80));
  }
  return median(times);
}

function startLoadedPingSampler(signal: AbortSignal, active: () => boolean, onSample: (ms: number) => void) {
  const times: number[] = [];
  const id = setInterval(async () => {
    if (!active() || signal.aborted) return;
    try {
      const ms = await pingOnce(signal);
      times.push(ms);
      onSample(ms);
    } catch { /* ignore during heavy load */ }
  }, 450);
  return () => {
    clearInterval(id);
    return median(times);
  };
}

/** Parallel-stream sustained test (same approach as Speedtest multi-connection mode). */
async function measureThroughput(
  direction: "down" | "up",
  streams: number,
  onProgress: (mbps: number) => void,
  signal: AbortSignal,
): Promise<number> {
  const start = performance.now();
  const measureFrom = start + WARMUP_MS;
  const endAt = start + WARMUP_MS + TEST_MS;
  let bytesAfterWarmup = 0;
  let totalBytes = 0;
  const window: { t: number; bytes: number }[] = [{ t: start, bytes: 0 }];

  const tick = (added: number) => {
    totalBytes += added;
    const now = performance.now();
    if (now >= measureFrom) bytesAfterWarmup += added;
    window.push({ t: now, bytes: totalBytes });
    while (window.length > 2 && window[0].t < now - 1000) window.shift();
    if (now >= measureFrom && window.length >= 2) {
      const dt = (window[window.length - 1].t - window[0].t) / 1000;
      const db = window[window.length - 1].bytes - window[0].bytes;
      if (dt > 0.25) onProgress((db * 8) / dt / 1_000_000);
    }
  };

  const worker = async () => {
    while (performance.now() < endAt) {
      if (signal.aborted) return;
      if (direction === "down") {
        const res = await fetch(`${CF_DOWN}?bytes=${CHUNK_DOWN}&r=${Math.random()}`, { cache: "no-store", signal });
        tick((await res.arrayBuffer()).byteLength);
      } else {
        const body = new Blob([new Uint8Array(CHUNK_UP)]);
        await fetch(`${CF_UP}?r=${Math.random()}`, { method: "POST", body, cache: "no-store", signal });
        tick(body.size);
      }
    }
  };

  await Promise.all(Array.from({ length: streams }, worker));
  const seconds = (endAt - measureFrom) / 1000;
  return seconds > 0 ? (bytesAfterWarmup * 8) / seconds / 1_000_000 : 0;
}

export function SpeedTestTool() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [liveDownload, setLiveDownload] = useState(0);
  const [liveUpload, setLiveUpload] = useState(0);
  const [livePing, setLivePing] = useState(0);
  const [liveLoadedPing, setLiveLoadedPing] = useState(0);
  const [results, setResults] = useState<Results | null>(null);
  const [conn, setConn] = useState<ConnectionInfo | null>(null);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const phaseRef = useRef<Phase>("idle");

  useEffect(() => {
    fetchConnectionInfo().then(setConn).catch(() => {});
  }, []);

  const reset = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    phaseRef.current = "idle";
    setPhase("idle");
    setLiveDownload(0);
    setLiveUpload(0);
    setLivePing(0);
    setLiveLoadedPing(0);
    setResults(null);
    setError("");
  };

  const run = useCallback(async () => {
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;
    setResults(null);
    setError("");
    setLiveDownload(0);
    setLiveUpload(0);
    setLivePing(0);
    setLiveLoadedPing(0);
    phaseRef.current = "connecting";
    setPhase("connecting");

    try {
      const [idlePingMs, info] = await Promise.all([
        measureIdlePing(12, abort.signal),
        fetchConnectionInfo(abort.signal).catch(() => null),
      ]);
      if (info) setConn(info);
      setLivePing(idlePingMs);

      phaseRef.current = "download";
      setPhase("download");
      const stopDlPing = startLoadedPingSampler(abort.signal, () => phaseRef.current === "download", setLiveLoadedPing);
      const downloadMbps = await measureThroughput("down", DOWNLOAD_STREAMS, setLiveDownload, abort.signal);
      const downloadPingMs = stopDlPing() || idlePingMs;

      phaseRef.current = "upload";
      setPhase("upload");
      setLiveLoadedPing(0);
      const stopUlPing = startLoadedPingSampler(abort.signal, () => phaseRef.current === "upload", setLiveLoadedPing);
      const uploadMbps = await measureThroughput("up", UPLOAD_STREAMS, setLiveUpload, abort.signal);
      const uploadPingMs = stopUlPing() || idlePingMs;

      setResults({ idlePingMs, downloadPingMs, uploadPingMs, downloadMbps, uploadMbps });
      phaseRef.current = "done";
      setPhase("done");
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError("Speed test failed. Close other downloads or VPN and try again.");
      phaseRef.current = "error";
      setPhase("error");
    }
  }, []);

  const running = phase === "connecting" || phase === "download" || phase === "upload";
  const dl = results?.downloadMbps ?? liveDownload;
  const ul = results?.uploadMbps ?? liveUpload;
  const gaugeSpeed =
    phase === "download" ? liveDownload :
    phase === "upload" ? liveUpload :
    phase === "done" ? ul : 0;

  return (
    <div className={card("overflow-hidden !p-0")}>
      {/* Top stats — Speedtest-style */}
      <div className="grid grid-cols-2 border-b border-[var(--border)]">
        <StatBlock label="Download" unit="Mbps" value={formatMbps(dl)} active={phase === "download"} />
        <StatBlock label="Upload" unit="Mbps" value={formatMbps(ul)} active={phase === "upload"} border />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 border-b border-[var(--border)] px-6 py-4 text-sm">
        <PingGroup label="Idle" ms={results?.idlePingMs ?? (phase === "connecting" ? Math.round(livePing) : "—")} icon="idle" active={phase === "connecting"} />
        <PingGroup label="Download" ms={results?.downloadPingMs ?? (phase === "download" ? Math.round(liveLoadedPing) : "—")} icon="down" active={phase === "download"} />
        <PingGroup label="Upload" ms={results?.uploadPingMs ?? (phase === "upload" ? Math.round(liveLoadedPing) : "—")} icon="up" active={phase === "upload"} />
      </div>

      {/* Gauge */}
      <div className="relative px-4 py-6">
        <SpeedGauge speed={gaugeSpeed} phase={phase} running={running} onGo={run} />
        {running && (
          <p className="mt-2 text-center text-sm text-[var(--muted)]">
            {phase === "connecting" && "Finding optimal server…"}
            {phase === "download" && `Testing download (${DOWNLOAD_STREAMS} connections)…`}
            {phase === "upload" && `Testing upload (${UPLOAD_STREAMS} connections)…`}
          </p>
        )}
      </div>

      {/* Connection info */}
      <div className="grid grid-cols-2 gap-px border-t border-[var(--border)] bg-[var(--border)]">
        <div className="flex items-center gap-3 bg-[var(--surface)] px-5 py-4">
          <Monitor className="h-5 w-5 shrink-0 text-[var(--muted)]" />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">Your connection</p>
            <p className="truncate text-sm font-medium">{conn?.ip || "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[var(--surface)] px-5 py-4">
          <Server className="h-5 w-5 shrink-0 text-[var(--muted)]" />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">Test server</p>
            <p className="truncate text-sm font-medium">
              Cloudflare {conn?.colo ? `(${conn.colo})` : ""}{conn?.loc ? ` · ${conn.loc}` : ""}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="border-t border-red-500/20 bg-red-500/5 px-5 py-3 text-sm text-red-300">{error}</div>
      )}

      {(phase === "done" || phase === "error") && (
        <div className="flex justify-center gap-3 border-t border-[var(--border)] px-5 py-4">
          <button
            type="button"
            onClick={run}
            className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
          >
            Test again
          </button>
          {phase === "done" && (
            <button type="button" onClick={reset} className="rounded-full border border-[var(--border)] px-6 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
              Reset
            </button>
          )}
        </div>
      )}

      <p className="border-t border-[var(--border)] px-5 py-3 text-center text-[10px] text-[var(--muted)]">
        Uses Cloudflare&apos;s speed endpoints with {DOWNLOAD_STREAMS} parallel download streams — same multi-connection method as{" "}
        <a href="https://www.speedtest.net/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--foreground)]">
          Speedtest.net
        </a>
        . Close other tabs and downloads for best accuracy.
      </p>
    </div>
  );
}

function StatBlock({ label, unit, value, active, border }: { label: string; unit: string; value: string; active: boolean; border?: boolean }) {
  return (
    <div className={`px-6 py-5 text-center ${border ? "border-l border-[var(--border)]" : ""} ${active ? "bg-violet-500/5" : ""}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-[10px] text-[var(--muted)]">{unit}</p>
      <p className={`mt-2 font-mono text-3xl font-semibold tabular-nums ${active ? "text-violet-300" : "text-[var(--foreground)]"}`}>{value}</p>
    </div>
  );
}

function PingGroup({ label, ms, icon, active }: { label: string; ms: number | string; icon: "idle" | "down" | "up"; active: boolean }) {
  const Icon = icon === "down" ? ArrowDown : icon === "up" ? ArrowUp : Activity;
  return (
    <div className={`flex items-center gap-2 ${active ? "text-violet-300" : "text-[var(--muted)]"}`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="text-xs">{label}</span>
      <span className="font-mono text-sm font-medium tabular-nums text-[var(--foreground)]">
        {typeof ms === "number" ? Math.round(ms) : ms}
      </span>
    </div>
  );
}

function SpeedGauge({ speed, phase, running, onGo }: { speed: number; phase: Phase; running: boolean; onGo: () => void }) {
  const angle = speedToAngle(speed);
  const rad = (angle * Math.PI) / 180;
  const cx = 160, cy = 150, r = 110;
  const nx = cx + r * Math.cos(rad - Math.PI / 2);
  const ny = cy + r * Math.sin(rad - Math.PI / 2);

  const arcPath = describeArc(cx, cy, r, -180, 0);

  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <svg viewBox="0 0 320 180" className="w-full" aria-hidden>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <path d={arcPath} fill="none" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
        <path d={arcPath} fill="none" stroke="url(#gaugeGrad)" strokeWidth="14" strokeLinecap="round" opacity="0.35" />
        {GAUGE_MARKS.map((mark, i) => {
          const a = (-90 + (i / (GAUGE_MARKS.length - 1)) * 180) * (Math.PI / 180);
          const tx = cx + (r + 18) * Math.cos(a - Math.PI / 2);
          const ty = cy + (r + 18) * Math.sin(a - Math.PI / 2);
          return (
            <text key={mark} x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
              {mark}
            </text>
          );
        })}
        {running && speed > 0 && (
          <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        )}
        <circle cx={cx} cy={cy} r="6" fill="#334155" />
        <circle cx={cx} cy={cy} r="3" fill="white" />
      </svg>

      <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
        {phase === "idle" || phase === "error" ? (
          <button
            type="button"
            onClick={onGo}
            className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-lg font-bold text-white shadow-xl shadow-violet-600/30 transition hover:scale-105 hover:brightness-110"
          >
            GO
          </button>
        ) : running ? (
          <div className="text-center">
            <p className="font-mono text-4xl font-semibold tabular-nums text-white">
              {phase === "connecting" ? "…" : formatMbps(speed)}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-[var(--muted)]">
              {phase === "download" ? "Mbps ↓" : phase === "upload" ? "Mbps ↑" : "ms"}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="font-mono text-3xl font-semibold tabular-nums text-violet-300">{formatMbps(speed)}</p>
            <p className="mt-1 text-xs text-emerald-400/90">Complete</p>
          </div>
        )}
      </div>
    </div>
  );
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, r, endDeg);
  const end = polar(cx, cy, r, startDeg);
  return `M ${start.x} ${start.y} A ${r} ${r} 0 0 0 ${end.x} ${end.y}`;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
