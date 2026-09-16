
"use client";

import { useState } from "react";

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
        <div className="p-6">
          <h1 className="text-2xl font-bold">
            Developer Tool
          </h1>

          <p className="mt-2 text-gray-500">
            Tool "{slug}" is not implemented yet.
          </p>
        </div>
      );
  }
}

/* -------------------------------- */
/* JSON FORMATTER                    */
/* -------------------------------- */

function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);

      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch {
      setOutput("");
      setError("Invalid JSON");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        JSON Formatter
      </h1>

      <p className="mt-2 text-gray-500">
        Format and beautify your JSON data.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">
            Input
          </label>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name":"John","age":25}'
            className="min-h-[400px] w-full rounded-lg border p-4 font-mono"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Output
          </label>

          <textarea
            value={output}
            readOnly
            className="min-h-[400px] w-full rounded-lg border p-4 font-mono"
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 text-red-500">
          {error}
        </p>
      )}

      <button
        onClick={formatJson}
        className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
      >
        Format JSON
      </button>
    </div>
  );
}

/* -------------------------------- */
/* JSON VALIDATOR                    */
/* -------------------------------- */

function JsonValidator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const validateJson = () => {
    try {
      JSON.parse(input);
      setResult("Valid JSON");
    } catch {
      setResult("Invalid JSON");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        JSON Validator
      </h1>

      <p className="mt-2 text-gray-500">
        Check whether your JSON is valid.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"name":"John"}'
        className="mt-6 min-h-[300px] w-full rounded-lg border p-4 font-mono"
      />

      <button
        onClick={validateJson}
        className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
      >
        Validate JSON
      </button>

      {result && (
        <p className="mt-4 font-medium">
          {result}
        </p>
      )}
    </div>
  );
}

/* -------------------------------- */
/* BASE64                            */
/* -------------------------------- */

function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => {
    try {
      setOutput(
        btoa(
          unescape(
            encodeURIComponent(input)
          )
        )
      );
    } catch {
      setOutput("Unable to encode text");
    }
  };

  const decode = () => {
    try {
      setOutput(
        decodeURIComponent(
          escape(atob(input))
        )
      );
    } catch {
      setOutput("Invalid Base64");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Base64 Encoder & Decoder
      </h1>

      <p className="mt-2 text-gray-500">
        Encode or decode Base64 text.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="mt-6 min-h-[250px] w-full rounded-lg border p-4"
        placeholder="Enter text..."
      />

      <div className="mt-4 flex gap-3">
        <button
          onClick={encode}
          className="rounded-lg bg-black px-5 py-2 text-white"
        >
          Encode
        </button>

        <button
          onClick={decode}
          className="rounded-lg border px-5 py-2"
        >
          Decode
        </button>
      </div>

      <textarea
        value={output}
        readOnly
        className="mt-6 min-h-[250px] w-full rounded-lg border p-4"
        placeholder="Result..."
      />
    </div>
  );
}

/* -------------------------------- */
/* URL ENCODER                       */
/* -------------------------------- */

function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => {
    setOutput(encodeURIComponent(input));
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch {
      setOutput("Invalid encoded URL");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        URL Encoder & Decoder
      </h1>

      <p className="mt-2 text-gray-500">
        Encode or decode URL text.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="mt-6 min-h-[250px] w-full rounded-lg border p-4"
        placeholder="Enter URL..."
      />

      <div className="mt-4 flex gap-3">
        <button
          onClick={encode}
          className="rounded-lg bg-black px-5 py-2 text-white"
        >
          Encode
        </button>

        <button
          onClick={decode}
          className="rounded-lg border px-5 py-2"
        >
          Decode
        </button>
      </div>

      <textarea
        value={output}
        readOnly
        className="mt-6 min-h-[250px] w-full rounded-lg border p-4"
        placeholder="Result..."
      />
    </div>
  );
}

/* -------------------------------- */
/* UUID GENERATOR                    */
/* -------------------------------- */

function UuidGenerator() {
  const [uuid, setUuid] = useState("");

  const generateUuid = () => {
    setUuid(crypto.randomUUID());
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        UUID Generator
      </h1>

      <p className="mt-2 text-gray-500">
        Generate a unique UUID.
      </p>

      <div className="mt-6 rounded-lg border p-5">
        <p className="break-all font-mono">
          {uuid || "Click generate to create a UUID"}
        </p>
      </div>

      <button
        onClick={generateUuid}
        className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
      >
        Generate UUID
      </button>
    </div>
  );
}

/* -------------------------------- */
/* HASH GENERATOR                    */
/* -------------------------------- */

