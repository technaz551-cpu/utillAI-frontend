
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
//         ? "border-blue-500 bg-blue-50"
//         : "border-slate-200 bg-white hover:border-blue-300"
//     }`;

//   return (
//     <div className={card()}>
//       <div className="mb-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3.5">
//         <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
//         <p className="text-xs leading-relaxed text-slate-600">
//           Runs locally in your browser — your input is never sent to our servers.
//         </p>
//       </div>

//       <p className="mb-3 text-sm font-medium">What do you want to do?</p>
//       <div className="grid gap-3 sm:grid-cols-3">
//         {CHOICES.map((choice) => {
//           const Icon = choice.icon;
//           return (
//             <button key={choice.id} type="button" onClick={() => chooseAction(choice.id)} className={choiceClass(action === choice.id)}>
//               <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
//               <span>
//                 <span className="block text-sm font-medium">{choice.name}</span>
//                 <span className="mt-1 block text-xs text-slate-500">{choice.hint}</span>
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
//         <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
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
//             <pre className="max-h-96 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
//               {output}
//             </pre>
//           </div>
//           {stats && (
//             <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
//               <p className="mb-3 text-sm font-medium">Details</p>
//               <ul className="space-y-3">
//                 {stats.map((stat) => (
//                   <li key={stat.label} className="border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
//                     <p className="text-[11px] uppercase tracking-wide text-slate-500">{stat.label}</p>
//                     <p className="mt-1 text-sm font-medium text-blue-600">{stat.value}</p>
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
import {
  Check,
  Copy,
  Download,
  KeyRound,
  Mail,
  Play,
  RotateCcw,
  Shield,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { btn, card, inputClass } from "@/lib/utils";
import type {
  ToolMeta,
  ToolStat,
} from "@/features/tools/client-processors";
import { INTERNET_PROCESSORS } from "@/features/tools/internet-processors";

type EmailOtpAction =
  | "generate-random-email"
  | "generate-otp"
  | "verify-otp";

const CHOICES: Array<{
  id: EmailOtpAction;
  name: string;
  hint: string;
  icon: typeof Mail;
}> = [
  {
    id: "generate-random-email",
    name: "Random Email",
    hint: "Create an address using the domain you choose.",
    icon: Mail,
  },
  {
    id: "generate-otp",
    name: "Generate OTP",
    hint: "Create a secure one-time password with expiry.",
    icon: KeyRound,
  },
  {
    id: "verify-otp",
    name: "Verify OTP",
    hint: "Check an OTP generated in this browser.",
    icon: ShieldCheck,
  },
];

function processLabel(
  status: string,
  action: EmailOtpAction | null
) {
  if (status === "processing") return "Processing…";

  if (action === "generate-random-email") {
    return "Generate Email";
  }

  if (action === "generate-otp") {
    return "Generate OTP";
  }

  if (action === "verify-otp") {
    return "Verify OTP";
  }

  return "Process";
}

export function EmailOtpTool({
  tool,
}: {
  tool: ToolMeta;
}) {
  const [action, setAction] =
    useState<EmailOtpAction | null>(null);

  const [domain, setDomain] =
    useState("example.com");

  const [usernameLength, setUsernameLength] =
    useState("10");

  const [otpLength, setOtpLength] =
    useState("6");

  const [expirySeconds, setExpirySeconds] =
    useState("300");

  const [userOtp, setUserOtp] =
    useState("");

  const [output, setOutput] =
    useState("");

  const [stats, setStats] =
    useState<ToolStat[] | null>(null);

  const [error, setError] =
    useState("");

  const [status, setStatus] =
    useState<
      "idle" | "processing" | "success" | "error"
    >("idle");

  const canRun =
    action === "generate-random-email" ||
    action === "generate-otp" ||
    (action === "verify-otp" &&
      userOtp.trim().length > 0);

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

  const chooseAction = (
    next: EmailOtpAction
  ) => {
    const keepResult =
      action === "generate-otp" &&
      next === "verify-otp";

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

    const processor =
      INTERNET_PROCESSORS[action];

    if (!processor) {
      setError(
        "Tool processor not implemented"
      );
      setStatus("error");
      return;
    }

    setStatus("processing");
    setError("");

    try {
      const result =
        await Promise.resolve(
          processor("", {
            domain,
            usernameLength,
            otpLength,
            expirySeconds,
            userOtp,
          })
        );

      if (result.error) {
        setError(result.error);
        setOutput("");
        setStats(null);
        setStatus("error");
      } else {
        setOutput(result.output);
        setStats(
          result.stats?.length
            ? result.stats
            : null
        );
        setStatus("success");
      }
    } catch (e) {
      setError(
        (e as Error).message
      );
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

  const copy = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(
        output
      );
    } catch {
      // Ignore clipboard errors.
    }
  };

  const download = () => {
    if (!output) return;

    const blob = new Blob(
      [output],
      { type: "text/plain" }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download =
      `${action || tool.slug}-result.txt`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">

      {/* ================================= */}
      {/* TOOL HEADER                       */}
      {/* ================================= */}

      <div className="border-b border-[var(--border)] px-5 py-5 md:px-6">
        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Email & OTP Tools
            </h2>

            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              Generate random email addresses,
              create OTPs, or verify an existing
              OTP directly in your browser.
            </p>
          </div>
        </div>
      </div>

      {/* ================================= */}
      {/* PRIVACY BANNER                    */}
      {/* ================================= */}

      <div className="px-5 pt-5 md:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/5 px-4 py-4">

          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl"
          />

          <div className="relative flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Shield className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                Browser-based processing
              </p>

              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                Your input is processed locally
                in your browser and is not sent
                to our servers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================= */}
      {/* ACTION SELECTION                  */}
      {/* ================================= */}

      <div className="px-5 py-6 md:px-6">
        <div className="mb-4">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            What do you want to do?
          </p>

          <p className="mt-1 text-xs text-[var(--muted)]">
            Select an action to continue.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {CHOICES.map((choice) => {
            const Icon = choice.icon;
            const selected =
              action === choice.id;

            return (
              <button
                key={choice.id}
                type="button"
                onClick={() =>
                  chooseAction(choice.id)
                }
                className={`
                  group relative overflow-hidden
                  rounded-2xl border
                  p-4 text-left
                  transition-all duration-300
                  ${
                    selected
                      ? "border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                      : "border-[var(--border)] bg-[var(--background)] hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                  }
                `}
              >
                <div className="relative z-10">

                  <div
                    className={`
                      flex h-10 w-10 items-center justify-center rounded-xl
                      transition-colors
                      ${
                        selected
                          ? "bg-white/15 text-white"
                          : "bg-blue-500/10 text-blue-500 group-hover:bg-white/15 group-hover:text-white"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span
                      className={`
                        text-sm font-semibold
                        ${
                          selected
                            ? "text-white"
                            : "text-[var(--foreground)] group-hover:text-white"
                        }
                      `}
                    >
                      {choice.name}
                    </span>

                    {selected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>

                  <p
                    className={`
                      mt-2 text-xs leading-5
                      ${
                        selected
                          ? "text-white/80"
                          : "text-[var(--muted)] group-hover:text-white/80"
                      }
                    `}
                  >
                    {choice.hint}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ================================= */}
        {/* INPUTS                            */}
        {/* ================================= */}

        {action && (
          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 md:p-5">

            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />

              <p className="text-sm font-semibold">
                {action ===
                  "generate-random-email" &&
                  "Email settings"}

                {action ===
                  "generate-otp" &&
                  "OTP settings"}

                {action ===
                  "verify-otp" &&
                  "Verification"}
              </p>
            </div>

            {action ===
              "generate-random-email" && (
              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--foreground)]">
                    Domain
                  </label>

                  <input
                    placeholder="example.com"
                    className={inputClass}
                    value={domain}
                    onChange={(e) =>
                      setDomain(e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--foreground)]">
                    Username length
                  </label>

                  <input
                    placeholder="10"
                    type="number"
                    min={5}
                    max={30}
                    className={inputClass}
                    value={usernameLength}
                    onChange={(e) =>
                      setUsernameLength(
                        e.target.value
                      )
                    }
                  />
                </div>

              </div>
            )}

            {action ===
              "generate-otp" && (
              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--foreground)]">
                    OTP length
                  </label>

                  <input
                    placeholder="6"
                    type="number"
                    min={4}
                    max={8}
                    className={inputClass}
                    value={otpLength}
                    onChange={(e) =>
                      setOtpLength(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--foreground)]">
                    Expiry time
                  </label>

                  <input
                    placeholder="300"
                    type="number"
                    min={30}
                    className={inputClass}
                    value={expirySeconds}
                    onChange={(e) =>
                      setExpirySeconds(
                        e.target.value
                      )
                    }
                  />

                  <p className="mt-1.5 text-[11px] text-[var(--muted)]">
                    Enter expiry time in seconds.
                  </p>
                </div>

              </div>
            )}

            {action ===
              "verify-otp" && (
              <div>
                <label className="mb-2 block text-xs font-semibold text-[var(--foreground)]">
                  OTP code
                </label>

                <input
                  placeholder="Enter the OTP to verify"
                  className={`${inputClass} font-mono tracking-widest`}
                  value={userOtp}
                  onChange={(e) =>
                    setUserOtp(
                      e.target.value
                    )
                  }
                />
              </div>
            )}
          </div>
        )}

        {/* ================================= */}
        {/* ACTION BUTTONS                    */}
        {/* ================================= */}

        <div className="mt-5 flex flex-wrap gap-3">

          <button
            type="button"
            onClick={run}
            disabled={
              !canRun ||
              status === "processing"
            }
            className="
              inline-flex items-center justify-center
              rounded-xl bg-blue-500
              px-5 py-2.5
              text-sm font-semibold text-white
              shadow-lg shadow-blue-500/20
              transition-all
              hover:bg-blue-600
              hover:shadow-blue-500/30
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Play className="mr-2 h-4 w-4" />

            {processLabel(
              status,
              action
            )}
          </button>

          <button
            type="button"
            onClick={clear}
            className="
              inline-flex items-center justify-center
              rounded-xl
              border border-[var(--border)]
              bg-[var(--background)]
              px-5 py-2.5
              text-sm font-medium
              text-[var(--foreground)]
              transition-all
              hover:border-blue-500
              hover:text-blue-500
            "
          >
            <RotateCcw className="mr-2 h-4 w-4" />

            Clear
          </button>
        </div>

        {/* ================================= */}
        {/* ERROR                             */}
        {/* ================================= */}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-4">
            <p className="text-sm font-semibold text-red-500">
              Something went wrong
            </p>

            <p className="mt-1 text-xs leading-5 text-red-500/80">
              {error}
            </p>
          </div>
        )}

        {/* ================================= */}
        {/* RESULT                            */}
        {/* ================================= */}

        {output && (
          <div
            className={`
              mt-6 grid gap-4
              ${
                stats
                  ? "lg:grid-cols-[minmax(0,1fr)_260px]"
                  : ""
              }
            `}
          >
            {/* Result */}
            <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 md:p-5">

              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    Result
                  </p>

                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Generated output
                  </p>
                </div>

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={copy}
                    className="
                      inline-flex h-9 w-9
                      items-center justify-center
                      rounded-lg
                      border border-[var(--border)]
                      text-[var(--muted)]
                      transition
                      hover:border-blue-500
                      hover:bg-blue-500/10
                      hover:text-blue-500
                    "
                    title="Copy result"
                  >
                    <Copy className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={download}
                    className="
                      inline-flex h-9 w-9
                      items-center justify-center
                      rounded-lg
                      border border-[var(--border)]
                      text-[var(--muted)]
                      transition
                      hover:border-blue-500
                      hover:bg-blue-500/10
                      hover:text-blue-500
                    "
                    title="Download result"
                  >
                    <Download className="h-4 w-4" />
                  </button>

                </div>
              </div>

              <pre
                className="
                  max-h-96 overflow-auto
                  whitespace-pre-wrap break-words
                  rounded-xl
                  border border-[var(--border)]
                  bg-[var(--surface)]
                  p-4
                  font-mono text-sm
                  leading-6
                  text-[var(--foreground)]
                "
              >
                {output}
              </pre>
            </div>

            {/* Details */}
            {stats && (
              <aside className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 md:p-5">

                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Details
                    </p>

                    <p className="text-[11px] text-[var(--muted)]">
                      Operation information
                    </p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {stats.map((stat) => (
                    <li
                      key={stat.label}
                      className="
                        rounded-xl
                        border border-[var(--border)]
                        bg-[var(--surface)]
                        p-3
                      "
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                        {stat.label}
                      </p>

                      <p className="mt-1.5 break-words text-sm font-semibold text-blue-500">
                        {stat.value}
                      </p>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
        )}
      </div>

      {/* ================================= */}
      {/* FOOTER STATUS                     */}
      {/* ================================= */}

      <div className="border-t border-[var(--border)] bg-[var(--background)] px-5 py-3.5 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <span
              className={`
                h-2 w-2 rounded-full
                ${
                  status === "processing"
                    ? "animate-pulse bg-blue-500"
                    : status === "success"
                    ? "bg-emerald-500"
                    : status === "error"
                    ? "bg-red-500"
                    : "bg-slate-400"
                }
              `}
            />

            {status === "processing" &&
              "Processing..."}

            {status === "success" &&
              "Completed successfully"}

            {status === "error" &&
              "Processing failed"}

            {status === "idle" &&
              "Ready to process"}
          </div>

          <span className="text-[11px] text-[var(--muted)]">
            Processed in your browser
          </span>

        </div>
      </div>
    </div>
  );
}