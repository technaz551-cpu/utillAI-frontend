
// "use client";

// import { useState } from "react";

// type DeveloperToolProps = {
//   slug: string;
// };

// export default function DeveloperTool({
//   slug,
// }: DeveloperToolProps) {
//   switch (slug) {
//     case "json-formatter":
//       return <JsonFormatter />;

//     case "json-validator":
//       return <JsonValidator />;

//     case "base64":
//       return <Base64Tool />;

//     case "url-encoder":
//       return <UrlEncoder />;

//     case "uuid-generator":
//       return <UuidGenerator />;

//     case "hash-generator":
//       return <HashGenerator />;

//     case "jwt-decoder":
//       return <JwtDecoder />;

//     case "timestamp-converter":
//       return <TimestampConverter />;

//     default:
//       return (
//         <div className="p-6">
//           <h1 className="text-2xl font-bold">
//             Developer Tool
//           </h1>

//           <p className="mt-2 text-gray-500">
//             Tool "{slug}" is not implemented yet.
//           </p>
//         </div>
//       );
//   }
// }

// /* -------------------------------- */
// /* JSON FORMATTER                    */
// /* -------------------------------- */

// function JsonFormatter() {
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState("");
//   const [error, setError] = useState("");

//   const formatJson = () => {
//     try {
//       const parsed = JSON.parse(input);

//       setOutput(JSON.stringify(parsed, null, 2));
//       setError("");
//     } catch {
//       setOutput("");
//       setError("Invalid JSON");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">
//         JSON Formatter
//       </h1>

//       <p className="mt-2 text-gray-500">
//         Format and beautify your JSON data.
//       </p>

//       <div className="mt-6 grid gap-6 md:grid-cols-2">
//         <div>
//           <label className="mb-2 block font-medium">
//             Input
//           </label>

//           <textarea
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder='{"name":"John","age":25}'
//             className="min-h-[400px] w-full rounded-lg border p-4 font-mono"
//           />
//         </div>

//         <div>
//           <label className="mb-2 block font-medium">
//             Output
//           </label>

//           <textarea
//             value={output}
//             readOnly
//             className="min-h-[400px] w-full rounded-lg border p-4 font-mono"
//           />
//         </div>
//       </div>

//       {error && (
//         <p className="mt-3 text-red-500">
//           {error}
//         </p>
//       )}

//       <button
//         onClick={formatJson}
//         className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
//       >
//         Format JSON
//       </button>
//     </div>
//   );
// }

// /* -------------------------------- */
// /* JSON VALIDATOR                    */
// /* -------------------------------- */

// function JsonValidator() {
//   const [input, setInput] = useState("");
//   const [result, setResult] = useState("");

//   const validateJson = () => {
//     try {
//       JSON.parse(input);
//       setResult("Valid JSON");
//     } catch {
//       setResult("Invalid JSON");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">
//         JSON Validator
//       </h1>

//       <p className="mt-2 text-gray-500">
//         Check whether your JSON is valid.
//       </p>

//       <textarea
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder='{"name":"John"}'
//         className="mt-6 min-h-[300px] w-full rounded-lg border p-4 font-mono"
//       />

//       <button
//         onClick={validateJson}
//         className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
//       >
//         Validate JSON
//       </button>

//       {result && (
//         <p className="mt-4 font-medium">
//           {result}
//         </p>
//       )}
//     </div>
//   );
// }

// /* -------------------------------- */
// /* BASE64                            */
// /* -------------------------------- */

// function Base64Tool() {
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState("");

//   const encode = () => {
//     try {
//       setOutput(
//         btoa(
//           unescape(
//             encodeURIComponent(input)
//           )
//         )
//       );
//     } catch {
//       setOutput("Unable to encode text");
//     }
//   };

//   const decode = () => {
//     try {
//       setOutput(
//         decodeURIComponent(
//           escape(atob(input))
//         )
//       );
//     } catch {
//       setOutput("Invalid Base64");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">
//         Base64 Encoder & Decoder
//       </h1>

//       <p className="mt-2 text-gray-500">
//         Encode or decode Base64 text.
//       </p>

//       <textarea
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         className="mt-6 min-h-[250px] w-full rounded-lg border p-4"
//         placeholder="Enter text..."
//       />

//       <div className="mt-4 flex gap-3">
//         <button
//           onClick={encode}
//           className="rounded-lg bg-black px-5 py-2 text-white"
//         >
//           Encode
//         </button>

