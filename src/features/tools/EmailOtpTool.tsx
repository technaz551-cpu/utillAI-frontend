// "use client";

// import { useEffect, useState } from "react";
// import { Copy, Download, KeyRound, Mail, Play, RotateCcw, Shield, ShieldCheck } from "lucide-react";
// import { btn, card, inputClass } from "@/lib/utils";
// import type { ToolMeta, ToolStat } from "@/features/tools/client-processors";
// import { INTERNET_PROCESSORS } from "@/features/tools/internet-processors";

// type EmailOtpAction = "generate-random-email" | "generate-otp" | "verify-otp";

// const CHOICES: Array<{ id: EmailOtpAction; name: string; hint: string; icon: typeof Mail }> = [
//   { id: "generate-random-email", name: "Random Email", hint: "Create an address on a domain you choose.", icon: Mail },
//   { id: "generate-otp", name: "Generate OTP", hint: "Create a one-time password with an expiry window.", icon: KeyRound },
//   { id: "verify-otp", name: "Verify OTP", hint: "Check a code against the last OTP from this browser.", icon: ShieldCheck },
// ];

// function processLabel(status: string, action: EmailOtpAction | null) {
//   if (status === "processing") return "Processing…";
//   if (action === "generate-random-email") return "Generate email";
//   if (action === "generate-otp") return "Generate OTP";
//   if (action === "verify-otp") return "Verify OTP";
//   return "Process";
// }

// export function EmailOtpTool({ tool }: { tool: ToolMeta }) {
//   const [action, setAction] = useState<EmailOtpAction | null>(null);
//   const [domain, setDomain] = useState("example.com");
//   const [usernameLength, setUsernameLength] = useState("10");
//   const [otpLength, setOtpLength] = useState("6");
//   const [expirySeconds, setExpirySeconds] = useState("300");
//   const [userOtp, setUserOtp] = useState("");
//   const [output, setOutput] = useState("");
//   const [stats, setStats] = useState<ToolStat[] | null>(null);
//   const [error, setError] = useState("");
//   const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

//   const canRun = action === "generate-random-email" || action === "generate-otp" || (action === "verify-otp" && userOtp.trim().length > 0);

//   useEffect(() => {
//     setAction(null);
//     setDomain("example.com");
//     setUsernameLength("10");
//     setOtpLength("6");
//     setExpirySeconds("300");
//     setUserOtp("");
//     setOutput("");
//     setStats(null);
//     setError("");
//     setStatus("idle");
//   }, [tool.slug]);

//   const chooseAction = (next: EmailOtpAction) => {
//     const keepResult = action === "generate-otp" && next === "verify-otp";
//     setAction(next);
//     setStatus("idle");
//     setError("");
//     if (!keepResult) {
//       setOutput("");
//       setStats(null);
//     }
//   };

//   const run = async () => {
//     if (!action || !canRun) return;
//     const processor = INTERNET_PROCESSORS[action];
//     if (!processor) {
//       setError("Tool processor not implemented");
//       setStatus("error");
//       return;
//     }
//     setStatus("processing");
//     setError("");
//     try {
//       const result = await Promise.resolve(processor("", {
//         domain,
//         usernameLength,
//         otpLength,
//         expirySeconds,
//         userOtp,
//       }));
//       if (result.error) {
//         setError(result.error);
//         setOutput("");
//         setStats(null);
//         setStatus("error");
//       } else {
//         setOutput(result.output);
//         setStats(result.stats?.length ? result.stats : null);
//         setStatus("success");
//       }
//     } catch (e) {
//       setError((e as Error).message);
//       setStatus("error");
//     }
//   };

//   const clear = () => {
//     setAction(null);
//     setDomain("example.com");
//     setUsernameLength("10");
//     setOtpLength("6");
//     setExpirySeconds("300");
//     setUserOtp("");
//     setOutput("");
//     setStats(null);
//     setError("");
//     setStatus("idle");
//   };

//   const copy = () => navigator.clipboard.writeText(output);
//   const download = () => {
//     const blob = new Blob([output], { type: "text/plain" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = `${action || tool.slug}-result.txt`;
//     a.click();
//   };

//   const choiceClass = (selected: boolean) =>
//     `flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
//       selected
//         ? "border-[var(--accent)] bg-[var(--accent-soft)]"
//         : "border-[var(--border)] bg-[#0d121c] hover:border-[var(--accent)]"
//     }`;

//   return (
//     <div className={card()}>
//       <div className="mb-5 flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
//         <Shield className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
//         <p className="text-xs leading-relaxed text-cyan-200/80">
//           Runs locally in your browser — your input is never sent to our servers.
//         </p>
//       </div>

