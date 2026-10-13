"use client";

import Image from "next/image";
import { getAssetPath } from "@/lib/getAssetPath";

export default function Services() {
  return (
    <section
      id="services"
      className="py-16 lg:py-20 relative overflow-hidden text-white"
      style={{
        background: "linear-gradient(110deg, #013A8F 0%, #0153AD 50%, #01B0FD 100%)",
      }}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 relative z-10 text-center">
        
        {/* Section Heading */}
        <div className="inline-block mb-8 lg:mb-10">
          <h2
            className="text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight drop-shadow-[0_2px_4px_rgba(1,58,143,0.8)]"
            style={{ color: "#FFFFFF" }}
          >
            Our Services
          </h2>
          <div className="w-16 h-1 bg-[#24C6F4] mx-auto mt-2.5 rounded-full shadow-sm" />
        </div>

        {/* Central Display: Orbit Arrangement on Desktop, Readable Stack on Mobile */}
        <div className="relative max-w-[1060px] mx-auto min-h-[540px] flex items-center justify-center">
          
          {/* ================= DESKTOP CIRCULAR ORBIT LAYOUT ================= */}
          <div className="hidden lg:block w-full h-[540px] relative">
            
            {/* Concentric Guide Rings centered on the tooth */}
            {/* Ring 1: Passing directly through the 12 icon centers (diameter 510px) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[510px] h-[510px] rounded-full border border-white/20 pointer-events-none" />
            {/* Ring 2: Intermediate ring (diameter 720px) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-white/10 pointer-events-none" />
            {/* Ring 3: Outer ring (diameter 930px) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[930px] h-[930px] rounded-full border border-white/[0.04] pointer-events-none" />

            {/* Central Realistic 3D Tooth */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%-21px)] z-20 pointer-events-none flex flex-col items-center">
              <div className="relative w-[210px] h-[340px] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
                <Image
                  src={getAssetPath("/figma/central_tooth.png")}
                  alt="Multispeciality Dental Care 3D Tooth"
                  fill
                  className="object-contain"
                  priority
                  unoptimized
                />
              </div>
            </div>

            {/* ================= LEFT SIDE SERVICES (6 items) ================= */}
            {/* 1. Dentures */}
            <div
              className="absolute flex items-center gap-3.5 -translate-y-1/2"
              style={{ right: "calc(50% + 174px)", top: "calc(50% - 180px)" }}
            >
              <span
                className="text-[15px] font-bold tracking-wide text-right whitespace-nowrap drop-shadow-[0_1px_3px_rgba(1,58,143,0.9)]"
                style={{ color: "#FFFFFF" }}
              >
                Dentures
              </span>
              <div className="w-10 h-10 rounded-full bg-white text-[#064BA8] border-2 border-[#24C6F4]/40 shadow-md flex items-center justify-center shrink-0 hover:bg-[#064BA8] hover:text-white transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 14c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                  <path d="M6 14v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2" />
                  <path d="M8 10v4M12 9v5M16 10v4" />
                </svg>
              </div>
            </div>

            {/* 2. Dental Implants */}
            <div
              className="absolute flex items-center gap-3.5 -translate-y-1/2"
              style={{ right: "calc(50% + 214px)", top: "calc(50% - 109px)" }}
            >
              <span
                className="text-[15px] font-bold tracking-wide text-right whitespace-nowrap drop-shadow-[0_1px_3px_rgba(1,58,143,0.9)]"
                style={{ color: "#FFFFFF" }}
              >
                Dental Implants
              </span>
              <div className="w-10 h-10 rounded-full bg-white text-[#064BA8] border-2 border-[#24C6F4]/40 shadow-md flex items-center justify-center shrink-0 hover:bg-[#064BA8] hover:text-white transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2C9.5 2 8 3.5 8 5.5c0 2 1.5 3.5 4 3.5s4-1.5 4-3.5C16 3.5 14.5 2 12 2z" />
                  <path d="M10 9h4v2h-4zM10.5 13h3M11 15h2M11.5 17h1M12 17v5" />
                </svg>
              </div>
            </div>

            {/* 3. Wisdom Teeth Removal */}
            <div
              className="absolute flex items-center gap-3.5 -translate-y-1/2"
              style={{ right: "calc(50% + 233px)", top: "calc(50% - 36px)" }}
            >
              <span
                className="text-[14px] font-bold leading-snug tracking-wide text-right drop-shadow-[0_1px_3px_rgba(1,58,143,0.9)]"
                style={{ color: "#FFFFFF" }}
              >
                Wisdom Teeth<br />Removal Surgery
              </span>
              <div className="w-10 h-10 rounded-full bg-white text-[#064BA8] border-2 border-[#24C6F4]/40 shadow-md flex items-center justify-center shrink-0 hover:bg-[#064BA8] hover:text-white transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 3C9 3 7 4.5 7 7c0 2.5 1 4 1.5 6s.5 6.5 1.5 6.5 1.5-2.5 2-4.5c.5 2 1 4.5 2 4.5s1-4 1.5-6.5 1.5-3.5 1.5-6c0-2.5-2-4-5-4z" />
                  <path d="M6 5l-2-2M18 5l2-2" />
                </svg>
              </div>
            </div>

            {/* 4. Crowns & Bridges */}
            <div
              className="absolute flex items-center gap-3.5 -translate-y-1/2"
              style={{ right: "calc(50% + 216px)", top: "calc(50% + 38px)" }}
            >
              <span
                className="text-[15px] font-bold tracking-wide text-right whitespace-nowrap drop-shadow-[0_1px_3px_rgba(1,58,143,0.9)]"
                style={{ color: "#FFFFFF" }}
              >
                Crowns & Bridges
              </span>
              <div className="w-10 h-10 rounded-full bg-white text-[#064BA8] border-2 border-[#24C6F4]/40 shadow-md flex items-center justify-center shrink-0 hover:bg-[#064BA8] hover:text-white transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 17l2-8 3.5 3.5L12 6l2.5 6.5L18 9l2 8H4z" />
                  <path d="M4 17h16v3H4z" />
                </svg>
              </div>
            </div>

            {/* 5. Laser Surgeries */}
            <div
              className="absolute flex items-center gap-3.5 -translate-y-1/2"
              style={{ right: "calc(50% + 174px)", top: "calc(50% + 111px)" }}
            >
              <span
                className="text-[15px] font-bold tracking-wide text-right whitespace-nowrap drop-shadow-[0_1px_3px_rgba(1,58,143,0.9)]"
                style={{ color: "#FFFFFF" }}
              >
                Laser Dentistry
              </span>
              <div className="w-10 h-10 rounded-full bg-white text-[#064BA8] border-2 border-[#24C6F4]/40 shadow-md flex items-center justify-center shrink-0 hover:bg-[#064BA8] hover:text-white transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M15 3l6 6-12 12-4-2 2-4 8-12z" />
                  <path d="M13 5l6 6M3 21l3-3" />
                </svg>
              </div>
            </div>

            {/* 6. Invisalign & Clear Aligners */}
            <div
              className="absolute flex items-center gap-3.5 -translate-y-1/2"
              style={{ right: "calc(50% + 134px)", top: "calc(50% + 180px)" }}
            >
              <span
                className="text-[15px] font-bold tracking-wide text-right whitespace-nowrap drop-shadow-[0_1px_3px_rgba(1,58,143,0.9)]"
                style={{ color: "#FFFFFF" }}
              >
                Clear Aligners
              </span>
              <div className="w-10 h-10 rounded-full bg-white text-[#064BA8] border-2 border-[#24C6F4]/40 shadow-md flex items-center justify-center shrink-0 hover:bg-[#064BA8] hover:text-white transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 7c0 5 2.5 10 6 10s6-5 6-10" />
                  <path d="M8 8c0 3.5 1.8 7 4 7s4-3.5 4-7" />
                  <circle cx="6" cy="7" r="1.5" />
                  <circle cx="18" cy="7" r="1.5" />
                </svg>
              </div>
            </div>

            {/* ================= RIGHT SIDE SERVICES (6 items) ================= */}
            {/* 1. Root Canal Treatment */}
            <div
              className="absolute flex items-center gap-3.5 -translate-y-1/2"
              style={{ left: "calc(50% + 174px)", top: "calc(50% - 184px)" }}
            >
              <div className="w-10 h-10 rounded-full bg-white text-[#064BA8] border-2 border-[#24C6F4]/40 shadow-md flex items-center justify-center shrink-0 hover:bg-[#064BA8] hover:text-white transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2C8 2 6 4 6 7c0 3 1.5 5 2 7.5S9 21 10.5 21s1.5-2.5 1.5-5c0 2.5 0 5 1.5 5s1.5-4 2.5-6.5c.5-2.5 2-4.5 2-7.5 0-3-2-5-6-5z" />
                  <path d="M12 7v8" />
                </svg>
              </div>
              <span
                className="text-[15px] font-bold tracking-wide text-left whitespace-nowrap drop-shadow-[0_1px_3px_rgba(1,58,143,0.9)]"
                style={{ color: "#FFFFFF" }}
              >
                Root Canal Treatment
              </span>
            </div>

            {/* 2. Teeth Whitening */}
            <div
              className="absolute flex items-center gap-3.5 -translate-y-1/2"
              style={{ left: "calc(50% + 217px)", top: "calc(50% - 109px)" }}
            >
              <div className="w-10 h-10 rounded-full bg-white text-[#064BA8] border-2 border-[#24C6F4]/40 shadow-md flex items-center justify-center shrink-0 hover:bg-[#064BA8] hover:text-white transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2C8 2 6 4 6 7c0 2.5 1 4 1.5 6s1 6 2.5 6 1.5-3 2-5c.5 2 1 5 2 5s1.5-4 2.5-6c.5-2 1.5-3.5 1.5-6 0-3-2-5-6-5z" />
                  <path d="M18 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
                </svg>
              </div>
              <span
                className="text-[15px] font-bold tracking-wide text-left whitespace-nowrap drop-shadow-[0_1px_3px_rgba(1,58,143,0.9)]"
                style={{ color: "#FFFFFF" }}
              >
                Teeth Whitening
              </span>
            </div>

            {/* 3. Cosmetic Dentistry */}
            <div
              className="absolute flex items-center gap-3.5 -translate-y-1/2"
              style={{ left: "calc(50% + 231px)", top: "calc(50% - 38px)" }}
            >
              <div className="w-10 h-10 rounded-full bg-white text-[#064BA8] border-2 border-[#24C6F4]/40 shadow-md flex items-center justify-center shrink-0 hover:bg-[#064BA8] hover:text-white transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M13 2L4 13h7l-1 9 10-12h-7l1-8z" />
                </svg>
              </div>
              <span
                className="text-[15px] font-bold tracking-wide text-left whitespace-nowrap drop-shadow-[0_1px_3px_rgba(1,58,143,0.9)]"
                style={{ color: "#FFFFFF" }}
              >
                Cosmetic Dentistry
              </span>
            </div>

            {/* 4. Braces & Orthodontics */}
            <div
              className="absolute flex items-center gap-3.5 -translate-y-1/2"
              style={{ left: "calc(50% + 212px)", top: "calc(50% + 39px)" }}
            >
              <div className="w-10 h-10 rounded-full bg-white text-[#064BA8] border-2 border-[#24C6F4]/40 shadow-md flex items-center justify-center shrink-0 hover:bg-[#064BA8] hover:text-white transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="8" width="18" height="8" rx="4" />
                  <path d="M7 8v8M12 8v8M17 8v8" />
                </svg>
              </div>
              <span
                className="text-[14px] font-bold leading-snug tracking-wide text-left drop-shadow-[0_1px_3px_rgba(1,58,143,0.9)]"
                style={{ color: "#FFFFFF" }}
              >
                Braces &<br />Orthodontics
              </span>
            </div>

            {/* 5. Kids Dentistry */}
            <div
              className="absolute flex items-center gap-3.5 -translate-y-1/2"
              style={{ left: "calc(50% + 179px)", top: "calc(50% + 111px)" }}
            >
              <div className="w-10 h-10 rounded-full bg-white text-[#064BA8] border-2 border-[#24C6F4]/40 shadow-md flex items-center justify-center shrink-0 hover:bg-[#064BA8] hover:text-white transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <span
                className="text-[15px] font-bold tracking-wide text-left whitespace-nowrap drop-shadow-[0_1px_3px_rgba(1,58,143,0.9)]"
                style={{ color: "#FFFFFF" }}
              >
                Pediatric Dentistry
              </span>
            </div>

            {/* 6. Smile Makeover & Designing */}
            <div
              className="absolute flex items-center gap-3.5 -translate-y-1/2"
              style={{ left: "calc(50% + 137px)", top: "calc(50% + 180px)" }}
            >
              <div className="w-10 h-10 rounded-full bg-white text-[#064BA8] border-2 border-[#24C6F4]/40 shadow-md flex items-center justify-center shrink-0 hover:bg-[#064BA8] hover:text-white transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 11c3 4 6 6 9 6s6-2 9-6c-3-2-6-3-9-3s-6 1-9 3z" />
                  <path d="M3 11c3 6 6 9 9 9s6-3 9-9" />
                </svg>
              </div>
              <span
                className="text-[15px] font-bold tracking-wide text-left whitespace-nowrap drop-shadow-[0_1px_3px_rgba(1,58,143,0.9)]"
                style={{ color: "#FFFFFF" }}
              >
                Smile Designing
              </span>
            </div>

          </div>

          {/* ================= MOBILE / TABLET RESPONSIVE GRID ================= */}
          <div className="lg:hidden flex flex-col items-center gap-8 w-full">
            {/* Center Tooth */}
            <div className="relative w-[180px] h-[260px] drop-shadow-xl my-2">
              <Image
                src={getAssetPath("/figma/central_tooth.png")}
                alt="Multispeciality Dental Care 3D Tooth"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>

            {/* Mobile 2-Column Grid of 12 Services */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
              {[
                "Dentures",
                "Root Canal Treatment",
                "Dental Implants",
                "Teeth Whitening",
                "Wisdom Teeth Removal",
                "Cosmetic Dentistry",
                "Crowns & Bridges",
                "Braces & Orthodontics",
                "Laser Dentistry",
                "Pediatric Dentistry",
                "Clear Aligners",
                "Smile Designing",
              ].map((name, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/20 border border-white/35 backdrop-blur-xs hover:bg-white/25 transition-all shadow-sm"
                >
                  <div className="w-9 h-9 rounded-full bg-white text-[#064BA8] flex items-center justify-center shrink-0 shadow-xs">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2C8 2 6 4 6 7c0 3 1.5 5 2 7.5S9 21 10.5 21s1.5-2.5 1.5-5c0 2.5 0 5 1.5 5s1.5-4 2.5-6.5c.5-2.5 2-4.5 2-7.5 0-3-2-5-6-5z" />
                    </svg>
                  </div>
                  <span
                    className="text-sm font-bold drop-shadow-[0_1px_2px_rgba(1,58,143,0.8)]"
                    style={{ color: "#FFFFFF" }}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
