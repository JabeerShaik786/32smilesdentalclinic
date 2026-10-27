import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface GenerateCaseSheetPdfOptions {
  patient: {
    id: string;
    name: string;
    age?: number | string;
    gender?: string;
    phone?: string;
    email?: string;
    address?: string;
    refDoctor?: string;
    visit?: string;
    firstVisit?: string;
    dentalChart?: Record<number, string>;
  };
  medicalHistoryConditions?: string[];
  medicalHistoryOthers?: string;
  currentMedications?: string;
  chiefComplaint?: string;
  intraOralExam?: string;
  provisionalDiagnosis?: string;
  treatmentAdvised?: string;
  visitDate?: string;
}

export async function generateAndDownloadCaseSheetPdf(
  options: GenerateCaseSheetPdfOptions
): Promise<void> {
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
  } = options;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const displayDate =
    visitDate ||
    patient.visit ||
    patient.firstVisit ||
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // Header banner
  doc.setFillColor(1, 83, 173); // 32 Smiles Blue #0153AD
  doc.rect(14, 12, pageWidth - 28, 22, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("32 SMILES MULTISPECIALITY DENTAL CLINIC", 20, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Comprehensive Oral Health & Advanced Care  |  PH: +91 98765 43210", 20, 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("DENTAL CASE SHEET", pageWidth - 20, 20, { align: "right" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`ID: ${patient.id}  |  Date: ${displayDate}`, pageWidth - 20, 26, { align: "right" });

  let yPos = 38;

  // 1. Patient Info Table
  autoTable(doc, {
    startY: yPos,
    theme: "grid",
    head: [["PATIENT INFORMATION", `ID: ${patient.id}`]],
    headStyles: { fillColor: [234, 248, 255], textColor: [1, 58, 143], fontStyle: "bold", fontSize: 9 },
    body: [
      [
        `Name: ${patient.name}\nAge: ${patient.age || "N/A"} Y  |  Gender: ${patient.gender || "N/A"}`,
        `Phone: ${patient.phone || "N/A"}\nRef: ${patient.refDoctor || "N/A"}\nAddress: ${patient.address || "N/A"}`
      ]
    ],
    bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
    margin: { left: 14, right: 14 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 4;

  // 2. Medical History
  const condStr = medicalHistoryConditions.length > 0
    ? medicalHistoryConditions.join(", ") + (medicalHistoryOthers ? ` (${medicalHistoryOthers})` : "")
    : "None Reported";

  autoTable(doc, {
    startY: yPos,
    theme: "grid",
    head: [["MEDICAL HISTORY", ""]],
    headStyles: { fillColor: [234, 248, 255], textColor: [1, 58, 143], fontStyle: "bold", fontSize: 9 },
    body: [
      [`Conditions: ${condStr}`],
      [`Current Medications: ${currentMedications || "None"}`],
    ],
    bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
    margin: { left: 14, right: 14 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 4;

  // 3. Clinical Case Details
  autoTable(doc, {
    startY: yPos,
    theme: "grid",
    head: [["CLINICAL CASE DETAILS", ""]],
    headStyles: { fillColor: [234, 248, 255], textColor: [1, 58, 143], fontStyle: "bold", fontSize: 9 },
    body: [
      [`Chief Complaint & Past Dental History:\n${chiefComplaint || "No chief complaint recorded."}`],
      [`Intra Oral Examination:\n${intraOralExam || "No intra oral examination notes recorded."}`],
      [`Provisional Diagnosis:\n${provisionalDiagnosis || "No provisional diagnosis recorded."}`],
      [`Treatment Advised:\n${treatmentAdvised || "No treatment advised recorded."}`],
    ],
    bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
    margin: { left: 14, right: 14 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 12;

  // Footer & Signatory
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("32 Smiles Multispeciality Dental Clinic  •  32 Smiles Dental Clinic, Main Road", 14, yPos);
  doc.text("Doctor's Signature: __________________________", pageWidth - 14, yPos, { align: "right" });

  const safeFilename = `32Smiles_CaseSheet_${patient.name.replace(/[^a-zA-Z0-9]/g, "_")}_${patient.id}.pdf`;
  doc.save(safeFilename);
}