//         <button
//           onClick={decode}
//           className="rounded-lg border px-5 py-2"
//         >
//           Decode
//         </button>
//       </div>

//       <textarea
//         value={output}
//         readOnly
//         className="mt-6 min-h-[250px] w-full rounded-lg border p-4"
//         placeholder="Result..."
//       />
//     </div>
//   );
// }

// /* -------------------------------- */
// /* URL ENCODER                       */
// /* -------------------------------- */

// function UrlEncoder() {
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState("");

//   const encode = () => {
//     setOutput(encodeURIComponent(input));
//   };

//   const decode = () => {
//     try {
//       setOutput(decodeURIComponent(input));
//     } catch {
//       setOutput("Invalid encoded URL");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">
//         URL Encoder & Decoder
//       </h1>

//       <p className="mt-2 text-gray-500">
//         Encode or decode URL text.
//       </p>

//       <textarea
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         className="mt-6 min-h-[250px] w-full rounded-lg border p-4"
//         placeholder="Enter URL..."
//       />

//       <div className="mt-4 flex gap-3">
//         <button
//           onClick={encode}
//           className="rounded-lg bg-black px-5 py-2 text-white"
//         >
//           Encode
//         </button>

//         <button
//           onClick={decode}
//           className="rounded-lg border px-5 py-2"
//         >
//           Decode
//         </button>
//       </div>

//       <textarea
//         value={output}
//         readOnly
//         className="mt-6 min-h-[250px] w-full rounded-lg border p-4"
//         placeholder="Result..."
//       />
//     </div>
//   );
// }

// /* -------------------------------- */
// /* UUID GENERATOR                    */
// /* -------------------------------- */

// function UuidGenerator() {
//   const [uuid, setUuid] = useState("");

//   const generateUuid = () => {
//     setUuid(crypto.randomUUID());
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">
//         UUID Generator
//       </h1>

//       <p className="mt-2 text-gray-500">
//         Generate a unique UUID.
//       </p>

//       <div className="mt-6 rounded-lg border p-5">
//         <p className="break-all font-mono">
//           {uuid || "Click generate to create a UUID"}
//         </p>
//       </div>

//       <button
//         onClick={generateUuid}
//         className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
//       >
//         Generate UUID
//       </button>
//     </div>
//   );
// }

// /* -------------------------------- */
// /* HASH GENERATOR                    */
// /* -------------------------------- */

// function HashGenerator() {
//   const [input, setInput] = useState("");
//   const [algorithm, setAlgorithm] = useState<
//     "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"
//   >("SHA-256");

//   const [hash, setHash] = useState("");

//   const generateHash = async () => {
//     if (!input) {
//       setHash("");
//       return;
//     }

//     const encoder = new TextEncoder();
//     const data = encoder.encode(input);

//     const buffer = await crypto.subtle.digest(
//       algorithm,
//       data
//     );

//     const hashArray = Array.from(
//       new Uint8Array(buffer)
//     );

//     const hashHex = hashArray
//       .map((byte) =>
//         byte.toString(16).padStart(2, "0")
//       )
//       .join("");

//     setHash(hashHex);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">
//         Hash Generator
//       </h1>

//       <p className="mt-2 text-gray-500">
//         Generate cryptographic hashes from text.
//       </p>

//       <textarea
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Enter text..."
//         className="mt-6 min-h-[200px] w-full rounded-lg border p-4"
//       />

//       <div className="mt-4 flex flex-wrap gap-3">
//         <select
//           value={algorithm}
//           onChange={(e) =>
//             setAlgorithm(
//               e.target.value as
//                 | "SHA-1"
//                 | "SHA-256"
//                 | "SHA-384"
//                 | "SHA-512"
//             )
//           }
//           className="rounded-lg border px-4 py-2"
//         >
//           <option value="SHA-1">SHA-1</option>
//           <option value="SHA-256">SHA-256</option>
//           <option value="SHA-384">SHA-384</option>
//           <option value="SHA-512">SHA-512</option>
//         </select>

//         <button
//           onClick={generateHash}
//           className="rounded-lg bg-black px-5 py-2 text-white"
//         >
//           Generate Hash
//         </button>
//       </div>

//       <div className="mt-6 rounded-lg border p-5">
//         <p className="mb-2 font-medium">
//           Hash Result
//         </p>