//       <p className="mb-3 text-sm font-medium">What do you want to do?</p>
//       <div className="grid gap-3 sm:grid-cols-3">
//         {CHOICES.map((choice) => {
//           const Icon = choice.icon;
//           return (
//             <button key={choice.id} type="button" onClick={() => chooseAction(choice.id)} className={choiceClass(action === choice.id)}>
//               <Icon className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
//               <span>
//                 <span className="block text-sm font-medium">{choice.name}</span>
//                 <span className="mt-1 block text-xs text-[var(--muted)]">{choice.hint}</span>
//               </span>
//             </button>
//           );
//         })}
//       </div>

//       {action === "generate-random-email" && (
//         <div className="mt-5 grid gap-3 sm:grid-cols-2">
//           <input placeholder="Domain (example.com)" className={inputClass} value={domain} onChange={(e) => setDomain(e.target.value)} />
//           <input placeholder="Username length (5–30)" type="number" min={5} max={30} className={inputClass} value={usernameLength} onChange={(e) => setUsernameLength(e.target.value)} />
//         </div>
//       )}

//       {action === "generate-otp" && (
//         <div className="mt-5 grid gap-3 sm:grid-cols-2">
//           <input placeholder="OTP length (4–8)" type="number" min={4} max={8} className={inputClass} value={otpLength} onChange={(e) => setOtpLength(e.target.value)} />
//           <input placeholder="Expiry seconds" type="number" min={30} className={inputClass} value={expirySeconds} onChange={(e) => setExpirySeconds(e.target.value)} />
//         </div>
//       )}

//       {action === "verify-otp" && (
//         <input
//           placeholder="Enter the OTP to verify"
//           className={`${inputClass} mt-5`}
//           value={userOtp}
//           onChange={(e) => setUserOtp(e.target.value)}
//         />
//       )}

//       <div className="mt-5 flex flex-wrap gap-2">
//         <button onClick={run} disabled={!canRun || status === "processing"} className={btn("primary")}>
//           <Play className="mr-2 h-4 w-4" /> {processLabel(status, action)}
//         </button>
//         <button onClick={clear} className={btn("secondary")}>
//           <RotateCcw className="mr-2 h-4 w-4" /> Clear
//         </button>
//       </div>

//       {error && (
//         <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">{error}</div>
//       )}

//       {output && (
//         <div className={`mt-6 ${stats ? "grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]" : ""}`}>
//           <div>
//             <div className="mb-2 flex items-center justify-between">
//               <span className="text-sm font-medium">Result</span>
//               <div className="flex gap-1">
//                 <button onClick={copy} className={btn("ghost")} title="Copy"><Copy className="h-4 w-4" /></button>
//                 <button onClick={download} className={btn("ghost")} title="Download"><Download className="h-4 w-4" /></button>
//               </div>
//             </div>
//             <pre className="max-h-96 overflow-auto rounded-xl border border-[var(--border)] bg-[#0a0f18] p-4 font-mono text-sm leading-relaxed text-blue-200 whitespace-pre-wrap">
//               {output}
//             </pre>
//           </div>
//           {stats && (
//             <aside className="rounded-xl border border-[var(--border)] bg-[#0a0f18] p-4">
//               <p className="mb-3 text-sm font-medium">Details</p>
//               <ul className="space-y-3">
//                 {stats.map((stat) => (
//                   <li key={stat.label} className="border-b border-[var(--border)] pb-3 last:border-b-0 last:pb-0">
//                     <p className="text-[11px] uppercase tracking-wide text-[var(--muted)]">{stat.label}</p>
//                     <p className="mt-1 text-sm font-medium text-cyan-200">{stat.value}</p>
//                   </li>
//                 ))}
//               </ul>
//             </aside>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { Copy, Download, KeyRound, Mail, Play, RotateCcw, Shield, ShieldCheck } from "lucide-react";
import { btn, card, inputClass } from "@/lib/utils";
import type { ToolMeta, ToolStat } from "@/features/tools/client-processors";
import { INTERNET_PROCESSORS } from "@/features/tools/internet-processors";

type EmailOtpAction = "generate-random-email" | "generate-otp" | "verify-otp";

const CHOICES: Array<{ id: EmailOtpAction; name: string; hint: string; icon: typeof Mail }> = [
  { id: "generate-random-email", name: "Random Email", hint: "Create an address on a domain you choose.", icon: Mail },
  { id: "generate-otp", name: "Generate OTP", hint: "Create a one-time password with an expiry window.", icon: KeyRound },
  { id: "verify-otp", name: "Verify OTP", hint: "Check a code against the last OTP from this browser.", icon: ShieldCheck },
];

function processLabel(status: string, action: EmailOtpAction | null) {
  if (status === "processing") return "Processing…";
  if (action === "generate-random-email") return "Generate email";
  if (action === "generate-otp") return "Generate OTP";
  if (action === "verify-otp") return "Verify OTP";
  return "Process";
}

