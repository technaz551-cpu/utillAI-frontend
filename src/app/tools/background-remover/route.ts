import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const AI_SERVER_URL =
  process.env.BIREFNET_API_URL ||
  "http://127.0.0.1:8002";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(
  request: NextRequest
) {
  try {
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
      new FormData();

    backendFormData.append(
      "file",
      file,
      file.name
    );

    const backendResponse =
      await fetch(
        `${AI_SERVER_URL}/remove-background`,
        {
          method: "POST",
          body: backendFormData,
          cache: "no-store",
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
          const data =
            await backendResponse.json();

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

    const resultBlob =
      await backendResponse.blob();

    if (!resultBlob.size) {
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
      resultBlob,
      {
        status: 200,
        headers: {
          "Content-Type":
            "image/png",

          "Content-Length":
            resultBlob.size.toString(),

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
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to connect to the BiRefNet server. Make sure the Python server is running on port 8002.",
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