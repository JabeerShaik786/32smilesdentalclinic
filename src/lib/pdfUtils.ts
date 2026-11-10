import type { PDFFont } from "pdf-lib";

/**
 * Wraps text into lines that fit within a maximum width in points.
 */
export function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  if (!text) return [];
  // Clean string and preserve explicit newlines
  const paragraphs = text.split(/\r?\n/);
  const result: string[] = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      continue;
    }
    const words = para.split(/\s+/);
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          result.push(currentLine);
        }
        currentLine = word;
      }
    }
    if (currentLine) {
      result.push(currentLine);
    }
  }

  return result;
}

/**
 * Triggers a browser download of the given PDF bytes.
 */
export function downloadPdfBytes(bytes: Uint8Array, filename: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Creates an object URL from PDF bytes.
 */
export function createPdfBlobUrl(bytes: Uint8Array): string {
  if (typeof window === "undefined") return "";
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  return URL.createObjectURL(blob);
}

/**
 * Prints a PDF directly via a hidden iframe, preserving 100% scale and original vector elements.
 */
export function printPdfBlob(blobUrl: string, title: string = "Document"): void {
  if (typeof window === "undefined" || !blobUrl) return;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.zIndex = "-9999";
  iframe.title = title;
  iframe.src = blobUrl;

  document.body.appendChild(iframe);

  iframe.onload = () => {
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.warn("Direct iframe print blocked or failed, opening window print fallback:", err);
        const printWin = window.open(blobUrl, "_blank");
        if (printWin) {
          printWin.focus();
          printWin.print();
        }
      }
      setTimeout(() => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 60000);
    }, 400);
  };
}