export function EmailOtpTool({ tool }: { tool: ToolMeta }) {
  const [action, setAction] = useState<EmailOtpAction | null>(null);
  const [domain, setDomain] = useState("example.com");
  const [usernameLength, setUsernameLength] = useState("10");
  const [otpLength, setOtpLength] = useState("6");
  const [expirySeconds, setExpirySeconds] = useState("300");
  const [userOtp, setUserOtp] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState<ToolStat[] | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  const canRun = action === "generate-random-email" || action === "generate-otp" || (action === "verify-otp" && userOtp.trim().length > 0);

  useEffect(() => {
    setAction(null);
    setDomain("example.com");
    setUsernameLength("10");
    setOtpLength("6");
    setExpirySeconds("300");
    setUserOtp("");
    setOutput("");
    setStats(null);
    setError("");
    setStatus("idle");
  }, [tool.slug]);

  const chooseAction = (next: EmailOtpAction) => {
    const keepResult = action === "generate-otp" && next === "verify-otp";
    setAction(next);
    setStatus("idle");
    setError("");
    if (!keepResult) {
      setOutput("");
      setStats(null);
    }
  };

  const run = async () => {
    if (!action || !canRun) return;
    const processor = INTERNET_PROCESSORS[action];
    if (!processor) {
      setError("Tool processor not implemented");
      setStatus("error");
      return;
    }
    setStatus("processing");
    setError("");
    try {
      const result = await Promise.resolve(processor("", {
        domain,
        usernameLength,
        otpLength,
        expirySeconds,
        userOtp,
      }));
      if (result.error) {
        setError(result.error);
        setOutput("");
        setStats(null);
        setStatus("error");
      } else {
        setOutput(result.output);
        setStats(result.stats?.length ? result.stats : null);
        setStatus("success");
      }
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  };

  const clear = () => {
    setAction(null);
    setDomain("example.com");
    setUsernameLength("10");
    setOtpLength("6");
    setExpirySeconds("300");
    setUserOtp("");
    setOutput("");
    setStats(null);
    setError("");
    setStatus("idle");
  };

  const copy = () => navigator.clipboard.writeText(output);
  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${action || tool.slug}-result.txt`;
    a.click();
  };

  const choiceClass = (selected: boolean) =>
    `flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
      selected
        ? "border-blue-500 bg-blue-50"
        : "border-slate-200 bg-white hover:border-blue-300"
    }`;

  return (
    <div className={card()}>
      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3.5">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
        <p className="text-xs leading-relaxed text-slate-600">
          Runs locally in your browser — your input is never sent to our servers.
        </p>
      </div>

      <p className="mb-3 text-sm font-medium">What do you want to do?</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {CHOICES.map((choice) => {
          const Icon = choice.icon;
          return (
            <button key={choice.id} type="button" onClick={() => chooseAction(choice.id)} className={choiceClass(action === choice.id)}>
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
              <span>
                <span className="block text-sm font-medium">{choice.name}</span>
                <span className="mt-1 block text-xs text-slate-500">{choice.hint}</span>
              </span>
            </button>
          );
        })}
      </div>

      {action === "generate-random-email" && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <input placeholder="Domain (example.com)" className={inputClass} value={domain} onChange={(e) => setDomain(e.target.value)} />
          <input placeholder="Username length (5–30)" type="number" min={5} max={30} className={inputClass} value={usernameLength} onChange={(e) => setUsernameLength(e.target.value)} />
        </div>
      )}

      {action === "generate-otp" && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <input placeholder="OTP length (4–8)" type="number" min={4} max={8} className={inputClass} value={otpLength} onChange={(e) => setOtpLength(e.target.value)} />
          <input placeholder="Expiry seconds" type="number" min={30} className={inputClass} value={expirySeconds} onChange={(e) => setExpirySeconds(e.target.value)} />
        </div>
      )}

      {action === "verify-otp" && (
        <input
          placeholder="Enter the OTP to verify"
          className={`${inputClass} mt-5`}
          value={userOtp}
          onChange={(e) => setUserOtp(e.target.value)}
        />
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={run} disabled={!canRun || status === "processing"} className={btn("primary")}>
          <Play className="mr-2 h-4 w-4" /> {processLabel(status, action)}
        </button>
        <button onClick={clear} className={btn("secondary")}>
          <RotateCcw className="mr-2 h-4 w-4" /> Clear
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {output && (
        <div className={`mt-6 ${stats ? "grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]" : ""}`}>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Result</span>
              <div className="flex gap-1">
                <button onClick={copy} className={btn("ghost")} title="Copy"><Copy className="h-4 w-4" /></button>
                <button onClick={download} className={btn("ghost")} title="Download"><Download className="h-4 w-4" /></button>
              </div>
            </div>
            <pre className="max-h-96 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
              {output}
            </pre>
          </div>
          {stats && (
            <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-sm font-medium">Details</p>
              <ul className="space-y-3">
                {stats.map((stat) => (
                  <li key={stat.label} className="border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">{stat.label}</p>
                    <p className="mt-1 text-sm font-medium text-blue-600">{stat.value}</p>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