//         <p className="break-all font-mono text-sm">
//           {hash || "Your hash will appear here"}
//         </p>
//       </div>
//     </div>
//   );
// }

// /* -------------------------------- */
// /* JWT DECODER                       */
// /* -------------------------------- */

// function JwtDecoder() {
//   const [input, setInput] = useState("");
//   const [header, setHeader] = useState("");
//   const [payload, setPayload] = useState("");
//   const [error, setError] = useState("");

//   const decodeBase64Url = (value: string) => {
//     const base64 = value
//       .replace(/-/g, "+")
//       .replace(/_/g, "/");

//     const padded =
//       base64 +
//       "=".repeat(
//         (4 - (base64.length % 4)) % 4
//       );

//     return decodeURIComponent(
//       Array.from(atob(padded))
//         .map(
//           (char) =>
//             `%${char
//               .charCodeAt(0)
//               .toString(16)
//               .padStart(2, "0")}`
//         )
//         .join("")
//     );
//   };

//   const decodeJwt = () => {
//     try {
//       const parts = input.trim().split(".");

//       if (parts.length !== 3) {
//         throw new Error("Invalid JWT");
//       }

//       const decodedHeader =
//         decodeBase64Url(parts[0]);

//       const decodedPayload =
//         decodeBase64Url(parts[1]);

//       setHeader(
//         JSON.stringify(
//           JSON.parse(decodedHeader),
//           null,
//           2
//         )
//       );

//       setPayload(
//         JSON.stringify(
//           JSON.parse(decodedPayload),
//           null,
//           2
//         )
//       );

//       setError("");
//     } catch {
//       setHeader("");
//       setPayload("");
//       setError("Invalid JWT token");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">
//         JWT Decoder
//       </h1>

//       <p className="mt-2 text-gray-500">
//         Decode the header and payload of a JWT.
//       </p>

//       <textarea
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Paste your JWT token..."
//         className="mt-6 min-h-[180px] w-full rounded-lg border p-4 font-mono"
//       />

//       <button
//         onClick={decodeJwt}
//         className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
//       >
//         Decode JWT
//       </button>

//       {error && (
//         <p className="mt-4 text-red-500">
//           {error}
//         </p>
//       )}

//       <div className="mt-6 grid gap-6 md:grid-cols-2">
//         <div>
//           <h2 className="mb-2 font-semibold">
//             Header
//           </h2>

//           <textarea
//             value={header}
//             readOnly
//             className="min-h-[250px] w-full rounded-lg border p-4 font-mono"
//           />
//         </div>

//         <div>
//           <h2 className="mb-2 font-semibold">
//             Payload
//           </h2>

//           <textarea
//             value={payload}
//             readOnly
//             className="min-h-[250px] w-full rounded-lg border p-4 font-mono"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// /* -------------------------------- */
// /* TIMESTAMP CONVERTER               */
// /* -------------------------------- */

// function TimestampConverter() {
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState("");

//   const convertTimestamp = () => {
//     const timestamp = Number(input);

//     if (!Number.isFinite(timestamp)) {
//       setOutput("Invalid timestamp");
//       return;
//     }

//     const milliseconds =
//       String(input).length <= 10
//         ? timestamp * 1000
//         : timestamp;

//     const date = new Date(milliseconds);

//     if (Number.isNaN(date.getTime())) {
//       setOutput("Invalid timestamp");
//       return;
//     }

//     setOutput(date.toISOString());
//   };

//   const generateCurrentTimestamp = () => {
//     setInput(
//       Math.floor(Date.now() / 1000).toString()
//     );
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">
//         Timestamp Converter
//       </h1>

//       <p className="mt-2 text-gray-500">
//         Convert Unix timestamps to readable dates.
//       </p>

//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Example: 1726200000"
//         className="mt-6 w-full rounded-lg border p-4 font-mono"
//       />

//       <div className="mt-4 flex flex-wrap gap-3">
//         <button
//           onClick={convertTimestamp}
//           className="rounded-lg bg-black px-5 py-2 text-white"
//         >
//           Convert
//         </button>

//         <button
//           onClick={generateCurrentTimestamp}
//           className="rounded-lg border px-5 py-2"
//         >
//           Current Timestamp
//         </button>
//       </div>

//       <div className="mt-6 rounded-lg border p-5">
//         <p className="mb-2 font-medium">
//           Converted Date
//         </p>

