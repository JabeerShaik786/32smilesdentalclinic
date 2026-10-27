"use client";

import React from "react";

export function numberToWords(amount: number): string {
  if (isNaN(amount) || amount === 0) return "ZERO RUPEES ONLY";
  const num = Math.floor(Math.abs(amount));

  const single = ["", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"];
  const double = ["TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"];
  const tens = ["", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];

  function convertChunk(n: number): string {
    let str = "";
    if (n >= 100) {
      str += single[Math.floor(n / 100)] + " HUNDRED ";
      n %= 100;
    }
    if (n >= 10 && n <= 19) {
      str += double[n - 10] + " ";
    } else {
      if (n >= 20) {
        str += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      }
      if (n > 0) {
        str += single[n] + " ";
      }
    }
    return str;
  }

  let words = "";
  const lakh = Math.floor(num / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;

  if (lakh > 0) {
    words += convertChunk(lakh) + "LAKH ";
  }
  if (thousand > 0) {
    words += convertChunk(thousand) + "THOUSAND ";
  }
  if (remainder > 0) {
    words += convertChunk(remainder);
  }

  return `${words.trim()} RUPEES ONLY`;
}

export interface VRDentalInvoicePrintData {
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
 * Protected 32 Smiles Multispeciality Dental Clinic Invoice Print Layout
 * Preserves the exact 32 Smiles invoice structure, typography, clinic details,
 * payment logs grid, number in words, and authorized signatory.
 */
export const VRDentalInvoicePrintTemplate: React.FC<VRDentalInvoicePrintData> = ({
  patient,
  invoice,
}) => {
  const patientName = invoice.patientName || patient?.name || "Patient";
  const ageGenderStr = patient?.age
    ? `${patient.age} ${patient.gender || ""}`.trim()
    : "";
  const rawDate =
    invoice.paymentDate || new Date().toISOString().split("T")[0];
  const formattedDate = rawDate.includes("T")
    ? rawDate.split("T")[0]
    : rawDate.split(" ")[0];

  const subtotal = invoice.subtotal || 0;
  const paidAmount = invoice.paidAmount || 0;
  const total = invoice.total || subtotal;
  const balance = Math.max(0, total - paidAmount);

  const items =
    invoice.items && invoice.items.length > 0
      ? invoice.items
      : [
          {
            description: invoice.treatment || "Dental Treatment",
            amount: subtotal,
          },
        ];

  return (
    <div className="a4-print-page bg-white text-slate-900 p-6 sm:p-8 max-w-[210mm] mx-auto text-xs space-y-4 font-sans select-text shadow-sm border border-slate-300 print:border-none print:shadow-none print:p-0">
      {/* Clinic details header (Centered) */}
      <div className="text-center space-y-1 pb-2">
        <h1 className="text-xl font-extrabold text-blue-900 tracking-tight">
          32 Smiles Multispeciality Dental Clinic
        </h1>
        <p className="text-[11px] text-slate-700 font-medium max-w-md mx-auto leading-tight">
          32 Smiles Dental Clinic, Main Road
        </p>
        <p className="text-[11px] font-bold text-slate-800">
          PH: +91 98765 43210
        </p>
      </div>

      <hr className="border-slate-400 my-2" />

      {/* Invoice Header Information & Patient Info */}
      <div className="grid grid-cols-2 gap-6 text-xs font-semibold py-1 text-slate-900">
        {/* Left column */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="w-24 shrink-0 font-bold text-slate-900">
              Invoice No :
            </span>
            <span className="font-semibold text-slate-800">{invoice.id}</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="w-24 shrink-0 font-bold text-slate-900">
              Date :
            </span>
            <span className="font-semibold text-slate-800">{formattedDate}</span>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="w-28 shrink-0 font-bold text-slate-900">
              Patient Name :
            </span>
            <span className="font-semibold text-slate-800">{patientName}</span>
          </div>
          {ageGenderStr ? (
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="w-28 shrink-0 font-bold text-slate-900">
                Age/Gender :
              </span>
              <span className="font-semibold text-slate-800">
                {ageGenderStr}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <hr className="border-slate-400 my-2" />

      {/* Treatment Details Table */}
      <div className="min-h-[140px] pt-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b-2 border-slate-400 text-slate-900">
              <th className="py-2 px-2 font-bold w-14">Sl No.</th>
              <th className="py-2 px-2 font-bold">Treatment Details</th>
              <th className="py-2 px-2 font-bold text-right w-32">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item, idx) => (
              <tr key={idx} className="text-slate-800">
                <td className="py-2 px-2 font-bold">{idx + 1}</td>
                <td className="py-2 px-2 font-medium break-words">
                  {item.description}
                </td>
                <td className="py-2 px-2 text-right font-bold font-mono">
                  {Number(item.amount || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-400 my-3" />

      {/* Financial Summary (Right Aligned) */}
      <div className="flex justify-end my-3">
        <div className="w-64 space-y-1.5 text-xs font-bold text-slate-900">
          <div className="flex justify-between">
            <span>Gross amount :</span>
            <span className="font-mono">
              {Number(subtotal).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          {invoice.discount ? (
            <div className="flex justify-between text-slate-600">
              <span>Discount :</span>
              <span className="font-mono">
                -{" "}
                {Number(invoice.discount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          ) : null}
          <div className="flex justify-between">
            <span>Amount paid :</span>
            <span className="font-mono">
              {Number(paidAmount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-300 pt-1">
            <span>Balance :</span>
            <span className="font-mono">
              {Number(balance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Details Section Box */}
      <div className="border border-slate-400 rounded-none p-0 my-3 overflow-hidden">
        <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-400 font-bold text-xs text-slate-900">
          Payment Details
        </div>
        <table className="w-full text-center border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-slate-300 bg-slate-50 text-slate-800 font-bold">
              <th className="py-1.5 px-2 border-r border-slate-300">
                Receipt No
              </th>
              <th className="py-1.5 px-2 border-r border-slate-300">
                Amt Received
              </th>
              <th className="py-1.5 px-2 border-r border-slate-300">
                Amt.Refund
              </th>
              <th className="py-1.5 px-2 border-r border-slate-300">Mode</th>
              <th className="py-1.5 px-2 border-r border-slate-300">Date</th>
              <th className="py-1.5 px-2 border-r border-slate-300">NO</th>
              <th className="py-1.5 px-2">Bank Name</th>
            </tr>
          </thead>
          <tbody>
            {invoice.paymentLogs && invoice.paymentLogs.length > 0 ? (
              invoice.paymentLogs.map((log, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-200 text-slate-800 font-medium"
                >
                  <td className="py-1.5 px-2 border-r border-slate-300 font-mono">
                    10{idx + 1}
                  </td>
                  <td className="py-1.5 px-2 border-r border-slate-300 font-mono font-bold">
                    {Number(log.amount || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-1.5 px-2 border-r border-slate-300 font-mono">
                    0.00
                  </td>
                  <td className="py-1.5 px-2 border-r border-slate-300">
                    {log.method}
                  </td>
                  <td className="py-1.5 px-2 border-r border-slate-300">
                    {log.date || formattedDate}
                  </td>
                  <td className="py-1.5 px-2 border-r border-slate-300">-</td>
                  <td className="py-1.5 px-2">-</td>
                </tr>
              ))
            ) : (
              <tr className="text-slate-800 font-medium">
                <td className="py-1.5 px-2 border-r border-slate-300 font-mono">
                  101
                </td>
                <td className="py-1.5 px-2 border-r border-slate-300 font-mono font-bold">
                  {Number(paidAmount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-1.5 px-2 border-r border-slate-300 font-mono">
                  0.00
                </td>
                <td className="py-1.5 px-2 border-r border-slate-300">Cash</td>
                <td className="py-1.5 px-2 border-r border-slate-300">
                  {formattedDate}
                </td>
                <td className="py-1.5 px-2 border-r border-slate-300">-</td>
                <td className="py-1.5 px-2">-</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dynamic Amount in Words & Signatory Block */}
      <div className="flex justify-between items-end pt-4 my-2 text-xs">
        <div className="font-extrabold text-slate-900 uppercase tracking-wide max-w-xs break-words">
          {numberToWords(paidAmount || total)}
        </div>

        <div className="text-right space-y-1 text-slate-900 shrink-0">
          <div className="font-bold">Authorised Signatory</div>
          <div className="text-[11px] font-semibold text-slate-800">
            32 Smiles Multispeciality Dental Clinic
          </div>
          <div className="text-[10px] font-bold tracking-wider uppercase text-slate-900">
            PROSTHODONTIST
          </div>
        </div>
      </div>
    </div>
  );
};
