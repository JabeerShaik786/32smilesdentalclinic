"use client";

import Image from "next/image";
import { Check, ShieldCheck } from "lucide-react";
import { getAssetPath } from "@/lib/getAssetPath";

export default function AboutSection() {
  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector("#contact") || document.querySelector("#consultancy");
    if (target) {
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="about" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Subtle oversized dental / wave watermark graphic in the background */}
      <div className="absolute right-[-10%] top-[10%] w-[600px] h-[600px] opacity-[0.04] pointer-events-none select-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-[#47D2FD]" strokeWidth="2">
          <circle cx="100" cy="100" r="90" />
          <path d="M50 100 Q 100 20 150 100 T 250 100" />
          <path d="M40 120 C 70 60, 130 60, 160 120 C 130 180, 70 180, 40 120 Z" />
        </svg>
      </div>

      <div className="max-w-[1360px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Large Rounded Clinic Treatment Room Image */}
          <div className="lg:col-span-6 w-full">
            <div className="relative w-full aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl shadow-slate-200/70 border border-[#D8F2FE]">
              <Image
                src={getAssetPath("/about_treatment_room.png")}
                alt="32 Smiles Multispeciality Dental Clinic Modern Treatment Room"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized
              />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-md border border-[#D8F2FE] flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#0153AD]" />
                <span className="text-xs font-bold text-[#013A8F]">Sterilized & Modern Operatory</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Typography & Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Eyebrow Label */}
            <div className="mb-4">
              <span className="relative inline-block text-xs md:text-sm font-extrabold tracking-[0.16em] uppercase pb-1 text-[#013A8F]">
                <span className="relative text-[#01B0FD]">
                  ABOUT OUR CLINIC
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0153AD] rounded-full" />
                </span>
              </span>
            </div>

            {/* Main Section Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#013A8F] tracking-tight leading-[1.18] mb-6">
              Complete Multispeciality<br />
              Dental Care for <span className="text-[#01B0FD]">Healthy Smiles</span>
            </h2>

            {/* Description Paragraph */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal mb-6 max-w-xl">
              At <strong>32 Smiles Multispeciality Dental Clinic</strong>, we are committed to delivering exceptional dental healthcare with a patient-centric philosophy. From routine preventative cleanings to advanced dental implants, smile makeovers, and orthodontic alignment, our clinic provides gentle, precise, and state-of-the-art dental treatments in a relaxing environment.
            </p>

            {/* Bullet features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 w-full max-w-lg">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Check className="w-4 h-4 text-[#0153AD] shrink-0" />
                <span>Multi-specialist Doctors</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Check className="w-4 h-4 text-[#0153AD] shrink-0" />
                <span>Advanced Digital Diagnostics</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Check className="w-4 h-4 text-[#0153AD] shrink-0" />
                <span>100% Painless Procedures</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Check className="w-4 h-4 text-[#0153AD] shrink-0" />
                <span>Strict Sterilization Standards</span>
              </div>
            </div>

            {/* Primary Read More Button (#0153AD, hover #013A8F) */}
            <div>
              <a
                href="#contact"
                onClick={scrollToContact}
                className="inline-flex items-center justify-center px-8 py-3 bg-[#0153AD] hover:bg-[#013A8F] text-white font-bold text-sm sm:text-base rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Read More
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
