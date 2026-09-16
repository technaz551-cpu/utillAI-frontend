"use client";

import { useState } from "react";

type DeveloperToolProps = {
  slug: string;
};

export default function DeveloperTool({ slug }: DeveloperToolProps) {
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
/* JSON FORMATTER                   */
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
/* JSON VALIDATOR                   */
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
/* BASE64                           */
/* -------------------------------- */

function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => {
    setOutput(btoa(unescape(encodeURIComponent(input))));
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
/* URL ENCODER                      */
/* -------------------------------- */

function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        URL Encoder & Decoder
      </h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="mt-6 min-h-[250px] w-full rounded-lg border p-4"
        placeholder="Enter URL..."
      />

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => setOutput(encodeURIComponent(input))}
          className="rounded-lg bg-black px-5 py-2 text-white"
        >
          Encode
        </button>

        <button
          onClick={() => {
            try {
              setOutput(decodeURIComponent(input));
            } catch {
              setOutput("Invalid encoded URL");
            }
          }}
          className="rounded-lg border px-5 py-2"
        >
          Decode
        </button>
      </div>

      <textarea
        value={output}
        readOnly
        className="mt-6 min-h-[250px] w-full rounded-lg border p-4"
      />
    </div>
  );
}

/* -------------------------------- */
/* UUID GENERATOR                   */
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