//         <p className="break-all font-mono">
//           {output || "Result will appear here"}
//         </p>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import {
  Braces,
  Check,
  CheckCircle2,
  Clipboard,
  Code2,
  Copy,
  Hash,
  KeyRound,
  Link2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Type,
  Activity,
  XCircle,
} from "lucide-react";

type DeveloperToolProps = {
  slug: string;
};

export default function DeveloperTool({
  slug,
}: DeveloperToolProps) {
  switch (slug) {
    case "json-formatter":
      return <JsonFormatter />;

    case "json-validator":
      return <JsonValidator />;

    case "base64":
      return <Base64Tool />;

    case "url-encoder":
      return <UrlEncoder />;

    case "uuid-generator":
      return <UuidGenerator />;

    case "hash-generator":
      return <HashGenerator />;

    case "jwt-decoder":
      return <JwtDecoder />;

    case "timestamp-converter":
      return <TimestampConverter />;

    default:
      return (
        <ToolShell
          icon={Code2}
          title="Developer Tool"
          description={`Tool "${slug}" is not implemented yet.`}
        >
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            This developer tool has not been implemented yet.
          </div>
        </ToolShell>
      );
  }
}

/* ============================================================
   SHARED UI
============================================================ */

type ToolShellProps = {
  icon: typeof Code2;
  title: string;
  description: string;
  children: React.ReactNode;
};

function ToolShell({
  icon: Icon,
  title,
  description,
  children,
}: ToolShellProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-white px-5 py-6 sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-sm shadow-blue-500/20">
            <Icon className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                {title}
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                <Sparkles className="h-3 w-3" />
                Browser
              </span>
            </div>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-7">{children}</div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-50/70 px-5 py-3 text-center">
        <p className="text-[10px] text-slate-400">
          Runs directly in your browser. Your data is not uploaded.
        </p>
      </div>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  icon?: typeof Code2;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-4 py-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <Icon className="h-3.5 w-3.5" />
            </div>
          )}

          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {title}
          </span>
        </div>

        {action}
      </div>

      {children}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  secondary = false,
  disabled = false,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition active:scale-[0.98]",
        secondary
          ? "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          : "bg-blue-500 text-white shadow-sm shadow-blue-500/20 hover:bg-blue-600 hover:shadow-md hover:shadow-blue-500/20",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      // Ignore clipboard errors.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      disabled={!value}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          {label}
        </>
      )}
    </button>
  );
}

function ClearButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[11px] font-semibold text-slate-400 transition hover:text-red-500"
    >
      Clear
    </button>
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  minHeight = "300px",
  readOnly = false,
  className = "",
}: {
  value: string;
  onChange?: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  placeholder?: string;
  minHeight?: string;
  readOnly?: boolean;
  className?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      spellCheck={false}
      className={[
        "w-full resize-y bg-white p-4 font-mono text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-300",
        "focus:bg-blue-50/20",
        className,
      ].join(" ")}
      style={{ minHeight }}
    />
  );
}

function StatusMessage({
  valid,
  children,
}: {
  valid: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium",
        valid
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-600",
      ].join(" ")}
    >
      {valid ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 shrink-0" />
      )}

      {children}
    </div>
  );
}

/* ============================================================
   JSON FORMATTER
============================================================ */

function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);

      setOutput(
        JSON.stringify(
          parsed,
          null,
          2,
        ),
      );

      setError("");
    } catch {
      setOutput("");
      setError("Invalid JSON. Please check your syntax.");
    }
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <ToolShell
      icon={Braces}
      title="JSON Formatter"
      description="Format and beautify your JSON data with readable indentation."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel
          title="Input JSON"
          icon={Braces}
          action={
            <ClearButton onClick={clear} />
          }
        >
          <TextArea
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            placeholder='{"name":"John","age":25}'
            minHeight="380px"
          />
        </Panel>

        <Panel
          title="Formatted JSON"
          icon={Code2}
          action={
            <CopyButton value={output} />
          }
        >
          <TextArea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            minHeight="380px"
          />
        </Panel>
      </div>

      {error && (
        <div className="mt-4">
          <StatusMessage valid={false}>
            {error}
          </StatusMessage>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <ActionButton onClick={formatJson}>
          <Braces className="h-4 w-4" />
          Format JSON
        </ActionButton>

        <ActionButton
          onClick={clear}
          secondary
        >
          Clear
        </ActionButton>
      </div>
    </ToolShell>
  );
}

/* ============================================================
   JSON VALIDATOR
============================================================ */

