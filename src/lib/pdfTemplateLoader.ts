import { getAssetPath } from "./getAssetPath";

export type TemplateType = "casesheet" | "prescription" | "invoice";

/**
 * Replacement PDF Templates:
 * 1. Case Sheet: public/caseSheet.pdf
 * 2. Prescription: public/prescription.pdf
 * 3. Invoice: public/invoice.pdf
 */
const TEMPLATE_FILENAMES: Record<TemplateType, { relativePath: string; staticFile: string }> = {
  casesheet: {
    relativePath: "public/caseSheet.pdf",
    staticFile: "caseSheet.pdf",
  },
  prescription: {
    relativePath: "public/prescription.pdf",
    staticFile: "prescription.pdf",
  },
  invoice: {
    relativePath: "public/invoice.pdf",
    staticFile: "invoice.pdf",
  },
};

// In-memory cache for loaded templates
const templateCache = new Map<TemplateType, Uint8Array>();

/**
 * Loads the replacement PDF template bytes.
 * On server (Node.js/testing): reads directly from process.cwd() / public / <file>.
 * On browser: fetches the static template asset using getAssetPath('/templates/<file>') or getAssetPath('/<file>').
 */
export async function loadTemplateBytes(type: TemplateType): Promise<Uint8Array> {
  const cached = templateCache.get(type);
  if (cached) {
    // Return a copy so mutations don't corrupt cached buffer
    return new Uint8Array(cached);
  }

  const { relativePath, staticFile } = TEMPLATE_FILENAMES[type];

  // 1. Server-side / Node.js testing environment
  if (typeof window === "undefined") {
    try {
      const req = typeof eval !== "undefined" ? (eval as any)("require") : null;
      if (req) {
        const fs = req("fs");
        const path = req("path");

        const candidates = [
          path.join(process.cwd(), relativePath),
          path.join(process.cwd(), "public", "templates", staticFile),
          path.join(process.cwd(), "public", staticFile),
          path.join(process.cwd(), staticFile),
        ];

        for (const cand of candidates) {
          if (fs.existsSync(cand)) {
            const buf = fs.readFileSync(cand);
            const uint8 = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
            templateCache.set(type, uint8);
            return new Uint8Array(uint8);
          }
        }
      }
    } catch {
      // Fall through to fetch if running in edge or non-node server
    }
  }

  // 2. Client-side / browser runtime
  try {
    const urlsToTry = [
      getAssetPath(`/templates/${staticFile}`),
      getAssetPath(`/${staticFile}`),
    ];

    let lastError: any = null;
    for (const assetUrl of urlsToTry) {
      try {
        const res = await fetch(assetUrl);
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          const uint8 = new Uint8Array(arrayBuffer);
          templateCache.set(type, uint8);
          return new Uint8Array(uint8);
        }
      } catch (e) {
        lastError = e;
      }
    }

    throw new Error(
      lastError?.message || `Failed to fetch template "${type}" from static assets.`
    );
  } catch (err: any) {
    console.error(`[PDF Template Loader] Client error loading template "${type}":`, err);
    throw new Error(`Failed to load PDF template for ${type}: ${err.message || String(err)}`);
  }
}
