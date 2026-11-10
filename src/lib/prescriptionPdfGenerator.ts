import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
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
 * Generates the Prescription PDF bytes using strict PDF-overlay onto the original template.
 */
export async function generatePrescriptionPdfBytes(
  options: GeneratePrescriptionPdfOptions
): Promise<Uint8Array> {
  const {
    patient,
    doctorName = "Dr. N. Shravan Krishna, B.D.S.",
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
  const { height: p1H } = p1.getSize();
  const yAt = (fitzY: number) => p1H - fitzY;

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
  p1.drawText(patient.name || "Patient", { x: 55, y: yAt(168), size: 10, font: helveticaBold, color: textColor });
  if (ageGenderStr) {
    p1.drawText(ageGenderStr, { x: 75, y: yAt(185), size: 9.5, font: helveticaBold, color: textColor });
  }

  p1.drawText(displayDate, { x: 496, y: yAt(163), size: 9.5, font: helveticaBold, color: textColor });

  const nextApptStr = nextAppointment || "Review after 5 days / As Advised";
  p1.drawText(nextApptStr, { x: 462, y: yAt(196), size: 8.5, font: helveticaBold, color: textColor });

  // 2. Right-Hand Column: Diagnosis, Medical Alert, Advice, Doctor Signature
  // Bounded within x = 458 to 585 (width = 127 pt)
  let rightColY = 224;

  if (diagnosis.trim()) {
    p1.drawText("DIAGNOSIS:", { x: 460, y: yAt(rightColY), size: 8, font: helveticaBold, color: rgb(0.01, 0.32, 0.68) });
    rightColY += 12;
    const diagLines = wrapText(diagnosis.trim(), helvetica, 7.8, 125);
    diagLines.slice(0, 5).forEach((line) => {
      p1.drawText(line, { x: 460, y: yAt(rightColY), size: 7.8, font: helvetica, color: textColor });
      rightColY += 10.5;
    });
    rightColY += 6;
  }

  if (medicalAlert.trim()) {
    p1.drawText("MEDICAL ALERT:", { x: 460, y: yAt(rightColY), size: 8, font: helveticaBold, color: rgb(0.8, 0.1, 0.1) });
    rightColY += 12;
    const alertLines = wrapText(medicalAlert.trim(), helvetica, 7.8, 125);
    alertLines.slice(0, 4).forEach((line) => {
      p1.drawText(line, { x: 460, y: yAt(rightColY), size: 7.8, font: helvetica, color: textColor });
      rightColY += 10.5;
    });
    rightColY += 6;
  }

  const adviceText = advice.trim() || "1. Take medications strictly after meals.\n2. Warm saline rinses 3-4 times daily.\n3. Avoid hot/hard foods on treatment site.\n4. Complete prescribed medicine course.";
  p1.drawText("ADVICE & NOTES:", { x: 460, y: yAt(rightColY), size: 8, font: helveticaBold, color: rgb(0.01, 0.32, 0.68) });
  rightColY += 12;
  const adviceLines = wrapText(adviceText, helvetica, 7.5, 125);
  adviceLines.slice(0, 10).forEach((line) => {
    if (rightColY < 710) {
      p1.drawText(line, { x: 460, y: yAt(rightColY), size: 7.5, font: helvetica, color: textColor });
      rightColY += 10.5;
    }
  });

  // Doctor Signature at bottom right
  p1.drawText(doctorName, { x: 460, y: yAt(730), size: 8.5, font: helveticaBold, color: textColor });
  p1.drawText("Consultant Dental Surgeon", { x: 460, y: yAt(742), size: 7.5, font: helvetica, color: textColor });

  // 3. Left-Hand Column: Prescribed Medicines (Under Rx symbol)
  // Available: x = 20 to 445 (width ~ 420 pt), y = 238 to 755 (height ~ 517 pt)
  let medY = 238;

  if (medicines.length === 0) {
    p1.drawText("No medications prescribed for this visit.", {
      x: 35,
      y: yAt(medY),
      size: 9,
      font: helveticaOblique,
      color: rgb(0.4, 0.45, 0.5),
    });
  } else {
    medicines.forEach((med, idx) => {
      if (medY > 730) return; // safety boundary

      const medFullName = [
        med.name.trim(),
        med.strength?.trim()
      ].filter(Boolean).join(" ");

      // 1. Medicine Name & Number
      p1.drawText(`${idx + 1}.  ${medFullName}`, {
        x: 25,
        y: yAt(medY),
        size: 9.5,
        font: helveticaBold,
        color: rgb(0.05, 0.25, 0.6),
      });
      medY += 14;

      // 2. Dosage parsing & timing details
      let dosageDisplay = med.dosage || "";
      if (parseDosageFn && med.dosage) {
        const parsed = parseDosageFn(med.dosage);
        const times: string[] = [];
        if (parsed.morning) times.push("Morning");
        if (parsed.afternoon) times.push("Afternoon");
        if (parsed.night) times.push("Night");
        const timeStr = times.join(", ");
        let mealStr = "";
        if (parsed.beforeMeals) mealStr = "(Before Meals)";
        else if (parsed.afterMeals) mealStr = "(After Meals)";
        dosageDisplay = [med.dosage, timeStr, mealStr].filter(Boolean).join(" ");
      }

      const durationStr = med.duration?.trim() ? `Duration: ${med.duration.trim()}` : "";
      const qtyStr = med.quantity?.trim() ? `Qty: ${med.quantity.trim()}` : "";

      const detailsLine = [
        dosageDisplay ? `Dosage: ${dosageDisplay}` : "",
        durationStr,
        qtyStr
      ].filter(Boolean).join("    |    ");

      if (detailsLine) {
        p1.drawText(detailsLine, {
          x: 38,
          y: yAt(medY),
          size: 8.5,
          font: helvetica,
          color: textColor,
        });
        medY += 12;
      }

      // 3. Instructions
      if (med.instructions?.trim()) {
        const instLines = wrapText(`Inst: ${med.instructions.trim()}`, helveticaOblique, 8, 400);
        instLines.slice(0, 2).forEach((inst) => {
          p1.drawText(inst, {
            x: 38,
            y: yAt(medY),
            size: 8,
            font: helveticaOblique,
            color: rgb(0.3, 0.35, 0.45),
          });
          medY += 10.5;
        });
      }

      medY += 10; // spacing before next medicine
    });
  }

  // Page 2 (Post-treatment Telugu instructions) remains 100% untouched as part of the original template!
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
  const patientName = options.patient.name.replace(/[^a-zA-Z0-9]/g, "_") || "Patient";
  const filename = `32Smiles_Prescription_${patientName}_${options.patient.id}.pdf`;
  downloadPdfBytes(bytes, filename);
}

/**
 * Prints the Prescription PDF directly.
 */
export async function printPrescriptionPdf(
  options: GeneratePrescriptionPdfOptions
): Promise<void> {
  const blobUrl = await generatePrescriptionPdfBlobUrl(options);
  printPdfBlob(blobUrl, `Prescription - ${options.patient.name}`);
}
