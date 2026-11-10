import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { loadTemplateBytes } from "./pdfTemplateLoader";
import { wrapText, downloadPdfBytes, createPdfBlobUrl, printPdfBlob } from "./pdfUtils";
import { numberToWords } from "@/components/print/VRDentalInvoicePrintTemplate";

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
}

/**
 * Generates the Invoice PDF bytes using strict PDF-overlay onto the original template.
 */
export async function generateInvoicePdfBytes(
  options: GenerateInvoicePdfOptions
): Promise<Uint8Array> {
  const { patient, invoice } = options;

  const templateBytes = await loadTemplateBytes("invoice");
  const doc = await PDFDocument.load(templateBytes);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const textColor = rgb(0.08, 0.12, 0.2); // Crisp dark slate

  const pages = doc.getPages();
  const p1 = pages[0];
  const { height: p1H } = p1.getSize();
  const yAt = (fitzY: number) => p1H - fitzY;

  const patientName = invoice.patientName || patient?.name || "Patient";
  const rawDate = invoice.paymentDate || new Date().toISOString().split("T")[0];
  const formattedDate = rawDate.includes("T") ? rawDate.split("T")[0] : rawDate.split(" ")[0];

  const subtotal = invoice.subtotal || 0;
  const paidAmount = invoice.paidAmount || 0;
  const total = invoice.total || subtotal;
  const balance = Math.max(0, total - paidAmount);

  const ageGender = patient?.age ? `${patient.age} Y ${patient.gender ? `/ ${patient.gender}` : ""}`.trim() : "";
  const phone = patient?.phone || "";

  // ==========================================
  // INVOICE BODY (fitzY = 175 to 760)
  // ==========================================

  // 1. Invoice Metadata Grid (fitzY: 175 to 215)
  // Left column: Invoice No & Date
  p1.drawText("Invoice No :", { x: 36, y: yAt(178), size: 9, font: helveticaBold, color: textColor });
  p1.drawText(invoice.id || "INV-001", { x: 100, y: yAt(178), size: 9, font: helvetica, color: textColor });

  p1.drawText("Date :", { x: 36, y: yAt(196), size: 9, font: helveticaBold, color: textColor });
  p1.drawText(formattedDate, { x: 100, y: yAt(196), size: 9, font: helvetica, color: textColor });

  // Right column: Patient Name & Age/Gender/Phone
  p1.drawText("Patient Name :", { x: 300, y: yAt(178), size: 9, font: helveticaBold, color: textColor });
  p1.drawText(patientName, { x: 375, y: yAt(178), size: 9, font: helvetica, color: textColor });

  const extraInfo = [ageGender, phone ? `Phone: ${phone}` : ""].filter(Boolean).join("    ");
  if (extraInfo) {
    p1.drawText("Age / Contact :", { x: 300, y: yAt(196), size: 9, font: helveticaBold, color: textColor });
    p1.drawText(extraInfo, { x: 375, y: yAt(196), size: 9, font: helvetica, color: textColor });
  }

  // Divider line
  p1.drawLine({
    start: { x: 36, y: yAt(212) },
    end: { x: 560, y: yAt(212) },
    thickness: 0.75,
    color: rgb(0.8, 0.85, 0.9),
  });

  // 2. Treatments Table Header (fitzY: 224 to 242)
  p1.drawRectangle({
    x: 36,
    y: yAt(242),
    width: 524,
    height: 18,
    color: rgb(0.93, 0.96, 0.99),
  });

  p1.drawText("Sl No.", { x: 45, y: yAt(231), size: 8.5, font: helveticaBold, color: rgb(0.01, 0.25, 0.5) });
  p1.drawText("Treatment Details", { x: 95, y: yAt(231), size: 8.5, font: helveticaBold, color: rgb(0.01, 0.25, 0.5) });
  p1.drawText("Qty", { x: 360, y: yAt(231), size: 8.5, font: helveticaBold, color: rgb(0.01, 0.25, 0.5) });
  p1.drawText("Unit Price (Rs.)", { x: 410, y: yAt(231), size: 8.5, font: helveticaBold, color: rgb(0.01, 0.25, 0.5) });
  p1.drawText("Amount (Rs.)", { x: 500, y: yAt(231), size: 8.5, font: helveticaBold, color: rgb(0.01, 0.25, 0.5) });

  // 3. Treatment Table Items
  const items = invoice.items && invoice.items.length > 0
    ? invoice.items
    : [{ description: invoice.treatment || "Dental Treatment", quantity: 1, unitPrice: subtotal, amount: subtotal }];

  let curY = 258;
  items.forEach((it, idx) => {
    if (curY > 520) return; // Prevent overflowing table

    const sNoStr = String(idx + 1);
    const qtyStr = it.quantity !== undefined ? String(it.quantity) : "1";
    const unitPrice = it.unitPrice !== undefined ? it.unitPrice : it.amount;
    const unitPriceStr = Number(unitPrice || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const amountStr = Number(it.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    p1.drawText(sNoStr, { x: 52, y: yAt(curY), size: 8.5, font: helvetica, color: textColor });
    
    // Wrap description if long
    const descLines = wrapText(it.description || "Dental Procedure", helvetica, 8.5, 255);
    p1.drawText(descLines[0] || "", { x: 95, y: yAt(curY), size: 8.5, font: helvetica, color: textColor });

    p1.drawText(qtyStr, { x: 368, y: yAt(curY), size: 8.5, font: helvetica, color: textColor });

    const upW = helvetica.widthOfTextAtSize(unitPriceStr, 8.5);
    p1.drawText(unitPriceStr, { x: 470 - upW, y: yAt(curY), size: 8.5, font: helvetica, color: textColor });

    const amW = helveticaBold.widthOfTextAtSize(amountStr, 8.5);
    p1.drawText(amountStr, { x: 555 - amW, y: yAt(curY), size: 8.5, font: helveticaBold, color: textColor });

    curY += 18;
    p1.drawLine({
      start: { x: 36, y: yAt(curY - 6) },
      end: { x: 560, y: yAt(curY - 6) },
      thickness: 0.5,
      color: rgb(0.9, 0.92, 0.95),
    });
  });

  // 4. Financial Summary (Right aligned, x: 340 to 560)
  let sumY = curY + 10;
  const grossStr = Number(subtotal).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const totalStr = Number(total).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const paidStr = Number(paidAmount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const balStr = Number(balance).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const drawSummaryLine = (label: string, val: string, isBold = false, isAccent = false) => {
    p1.drawText(label, { x: 350, y: yAt(sumY), size: 8.5, font: isBold ? helveticaBold : helvetica, color: textColor });
    const valFont = isBold ? helveticaBold : helvetica;
    const valColor = isAccent ? rgb(0.01, 0.45, 0.25) : textColor;
    const vW = valFont.widthOfTextAtSize(val, 8.5);
    p1.drawText(val, { x: 555 - vW, y: yAt(sumY), size: 8.5, font: valFont, color: valColor });
    sumY += 14;
  };

  drawSummaryLine("Gross Amount (Rs.) :", grossStr);

  if (invoice.discount) {
    const discStr = Number(invoice.discount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    drawSummaryLine("Discount (Rs.) :", `- ${discStr}`);
  }

  p1.drawLine({
    start: { x: 350, y: yAt(sumY - 4) },
    end: { x: 555, y: yAt(sumY - 4) },
    thickness: 0.5,
    color: rgb(0.8, 0.85, 0.9),
  });

  drawSummaryLine("Total Amount (Rs.) :", totalStr, true);
  drawSummaryLine("Amount Paid (Rs.) :", paidStr, true, true);
  drawSummaryLine("Balance Due (Rs.) :", balStr, true);

  // 5. Payment Details Section Box
  let payY = sumY + 8;
  p1.drawRectangle({
    x: 36,
    y: yAt(payY + 14),
    width: 524,
    height: 14,
    color: rgb(0.95, 0.96, 0.98),
  });
  p1.drawText("Payment Details", { x: 42, y: yAt(payY + 3), size: 8, font: helveticaBold, color: rgb(0.01, 0.25, 0.5) });

  payY += 16;
  p1.drawText("Receipt No", { x: 45, y: yAt(payY + 4), size: 7.5, font: helveticaBold, color: textColor });
  p1.drawText("Amt Received (Rs.)", { x: 130, y: yAt(payY + 4), size: 7.5, font: helveticaBold, color: textColor });
  p1.drawText("Payment Mode", { x: 250, y: yAt(payY + 4), size: 7.5, font: helveticaBold, color: textColor });
  p1.drawText("Date", { x: 360, y: yAt(payY + 4), size: 7.5, font: helveticaBold, color: textColor });
  p1.drawText("Reference / Bank", { x: 450, y: yAt(payY + 4), size: 7.5, font: helveticaBold, color: textColor });

  payY += 14;
  if (invoice.paymentLogs && invoice.paymentLogs.length > 0) {
    invoice.paymentLogs.slice(0, 3).forEach((log, idx) => {
      const logAmtStr = Number(log.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      p1.drawText(`REC-10${idx + 1}`, { x: 45, y: yAt(payY + 4), size: 8, font: helvetica, color: textColor });
      p1.drawText(logAmtStr, { x: 130, y: yAt(payY + 4), size: 8, font: helveticaBold, color: rgb(0.01, 0.45, 0.25) });
      p1.drawText(log.method || "Cash", { x: 250, y: yAt(payY + 4), size: 8, font: helvetica, color: textColor });
      p1.drawText(log.date || formattedDate, { x: 360, y: yAt(payY + 4), size: 8, font: helvetica, color: textColor });
      p1.drawText("-", { x: 450, y: yAt(payY + 4), size: 8, font: helvetica, color: textColor });
      payY += 12;
    });
  } else {
    p1.drawText("REC-101", { x: 45, y: yAt(payY + 4), size: 8, font: helvetica, color: textColor });
    p1.drawText(paidStr, { x: 130, y: yAt(payY + 4), size: 8, font: helveticaBold, color: rgb(0.01, 0.45, 0.25) });
    p1.drawText("Cash", { x: 250, y: yAt(payY + 4), size: 8, font: helvetica, color: textColor });
    p1.drawText(formattedDate, { x: 360, y: yAt(payY + 4), size: 8, font: helvetica, color: textColor });
    p1.drawText("-", { x: 450, y: yAt(payY + 4), size: 8, font: helvetica, color: textColor });
  }

  // 6. Dynamic Amount in Words & Authorised Signatory Block
  const wordY = Math.max(payY + 36, 680);
  p1.drawText("Amount in Words:", { x: 36, y: yAt(wordY), size: 8, font: helveticaBold, color: textColor });
  const inWords = numberToWords(paidAmount || total);
  p1.drawText(inWords, { x: 36, y: yAt(wordY + 12), size: 8.5, font: helveticaBold, color: rgb(0.01, 0.25, 0.5) });

  // Signatory Block on right
  p1.drawText("Authorised Signatory", { x: 430, y: yAt(wordY), size: 8.5, font: helveticaBold, color: textColor });
  p1.drawText(invoice.doctor || "Dr. N. Shravan Krishna, B.D.S.", { x: 430, y: yAt(wordY + 12), size: 8, font: helvetica, color: textColor });
  p1.drawText("32 Smiles Multispeciality Dental Clinic", { x: 430, y: yAt(wordY + 23), size: 7.5, font: helvetica, color: textColor });

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
  const filename = `32Smiles_Invoice_${patientName}_${options.invoice.id}.pdf`;
  downloadPdfBytes(bytes, filename);
}

/**
 * Prints the Invoice PDF directly.
 */
export async function printInvoicePdf(
  options: GenerateInvoicePdfOptions
): Promise<void> {
  const blobUrl = await generateInvoicePdfBlobUrl(options);
  printPdfBlob(blobUrl, `Invoice - ${options.invoice.id}`);
}
