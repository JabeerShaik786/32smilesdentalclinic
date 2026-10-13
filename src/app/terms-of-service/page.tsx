import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { FileText, ArrowLeft, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | 32 Smiles Multispeciality Dental Clinic",
  description: "Terms and conditions of service for 32 Smiles Multispeciality Dental Clinic.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-28 pb-20 bg-[#f8fafc]">
        {/* Header Banner */}
        <section className="bg-[linear-gradient(110deg,#013A8F,#0153AD,#01B0FD)] text-white py-14 px-6 md:px-12 lg:px-20 relative overflow-hidden">
          <div className="max-w-[1100px] mx-auto relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <span className="p-2 bg-white/20 backdrop-blur-xs rounded-lg inline-flex">
                <FileText className="w-6 h-6 text-white" />
              </span>
              <span className="text-xs md:text-sm uppercase tracking-widest font-bold text-white/90">
                Clinic Terms & Policies
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Terms of Service
            </h1>
            <p className="mt-3 text-white/90 text-sm sm:text-base max-w-2xl font-normal">
              Terms and conditions governing clinical appointments, consultations, and website usage at 32 Smiles Multispeciality Dental Clinic.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-[1100px] mx-auto px-6 md:px-12 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 sm:p-12 space-y-10 text-[#1e293b]">
            
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#013A8F] mb-4 flex items-center gap-2.5">
                <span className="w-2 h-6 bg-[#0153AD] rounded-full inline-block" />
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                By accessing this website, booking consultations, or receiving clinical services at <strong>32 Smiles Multispeciality Dental Clinic</strong>, you acknowledge and agree to be bound by these terms. If you do not agree, please contact our administrative desk for guidance.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#013A8F] mb-4 flex items-center gap-2.5">
                <span className="w-2 h-6 bg-[#0153AD] rounded-full inline-block" />
                2. Clinical Appointments & Consultations
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm sm:text-base leading-relaxed">
                <li>Appointment requests submitted online are confirmed upon verification by our clinic coordinator.</li>
                <li>Please arrive 10–15 minutes prior to your scheduled consultation time to complete registration formalities.</li>
                <li>If you need to reschedule or cancel your appointment, kindly inform us at least 24 hours in advance.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#013A8F] mb-4 flex items-center gap-2.5">
                <span className="w-2 h-6 bg-[#0153AD] rounded-full inline-block" />
                3. Medical & Dental Disclaimers
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Information on this website is provided for general informational purposes and does not substitute for individualized in-person dental examination, diagnosis, or customized treatment plans by a licensed dental surgeon.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-[#013A8F] mb-3">Clinic Contact</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                For questions regarding appointments, treatments, or policies, please reach out to us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0153AD]" />
                  <a href="tel:08143148485" className="hover:underline">081431 48485</a>
                </div>
                <div className="flex items-center gap-2">
                  <span>Ambedkar Nagar, Yanam, Andhra Pradesh – 533464</span>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
