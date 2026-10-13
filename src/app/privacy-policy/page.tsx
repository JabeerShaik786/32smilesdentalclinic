import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { ShieldCheck, ArrowLeft, Lock, FileText, Phone, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | 32 Smiles Multispeciality Dental Clinic",
  description: "Privacy Policy and patient information protection practices for 32 Smiles Multispeciality Dental Clinic.",
};

export default function PrivacyPolicyPage() {
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
                <ShieldCheck className="w-6 h-6 text-white" />
              </span>
              <span className="text-xs md:text-sm uppercase tracking-widest font-bold text-white/90">
                Patient Privacy & Trust
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-3 text-white/90 text-sm sm:text-base max-w-2xl font-normal">
              How 32 Smiles Multispeciality Dental Clinic collects, uses, and safeguards your health and personal information.
            </p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="max-w-[1100px] mx-auto px-6 md:px-12 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 sm:p-12 space-y-10 text-[#1e293b]">
            
            {/* Introduction */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#013A8F] mb-4 flex items-center gap-2.5">
                <span className="w-2 h-6 bg-[#0153AD] rounded-full inline-block" />
                1. Introduction
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Welcome to <strong>32 Smiles Multispeciality Dental Clinic</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to maintaining the confidentiality, integrity, and security of your personal and dental medical information. This Privacy Policy describes how we collect, store, process, and protect information obtained through our clinic visits, website, online consultation requests, and communication channels.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#013A8F] mb-4 flex items-center gap-2.5">
                <span className="w-2 h-6 bg-[#0153AD] rounded-full inline-block" />
                2. Information We Collect
              </h2>
              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  <strong>Personal Contact Details:</strong> Name, phone number, email address, and residential address provided during online appointment bookings, phone calls, or clinic registration.
                </p>
                <p>
                  <strong>Dental and Medical Records:</strong> Treatment histories, digital X-rays, clinical photographs, diagnostic records, allergies, and medication notes necessary to ensure safe and effective dental procedures.
                </p>
                <p>
                  <strong>Website Usage Data:</strong> Anonymized technical details such as browser type, device information, and interaction patterns to help optimize our online services.
                </p>
              </div>
            </div>

            {/* Use of Information */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#013A8F] mb-4 flex items-center gap-2.5">
                <span className="w-2 h-6 bg-[#0153AD] rounded-full inline-block" />
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm sm:text-base">
                <li>Scheduling, confirming, and managing dental appointments and consultations.</li>
                <li>Providing clinical diagnosis, customized treatment planning, and follow-up care.</li>
                <li>Responding to inquiries submitted via website forms, telephone, or WhatsApp.</li>
                <li>Maintaining accurate patient healthcare records in compliance with clinical standards.</li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-[#013A8F] mb-3">Questions & Contact</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                If you have any questions or concerns regarding this Privacy Policy, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0153AD]" />
                  <a href="tel:08143148485" className="hover:underline">081431 48485</a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0153AD]" />
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
