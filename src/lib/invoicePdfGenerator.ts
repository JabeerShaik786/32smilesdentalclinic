import { PDFDocument, rgb, degrees, StandardFonts, PDFFont, RGB } from "pdf-lib";
import { loadTemplateBytes } from "./pdfTemplateLoader";
import { wrapText, downloadPdfBytes, createPdfBlobUrl, printPdfBlob } from "./pdfUtils";

/**
 * Converts a numeric amount to Indian currency words format.
 */
function convertNumberToWords(amount: number): string {
  if (isNaN(amount) || amount <= 0) return "Zero Rupees Only";

  const singleDigits = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertTwoDigits(n: number): string {
    if (n < 10) return singleDigits[n];
    if (n >= 10 && n < 20) return teens[n - 10];
    return `${tens[Math.floor(n / 10)]} ${singleDigits[n % 10]}`.trim();
  }

  function convertThreeDigits(n: number): string {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const hStr = h > 0 ? `${singleDigits[h]} Hundred` : "";
    const rStr = r > 0 ? convertTwoDigits(r) : "";
    return [hStr, rStr].filter(Boolean).join(" and ");
  }

  let num = Math.floor(amount);
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = num;

  const parts: string[] = [];
  if (crore > 0) parts.push(`${convertTwoDigits(crore)} Crore`);
  if (lakh > 0) parts.push(`${convertTwoDigits(lakh)} Lakh`);
  if (thousand > 0) parts.push(`${convertTwoDigits(thousand)} Thousand`);
  if (hundred > 0) parts.push(convertThreeDigits(hundred));

  return `${parts.join(" ")} Rupees Only`.replace(/\s+/g, " ").trim();
}

export interface GenerateInvoicePdfOptions {
  patient?: {
    id?: string;
    patient_id?: string;
    name?: string;
    age?: number | string;
    gender?: string;
    phone?: string;
  } | null;
  invoice: {
    id: string;
    patientId?: string;
    patientName?: string;
    doctor?: string;
    treatment?: string;
    items?: Array<{
      description: string;
      quantity?: number;
      unitPrice?: number;
      amount: number;
    }>;
    subtotal: number;
    discount?: number;
    discountType?: "percentage" | "fixed";
    discountValue?: number;
    tax?: number;
    total: number;
    paidAmount: number;
    status: string;
    paymentDate?: string;
    paymentLogs?: { method: string; amount: number; date: string }[];
  };
  doctorName?: string;
  treatmentSummary?: string;
}

/**
 * Generates the Invoice / Receipt PDF bytes using strict PDF-overlay onto the replacement template (public/invoice.pdf).
 */