function JsonValidator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<
    "valid" | "invalid" | ""
  >("");

  const validateJson = () => {
    try {
      JSON.parse(input);
      setResult("valid");
    } catch {
      setResult("invalid");
    }
  };

  const clear = () => {
    setInput("");
    setResult("");
  };

  return (
    <ToolShell
      icon={ShieldCheck}
      title="JSON Validator"
      description="Check whether your JSON is valid and correctly formatted."
    >
      <Panel
        title="JSON Input"
        icon={ShieldCheck}
        action={
          <ClearButton onClick={clear} />
        }
      >
        <TextArea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setResult("");
          }}
          placeholder='{"name":"John","age":25}'
          minHeight="360px"
        />
      </Panel>

      <div className="mt-5 flex flex-wrap gap-3">
        <ActionButton onClick={validateJson}>
          <ShieldCheck className="h-4 w-4" />
          Validate JSON
        </ActionButton>

        <ActionButton
          onClick={clear}
          secondary
        >
          Clear
        </ActionButton>
      </div>

      {result && (
        <div className="mt-5">
          <StatusMessage
            valid={result === "valid"}
          >
            {result === "valid"
              ? "Valid JSON — your JSON syntax is correct."
              : "Invalid JSON — please check your syntax."}
          </StatusMessage>
        </div>
      )}
    </ToolShell>
  );
}

/* ============================================================
   BASE64
============================================================ */

