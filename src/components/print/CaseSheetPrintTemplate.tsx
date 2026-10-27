"use client";

import React from "react";
import { DentalLogo } from "@/components/dental-logo";

export interface CaseSheetPrintData {
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
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
}

export function getCaseSheetTotalPages(treatmentAdvised?: string): number {
  return 1;
}

/**
 * Official 32 Smiles Dental Clinic Case Sheet Print & Screen Layout
 * Preserves the exact 32 Smiles case sheet design, sections, typography,
 * clinic details, and print behavior.
 */
export const CaseSheetPrintTemplate: React.FC<CaseSheetPrintData> = ({
  patient,
  medicalHistoryConditions = [],
  medicalHistoryOthers = "",
  currentMedications = "",
  chiefComplaint = "",
  intraOralExam = "",
  provisionalDiagnosis = "",
  treatmentAdvised = "",
  visitDate = "",
  clinicName = "32 Smiles Dental Clinic",
  clinicAddress = "32 Smiles Dental Clinic, Main Road",
  clinicPhone = "+91 98765 43210",
}) => {
  const displayDate =
    visitDate ||
    patient.visit ||
    patient.firstVisit ||
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const conditionsList = [
    "Diabetes",
    "B.P.",
    "Heart Complaint",
    "Allergies",
    "Bleeding Disorders",
    "Pregnancy",
    "Thyroid",
    "Others",
  ];

  return (
    <div className="a4-print-page bg-white text-slate-900 p-6 sm:p-8 max-w-[210mm] mx-auto text-xs space-y-4 font-sans select-text shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0">
      {/* 32 SMILES CLINIC HEADER */}
      <div className="border-b-2 border-slate-800 pb-3 mb-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <DentalLogo showText={false} iconClassName="h-10 w-10 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {clinicName || "32 Smiles Dental Clinic"}
            </h1>
            <p className="text-xs font-semibold text-slate-600">
              Dental Clinic / Comprehensive Dental Care
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Phone: {clinicPhone || "+91 98765 43210"}
            </p>
          </div>
        </div>
        <div className="text-right space-y-0.5">
          <span className="text-sm font-extrabold text-blue-700 block tracking-wider uppercase">
            DENTAL CASE SHEET
          </span>
          <p className="text-xs font-bold text-slate-800">ID: {patient.id}</p>
          <p className="text-xs text-slate-600">Date: {displayDate}</p>
        </div>
      </div>

      {/* SECTION 1 — PATIENT / CONTACT INFORMATION */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-sky-50 px-4 py-1.5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            PATIENT / CONTACT INFORMATION
          </h3>
          <span className="text-[11px] font-bold text-slate-500">
            ID: {patient.id}
          </span>
        </div>

        <div className="p-3.5 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          {/* Left Column */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-3 gap-1 items-baseline">
              <span className="font-bold text-slate-800">Name:</span>
              <span className="col-span-2 font-bold text-slate-900 text-sm">
                {patient.name}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 items-baseline">
              <span className="font-bold text-slate-800">Age:</span>
              <span className="col-span-2 font-semibold text-slate-900">
                {patient.age ? `${patient.age} Years` : "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 items-baseline">
              <span className="font-bold text-slate-800">Gender:</span>
              <span className="col-span-2 font-semibold text-slate-900">
                {patient.gender || "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 items-baseline">
              <span className="font-bold text-slate-800">Tel No.:</span>
              <span className="col-span-2 font-semibold text-slate-900">
                {patient.phone || "N/A"}
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-3 gap-1 items-baseline">
              <span className="font-bold text-slate-800">Ref.:</span>
              <span className="col-span-2 font-semibold text-slate-900">
                {patient.refDoctor || "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 items-baseline">
              <span className="font-bold text-slate-800">Address:</span>
              <span className="col-span-2 font-semibold text-slate-900 leading-tight">
                {patient.address || "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 items-baseline">
              <span className="font-bold text-slate-800">Email:</span>
              <span className="col-span-2 font-semibold text-slate-900">
                {patient.email || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 — MEDICAL HISTORY */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-sky-50 px-4 py-1.5 border-b border-slate-200">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            MEDICAL HISTORY
          </h3>
        </div>

        <div className="p-3.5 space-y-2 text-xs">
          <div className="grid grid-cols-4 gap-2.5">
            {conditionsList.map((cond) => {
              const checked = medicalHistoryConditions.includes(cond);
              return (
                <div key={cond} className="flex items-center gap-1.5">
                  <span
                    className={`w-3.5 h-3.5 border rounded flex items-center justify-center text-[10px] shrink-0 ${
                      checked
                        ? "bg-blue-600 text-white font-bold border-blue-600"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {checked ? "✓" : ""}
                  </span>
                  <span
                    className={`text-[11px] ${
                      checked ? "font-bold text-blue-900" : "text-slate-700"
                    }`}
                  >
                    {cond}
                  </span>
                  {cond === "Others" && checked && medicalHistoryOthers && (
                    <span className="text-[10px] text-slate-600 font-semibold truncate">
                      ({medicalHistoryOthers})
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <span className="font-bold text-slate-800 shrink-0">
              Medications if any:
            </span>
            <span className="font-semibold text-slate-700 italic">
              {currentMedications || "None"}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3 — CLINICAL CASE DETAILS */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-sky-50 px-4 py-1.5 border-b border-slate-200">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            CLINICAL CASE DETAILS
          </h3>
        </div>

        <div className="p-3.5 space-y-2.5 divide-y divide-slate-100 text-xs">
          <div className="pt-2 first:pt-0 space-y-1">
            <span className="font-bold text-slate-900 block">
              Chief Complaint & Past Dental History
            </span>
            <div className="p-2 bg-slate-50/70 rounded border border-slate-100 text-slate-800 whitespace-pre-wrap leading-relaxed min-h-[38px]">
              {chiefComplaint || (
                <span className="text-slate-400 italic">
                  No chief complaint recorded.
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 space-y-1">
            <span className="font-bold text-slate-900 block">
              Intra Oral Examination
            </span>
            <div className="p-2 bg-slate-50/70 rounded border border-slate-100 text-slate-800 whitespace-pre-wrap leading-relaxed min-h-[38px]">
              {intraOralExam || (
                <span className="text-slate-400 italic">
                  No intra oral examination notes recorded.
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 space-y-1">
            <span className="font-bold text-slate-900 block">
              Provisional Diagnosis
            </span>
            <div className="p-2 bg-slate-50/70 rounded border border-slate-100 text-slate-800 whitespace-pre-wrap leading-relaxed min-h-[38px]">
              {provisionalDiagnosis || (
                <span className="text-slate-400 italic">
                  No provisional diagnosis recorded.
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 space-y-1">
            <span className="font-bold text-slate-900 block">
              Treatment Advised
            </span>
            <div className="p-2 bg-slate-50/70 rounded border border-slate-100 text-slate-800 whitespace-pre-wrap leading-relaxed min-h-[38px]">
              {treatmentAdvised || (
                <span className="text-slate-400 italic">
                  No treatment advised recorded.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER & DOCTOR SIGNATURE BLOCK */}
      <div className="pt-3 flex justify-between items-end border-t border-slate-200 mt-2">
        <div className="text-[11px] text-slate-500">
          <p className="font-bold text-slate-700">
            {clinicName || "32 Smiles Multispeciality Dental Clinic"}
          </p>
          <p>{clinicAddress || "Comprehensive Oral Health & Advanced Dental Care"}</p>
        </div>
        <div className="text-right space-y-4">
          <p className="text-xs text-slate-700 font-semibold">
            Doctor's Signature: __________________________
          </p>
        </div>
      </div>
    </div>
  );
};
