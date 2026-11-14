import { PDFDocument, rgb, degrees, StandardFonts, PDFFont, RGB } from "pdf-lib";
import { loadTemplateBytes } from "./pdfTemplateLoader";
import { wrapText, downloadPdfBytes, createPdfBlobUrl, printPdfBlob } from "./pdfUtils";
import { getCleanMedicalAlert } from "./medicalAlertUtils";

export interface GeneratePrescriptionPdfOptions {
  patient: {
    id: string;
    name: string;
    age?: number | string;
    gender?: string;
    phone?: string;
    medicalNotes?: string;
    allergies?: string;
    medicalConditions?: string;
    medicalHistory?: string[];
    medicalHistoryOthers?: string;
  };
  doctorName?: string;
  date?: string;
  nextAppointment?: string;
  diagnosis?: string;
  medicines: Array<{
    name: string;
    dosage: string;
    duration: string;
    instructions: string;
    strength?: string;
    quantity?: string;
  }>;
  advice?: string;
  parseDosageFn?: (dosageStr: string) => {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
    beforeMeals: boolean;
    afterMeals: boolean;
  };
}

/**
 * Generates the Prescription PDF bytes using strict PDF-overlay onto the replacement template (public/prescription.pdf).
 */
export async function generatePrescriptionPdfBytes(
  options: GeneratePrescriptionPdfOptions
): Promise<Uint8Array> {
  const {
    patient,
    doctorName = "",
    date,
    nextAppointment = "",
    diagnosis = "",
    medicines = [],
    advice = "",
    parseDosageFn,
  } = options;

  const templateBytes = await loadTemplateBytes("prescription");
  const doc = await PDFDocument.load(templateBytes);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await doc.embedFont(StandardFonts.HelveticaOblique);
  const textColor = rgb(0.08, 0.12, 0.2); // Crisp dark slate

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

  const displayDate =
    date ||
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const ageGenderStr = `${patient.age ? `${patient.age} Y` : ""} ${patient.gender ? `/ ${patient.gender}` : ""}`.trim();
  const medicalAlert = getCleanMedicalAlert(patient);

  // ==========================================
  // PAGE 1: PRESCRIPTION RECORD
  // ==========================================

  // 1. Patient Header Information
  // Name (x: 78..450, y_top: 217) - 6 pt padding after printed 'Name :'
  if (patient.name) {
    drawP1Text(patient.name.trim(), 78, 217, { font: helveticaBold, size: 10 });
  }

  // Age / Sex (x: 96..450, y_top: 235) - 8 pt padding after printed 'Age / Sex :'
  if (ageGenderStr) {
    drawP1Text(ageGenderStr, 96, 235, { font: helveticaBold, size: 9.5 });
  }

  // Date (x: 500..575, y_top: 217)
  if (displayDate) {
    drawP1Text(displayDate, 500, 217, { font: helveticaBold, size: 9.5 });
  }

  // Next Appointment (x: 468..575, y_top: 248) - positioned on line below 'Next Appointment :'
  const nextApptStr = nextAppointment ? nextAppointment.trim() : "";
  if (nextApptStr) {
    drawP1Text(nextApptStr, 468, 248, { font: helveticaBold, size: 8.5 });
  }

  // 2. Right-Hand Column: Diagnosis, Medical Alert, Advice, Doctor Signature
  // Bounded within x = 468 to 575 (width = 107 pt)
  let rightColY = 275;

  if (diagnosis && diagnosis.trim()) {
    drawP1Text("DIAGNOSIS:", 468, rightColY, { font: helveticaBold, size: 8, color: rgb(0.01, 0.32, 0.68) });
    rightColY += 12;
    const diagLines = wrapText(diagnosis.trim(), helvetica, 7.8, 107);
    diagLines.slice(0, 5).forEach((line) => {
      drawP1Text(line, 468, rightColY, { font: helvetica, size: 7.8 });
      rightColY += 11;
    });
    rightColY += 6;
  }

  if (medicalAlert && medicalAlert.trim()) {
    drawP1Text("MEDICAL ALERT:", 468, rightColY, { font: helveticaBold, size: 8, color: rgb(0.8, 0.1, 0.1) });
    rightColY += 12;
    const alertLines = wrapText(medicalAlert.trim(), helvetica, 7.8, 107);
    alertLines.slice(0, 4).forEach((line) => {
      drawP1Text(line, 468, rightColY, { font: helvetica, size: 7.8 });
      rightColY += 11;
    });
    rightColY += 6;
  }

  const adviceText = advice ? advice.trim() : "";
  if (adviceText) {
    drawP1Text("ADVICE & NOTES:", 468, rightColY, { font: helveticaBold, size: 8, color: rgb(0.01, 0.32, 0.68) });
    rightColY += 12;
    const adviceLines = wrapText(adviceText, helvetica, 7.5, 107);
    adviceLines.slice(0, 10).forEach((line) => {
      if (rightColY < 670) {
        drawP1Text(line, 468, rightColY, { font: helvetica, size: 7.5 });
        rightColY += 10.5;
      }
    });
  }

  // Doctor Signature at bottom right
  const docToPrint = doctorName ? doctorName.trim() : "";
  if (docToPrint) {
    drawP1Text(docToPrint, 468, 685, { font: helveticaBold, size: 8.5 });
    drawP1Text("Consultant Dental Surgeon", 468, 698, { font: helvetica, size: 7.5 });
  }

  // 3. Left-Hand Column: Prescribed Medicines (Under Rx Symbol)
  // Region: x = 35 to 445 (width = 410 pt), y = 290 down to 700
  let medY = 290;

  if (medicines && medicines.length > 0) {
    medicines.slice(0, 10).forEach((med, idx) => {
      if (!med.name || !med.name.trim()) return;
      if (medY > 685) return;

      // Line 1: Number + Medicine Name + Strength
      const numStr = `${idx + 1}.`;
      drawP1Text(numStr, 35, medY, { font: helveticaBold, size: 9.5 });

      const nameWithStrength = [med.name, med.strength].filter(Boolean).join(" ");
      drawP1Text(nameWithStrength, 55, medY, {
        font: helveticaBold,
        size: 9.5,
        color: rgb(0.01, 0.22, 0.45),
      });

      // Quantity right-aligned on line 1 if available
      if (med.quantity) {
        const qtyStr = `Qty: ${med.quantity}`;
        const qW = helveticaBold.widthOfTextAtSize(qtyStr, 8.5);
        drawP1Text(qtyStr, 440 - qW, medY, {
          font: helveticaBold,
          size: 8.5,
          color: rgb(0.3, 0.35, 0.4),
        });
      }

      medY += 13;

      // Line 2: Dosage Schedule & Timing
      let dosageDisplay = med.dosage || "";
      let timingDisplay = "";

      if (parseDosageFn && med.dosage) {
        const parsed = parseDosageFn(med.dosage);
        const m = parsed.morning ? "1" : "0";
        const a = parsed.afternoon ? "1" : "0";
        const n = parsed.night ? "1" : "0";
        dosageDisplay = `${m} - ${a} - ${n}`;
        if (parsed.beforeMeals) timingDisplay = "Before Food";
        else if (parsed.afterMeals) timingDisplay = "After Food";
      }

      const scheduleParts = [
        dosageDisplay ? `[ ${dosageDisplay} ]` : "",
        timingDisplay ? `(${timingDisplay})` : "",
        med.duration ? `Duration: ${med.duration}` : "",
      ].filter(Boolean);

      if (scheduleParts.length > 0) {
        drawP1Text(scheduleParts.join("   •   "), 55, medY, {
          font: helveticaBold,
          size: 8.5,
          color: rgb(0.15, 0.25, 0.35),
        });
        medY += 12;
      }

      // Line 3: Specific Instructions / Remarks
      if (med.instructions && med.instructions.trim()) {
        const instrLines = wrapText(med.instructions.trim(), helveticaOblique, 8, 385);
        instrLines.slice(0, 2).forEach((iLine) => {
          drawP1Text(`Note: ${iLine}`, 55, medY, {
            font: helveticaOblique,
            size: 8,
            color: rgb(0.35, 0.4, 0.45),
          });
          medY += 10.5;
        });
      }

      // Space between medicines
      medY += 8;
    });
  }

  // Page 2: Telugu post-extraction care instructions (preserved untouched)

  return await doc.save();
}

/**
 * Creates a blob URL for previewing or printing the Prescription.
 */
export async function generatePrescriptionPdfBlobUrl(
  options: GeneratePrescriptionPdfOptions
): Promise<string> {
  const bytes = await generatePrescriptionPdfBytes(options);
  return createPdfBlobUrl(bytes);
}

/**
 * Generates and downloads the Prescription PDF file.
 */
export async function generateAndDownloadPrescriptionPdf(
  options: GeneratePrescriptionPdfOptions
): Promise<void> {
  const bytes = await generatePrescriptionPdfBytes(options);
  const patientName = (options.patient.name || "Patient").replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `32Smiles_Prescription_${patientName}_${options.patient.id || "rec"}.pdf`;
  downloadPdfBytes(bytes, filename);
}

/**
 * Prints the Prescription PDF directly.
 */
export async function printPrescriptionPdf(
  options: GeneratePrescriptionPdfOptions
): Promise<void> {
  const blobUrl = await generatePrescriptionPdfBlobUrl(options);
  printPdfBlob(blobUrl, `Prescription - ${options.patient.name || "Patient"}`);
}
