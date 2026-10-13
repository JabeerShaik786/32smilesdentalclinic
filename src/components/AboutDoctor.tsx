"use client";

import Image from "next/image";
import { ShieldCheck, HeartHandshake, CheckCircle2 } from "lucide-react";
import { getAssetPath } from "@/lib/getAssetPath";

export default function AboutDoctor() {
  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target =
      document.querySelector("#contact") ||
      document.querySelector("#consultancy") ||
      document.querySelector("#about");
    if (target) {
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="doctor"
      className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden"
    >
      {/* Decorative Background: Soft Tooth Outline */}
      <div
        className="absolute right-[-2%] top-[12%] w-[380px] h-[460px] opacity-[0.06] pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full stroke-[#47D2FD]"
          strokeWidth="1.6"
        >
          <path d="M20,35 C20,15 35,8 50,15 C65,8 80,15 80,35 C80,55 75,70 70,105 C68,112 60,112 56,98 C53,86 47,86 44,98 C40,112 32,112 30,105 C25,70 20,55 20,35 Z" />
        </svg>
      </div>

      <div className="max-w-[1360px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ================= LEFT SIDE: Content & Typography ================= */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Small label: ABOUT OUR DOCTOR */}
            <div className="mb-3">
              <span className="relative inline-block text-xs md:text-sm font-extrabold tracking-[0.16em] uppercase pb-1 text-[#013A8F]">
                <span className="relative text-[#01B0FD]">
                  ABOUT
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#0153AD] rounded-full" />
                </span>
                <span className="ml-2 font-bold text-[#013A8F]">OUR DOCTOR</span>
              </span>
            </div>

            {/* Main heading: Expert Care for Healthier Smiles */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#013A8F] tracking-tight leading-[1.18] mb-3">
              Expert Care for<br className="hidden sm:inline" />{" "}
              <span className="text-[#01B0FD]">Healthier Smiles</span>
            </h2>

            {/* Tagline */}
            <p className="text-base sm:text-lg font-semibold text-[#0153AD] mb-4 tracking-tight">
              Experienced. Compassionate. Dedicated to Your Smile.
            </p>

            {/* Paragraph */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal mb-6 max-w-xl">
              At 32 Smiles Multispeciality Dental Clinic, our doctor is committed to providing personalized, gentle, and high-quality dental care. Every patient is treated with dedicated clinical attention, advanced treatment techniques, and a compassionate approach focused on long-term oral health and confidence.
            </p>

            {/* Doctor Highlights */}
            <div className="flex flex-col gap-2.5 mb-8 text-sm text-slate-700">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#0153AD] shrink-0" />
                <span>Multispeciality Dental Care & Modern Procedures</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HeartHandshake className="w-4 h-4 text-[#0153AD] shrink-0" />
                <span>Patient-First Philosophy & Gentle Techniques</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0153AD] shrink-0" />
                <span>Modern Sterilization & Diagnostic Standards</span>
              </div>
            </div>

            {/* Primary button (#0153AD, hover #013A8F) */}
            <div>
              <a
                href="#consultancy"
                onClick={scrollToContact}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#0153AD] hover:bg-[#013A8F] text-white font-bold text-sm sm:text-base rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>Know More</span>
                <span className="text-lg leading-none">→</span>
              </a>
            </div>
          </div>

          {/* ================= RIGHT SIDE: Doctor Image & Decorative Elements ================= */}
          <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[440px] lg:max-w-[480px] flex items-center justify-center">
              
              {/* Decorative 1: Soft Light-Blue Circular Background Glow */}
              <div
                className="absolute inset-0 -m-4 sm:-m-6 rounded-full bg-gradient-to-tr from-[#01B0FD]/15 via-[#0153AD]/8 to-transparent -z-10 blur-xl pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-[#01B0FD]/10 -z-10 pointer-events-none"
                aria-hidden="true"
              />

              {/* Decorative 2: Small Blue Decorative Dots Grid */}
              <div
                className="absolute -top-6 -left-4 sm:-left-8 w-24 h-24 grid grid-cols-5 gap-2.5 opacity-50 pointer-events-none -z-10"
                aria-hidden="true"
              >
                {[...Array(25)].map((_, i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#47D2FD]"
                  />
                ))}
              </div>

              {/* Decorative 3: Thin Curved Accent Line */}
              <svg
                className="absolute -bottom-6 -left-6 sm:-left-10 w-28 sm:w-36 h-20 pointer-events-none -z-10"
                viewBox="0 0 140 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M10 70 Q 70 10 130 50"
                  stroke="#01B0FD"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Doctor Image Container */}
              <div className="relative w-full aspect-[4/5] min-h-[440px] sm:min-h-[500px] lg:min-h-[530px] rounded-3xl sm:rounded-[36px] bg-gradient-to-b from-[#EAF8FF] via-white to-[#EAF8FF] border-2 border-[#47D2FD]/40 shadow-xl shadow-slate-200/50 flex items-end justify-center pt-3 px-3 pb-0 sm:pt-4 sm:px-4 overflow-hidden group">
                
                {/* Subtle internal background glow */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/70 blur-2xl pointer-events-none" />

                {/* Doctor Portrait Image */}
                <div className="relative w-full h-full flex items-end justify-center z-10">
                  <Image
                    src={getAssetPath("/doctor.png")}
                    alt="Doctor - 32 Smiles Multispeciality Dental Clinic"
                    fill
                    priority
                    className="object-contain object-bottom drop-shadow-[0_12px_24px_rgba(1,58,143,0.18)] group-hover:scale-[1.02] transition-transform duration-300"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 440px, 480px"
                    unoptimized
                  />
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