function HashGenerator() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<
    "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"
  >("SHA-256");

  const [hash, setHash] = useState("");

  const generateHash = async () => {
    if (!input) {
      setHash("");
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const buffer = await crypto.subtle.digest(
      algorithm,
      data
    );

    const hashArray = Array.from(
      new Uint8Array(buffer)
    );

    const hashHex = hashArray
      .map((byte) =>
        byte.toString(16).padStart(2, "0")
      )
      .join("");

    setHash(hashHex);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Hash Generator
      </h1>

      <p className="mt-2 text-gray-500">
        Generate cryptographic hashes from text.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text..."
        className="mt-6 min-h-[200px] w-full rounded-lg border p-4"
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={algorithm}
          onChange={(e) =>
            setAlgorithm(
              e.target.value as
                | "SHA-1"
                | "SHA-256"
                | "SHA-384"
                | "SHA-512"
            )
          }
          className="rounded-lg border px-4 py-2"
        >
          <option value="SHA-1">SHA-1</option>
          <option value="SHA-256">SHA-256</option>
          <option value="SHA-384">SHA-384</option>
          <option value="SHA-512">SHA-512</option>
        </select>

        <button
          onClick={generateHash}
          className="rounded-lg bg-black px-5 py-2 text-white"
        >
          Generate Hash
        </button>
      </div>

      <div className="mt-6 rounded-lg border p-5">
        <p className="mb-2 font-medium">
          Hash Result
        </p>

        <p className="break-all font-mono text-sm">
          {hash || "Your hash will appear here"}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* JWT DECODER                       */
/* -------------------------------- */

function JwtDecoder() {
  const [input, setInput] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");

  const decodeBase64Url = (value: string) => {
    const base64 = value
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded =
      base64 +
      "=".repeat(
        (4 - (base64.length % 4)) % 4
      );

    return decodeURIComponent(
      Array.from(atob(padded))
        .map(
          (char) =>
            `%${char
              .charCodeAt(0)
              .toString(16)
              .padStart(2, "0")}`
        )
        .join("")
    );
  };

  const decodeJwt = () => {
    try {
      const parts = input.trim().split(".");

      if (parts.length !== 3) {
        throw new Error("Invalid JWT");
      }

      const decodedHeader =
        decodeBase64Url(parts[0]);

      const decodedPayload =
        decodeBase64Url(parts[1]);

      setHeader(
        JSON.stringify(
          JSON.parse(decodedHeader),
          null,
          2
        )
      );

      setPayload(
        JSON.stringify(
          JSON.parse(decodedPayload),
          null,
          2
        )
      );

      setError("");
    } catch {
      setHeader("");
      setPayload("");
      setError("Invalid JWT token");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        JWT Decoder
      </h1>

      <p className="mt-2 text-gray-500">
        Decode the header and payload of a JWT.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your JWT token..."
        className="mt-6 min-h-[180px] w-full rounded-lg border p-4 font-mono"
      />

      <button
        onClick={decodeJwt}
        className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
      >
        Decode JWT
      </button>

      {error && (
        <p className="mt-4 text-red-500">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-2 font-semibold">
            Header
          </h2>

          <textarea
            value={header}
            readOnly
            className="min-h-[250px] w-full rounded-lg border p-4 font-mono"
          />
        </div>

        <div>
          <h2 className="mb-2 font-semibold">
            Payload
          </h2>

          <textarea
            value={payload}
            readOnly
            className="min-h-[250px] w-full rounded-lg border p-4 font-mono"
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* TIMESTAMP CONVERTER               */
/* -------------------------------- */

function TimestampConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convertTimestamp = () => {
    const timestamp = Number(input);

    if (!Number.isFinite(timestamp)) {
      setOutput("Invalid timestamp");
      return;
    }

    const milliseconds =
      String(input).length <= 10
        ? timestamp * 1000
        : timestamp;

    const date = new Date(milliseconds);

    if (Number.isNaN(date.getTime())) {
      setOutput("Invalid timestamp");
      return;
    }

    setOutput(date.toISOString());
  };

  const generateCurrentTimestamp = () => {
    setInput(
      Math.floor(Date.now() / 1000).toString()
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Timestamp Converter
      </h1>

      <p className="mt-2 text-gray-500">
        Convert Unix timestamps to readable dates.
      </p>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Example: 1726200000"
        className="mt-6 w-full rounded-lg border p-4 font-mono"
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={convertTimestamp}
          className="rounded-lg bg-black px-5 py-2 text-white"
        >
          Convert
        </button>

        <button
          onClick={generateCurrentTimestamp}
          className="rounded-lg border px-5 py-2"
        >
          Current Timestamp
        </button>
      </div>

      <div className="mt-6 rounded-lg border p-5">
        <p className="mb-2 font-medium">
          Converted Date
        </p>

        <p className="break-all font-mono">
          {output || "Result will appear here"}
        </p>
      </div>
    </div>
  );
}

