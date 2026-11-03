/** Load pixels the same way browsers display them (respects EXIF orientation). */
export async function loadOrientedBitmap(
  source: Blob | File,
): Promise<ImageBitmap> {
  return createImageBitmap(source, {
    imageOrientation: "from-image",
  });
}

export async function orientedPreviewFromUrl(
  src: string,
): Promise<{
  previewUrl: string;
  width: number;
  height: number;
}> {
  const response = await fetch(src);
  const blob = await response.blob();
  const bitmap = await loadOrientedBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Canvas is not supported by this browser.");
  }
  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  const previewBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (value) =>
        value
          ? resolve(value)
          : reject(new Error("Could not build crop preview.")),
      "image/png",
    );
  });

  return {
    previewUrl: URL.createObjectURL(previewBlob),
    width: canvas.width,
    height: canvas.height,
  };
}
