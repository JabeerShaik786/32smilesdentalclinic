"use client";

import Image from "next/image";
import { Phone, Calendar } from "lucide-react";
import { getAssetPath } from "@/lib/getAssetPath";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative w-full min-h-[580px] lg:min-h-[660px] flex items-center pt-28 pb-32 overflow-hidden bg-[#EAF8FF]"
    >
      {/* Background Image: Woman smiling with dental instruments */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getAssetPath("/hero-bg.png")}
          alt="32 Smiles Multispeciality Dental Treatment"
          fill
          className="object-cover object-[60%_center] md:object-[75%_center] lg:object-right"
          priority
          unoptimized
        />
        {/* Soft Light Blue Gradient Wash from left to right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#EAF8FF] via-[#EAF8FF]/95 md:via-[#EAF8FF]/85 via-45% to-transparent to-75% pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="max-w-[1360px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10">
        <div className="max-w-xl text-left flex flex-col items-start pt-6 sm:pt-10">
          
          {/* Small Uppercase Label with Blue Accent Underline */}
          <div className="mb-4">
            <span className="relative inline-block text-xs md:text-sm font-extrabold tracking-[0.18em] text-[#013A8F] uppercase pb-1.5">
              <span className="relative text-[#01B0FD]">
                PERFECT
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0153AD] rounded-full" />
              </span>
              <span className="ml-2 font-bold text-[#013A8F]">SMILE</span>
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#013A8F] tracking-tight leading-[1.12] mb-5">
            Your <span className="text-[#01B0FD]">Journey</span> to a perfect<br />
            smile begins with us!
          </h1>

          {/* Tagline / Subtitle */}
          <p className="text-slate-600 text-base sm:text-lg mb-8 max-w-lg leading-relaxed font-normal">
            Welcome to <strong className="text-[#013A8F] font-semibold">32 Smiles Multispeciality Dental Clinic</strong>. Comprehensive multispeciality dental care, gentle treatments, and modern dentistry in Yanam.
          </p>

          {/* Buttons: Primary Book Appointment (#0153AD) & Contact Us */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://calendly.com/32smiles-dental-clinic/30min?month=2026-10&date=2026-10-03"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#0153AD] hover:bg-[#013A8F] text-white font-bold text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <Calendar className="w-4 h-4 text-[#47D2FD]" />
              <span>Book Appointment</span>
            </a>
            <a
              href="tel:08143148485"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-[#EAF8FF] text-[#013A8F] font-bold text-sm sm:text-base rounded-lg border border-[#D8F2FE] shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Phone className="w-4 h-4 text-[#0153AD]" />
              <span>Contact Us</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
