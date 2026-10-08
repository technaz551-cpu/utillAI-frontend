import { NextRequest, NextResponse } from "next/server";
import { File as NodeFile } from "node:buffer";
import {
  Agent,
  fetch as upstreamFetch,
  FormData as UpstreamFormData,
} from "undici";

export const runtime = "nodejs";

const configuredBackendUrl =
  process.env.BIREFNET_API_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim()?.replace(/\/api\/v1\/?$/i, "");
const AI_SERVER_URL = configuredBackendUrl
  ?.replace(/\/+$/, "");

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const INFERENCE_TIMEOUT_MS = 30 * 60 * 1000;
const upstreamAgent = new Agent({
  connectTimeout: 10_000,
  headersTimeout: INFERENCE_TIMEOUT_MS,
  bodyTimeout: INFERENCE_TIMEOUT_MS,
});

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(
  request: NextRequest
) {
  try {
    if (!AI_SERVER_URL) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Background removal backend URL is not configured. Set BIREFNET_API_URL or NEXT_PUBLIC_API_URL.",
        },
        { status: 503 }
      );
    }

    /*
     * ---------------------------------------------------------
     * Read uploaded file
     * ---------------------------------------------------------
     */

    const formData =
      await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No image file was uploaded.",
        },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * Validate file type
     * ---------------------------------------------------------
     */

    if (
      !ALLOWED_TYPES.has(file.type)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unsupported image format. Please use JPG, PNG or WEBP.",
        },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * Validate file size
     * ---------------------------------------------------------
     */

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Image is too large. Maximum allowed size is 15 MB.",
        },
        { status: 413 }
      );
    }

    /*
     * ---------------------------------------------------------
     * Forward image to Python BiRefNet server
     * ---------------------------------------------------------
     */

    const backendFormData =
      new UpstreamFormData();

    backendFormData.append(
      "file",
      new NodeFile(
        [Buffer.from(await file.arrayBuffer())],
        file.name,
        { type: file.type }
      ),
      file.name
    );

    const backendResponse = await upstreamFetch(
      `${AI_SERVER_URL}/remove-background`,
      {
        method: "POST",
        body: backendFormData,
        dispatcher: upstreamAgent,
      }
    );

    /*
     * ---------------------------------------------------------
     * Backend error
     * ---------------------------------------------------------
     */

    if (!backendResponse.ok) {
      let backendMessage =
        "Background removal service failed.";

      const backendContentType =
        backendResponse.headers.get(
          "content-type"
        ) || "";

      if (
        backendContentType.includes(
          "application/json"
        )
      ) {
        try {
          const data = (await backendResponse.json()) as {
            detail?: string;
            message?: string;
          };

          backendMessage =
            data?.detail ||
            data?.message ||
            backendMessage;
        } catch {
          // Keep default message.
        }
      } else {
        try {
          const text =
            await backendResponse.text();

          if (text) {
            backendMessage = text;
          }
        } catch {
          // Keep default message.
        }
      }

      console.error(
        "BiRefNet backend error:",
        backendResponse.status,
        backendMessage
      );

      return NextResponse.json(
        {
          success: false,
          message: backendMessage,
        },
        {
          status:
            backendResponse.status >= 500
              ? 502
              : backendResponse.status,
        }
      );
    }

    /*
     * ---------------------------------------------------------
     * Get generated PNG
     * ---------------------------------------------------------
     */

    const imageBytes = new Uint8Array(
      await backendResponse.arrayBuffer()
    );

    if (!imageBytes.byteLength) {
      return NextResponse.json(
        {
          success: false,
          message:
            "BiRefNet returned an empty image.",
        },
        { status: 502 }
      );
    }

    /*
     * ---------------------------------------------------------
     * Return transparent PNG to browser
     * ---------------------------------------------------------
     */

    return new NextResponse(
      imageBytes,
      {
        status: 200,
        headers: {
          "Content-Type":
            "image/png",

          "Content-Length":
            imageBytes.byteLength.toString(),

          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "Background remover API error:",
      error
    );

    if (
      error instanceof TypeError
    ) {
      const causeCode =
        typeof error.cause === "object" &&
        error.cause !== null &&
        "code" in error.cause
          ? error.cause.code
          : undefined;

      if (
        causeCode === "UND_ERR_HEADERS_TIMEOUT" ||
        causeCode === "UND_ERR_BODY_TIMEOUT"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "BiRefNet CPU processing exceeded the 30-minute request limit.",
          },
          { status: 504 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message:
            `Unable to connect to the background removal backend at ${AI_SERVER_URL}.`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Background removal failed.",
      },
      { status: 500 }
    );
  }
}