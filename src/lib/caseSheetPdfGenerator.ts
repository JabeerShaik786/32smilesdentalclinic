import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { loadTemplateBytes } from "./pdfTemplateLoader";
import { wrapText, downloadPdfBytes, createPdfBlobUrl, printPdfBlob } from "./pdfUtils";

export interface GenerateCaseSheetPdfOptions {
  patient: {
    id: string;
    name: string;
    age?: number | string;
    gender?: string;
    phone?: string;
    email?: string;
    address?: string;
    occupation?: string;
    refDoctor?: string;
    visit?: string;
    firstVisit?: string;
    allergies?: string;
    medicalNotes?: string;
    surgeries?: string;
    habits?: string;
    bp?: string;
    diabetic?: string;
    pregnancy?: string;
    dentalChart?: Record<number | string, string | string[]>;
  };
  medicalHistoryConditions?: string[];
  medicalHistoryOthers?: string;
  currentMedications?: string;
  chiefComplaint?: string;
  intraOralExam?: string;
  provisionalDiagnosis?: string;
  treatmentAdvised?: string;
  visitDate?: string;
  doctorName?: string;
  costItems?: Array<{ sNo: string | number; treatment: string; cost: number | string }>;
  totalEstimate?: number | string;
  treatmentRemarks?: Array<{ sNo: string | number; date: string; remarks: string }>;
}

// Map FDI numbers to column index (0 to 15)
function getToothColIndex(fdi: number): { quadrant: number; colIdx: number } | null {
  if (fdi >= 11 && fdi <= 18) {
    // Upper Right: 18 (col 0) down to 11 (col 7)
    return { quadrant: 1, colIdx: 18 - fdi };
  } else if (fdi >= 21 && fdi <= 28) {
    // Upper Left: 21 (col 8) up to 28 (col 15)
    return { quadrant: 2, colIdx: fdi - 21 + 8 };
  } else if (fdi >= 41 && fdi <= 48) {
    // Lower Right: 48 (col 0) down to 41 (col 7)
    return { quadrant: 4, colIdx: 48 - fdi };
  } else if (fdi >= 31 && fdi <= 38) {
    // Lower Left: 31 (col 8) up to 38 (col 15)
    return { quadrant: 3, colIdx: fdi - 31 + 8 };
  }
  return null;
}

// FDI conversion from 1-32 index if needed
const INDEX_TO_FDI: Record<number, number> = {
  1: 18, 2: 17, 3: 16, 4: 15, 5: 14, 6: 13, 7: 12, 8: 11,
  9: 21, 10: 22, 11: 23, 12: 24, 13: 25, 14: 26, 15: 27, 16: 28,
  17: 38, 18: 37, 19: 36, 20: 35, 21: 34, 22: 33, 23: 32, 24: 31,
  25: 41, 26: 42, 27: 43, 28: 44, 29: 45, 30: 46, 31: 47, 32: 48
};

function shortenToothStatus(status: string): string {
  if (!status) return "";
  const s = status.toLowerCase();
  if (s.includes("root canal") || s.includes("rct")) return "RCT";
  if (s.includes("crown") || s.includes("cap")) return "Crown";
  if (s.includes("fill") || s.includes("restoration") || s.includes("composite")) return "Fill";
  if (s.includes("decay") || s.includes("caries") || s.includes("cavity")) return "Decay";
  if (s.includes("miss") || s.includes("absent")) return "Miss";
  if (s.includes("extract")) return "Ext";
  if (s.includes("implant")) return "Imp";
  if (s.includes("bridge")) return "Bridge";
  return status.length > 6 ? status.slice(0, 5) : status;
}

/**
 * Generates the Case Sheet PDF bytes using strict PDF-overlay onto the original template.
 */
