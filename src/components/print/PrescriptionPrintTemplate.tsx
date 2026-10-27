"use client";

import React from "react";
import { getCleanMedicalAlert } from "@/lib/medicalAlertUtils";

export interface PrescriptionPrintData {
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

/**
 * Protected 32 Smiles Dental Clinic Prescription Print & Screen Layout
 * Preserves the exact 32 Smiles prescription structure, typography,
 * clinic details, medicine table layout, instructions, and signature block.
 */
export const PrescriptionPrintTemplate: React.FC<PrescriptionPrintData> = ({
  patient,
  doctorName = "Doctor / Dentist",
  date,
  diagnosis = "",
  medicines = [],
  advice = "",
  parseDosageFn,
}) => {
  const displayDate = date || new Date().toISOString().split("T")[0];
  const ageGender = `${patient.age ? `${patient.age} Y` : ""} ${patient.gender || ""}`.trim();
  const medicalAlert = getCleanMedicalAlert(patient);

  return (
    <div className="a4-print-page bg-white text-slate-900 p-6 sm:p-8 max-w-[210mm] mx-auto text-xs space-y-6 font-sans select-text shadow-sm border border-slate-300 print:border-none print:shadow-none print:p-0">
      {/* Clinic Header */}
      <div className="border-b-2 border-slate-800 pb-4 mb-4 flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-blue-900 tracking-tight">
            32 Smiles Dental Clinic
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            32 Smiles Dental Clinic, Main Road
          </p>
          <p className="text-xs text-slate-800 font-bold">PH: +91 98765 43210</p>
        </div>
        <div className="text-right space-y-1">
          <span className="text-lg font-black text-blue-900 uppercase tracking-wider block">
            PRESCRIPTION
          </span>
          <p className="text-xs text-slate-600 font-medium">Date: {displayDate}</p>
        </div>
      </div>

      {/* Patient & Doctor Details Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
        <div>
          <span className="font-bold text-slate-700">Patient Name: </span>
          <span className="font-semibold text-slate-900">{patient.name}</span>
        </div>
        <div>
          <span className="font-bold text-slate-700">Doctor: </span>
          <span className="font-semibold text-slate-900">{doctorName}</span>
        </div>
        <div>
          <span className="font-bold text-slate-700">Patient ID: </span>
          <span className="font-semibold text-slate-900">{patient.id}</span>
        </div>
        <div>
          <span className="font-bold text-slate-700">Prescription Date: </span>
          <span className="font-semibold text-slate-900">{displayDate}</span>
        </div>
        {ageGender ? (
          <div>
            <span className="font-bold text-slate-700">Age / Gender: </span>
            <span className="font-semibold text-slate-900">{ageGender}</span>
          </div>
        ) : null}
        {patient.phone ? (
          <div>
            <span className="font-bold text-slate-700">Contact: </span>
            <span className="font-semibold text-slate-900">{patient.phone}</span>
          </div>
        ) : null}
        {medicalAlert ? (
          <div className="col-span-2 mt-1 pt-1 border-t border-slate-200">
            <span className="font-bold text-rose-700">Medical Alert: </span>
            <span className="font-semibold text-slate-900">{medicalAlert}</span>
          </div>
        ) : null}
      </div>

      {/* Diagnosis Notes */}
      {diagnosis.trim() ? (
        <div className="space-y-1.5">
          <h3 className="font-bold text-sm text-blue-900 uppercase tracking-wide border-b border-slate-200 pb-1">
            Diagnosis / Clinical Notes
          </h3>
          <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed pl-1">
            {diagnosis.trim()}
          </p>
        </div>
      ) : null}

      {/* Medicines Prescribed Table */}
      {medicines.length > 0 ? (
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-blue-900 uppercase tracking-wide border-b border-slate-200 pb-1">
            Medicines Prescribed
          </h3>
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border border-slate-300 px-2.5 py-1.5 text-center w-8">#</th>
                <th className="border border-slate-300 px-3 py-1.5 text-left font-bold">
                  Medicine Name
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-left">
                  Dosage / Frequency
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-left">Meal Timing</th>
                <th className="border border-slate-300 px-3 py-1.5 text-left">Duration</th>
                <th className="border border-slate-300 px-3 py-1.5 text-left">
                  Special Instructions
                </th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med, idx) => {
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

                return (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/80"}
                  >
                    <td className="border border-slate-300 px-2.5 py-2 text-center font-medium">
                      {idx + 1}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 font-bold text-slate-900">
                      {med.name.trim() || "-"}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-slate-800">
                      {timeStr}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-slate-800">
                      {mealStr}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-slate-800">
                      {med.duration.trim() || "-"}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-slate-800">
                      {med.instructions.trim() || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Doctor Advice / Instructions */}
      {advice.trim() ? (
        <div className="space-y-1.5">
          <h3 className="font-bold text-sm text-blue-900 uppercase tracking-wide border-b border-slate-200 pb-1">
            Doctor Advice / Instructions
          </h3>
          <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed pl-1">
            {advice.trim()}
          </p>
        </div>
      ) : null}

      {/* Doctor Signature Block */}
      <div className="pt-8 flex justify-end">
        <div className="text-right space-y-6">
          <p className="text-xs font-bold text-slate-900">Doctor: {doctorName}</p>
          <p className="text-xs text-slate-700">
            Signature: __________________________
          </p>
        </div>
      </div>
    </div>
  );
};
