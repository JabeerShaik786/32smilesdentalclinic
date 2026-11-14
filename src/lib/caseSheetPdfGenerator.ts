import { PDFDocument, rgb, degrees, StandardFonts, PDFFont, RGB } from "pdf-lib";
import { loadTemplateBytes } from "./pdfTemplateLoader";
import { wrapText, downloadPdfBytes, createPdfBlobUrl, printPdfBlob } from "./pdfUtils";

export interface CompletedTreatmentRecord {
  date?: string;
  treatmentDone?: string;
  treatment?: string;
  name?: string;
  remarks?: string;
  notes?: string;
  stage?: string;
}

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
  costItems?: Array<{ sNo?: string | number; treatment: string; cost: number | string }>;
  totalEstimate?: number | string;
  treatmentRemarks?: Array<{ sNo?: string | number; date?: string; treatmentDone?: string; remarks?: string }>;
  completedTreatments?: CompletedTreatmentRecord[];
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
 * Generates the Case Sheet PDF bytes using strict PDF-overlay onto the replacement template (public/caseSheet.pdf).
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
    doctorName = "",
    costItems = [],
    totalEstimate = "",
    treatmentRemarks = [],
    completedTreatments = [],
  } = options;

  const templateBytes = await loadTemplateBytes("casesheet");
  const doc = await PDFDocument.load(templateBytes);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
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

  // 1. Case No & Date (underline at 173.3 pt, 175.7 pt)
  const caseNo = patient.id ? patient.id.trim() : "";
  if (caseNo) {
    drawP1Text(caseNo, 80, 168, { font: helveticaBold, size: 9.5 });
  }
  if (displayDate) {
    drawP1Text(displayDate, 470, 170, { font: helveticaBold, size: 9.5 });
  }

  // 2. Name & Age/Sex (underline at 194.9 pt)
  if (patient.name) {
    drawP1Text(patient.name.trim(), 135, 189, { font: helveticaBold, size: 10 });
  }
  const ageGenderStr = `${patient.age ? `${patient.age} Y` : ""} ${patient.gender ? `/ ${patient.gender}` : ""}`.trim();
  if (ageGenderStr) {
    drawP1Text(ageGenderStr, 490, 189, { font: helveticaBold, size: 9.5 });
  }

  // 3. Address (two underline fields: line 1 underline at 215 pt, line 2 underline at 235 pt)
  if (patient.address) {
    const addressLines = wrapText(patient.address.trim(), helvetica, 9, 490);
    if (addressLines[0]) {
      drawP1Text(addressLines[0], 80, 210, { font: helvetica, size: 9 });
    }
    if (addressLines[1]) {
      drawP1Text(addressLines.slice(1).join(", "), 28, 230, { font: helvetica, size: 9 });
    }
  }

  // 4. Contact: Mobile, Phone (O), Email (underline at 254.9 pt)
  if (patient.phone) {
    drawP1Text(patient.phone.trim(), 68, 246, { font: helvetica, size: 9 });
  }
  const offPhone = (patient as any).officePhone || "";
  if (offPhone) {
    drawP1Text(offPhone.trim(), 320, 246, { font: helvetica, size: 9 });
  }
  if (patient.email) {
    drawP1Text(patient.email.trim(), 455, 246, { font: helvetica, size: 8.5 });
  }

  // 5. Occupation & Referred by (underlines at 275 pt and 295 pt)
  if (patient.occupation) {
    drawP1Text(patient.occupation.trim(), 160, 268, { font: helvetica, size: 9 });
  }
  if (patient.refDoctor) {
    drawP1Text(patient.refDoctor.trim(), 95, 288, { font: helvetica, size: 9 });
  }

  // 6. Medical History Indicators: 1. B.P., 2. Diabetic, 3. Pregnancy
  const condsLower = medicalHistoryConditions.map(c => c.toLowerCase());
  const medNotesLower = (patient.medicalNotes || "").toLowerCase();

  const isBP = patient.bp || condsLower.some(c => c.includes("b.p") || c.includes("blood pressure") || c.includes("hypertension")) || medNotesLower.includes("hypertension");
  const isDiabetic = patient.diabetic || condsLower.some(c => c.includes("diabet")) || medNotesLower.includes("diabet");
  const isPreg = patient.pregnancy || condsLower.some(c => c.includes("pregnan"));

  const bpVal = patient.bp || (isBP ? "Yes" : "");
  if (bpVal) {
    drawP1Text(bpVal, 65, 345, { font: helveticaBold, size: 9, color: isBP ? rgb(0.8, 0.1, 0.1) : textColor });
  }

  const diabVal = patient.diabetic || (isDiabetic ? "Yes" : "");
  if (diabVal) {
    drawP1Text(diabVal, 345, 345, { font: helveticaBold, size: 9, color: isDiabetic ? rgb(0.8, 0.1, 0.1) : textColor });
  }

  const pregValue = patient.pregnancy || (isPreg ? "Yes" : "");
  if (pregValue) {
    drawP1Text(pregValue, 515, 345, { font: helveticaBold, size: 9, color: textColor });
  }

  // 7. Medical History Table (4 Columns, content y: 405 to 438)
  // Col 1: Medications
  if (currentMedications && currentMedications.trim()) {
    const medLines = wrapText(currentMedications.trim(), helvetica, 8, 120);
    medLines.slice(0, 3).forEach((line, i) => {
      drawP1Text(line, 35, 412 + i * 11, { font: helvetica, size: 8 });
    });
  }

  // Col 2: Allergies
  const allergyList: string[] = [];
  if (patient.allergies) allergyList.push(patient.allergies);
  medicalHistoryConditions.forEach(c => {
    if (c.toLowerCase().includes("allerg") && !allergyList.includes(c)) allergyList.push(c);
  });
  if (allergyList.length > 0) {
    const allergyLines = wrapText(allergyList.join(", "), helvetica, 8, 120);
    allergyLines.slice(0, 3).forEach((line, i) => {
      drawP1Text(line, 165, 412 + i * 11, { font: helvetica, size: 8 });
    });
  }

  // Col 3: Surgeries / Hospitalization
  const surgText = patient.surgeries || medicalHistoryOthers || "";
  if (surgText && surgText.trim()) {
    const surgLines = wrapText(surgText.trim(), helvetica, 8, 120);
    surgLines.slice(0, 3).forEach((line, i) => {
      drawP1Text(line, 295, 412 + i * 11, { font: helvetica, size: 8 });
    });
  }

  // Col 4: Habits
  if (patient.habits && patient.habits.trim()) {
    const habitLines = wrapText(patient.habits.trim(), helvetica, 8, 130);
    habitLines.slice(0, 3).forEach((line, i) => {
      drawP1Text(line, 425, 412 + i * 11, { font: helvetica, size: 8 });
    });
  }

  // 8. Chief Complaint
  if (chiefComplaint && chiefComplaint.trim()) {
    const chiefLines = wrapText(chiefComplaint.trim(), helvetica, 8.5, 545);
    chiefLines.slice(0, 4).forEach((line, i) => {
      drawP1Text(line, 25, 475 + i * 13, { font: helvetica, size: 8.5 });
    });
  }

  // 9. Tooth Chart Annotations
  // 16 Columns centers across visual width from x=82 to 508 (col width = 26.625)
  const colCenters = [
    95.3, 121.9, 148.6, 175.2, 201.8, 228.4, 255.1, 281.7,
    308.3, 335.0, 361.6, 388.2, 414.8, 441.5, 468.1, 494.7
  ];

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
        // Upper row: y_top = 566
        drawP1Text(shortCode, cx - w / 2, 566, {
          font: helveticaBold,
          size: 7,
          color: rgb(0.7, 0.1, 0.1),
        });
      } else {
        // Lower row: y_top = 638
        drawP1Text(shortCode, cx - w / 2, 638, {
          font: helveticaBold,
          size: 7,
          color: rgb(0.7, 0.1, 0.1),
        });
      }
    });
  }

  // 10. Treatment Plan & Clinical Notes
  let planY = 680;
  const fullPlanText = [
    treatmentAdvised ? `Treatment Advised: ${treatmentAdvised}` : "",
    intraOralExam ? `Intra Oral Examination: ${intraOralExam}` : "",
    provisionalDiagnosis ? `Provisional Diagnosis: ${provisionalDiagnosis}` : ""
  ].filter(Boolean).join("\n");

  const planContent = fullPlanText ? fullPlanText.trim() : "";
  if (planContent) {
    for (const rawLine of planContent.split("\n")) {
      const wrapped = wrapText(rawLine, helvetica, 8.5, 545);
      for (const wLine of wrapped) {
        if (planY > 750) break;
        drawP1Text(wLine, 25, planY, { font: helvetica, size: 8.5 });
        planY += 13;
      }
    }
  }

  // 11. Doctor signature
  const docSign = doctorName ? doctorName.trim() : "";
  if (docSign) {
    drawP1Text(docSign, 430, 758, { font: helveticaBold, size: 8.5 });
  }

  // ==========================================
  // PAGE 2: COST ESTIMATE, CONSENT & VISITS
  // ==========================================
  if (pages.length > 1) {
    const p2 = pages[1];

    // Helper to draw text on Page 2 matching landscape table orientation (degrees(180))
    const drawP2Text = (
      text: string,
      visX: number,
      visY_top: number,
      opts: { font?: PDFFont; size?: number; color?: RGB } = {}
    ) => {
      if (!text) return;
      const font = opts.font || helvetica;
      const size = opts.size || 8;
      const color = opts.color || textColor;
      const x = 841.68 - visY_top;
      const y = 595.08 - visX;
      p2.drawText(text, {
        x,
        y,
        size,
        font,
        color,
        rotate: degrees(180),
      });
    };

    // 1. Cost Estimate Table (13 rows along X: rowX = 520.0 - idx * 16.5)
    let computedTotal = 0;
    const finalCostItems = costItems || [];

    finalCostItems.slice(0, 13).forEach((item, idx) => {
      const rowX = 520.0 - idx * 16.5;
      const sNoStr = String(item.sNo || idx + 1);
      const costStr = typeof item.cost === "number"
        ? item.cost.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : String(item.cost);

      const numVal = typeof item.cost === "number" ? item.cost : parseFloat(costStr.replace(/[^0-9.]/g, "")) || 0;
      computedTotal += numVal;

      // S.No. (Y ~ 78)
      drawP2Text(sNoStr, rowX, 78, { font: helvetica, size: 7.5 });

      // Treatment (Y ~ 100, fits up to 34 chars)
      const trStr = item.treatment.length > 34 ? item.treatment.slice(0, 33) + "…" : item.treatment;
      drawP2Text(trStr, rowX, 100, { font: helvetica, size: 7.5 });

      // Cost (Y ~ 320)
      drawP2Text(costStr, rowX, 320, { font: helveticaBold, size: 7.5 });
    });

    // Total Cost Row (rowX = 275.0, Y ~ 320)
    if (totalEstimate || computedTotal > 0) {
      const totalCostStr = totalEstimate
        ? (typeof totalEstimate === "number" ? totalEstimate.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : String(totalEstimate))
        : computedTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      drawP2Text(totalCostStr, 275.0, 320, { font: helveticaBold, size: 8 });
    }

    // 2. Consent Date & Time, and Patient Signature
    if (displayDate) {
      drawP2Text(displayDate, 40, 135, { font: helveticaBold, size: 8.5 });
    }
    if (patient.name) {
      drawP2Text(patient.name.trim(), 55, 260, { font: helveticaBold, size: 8.5 });
    }

    // 3. Treatment Done Table (16 rows along X: rowX = 520.0 - idx * 31.5)
    // Populated strictly from patient's actual completed treatment history
    const treatmentsToUse = completedTreatments || treatmentRemarks || [];
    const validCompleted = treatmentsToUse.filter(t => !t.stage || t.stage.toLowerCase() === "completed");

    validCompleted.slice(0, 16).forEach((v, idx) => {
      const rowX = 520.0 - idx * 31.5;
      const dateStr = v.date || "";
      const treatStr = v.treatmentDone || v.name || v.treatment || "";
      const remStr = v.remarks || v.notes || "";

      // Date column (Y ~ 455)
      if (dateStr) {
        drawP2Text(dateStr, rowX, 455, { font: helvetica, size: 7.5 });
      }

      // Treatment Done column (Y ~ 515, fits up to 40 chars)
      if (treatStr) {
        const treatTrimmed = treatStr.length > 40 ? treatStr.slice(0, 39) + "…" : treatStr;
        drawP2Text(treatTrimmed, rowX, 515, { font: helveticaBold, size: 7.5 });
      }

      // Remarks column (Y ~ 712, fits up to 22 chars)
      if (remStr) {
        const remTrimmed = remStr.length > 22 ? remStr.slice(0, 21) + "…" : remStr;
        drawP2Text(remTrimmed, rowX, 712, { font: helvetica, size: 7.5 });
      }
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
  const patientName = (options.patient.name || "Patient").replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `32Smiles_CaseSheet_${patientName}_${options.patient.id || "rec"}.pdf`;
  downloadPdfBytes(bytes, filename);
}

/**
 * Prints the Case Sheet PDF directly.
 */
export async function printCaseSheetPdf(
  options: GenerateCaseSheetPdfOptions
): Promise<void> {
  const blobUrl = await generateCaseSheetPdfBlobUrl(options);
  printPdfBlob(blobUrl, `Case Sheet - ${options.patient.name || "Patient"}`);
}