function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const encode = () => {
    try {
      setOutput(
        btoa(
          unescape(
            encodeURIComponent(input),
          ),
        ),
      );

      setError("");
    } catch {
      setOutput("");
      setError("Unable to encode text.");
    }
  };

  const decode = () => {
    try {
      setOutput(
        decodeURIComponent(
          escape(atob(input)),
        ),
      );

      setError("");
    } catch {
      setOutput("");
      setError("Invalid Base64 input.");
    }
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <ToolShell
      icon={Code2}
      title="Base64 Encoder & Decoder"
      description="Encode text to Base64 or decode Base64 back into readable text."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel
          title="Input"
          icon={Type}
          action={
            <ClearButton onClick={clear} />
          }
        >
          <TextArea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            placeholder="Enter text or Base64..."
            minHeight="300px"
          />
        </Panel>

        <Panel
          title="Result"
          icon={Code2}
          action={
            <CopyButton value={output} />
          }
        >
          <TextArea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            minHeight="300px"
          />
        </Panel>
      </div>

      {error && (
        <div className="mt-4">
          <StatusMessage valid={false}>
            {error}
          </StatusMessage>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <ActionButton onClick={encode}>
          <Code2 className="h-4 w-4" />
          Encode
        </ActionButton>

        <ActionButton
          onClick={decode}
          secondary
        >
          Decode
        </ActionButton>

        <ActionButton
          onClick={clear}
          secondary
        >
          Clear
        </ActionButton>
      </div>
    </ToolShell>
  );
}

/* ============================================================
   URL ENCODER
============================================================ */

function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const encode = () => {
    setOutput(
      encodeURIComponent(input),
    );

    setError("");
  };

  const decode = () => {
    try {
      setOutput(
        decodeURIComponent(input),
      );

      setError("");
    } catch {
      setOutput("");
      setError("Invalid encoded URL.");
    }
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <ToolShell
      icon={Link2}
      title="URL Encoder & Decoder"
      description="Encode special characters in URLs or decode encoded URL text."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel
          title="Input URL"
          icon={Link2}
          action={
            <ClearButton onClick={clear} />
          }
        >
          <TextArea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            placeholder="https://example.com/?name=John Doe"
            minHeight="280px"
          />
        </Panel>

        <Panel
          title="Result"
          icon={Code2}
          action={
            <CopyButton value={output} />
          }
        >
          <TextArea
            value={output}
            readOnly
            placeholder="Encoded or decoded URL will appear here..."
            minHeight="280px"
          />
        </Panel>
      </div>

      {error && (
        <div className="mt-4">
          <StatusMessage valid={false}>
            {error}
          </StatusMessage>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <ActionButton onClick={encode}>
          <Link2 className="h-4 w-4" />
          Encode URL
        </ActionButton>

        <ActionButton
          onClick={decode}
          secondary
        >
          Decode URL
        </ActionButton>

        <ActionButton
          onClick={clear}
          secondary
        >
          Clear
        </ActionButton>
      </div>
    </ToolShell>
  );
}

/* ============================================================
   UUID GENERATOR
============================================================ */

function UuidGenerator() {
  const [uuid, setUuid] =
    useState("");

  const generateUuid = () => {
    setUuid(
      crypto.randomUUID(),
    );
  };

  return (
    <ToolShell
      icon={KeyRound}
      title="UUID Generator"
      description="Generate a unique UUID instantly using your browser."
    >
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <KeyRound className="h-4 w-4" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Generated UUID
            </span>
          </div>

          <CopyButton value={uuid} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-5">
          <p className="break-all font-mono text-sm leading-6 text-slate-700">
            {uuid ||
              "Click generate to create a UUID"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <ActionButton onClick={generateUuid}>
          <RefreshCw className="h-4 w-4" />
          Generate UUID
        </ActionButton>

        {uuid && (
          <ActionButton
            secondary
            onClick={() =>
              setUuid("")
            }
          >
            Clear
          </ActionButton>
        )}
      </div>
    </ToolShell>
  );
}

/* ============================================================
   HASH GENERATOR
============================================================ */

function HashGenerator() {
  const [input, setInput] =
    useState("");

  const [algorithm, setAlgorithm] =
    useState<
      | "SHA-1"
      | "SHA-256"
      | "SHA-384"
      | "SHA-512"
    >("SHA-256");

  const [hash, setHash] =
    useState("");

  const generateHash =
    async () => {
      if (!input) {
        setHash("");
        return;
      }

      const encoder =
        new TextEncoder();

      const data =
        encoder.encode(input);

      const buffer =
        await crypto.subtle.digest(
          algorithm,
          data,
        );

      const hashArray =
        Array.from(
          new Uint8Array(buffer),
        );

      const hashHex =
        hashArray
          .map((byte) =>
            byte
              .toString(16)
              .padStart(2, "0"),
          )
          .join("");

      setHash(hashHex);
    };

  return (
    <ToolShell
      icon={Hash}
      title="Hash Generator"
      description="Generate SHA cryptographic hashes from any text."
    >
      <Panel
        title="Input Text"
        icon={Type}
        action={
          <ClearButton
            onClick={() => {
              setInput("");
              setHash("");
            }}
          />
        }
      >
        <TextArea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setHash("");
          }}
          placeholder="Enter text to generate a hash..."
          minHeight="250px"
        />
      </Panel>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Hash algorithm
          </label>

          <select
            value={algorithm}
            onChange={(e) =>
              setAlgorithm(
                e.target.value as
                  | "SHA-1"
                  | "SHA-256"
                  | "SHA-384"
                  | "SHA-512",
              )
            }
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-auto"
          >
            <option value="SHA-1">
              SHA-1
            </option>

            <option value="SHA-256">
              SHA-256
            </option>

            <option value="SHA-384">
              SHA-384
            </option>

            <option value="SHA-512">
              SHA-512
            </option>
          </select>
        </div>

        <div className="flex items-end">
          <ActionButton
            onClick={generateHash}
            disabled={!input}
          >
            <Hash className="h-4 w-4" />
            Generate Hash
          </ActionButton>
        </div>
      </div>

      <div className="mt-5">
        <Panel
          title="Hash Result"
          icon={Hash}
          action={
            <CopyButton value={hash} />
          }
        >
          <div className="min-h-[120px] bg-white p-4">
            <p className="break-all font-mono text-sm leading-6 text-slate-600">
              {hash ||
                "Your hash will appear here"}
            </p>
          </div>
        </Panel>
      </div>
    </ToolShell>
  );
}

/* ============================================================
   JWT DECODER
============================================================ */

function JwtDecoder() {
  const [input, setInput] =
    useState("");

  const [header, setHeader] =
    useState("");

  const [payload, setPayload] =
    useState("");

  const [error, setError] =
    useState("");

  const decodeBase64Url =
    (value: string) => {
      const base64 =
        value
          .replace(/-/g, "+")
          .replace(/_/g, "/");

      const padded =
        base64 +
        "=".repeat(
          (4 -
            (base64.length % 4)) %
            4,
        );

      return decodeURIComponent(
        Array.from(
          atob(padded),
        )
          .map(
            (char) =>
              `%${char
                .charCodeAt(0)
                .toString(16)
                .padStart(2, "0")}`,
          )
          .join(""),
      );
    };

  const decodeJwt = () => {
    try {
      const parts =
        input.trim().split(".");

      if (parts.length !== 3) {
        throw new Error(
          "Invalid JWT",
        );
      }

      const decodedHeader =
        decodeBase64Url(
          parts[0],
        );

      const decodedPayload =
        decodeBase64Url(
          parts[1],
        );

      setHeader(
        JSON.stringify(
          JSON.parse(
            decodedHeader,
          ),
          null,
          2,
        ),
      );

      setPayload(
        JSON.stringify(
          JSON.parse(
            decodedPayload,
          ),
          null,
          2,
        ),
      );

      setError("");
    } catch {
      setHeader("");
      setPayload("");
      setError(
        "Invalid JWT token.",
      );
    }
  };

  return (
    <ToolShell
      icon={KeyRound}
      title="JWT Decoder"
      description="Decode the header and payload of a JSON Web Token directly in your browser."
    >
      <Panel
        title="JWT Token"
        icon={KeyRound}
        action={
          <ClearButton
            onClick={() => {
              setInput("");
              setHeader("");
              setPayload("");
              setError("");
            }}
          />
        }
      >
        <TextArea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          placeholder="Paste your JWT token here..."
          minHeight="180px"
        />
      </Panel>

      <div className="mt-5">
        <ActionButton
          onClick={decodeJwt}
          disabled={!input.trim()}
        >
          <KeyRound className="h-4 w-4" />
          Decode JWT
        </ActionButton>
      </div>

      {error && (
        <div className="mt-4">
          <StatusMessage valid={false}>
            {error}
          </StatusMessage>
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel
          title="Header"
          icon={Braces}
          action={
            <CopyButton value={header} />
          }
        >
          <TextArea
            value={header}
            readOnly
            placeholder="Decoded JWT header..."
            minHeight="280px"
          />
        </Panel>

        <Panel
          title="Payload"
          icon={Braces}
          action={
            <CopyButton value={payload} />
          }
        >
          <TextArea
            value={payload}
            readOnly
            placeholder="Decoded JWT payload..."
            minHeight="280px"
          />
        </Panel>
      </div>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-700">
        <strong>Note:</strong> This tool only
        decodes the JWT header and payload. It
        does not verify the token signature.
      </div>
    </ToolShell>
  );
}

/* ============================================================
   TIMESTAMP CONVERTER
============================================================ */

function TimestampConverter() {
  const [input, setInput] =
    useState("");

  const [output, setOutput] =
    useState("");

  const [error, setError] =
    useState("");

  const convertTimestamp = () => {
    const timestamp =
      Number(input);

    if (!Number.isFinite(timestamp)) {
      setOutput("");
      setError(
        "Invalid timestamp.",
      );
      return;
    }

    const milliseconds =
      String(input).length <= 10
        ? timestamp * 1000
        : timestamp;

    const date =
      new Date(milliseconds);

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      setOutput("");
      setError(
        "Invalid timestamp.",
      );
      return;
    }

    setOutput(
      date.toISOString(),
    );

    setError("");
  };

  const generateCurrentTimestamp =
    () => {
      setInput(
        Math.floor(
          Date.now() / 1000,
        ).toString(),
      );

      setOutput("");
      setError("");
    };

  return (
    <ToolShell
      icon={Activity}
      title="Timestamp Converter"
      description="Convert Unix timestamps into readable ISO dates."
    >
      <div className="max-w-3xl">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Unix timestamp
          </label>

          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            placeholder="Example: 1726200000"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-mono text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />

          <p className="mt-2 text-xs text-slate-400">
            Supports seconds and millisecond
            timestamps.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton
            onClick={convertTimestamp}
            disabled={!input}
          >
            <RefreshCw className="h-4 w-4" />
            Convert
          </ActionButton>

          <ActionButton
            onClick={
              generateCurrentTimestamp
            }
            secondary
          >
            Current Timestamp
          </ActionButton>
        </div>

        {error && (
          <div className="mt-4">
            <StatusMessage valid={false}>
              {error}
            </StatusMessage>
          </div>
        )}

        <div className="mt-5">
          <Panel
            title="Converted Date"
            icon={Activity}
            action={
              <CopyButton value={output} />
            }
          >
            <div className="min-h-[130px] bg-white p-5">
              <p className="break-all font-mono text-sm leading-6 text-slate-700">
                {output ||
                  "Converted date will appear here"}
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </ToolShell>
  );
}