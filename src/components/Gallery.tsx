"use client";

import Image from "next/image";
import { getAssetPath } from "@/lib/getAssetPath";

export default function Gallery() {
  return (
    <section id="gallery" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Dental Instruments decoration in bottom right corner */}
      <div className="absolute right-0 bottom-0 w-[140px] md:w-[170px] aspect-[172/140] pointer-events-none select-none z-10">
        <Image
          src={getAssetPath("/figma/dental_tools.png")}
          alt="Dental Tools Decoration"
          fill
          className="object-contain object-bottom-right"
          unoptimized
        />
      </div>

      <div className="max-w-[1360px] mx-auto px-6 md:px-12 lg:px-20 relative z-20 text-center">
        
        {/* Section Heading */}
        <div className="inline-block mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#013A8F] tracking-tight">
            Clinic Gallery
          </h2>
          <div className="w-14 h-1 bg-[#0153AD] mx-auto mt-2.5 rounded-full" />
          <p className="text-slate-500 text-sm md:text-base mt-3 max-w-lg mx-auto">
            Take a visual tour of our modern operatories, state-of-the-art dental equipment, and sterile environment.
          </p>
        </div>

        {/* Gallery 1 + 4 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch max-w-[1100px] mx-auto">
          
          {/* LEFT: One Large Feature Image (~50% width) - 1. Exterior/front view */}
          <div className="lg:col-span-6 relative w-full aspect-[4/3] lg:aspect-auto lg:h-[430px] rounded-2xl md:rounded-3xl overflow-hidden shadow-md border border-[#D8F2FE] hover:border-[#01B0FD] hover:shadow-xl transition-all duration-300 group">
            <Image
              src={getAssetPath("/gallery/gallery_1.png")}
              alt="Exterior and Front View of 32 Smiles Dental Clinic"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#013A8F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-white text-sm font-semibold">Exterior & Front View</span>
            </div>
          </div>

          {/* RIGHT: 2x2 Grid of 4 Smaller Images */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 md:gap-5 w-full">
            
            {/* Top-Left: 2. Interior dental treatment room */}
            <div className="relative w-full aspect-[4/3] lg:h-[202px] rounded-2xl overflow-hidden shadow-sm border border-[#D8F2FE] hover:border-[#01B0FD] hover:shadow-md transition-all duration-300 group">
              <Image
                src={getAssetPath("/gallery/gallery_2.png")}
                alt="Interior Dental Treatment Room - 32 Smiles Multispeciality Dental Clinic"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 50vw, 25vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#013A8F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-white text-xs font-semibold">Dental Treatment Room</span>
              </div>
            </div>

            {/* Top-Right: 3. Doctor performing a dental procedure */}
            <div className="relative w-full aspect-[4/3] lg:h-[202px] rounded-2xl overflow-hidden shadow-sm border border-[#D8F2FE] hover:border-[#01B0FD] hover:shadow-md transition-all duration-300 group">
              <Image
                src={getAssetPath("/gallery/gallery_3.png")}
                alt="Doctor Performing Dental Procedure - 32 Smiles Multispeciality Dental Clinic"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 50vw, 25vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#013A8F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-white text-xs font-semibold">Doctor Performing Procedure</span>
              </div>
            </div>

            {/* Bottom-Left: 4. Front entrance/signboard of 32 Smiles Dental Clinic */}
            <div className="relative w-full aspect-[4/3] lg:h-[202px] rounded-2xl overflow-hidden shadow-sm border border-[#D8F2FE] hover:border-[#01B0FD] hover:shadow-md transition-all duration-300 group">
              <Image
                src={getAssetPath("/gallery/gallery_4.png")}
                alt="Front Entrance and Signboard - 32 Smiles Dental Clinic"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 50vw, 25vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#013A8F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-white text-xs font-semibold">Front Entrance & Signboard</span>
              </div>
            </div>

            {/* Bottom-Right: 5. Night-time exterior/signboard of 32 Smiles Dental Clinic */}
            <div className="relative w-full aspect-[4/3] lg:h-[202px] rounded-2xl overflow-hidden shadow-sm border border-[#D8F2FE] hover:border-[#01B0FD] hover:shadow-md transition-all duration-300 group">
              <Image
                src={getAssetPath("/gallery/gallery_5.jpg")}
                alt="Night-Time Exterior and Signboard - 32 Smiles Dental Clinic"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 50vw, 25vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#013A8F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-white text-xs font-semibold">Night-Time Signboard</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
