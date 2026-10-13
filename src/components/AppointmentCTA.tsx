"use client";

import Image from "next/image";
import { Phone, Calendar } from "lucide-react";
import { getAssetPath } from "@/lib/getAssetPath";

export default function AppointmentCTA() {
  return (
    <section
      id="contact"
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden text-white"
      style={{
        background: "linear-gradient(110deg, #013A8F 0%, #0153AD 50%, #01B0FD 100%)",
      }}
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Main Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT: Text & CTA Buttons */}
          <div className="lg:col-span-6 flex flex-col items-start text-left max-w-xl">
            <h2
              className="text-3xl sm:text-4xl lg:text-[50px] font-extrabold tracking-tight leading-[1.14] mb-4 drop-shadow-[0_2px_8px_rgba(1,58,143,0.6)]"
              style={{ color: "#FFFFFF" }}
            >
              Book Your<br />
              <span style={{ color: "#00CFFF" }}>
                Appointment Today!
              </span>
            </h2>
            <div className="w-16 h-1.5 bg-[#00CFFF] rounded-full mb-6 shadow-sm" />

            <p
              className="text-sm sm:text-base leading-relaxed font-normal mb-8"
              style={{ color: "rgba(255, 255, 255, 0.95)" }}
            >
              Your smile deserves the best care! Schedule your dental appointment online instantly with our official Calendly calendar, or contact our reception desk directly. Expert multispeciality care and gentle treatments await you in Yanam.
            </p>

            {/* Prominent Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://calendly.com/32smiles-dental-clinic/30min?month=2026-10&date=2026-10-03"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#0153AD] hover:bg-[#013A8F] hover:text-white font-extrabold text-base rounded-lg shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-200 cursor-pointer border-2 border-white"
              >
                <Calendar className="w-5 h-5 text-[#0153AD]" />
                <span>Book Appointment (Calendly)</span>
              </a>
              <a
                href="tel:08143148485"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#013A8F]/80 hover:bg-[#013A8F] text-white font-bold text-base rounded-lg border border-white/20 shadow-md transition-all duration-200"
              >
                <Phone className="w-4 h-4 text-[#47D2FD]" />
                <span>081431 48485</span>
              </a>
            </div>
          </div>

          {/* RIGHT: Large Cartoon Smiling Tooth Container */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
            <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] lg:w-[430px] lg:h-[430px] rounded-full bg-white/15 backdrop-blur-xs flex items-center justify-center border-4 border-white/30 shadow-2xl">
              <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[390px] lg:h-[390px] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.25)]">
                <Image
                  src={getAssetPath("/smiling-tooth.png")}
                  alt="32 Smiles Multispeciality Dental Clinic"
                  fill
                  className="object-contain"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
