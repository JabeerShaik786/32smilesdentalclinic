import { getAssetPath } from "./getAssetPath";

export type TemplateType = "casesheet" | "prescription" | "invoice";

const TEMPLATE_FILENAMES: Record<TemplateType, { original: string; staticFile: string }> = {
  casesheet: {
    original: "case sheet_merged.pdf",
    staticFile: "case_sheet_merged.pdf",
  },
  prescription: {
    original: "prescription_merged.pdf",
    staticFile: "prescription_merged.pdf",
  },
  invoice: {
    original: "invoice.pdf",
    staticFile: "invoice.pdf",
  },
};

// In-memory cache for loaded templates
const templateCache = new Map<TemplateType, Uint8Array>();

/**
 * Loads the original PDF template bytes.
 * On server (Node.js/testing): reads directly from D:\32smilesdentalclinic\<file>.
 * On browser: fetches the static template asset using getAssetPath('/templates/<file>').
 */
export async function loadTemplateBytes(type: TemplateType): Promise<Uint8Array> {
  const cached = templateCache.get(type);
  if (cached) {
    // Return a copy so mutations don't corrupt cached buffer
    return new Uint8Array(cached);
  }

  const { original, staticFile } = TEMPLATE_FILENAMES[type];

  // 1. Server-side / Node.js testing environment
  if (typeof window === "undefined") {
    try {
      // Dynamic require in Node environments
      const req = typeof eval !== "undefined" ? (eval as any)("require") : null;
      if (req) {
        const fs = req("fs");
        const path = req("path");
        const rootPath = path.join(process.cwd(), original);
        if (fs.existsSync(rootPath)) {
          const buf = fs.readFileSync(rootPath);
          const uint8 = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
          templateCache.set(type, uint8);
          return new Uint8Array(uint8);
        }

        const publicPath = path.join(process.cwd(), "public", "templates", staticFile);
        if (fs.existsSync(publicPath)) {
          const buf = fs.readFileSync(publicPath);
          const uint8 = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
          templateCache.set(type, uint8);
          return new Uint8Array(uint8);
        }
      }
    } catch {
      // Fall through to fetch if running in edge or non-node server
    }
  }

  // 2. Client-side / browser runtime
  try {
    const assetUrl = getAssetPath(`/templates/${staticFile}`);
    const res = await fetch(assetUrl);

    if (!res.ok) {
      throw new Error(`Failed to load template "${type}" from ${assetUrl}. HTTP status: ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    templateCache.set(type, uint8);
    return new Uint8Array(uint8);
  } catch (err: any) {
    console.error(`[PDF Template Loader] Client error loading template "${type}":`, err);
    throw new Error(`Failed to load PDF template for ${type}: ${err.message || String(err)}`);
  }
}
