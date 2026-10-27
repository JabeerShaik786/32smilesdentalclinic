import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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

export async function generateAndDownloadInvoicePdf(
  options: GenerateInvoicePdfOptions
): Promise<void> {
  const { patient, invoice } = options;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const patientName = invoice.patientName || patient?.name || "Patient";
  const rawDate = invoice.paymentDate || new Date().toISOString().split("T")[0];
  const formattedDate = rawDate.includes("T") ? rawDate.split("T")[0] : rawDate.split(" ")[0];

  const subtotal = invoice.subtotal || 0;
  const paidAmount = invoice.paidAmount || 0;
  const total = invoice.total || subtotal;
  const balance = Math.max(0, total - paidAmount);

  // Clinic Header (Centered)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(1, 83, 173); // #0153AD
  doc.text("32 Smiles Multispeciality Dental Clinic", pageWidth / 2, 20, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text("32 Smiles Dental Clinic, Main Road", pageWidth / 2, 26, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.text("PH: +91 98765 43210", pageWidth / 2, 31, { align: "center" });

  doc.setDrawColor(148, 163, 184);
  doc.line(14, 35, pageWidth - 14, 35);

  // Invoice Details & Patient Info Grid
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`Invoice No :  ${invoice.id}`, 16, 42);
  doc.text(`Date :  ${formattedDate}`, 16, 48);

  doc.text(`Patient Name :  ${patientName}`, pageWidth / 2 + 10, 42);
  const ageGender = patient?.age ? `${patient.age} Y ${patient.gender || ""}`.trim() : "";
  if (ageGender) {
    doc.text(`Age/Gender :  ${ageGender}`, pageWidth / 2 + 10, 48);
  }

  doc.line(14, 53, pageWidth - 14, 53);

  // Treatments Table
  const items = invoice.items && invoice.items.length > 0
    ? invoice.items
    : [{ description: invoice.treatment || "Dental Treatment", amount: subtotal }];

  const tableRows = items.map((it, idx) => [
    String(idx + 1),
    it.description,
    Number(it.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  ]);

  autoTable(doc, {
    startY: 57,
    head: [["Sl No.", "Treatment Details", "Amount (₹)"]],
    headStyles: { fillColor: [1, 83, 173], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
    body: tableRows,
    bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 16, halign: "center" },
      1: { cellWidth: "auto" },
      2: { cellWidth: 35, halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  let currentY = (doc as any).lastAutoTable.finalY + 4;

  // Financial summary
  const summaryX = pageWidth - 70;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Gross amount :", summaryX, currentY);
  doc.text(Number(subtotal).toLocaleString("en-IN", { minimumFractionDigits: 2 }), pageWidth - 16, currentY, { align: "right" });

  if (invoice.discount) {
    currentY += 5;
    doc.text("Discount :", summaryX, currentY);
    doc.text(`- ${Number(invoice.discount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, pageWidth - 16, currentY, { align: "right" });
  }

  currentY += 5;
  doc.text("Amount paid :", summaryX, currentY);
  doc.text(Number(paidAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 }), pageWidth - 16, currentY, { align: "right" });

  currentY += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Balance :", summaryX, currentY);
  doc.text(Number(balance).toLocaleString("en-IN", { minimumFractionDigits: 2 }), pageWidth - 16, currentY, { align: "right" });

  currentY += 8;

  // Payment Details Section Box
  const paymentRows = (invoice.paymentLogs && invoice.paymentLogs.length > 0)
    ? invoice.paymentLogs.map((log, idx) => [
        `10${idx + 1}`,
        Number(log.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 }),
        "0.00",
        log.method,
        log.date || formattedDate,
        "-",
        "-"
      ])
    : [[
        "101",
        Number(paidAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 }),
        "0.00",
        "Cash",
        formattedDate,
        "-",
        "-"
      ]];

  autoTable(doc, {
    startY: currentY,
    head: [["Receipt No", "Amt Received", "Amt. Refund", "Mode", "Date", "NO", "Bank Name"]],
    headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: "bold", fontSize: 8 },
    body: paymentRows,
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59], halign: "center" },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Amount in words & Signatory block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const wordsText = numberToWords(paidAmount || total);
  const splitWords = doc.splitTextToSize(wordsText, 100);
  doc.text(splitWords, 14, currentY);

  doc.setFont("helvetica", "normal");
  doc.text("Authorised Signatory", pageWidth - 14, currentY, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.text("32 Smiles Multispeciality Dental Clinic", pageWidth - 14, currentY + 4, { align: "right" });
  doc.setFontSize(7.5);
  doc.text("PROSTHODONTIST", pageWidth - 14, currentY + 8, { align: "right" });

  const safeFilename = `32Smiles_Invoice_${invoice.id}_${patientName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
  doc.save(safeFilename);
}