export async function generateCaseSheetPdfBytes(
  options: GenerateCaseSheetPdfOptions
): Promise<Uint8Array> {
  const {
    patient,
    medicalHistoryConditions = [],
    medicalHistoryOthers = "",
    currentMedications = "",
    chiefComplaint = "",
    intraOralExam = "",
    provisionalDiagnosis = "",
    treatmentAdvised = "",
    visitDate = "",
    doctorName = "Dr. N. Shravan Krishna, B.D.S.",
    costItems = [],
    totalEstimate = "",
    treatmentRemarks = [],
  } = options;

  const templateBytes = await loadTemplateBytes("casesheet");
  const doc = await PDFDocument.load(templateBytes);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const textColor = rgb(0.08, 0.12, 0.2); // Crisp dark slate

  const pages = doc.getPages();
  const p1 = pages[0];
  const { height: p1H } = p1.getSize();
  const yAt = (fitzY: number) => p1H - fitzY;

  const displayDate =
    visitDate ||
    patient.visit ||
    patient.firstVisit ||
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  // ==========================================
  // PAGE 1: PATIENT & CLINICAL RECORD
  // ==========================================

  // 1. Case No & Date
  const caseNo = patient.id || "N/A";
  p1.drawText(caseNo, { x: 56, y: yAt(127), size: 9.5, font: helveticaBold, color: textColor });
  p1.drawText(displayDate, { x: 492, y: yAt(127), size: 9.5, font: helveticaBold, color: textColor });

  // 2. Name & Age/Sex
  p1.drawText(patient.name || "", { x: 120, y: yAt(151), size: 10, font: helveticaBold, color: textColor });
  const ageGenderStr = `${patient.age ? `${patient.age} Y` : ""} ${patient.gender ? `/ ${patient.gender}` : ""}`.trim();
  if (ageGenderStr) {
    p1.drawText(ageGenderStr, { x: 515, y: yAt(150), size: 9.5, font: helveticaBold, color: textColor });
  }

  // 3. Address (two underline fields: line 1 max width 510, line 2 max width 550)
  if (patient.address) {
    const addressLines = wrapText(patient.address, helvetica, 9, 510);
    if (addressLines[0]) {
      p1.drawText(addressLines[0], { x: 60, y: yAt(174), size: 9, font: helvetica, color: textColor });
    }
    if (addressLines[1]) {
      p1.drawText(addressLines.slice(1).join(", "), { x: 18, y: yAt(195), size: 9, font: helvetica, color: textColor });
    }
  }

  // 4. Contact: Mobile, Phone (O), Email
  if (patient.phone) {
    p1.drawText(patient.phone, { x: 58, y: yAt(222), size: 9, font: helvetica, color: textColor });
  }
  // Optional office phone
  const offPhone = (patient as any).officePhone || "";
  if (offPhone) {
    p1.drawText(offPhone, { x: 310, y: yAt(222), size: 9, font: helvetica, color: textColor });
  }
  if (patient.email) {
    p1.drawText(patient.email, { x: 455, y: yAt(222), size: 8.5, font: helvetica, color: textColor });
  }

  // 5. Occupation & Referred by
  if (patient.occupation) {
    p1.drawText(patient.occupation, { x: 148, y: yAt(246), size: 9, font: helvetica, color: textColor });
  }
  if (patient.refDoctor) {
    p1.drawText(patient.refDoctor, { x: 88, y: yAt(269), size: 9, font: helvetica, color: textColor });
  }

  // 6. Medical History Indicators: 1. B. P, 2. Diabetic, 3. Pregnancy
  const condsLower = medicalHistoryConditions.map(c => c.toLowerCase());
  const medNotesLower = (patient.medicalNotes || "").toLowerCase();

  const isBP = patient.bp || condsLower.some(c => c.includes("b.p") || c.includes("blood pressure") || c.includes("hypertension")) || medNotesLower.includes("hypertension");
  const isDiabetic = patient.diabetic || condsLower.some(c => c.includes("diabet")) || medNotesLower.includes("diabet");
  const isPreg = patient.pregnancy || condsLower.some(c => c.includes("pregnan"));

  p1.drawText(patient.bp || (isBP ? "Yes" : "Normal"), { x: 58, y: yAt(325), size: 8.5, font: helveticaBold, color: isBP ? rgb(0.8, 0.1, 0.1) : textColor });
  p1.drawText(patient.diabetic || (isDiabetic ? "Yes" : "No"), { x: 326, y: yAt(325), size: 8.5, font: helveticaBold, color: isDiabetic ? rgb(0.8, 0.1, 0.1) : textColor });

  const pregValue = patient.pregnancy || (isPreg ? "Yes" : (patient.gender?.toLowerCase() === "male" ? "N/A" : "No"));
  p1.drawText(pregValue, { x: 520, y: yAt(325), size: 8.5, font: helveticaBold, color: textColor });

  // 7. Medical History Table (4 Columns, content y: 393 down to 443)
  // Col 1: Medications
  const medsText = currentMedications || "None reported";
  const medLines = wrapText(medsText, helvetica, 8, 128);
  medLines.slice(0, 4).forEach((line, i) => {
    p1.drawText(line, { x: 28, y: yAt(402 + i * 11), size: 8, font: helvetica, color: textColor });
  });

  // Col 2: Allergies
  const allergyList: string[] = [];
  if (patient.allergies) allergyList.push(patient.allergies);
  medicalHistoryConditions.forEach(c => {
    if (c.toLowerCase().includes("allerg") && !allergyList.includes(c)) allergyList.push(c);
  });
  const allergyText = allergyList.length > 0 ? allergyList.join(", ") : "None reported";
  const allergyLines = wrapText(allergyText, helvetica, 8, 128);
  allergyLines.slice(0, 4).forEach((line, i) => {
    p1.drawText(line, { x: 166, y: yAt(402 + i * 11), size: 8, font: helvetica, color: textColor });
  });

  // Col 3: Surgeries / Hospitalization
  const surgText = patient.surgeries || (medicalHistoryOthers ? `Other: ${medicalHistoryOthers}` : "Nil reported");
  const surgLines = wrapText(surgText, helvetica, 8, 128);
  surgLines.slice(0, 4).forEach((line, i) => {
    p1.drawText(line, { x: 304, y: yAt(402 + i * 11), size: 8, font: helvetica, color: textColor });
  });

  // Col 4: Habits
  const habitsText = patient.habits || "Nil reported";
  const habitLines = wrapText(habitsText, helvetica, 8, 128);
  habitLines.slice(0, 4).forEach((line, i) => {
    p1.drawText(line, { x: 442, y: yAt(402 + i * 11), size: 8, font: helvetica, color: textColor });
  });

  // 8. Chief Complaint
  const chiefStr = chiefComplaint || "Patient reported for routine dental examination and oral prophylaxis.";
  const chiefLines = wrapText(chiefStr, helvetica, 8.5, 545);
  chiefLines.slice(0, 4).forEach((line, i) => {
    p1.drawText(line, { x: 20, y: yAt(474 + i * 13), size: 8.5, font: helvetica, color: textColor });
  });

  // 9. Tooth Chart Annotations
  // 16 Columns centers:
  const colCenters = [50.5, 84.2, 117.9, 151.6, 185.3, 219.0, 252.7, 286.4, 320.1, 353.9, 387.7, 421.4, 455.2, 489.0, 522.7, 556.5];

  if (patient.dentalChart && typeof patient.dentalChart === "object") {
    Object.entries(patient.dentalChart).forEach(([key, val]) => {
      const num = Number(key);
      const fdi = num > 10 && num < 50 ? num : (INDEX_TO_FDI[num] || 0);
      if (!fdi) return;

      const mapping = getToothColIndex(fdi);
      if (!mapping) return;

      const valStr = Array.isArray(val) ? val.join(", ") : String(val || "");
      const shortCode = shortenToothStatus(valStr);
      if (!shortCode) return;

      const cx = colCenters[mapping.colIdx];
      const w = helveticaBold.widthOfTextAtSize(shortCode, 7);

      if (mapping.quadrant === 1 || mapping.quadrant === 2) {
        // Upper row: yAt(571)
        p1.drawText(shortCode, {
          x: cx - w / 2,
          y: yAt(571),
          size: 7,
          font: helveticaBold,
          color: rgb(0.7, 0.1, 0.1),
        });
      } else {
        // Lower row: yAt(642)
        p1.drawText(shortCode, {
          x: cx - w / 2,
          y: yAt(642),
          size: 7,
          font: helveticaBold,
          color: rgb(0.7, 0.1, 0.1),
        });
      }
    });
  }

  // 10. Treatment Plan & Clinical Notes
  let planY = 678;
  const fullPlanText = [
    treatmentAdvised ? `Treatment Advised: ${treatmentAdvised}` : "",
    intraOralExam ? `Intra Oral Examination: ${intraOralExam}` : "",
    provisionalDiagnosis ? `Provisional Diagnosis: ${provisionalDiagnosis}` : ""
  ].filter(Boolean).join("\n\n");

  const planContent = fullPlanText || "No active treatment plan recorded.";
  for (const rawLine of planContent.split("\n")) {
    const wrapped = wrapText(rawLine, helvetica, 8.5, 545);
    for (const wLine of wrapped) {
      if (planY > 770) break;
      p1.drawText(wLine, { x: 20, y: yAt(planY), size: 8.5, font: helvetica, color: textColor });
      planY += 12;
    }
  }

  // 11. Doctor signature
  p1.drawText(doctorName, { x: 420, y: yAt(776), size: 8.5, font: helveticaBold, color: textColor });

  // ==========================================
  // PAGE 2: COST ESTIMATE, CONSENT & VISITS
  // ==========================================
  if (pages.length > 1) {
    const p2 = pages[1];
    const { height: p2H } = p2.getSize();
    const yAtP2 = (fitzY: number) => p2H - fitzY;

    // 1. Cost Estimate Table (Rows 1 to 15, fitzY = 86 + idx * 15.15)
    let computedTotal = 0;
    const finalCostItems = costItems.length > 0
      ? costItems
      : (treatmentAdvised ? [
          { sNo: "1", treatment: treatmentAdvised.split("\n")[0] || "Dental Consultation & Treatment", cost: "1,500.00" }
        ] : []);

    finalCostItems.slice(0, 15).forEach((item, idx) => {
      const rowY = 86 + idx * 15.15;
      const sNoStr = String(item.sNo || idx + 1);
      const costStr = typeof item.cost === "number"
        ? item.cost.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : String(item.cost);

      const numVal = typeof item.cost === "number" ? item.cost : parseFloat(costStr.replace(/[^0-9.]/g, "")) || 0;
      computedTotal += numVal;

      // S.No. centered in col (x: 36..90, center: 63)
      const snW = helvetica.widthOfTextAtSize(sNoStr, 8);
      p2.drawText(sNoStr, { x: 63 - snW / 2, y: yAtP2(rowY), size: 8, font: helvetica, color: textColor });

      // Treatment (x: 94..307)
      const trStr = item.treatment.length > 36 ? item.treatment.slice(0, 35) + "…" : item.treatment;
      p2.drawText(trStr, { x: 94, y: yAtP2(rowY), size: 8, font: helvetica, color: textColor });

      // Cost (x: 312..399, right aligned ~ 395)
      const cW = helveticaBold.widthOfTextAtSize(costStr, 8);
      p2.drawText(costStr, { x: 395 - cW, y: yAtP2(rowY), size: 8, font: helveticaBold, color: textColor });
    });

    // Total Cost Row (fitzY: 313)
    const totalCostStr = totalEstimate
      ? (typeof totalEstimate === "number" ? totalEstimate.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : String(totalEstimate))
      : (computedTotal > 0 ? computedTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-");

    const totW = helveticaBold.widthOfTextAtSize(totalCostStr, 8.5);
    p2.drawText(totalCostStr, { x: 395 - totW, y: yAtP2(313), size: 8.5, font: helveticaBold, color: textColor });

    // 2. Consent Date & Time, and Patient Signature
    p2.drawText(`${displayDate}`, { x: 98, y: yAtP2(556), size: 8.5, font: helveticaBold, color: textColor });
    // Patient Signature placed ABOVE label to avoid overlap
    p2.drawText(patient.name || "", { x: 310, y: yAtP2(538), size: 8.5, font: helveticaBold, color: textColor });

    // 3. Treatment Date & Remarks Table (Right Side, 16 rows)
    const finalRemarks = treatmentRemarks.length > 0
      ? treatmentRemarks
      : [{ sNo: "1", date: displayDate, remarks: "Consultation, diagnosis and treatment advised recorded." }];

    finalRemarks.slice(0, 16).forEach((v, idx) => {
      const rY = 82 + idx * 29.1;
      const snStr = String(v.sNo || idx + 1);
      const snW = helvetica.widthOfTextAtSize(snStr, 8.5);
      p2.drawText(snStr, { x: 463 - snW / 2, y: yAtP2(rY), size: 8.5, font: helvetica, color: textColor });
      p2.drawText(v.date, { x: 494, y: yAtP2(rY), size: 8.5, font: helveticaBold, color: textColor });

      const rLines = wrapText(v.remarks, helvetica, 8, 122);
      rLines.slice(0, 2).forEach((rl, ri) => {
        p2.drawText(rl, { x: 694, y: yAtP2(rY - 4 + ri * 10), size: 8, font: helvetica, color: textColor });
      });
    });
  }

  return await doc.save();
}

/**
 * Creates a blob URL for previewing or printing the Case Sheet.
 */
export async function generateCaseSheetPdfBlobUrl(
  options: GenerateCaseSheetPdfOptions
): Promise<string> {
  const bytes = await generateCaseSheetPdfBytes(options);
  return createPdfBlobUrl(bytes);
}

/**
 * Generates and downloads the Case Sheet PDF file.
 */
export async function generateAndDownloadCaseSheetPdf(
  options: GenerateCaseSheetPdfOptions
): Promise<void> {
  const bytes = await generateCaseSheetPdfBytes(options);
  const patientName = options.patient.name.replace(/[^a-zA-Z0-9]/g, "_") || "Patient";
  const filename = `32Smiles_CaseSheet_${patientName}_${options.patient.id}.pdf`;
  downloadPdfBytes(bytes, filename);
}

/**
 * Prints the Case Sheet PDF directly.
 */
export async function printCaseSheetPdf(
  options: GenerateCaseSheetPdfOptions
): Promise<void> {
  const blobUrl = await generateCaseSheetPdfBlobUrl(options);
  printPdfBlob(blobUrl, `Case Sheet - ${options.patient.name}`);
}
