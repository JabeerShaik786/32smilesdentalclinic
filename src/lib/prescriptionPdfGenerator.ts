import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  diagnosis?: string;
  medicines: Array<{
    name: string;
    dosage: string;
    duration: string;
    instructions: string;
    strength?: string;
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

export async function generateAndDownloadPrescriptionPdf(
  options: GeneratePrescriptionPdfOptions
): Promise<void> {
  const {
    patient,
    doctorName = "Doctor / Dentist",
    date,
    diagnosis = "",
    medicines = [],
    advice = "",
    parseDosageFn,
  } = options;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const displayDate = date || new Date().toISOString().split("T")[0];
  const ageGender = `${patient.age ? `${patient.age} Y` : ""} ${patient.gender || ""}`.trim();
  const medicalAlert = getCleanMedicalAlert(patient);

  // Clinic Header Banner
  doc.setFillColor(1, 83, 173); // #0153AD
  doc.rect(14, 12, pageWidth - 28, 22, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("32 SMILES DENTAL CLINIC", 20, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("32 Smiles Dental Clinic, Main Road  |  PH: +91 98765 43210", 20, 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PRESCRIPTION", pageWidth - 20, 20, { align: "right" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${displayDate}`, pageWidth - 20, 26, { align: "right" });

  let yPos = 38;

  // Patient Card
  autoTable(doc, {
    startY: yPos,
    theme: "grid",
    head: [["PATIENT INFORMATION", "DOCTOR & CLINICAL RECORD"]],
    headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: "bold", fontSize: 8.5 },
    body: [
      [
        `Patient Name: ${patient.name}\nPatient ID: ${patient.id}\nAge / Gender: ${ageGender || "N/A"}\nContact: ${patient.phone || "N/A"}`,
        `Doctor: ${doctorName}\nPrescription Date: ${displayDate}\n${medicalAlert ? `Medical Alert: ${medicalAlert}` : ""}`
      ]
    ],
    bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
    margin: { left: 14, right: 14 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 4;

  // Diagnosis if present
  if (diagnosis.trim()) {
    autoTable(doc, {
      startY: yPos,
      theme: "plain",
      head: [["Diagnosis / Clinical Notes"]],
      headStyles: { fontStyle: "bold", fontSize: 9, textColor: [1, 83, 173] },
      body: [[diagnosis.trim()]],
      bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
      margin: { left: 14, right: 14 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 3;
  }

  // Medicines Table
  if (medicines.length > 0) {
    const medRows = medicines.map((med, idx) => {
      const parsed = parseDosageFn
        ? parseDosageFn(med.dosage)
        : {
            morning: med.dosage.toLowerCase().includes("morning") || med.dosage.includes("1-"),
            afternoon: med.dosage.toLowerCase().includes("afternoon") || med.dosage.includes("-1-"),
            night: med.dosage.toLowerCase().includes("night") || med.dosage.endsWith("-1"),
            beforeMeals: med.dosage.toLowerCase().includes("before"),
            afterMeals: med.dosage.toLowerCase().includes("after"),
          };

      const times: string[] = [];
      if (parsed.morning) times.push("Morning");
      if (parsed.afternoon) times.push("Afternoon");
      if (parsed.night) times.push("Night");

      const timeStr = times.join(", ") || med.dosage || "-";
      let mealStr = "-";
      if (parsed.beforeMeals) mealStr = "Before Meals";
      else if (parsed.afterMeals) mealStr = "After Meals";

      return [
        String(idx + 1),
        med.name.trim() || "-",
        timeStr,
        mealStr,
        med.duration.trim() || "-",
        med.instructions.trim() || "-"
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [["#", "Medicine Name", "Dosage / Frequency", "Meal Timing", "Duration", "Special Instructions"]],
      headStyles: { fillColor: [1, 83, 173], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
      body: medRows,
      bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 42, fontStyle: "bold" },
        2: { cellWidth: 32 },
        3: { cellWidth: 26 },
        4: { cellWidth: 22 },
        5: { cellWidth: "auto" },
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 4;
  }

  // Advice
  if (advice.trim()) {
    autoTable(doc, {
      startY: yPos,
      theme: "plain",
      head: [["Doctor Advice / Instructions"]],
      headStyles: { fontStyle: "bold", fontSize: 9, textColor: [1, 83, 173] },
      body: [[advice.trim()]],
      bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
      margin: { left: 14, right: 14 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 8;
  } else {
    yPos += 8;
  }

  // Signature Block
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Doctor: ${doctorName}`, pageWidth - 14, yPos, { align: "right" });
  doc.text("Signature: __________________________", pageWidth - 14, yPos + 8, { align: "right" });

  const safeFilename = `32Smiles_Prescription_${patient.name.replace(/[^a-zA-Z0-9]/g, "_")}_${displayDate}.pdf`;
  doc.save(safeFilename);
}
