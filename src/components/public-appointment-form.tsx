"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, Phone, Mail, Stethoscope, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getTodayKolkataDbDate,
  isSlotInThePast,
  getNextAvailableAppointmentSlot,
} from "@/lib/dateTimeUtils";

interface DoctorOption {
  id: string;
  name: string;
  speciality: string;
}

const PUBLIC_APPT_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:30 AM",
  "02:00 PM",
  "04:30 PM",
  "06:00 PM",
];

export function PublicAppointmentForm({ className = "" }: { className?: string }) {
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const todayDb = getTodayKolkataDbDate();
  const defaultSlot = getNextAvailableAppointmentSlot(todayDb, PUBLIC_APPT_SLOTS);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: todayDb,
    time: defaultSlot,
    doctorId: "",
    treatment: "General Consultation",
    notes: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getEndpoint = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    return `${supabaseUrl}/functions/v1/public-appointment`;
  };

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const endpoint = getEndpoint();
        const res = await fetch(endpoint);
        const json = await res.json();
        if (json.success && Array.isArray(json.doctors)) {
          setDoctors(json.doctors);
        }
      } catch (err) {
        console.error("Failed to load doctor options:", err);
      } finally {
        setLoadingDoctors(false);
      }
    }
    fetchDoctors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === "date") {
        if (isSlotInThePast(prev.time, value)) {
          next.time = getNextAvailableAppointmentSlot(value, PUBLIC_APPT_SLOTS);
        }
      }
      return next;
    });
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Client Validations
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage("Please enter your full name (minimum 2 characters).");
      return;
    }

    const digits = formData.phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!formData.date) {
      setErrorMessage("Please select your preferred appointment date.");
      return;
    }

    if (isSlotInThePast(formData.time, formData.date)) {
      setErrorMessage("The selected time slot has already passed for today. Please choose an upcoming time slot.");
      return;
    }

    setSubmitting(true);

    try {
      const endpoint = getEndpoint();
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          date: formData.date,
          time: formData.time,
          doctorId: formData.doctorId || null,
          treatment: formData.treatment,
          notes: formData.notes.trim() || null
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit appointment request.");
      }

      setSuccessMessage(
        data.message || `Appointment request submitted! Your confirmation ID is ${data.appointmentId || "confirmed"}. Our team will contact you shortly.`
      );
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong while submitting. Please call our clinic directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    const resetDate = getTodayKolkataDbDate();
    setFormData({
      name: "",
      phone: "",
      email: "",
      date: resetDate,
      time: getNextAvailableAppointmentSlot(resetDate, PUBLIC_APPT_SLOTS),
      doctorId: "",
      treatment: "General Consultation",
      notes: ""
    });
  };

  if (successMessage) {
    return (
      <div className={`p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl mx-auto space-y-4 text-center ${className}`}>
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Request Received!</h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {successMessage}
        </p>
        <div className="pt-2">
          <Button
            onClick={handleReset}
            className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl mx-auto space-y-6 ${className}`}>
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" /> Book an Appointment
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Select your preferred date and time. Our team will contact you to confirm your slot.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="public-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-slate-400" /> Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="public-name"
            name="name"
            required
            placeholder="e.g. Ramesh Kumar"
            value={formData.name}
            onChange={handleChange}
            className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs"
          />
        </div>

        {/* Mobile & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="public-phone" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" /> Mobile Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="public-phone"
              name="phone"
              type="tel"
              required
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={handleChange}
              className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="public-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" /> Email Address (Optional)
            </Label>
            <Input
              id="public-email"
              name="email"
              type="email"
              placeholder="e.g. name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="public-date" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" /> Preferred Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="public-date"
              name="date"
              type="date"
              required
              min={todayDb}
              value={formData.date}
              onChange={handleChange}
              className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="public-time" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" /> Preferred Time <span className="text-red-500">*</span>
            </Label>
            <select
              id="public-time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="h-10 w-full rounded-xl bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PUBLIC_APPT_SLOTS.map((slot) => {
                const past = isSlotInThePast(slot, formData.date);
                return (
                  <option key={slot} value={slot} disabled={past}>
                    {slot}{past ? " (Past)" : ""}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Doctor & Treatment Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="public-doctor" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Stethoscope className="h-3.5 w-3.5 text-slate-400" /> Preferred Doctor
            </Label>
            <select
              id="public-doctor"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              disabled={loadingDoctors}
              className="h-10 w-full rounded-xl bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            >
              <option value="">Any Available Doctor</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.speciality})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="public-treatment" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Service / Treatment
            </Label>
            <select
              id="public-treatment"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              className="h-10 w-full rounded-xl bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="General Consultation">General Consultation</option>
              <option value="Dental Scaling / Cleaning">Dental Scaling / Cleaning</option>
              <option value="Root Canal Treatment">Root Canal Treatment</option>
              <option value="Dental Implants">Dental Implants</option>
              <option value="Teeth Whitening">Teeth Whitening</option>
              <option value="Orthodontic Braces / Aligners">Orthodontic Braces / Aligners</option>
              <option value="Tooth Extraction">Tooth Extraction</option>
              <option value="Crowns & Bridges">Crowns & Bridges</option>
              <option value="Emergency Toothache Care">Emergency Toothache Care</option>
            </select>
          </div>
        </div>

        {/* Notes / Reason */}
        <div className="space-y-1.5">
          <Label htmlFor="public-notes" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-slate-400" /> Additional Notes / Symptoms
          </Label>
          <textarea
            id="public-notes"
            name="notes"
            rows={3}
            placeholder="Mention any symptoms, specific dental issues, or requests..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full rounded-xl bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting Request...
            </>
          ) : (
            "Request Appointment Confirmation"
          )}
        </Button>
      </form>
    </div>
  );
}