export async function generateInvoicePdfBytes(
  options: GenerateInvoicePdfOptions
): Promise<Uint8Array> {
  const { patient, invoice, doctorName } = options;
  const inv = invoice || ({} as any);

  const templateBytes = await loadTemplateBytes("invoice");
  const doc = await PDFDocument.load(templateBytes);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const textColor = rgb(0.08, 0.12, 0.2); // Crisp dark slate
  const primaryBlue = rgb(0.01, 0.22, 0.55);

  const pages = doc.getPages();
  const p1 = pages[0];

  // Helper to draw text at visual portrait coordinates (X: left 0..595, Y: top 0..842)
  const drawP1Text = (
    text: string,
    visX: number,
    visY_top: number,
    opts: { font?: PDFFont; size?: number; color?: RGB } = {}
  ) => {
    if (!text) return;
    const font = opts.font || helvetica;
    const size = opts.size || 9;
    const color = opts.color || textColor;
    const x = 841.68 - visY_top;
    const y = 595.08 - visX;
    p1.drawText(text, {
      x,
      y,
      size,
      font,
      color,
      rotate: degrees(270),
    });
  };

  const patientName = inv.patientName || patient?.name || "";
  const rawDate = inv.paymentDate || "";
  const formattedDate = rawDate ? (rawDate.includes("T") ? rawDate.split("T")[0] : rawDate.split(" ")[0]) : "";

  const subtotal = inv.subtotal || 0;
  const paidAmount = inv.paidAmount ?? (inv.total || subtotal);
  const total = inv.total || subtotal;
  const balance = Math.max(0, total - paidAmount);

  // 1. Receipt / Invoice No (x: 52..200, y_top: 241 aligned with "No." baseline)
  const invNo = inv.id || "";
  if (invNo) {
    drawP1Text(invNo, 52, 241, { font: helveticaBold, size: 9.5, color: primaryBlue });
  }

  // 2. Date (x: 458..540, y_top: 240 aligned with "Date :" baseline)
  if (formattedDate) {
    drawP1Text(formattedDate, 458, 240, { font: helveticaBold, size: 9.5 });
  }

  // 3. Received with thanks from (x: 210..540, y_top: 276.5 sitting on Line 1)
  if (patientName) {
    const nameLines = wrapText(patientName, helveticaBold, 9.5, 330);
    drawP1Text(nameLines[0] || patientName, 210, 276.5, { font: helveticaBold, size: 9.5 });
    if (nameLines[1]) {
      drawP1Text(nameLines.slice(1).join(" "), 35, 306.0, { font: helveticaBold, size: 9 });
    }
  }

  // 4. The sum of Rupees (in words) (x: 142..540, y_top: 335.0 sitting on Line 3)
  const effectiveAmount = paidAmount > 0 ? paidAmount : total;
  if (effectiveAmount > 0) {
    const wordsStr = convertNumberToWords(effectiveAmount);
    const wordLines = wrapText(wordsStr, helveticaBold, 9, 395);
    drawP1Text(wordLines[0] || wordsStr, 142, 335.0, { font: helveticaBold, size: 9, color: primaryBlue });
    if (wordLines[1]) {
      drawP1Text(wordLines.slice(1).join(" "), 35, 363.5, { font: helveticaBold, size: 8.5 });
    }
  }

  // 5. Towards (Treatment Details & Summary) (x: 86..540, y_top: 363.5 sitting on Line 4)
  let treatmentSummary = "";
  if (inv.items && inv.items.length > 0) {
    treatmentSummary = inv.items.map(it => it.description).filter(Boolean).join(", ");
  } else if (inv.treatment) {
    treatmentSummary = inv.treatment.trim();
  }

  // Append financial context if balance or discount exists
  const notes: string[] = [];
  if (inv.discount && inv.discount > 0) {
    notes.push(`Disc: Rs. ${Number(inv.discount).toLocaleString("en-IN")}`);
  }
  if (total !== effectiveAmount && total > 0) {
    notes.push(`Total: Rs. ${total.toLocaleString("en-IN")}`);
  }
  if (balance > 0) {
    notes.push(`Bal: Rs. ${balance.toLocaleString("en-IN")}`);
  }
  if (notes.length > 0) {
    treatmentSummary = treatmentSummary ? `${treatmentSummary} (${notes.join(", ")})` : `(${notes.join(", ")})`;
  }

  if (treatmentSummary) {
    const treatLines = wrapText(treatmentSummary, helvetica, 9, 450);
    drawP1Text(treatLines[0] || treatmentSummary, 86, 363.5, { font: helvetica, size: 9 });
    if (treatLines[1]) {
      drawP1Text(treatLines.slice(1).join(" "), 35, 393.0, { font: helvetica, size: 8.5 });
    }
  }

  // 6. Rs. [       ] Box (x: 85..205, y_top: 458 inside rectangular box)
  if (effectiveAmount > 0) {
    const amtFormatted = `${effectiveAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/-`;
    drawP1Text(amtFormatted, 85, 458, { font: helveticaBold, size: 12, color: primaryBlue });
  }

  // 7. Signature (x: 425..530, y_top: 448 directly above "Signature" label)
  const docSignatory = (inv.doctor || options.doctorName || "").trim();
  if (docSignatory) {
    drawP1Text(docSignatory, 425, 448, { font: helveticaBold, size: 8.5 });
  }

  return await doc.save();
}

/**
 * Creates a blob URL for previewing or printing the Invoice.
 */
export async function generateInvoicePdfBlobUrl(
  options: GenerateInvoicePdfOptions
): Promise<string> {
  const bytes = await generateInvoicePdfBytes(options);
  return createPdfBlobUrl(bytes);
}

/**
 * Generates and downloads the Invoice PDF file.
 */
export async function generateAndDownloadInvoicePdf(
  options: GenerateInvoicePdfOptions
): Promise<void> {
  const bytes = await generateInvoicePdfBytes(options);
  const patientName = (options.invoice.patientName || options.patient?.name || "Patient").replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `32Smiles_Receipt_${patientName}_${options.invoice.id}.pdf`;
  downloadPdfBytes(bytes, filename);
}

/**
 * Prints the Invoice PDF directly.
 */
export async function printInvoicePdf(
  options: GenerateInvoicePdfOptions
): Promise<void> {
  const blobUrl = await generateInvoicePdfBlobUrl(options);
  printPdfBlob(blobUrl, `Receipt - ${options.invoice.id}`);
}
