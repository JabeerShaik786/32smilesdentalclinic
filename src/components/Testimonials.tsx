"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { getAssetPath } from "@/lib/getAssetPath";

interface TestimonialCardData {
  id: number;
  name: string;
  avatar: string;
  treatment: string;
  quote: string;
}

const TESTIMONIALS_DATA: TestimonialCardData[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    avatar: "/figma/avatar_srinivas.png",
    treatment: "Dental Implants",
    quote:
      "Had a wonderful experience at 32 Smiles Multispeciality Dental Clinic. I got two dental implants done here, and the entire procedure was completely pain-free and smoothly handled. The doctors and clinic staff were extremely supportive and professional.",
  },
  {
    id: 2,
    name: "Sneha Reddy",
    avatar: "/figma/avatar_lakshmi.jpg",
    treatment: "Clear Aligners & Teeth Alignment",
    quote:
      "Visited 32 Smiles for teeth alignment consultation. The doctor explained the clear aligners process in detail using 3D scans. The results have been incredible, and my confidence in my smile has improved tremendously. Truly top-notch care!",
  },
  {
    id: 3,
    name: "Karthik Verma",
    avatar: "/figma/avatar_bhargav.png",
    treatment: "Root Canal & Ceramic Crown",
    quote:
      "I was terrified of getting a root canal, but the team at 32 Smiles Multispeciality Dental Clinic made it feel like a breeze! No pain, modern equipment, and pristine hygiene. Highly recommend them for anyone seeking quality dental treatment.",
  },
  {
    id: 4,
    name: "Sunita Sharma",
    avatar: "/figma/avatar_test1.png",
    treatment: "Teeth Whitening & Cleaning",
    quote:
      "Excellent service and very warm staff. Got professional teeth whitening and cleaning done for my wedding. The results exceeded my expectations. The clinic is spotless and equipped with the latest dental technology.",
  },
  {
    id: 5,
    name: "M. Durga Prasad",
    avatar: "/figma/avatar_durgaprasad.jpg",
    treatment: "Wisdom Tooth Removal",
    quote:
      "Got my impacted wisdom tooth extracted at 32 Smiles Dental Clinic. The surgeon was exceptionally skilled and the recovery was very fast without any complications. Reasonable pricing and very courteous team.",
  },
  {
    id: 6,
    name: "K. Satyanarayana",
    avatar: "/figma/avatar_satyanarayana.jpg",
    treatment: "Full Mouth Rehabilitation",
    quote:
      "The best multispeciality dental clinic in town. I took my elderly parents here for dentures and full mouth rehabilitation. The doctors treat patients with patience, empathy, and utmost dedication.",
  },
];

const EXTENDED_TESTIMONIALS = [
  ...TESTIMONIALS_DATA,
  ...TESTIMONIALS_DATA.slice(0, 3),
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Responsive items count
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Pause when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.visibilityState === "hidden");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleNext = useCallback(() => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => {
      if (prev >= TESTIMONIALS_DATA.length) {
        setIsTransitioning(false);
        return 0;
      }
      return prev + 1;
    });
  }, [isTransitioning]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
  }, []);

  // Seamless jump reset
  useEffect(() => {
    if (currentIndex >= TESTIMONIALS_DATA.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsTransitioning(true);
    }
  }, [currentIndex]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
    setTouchStart(null);
  };

  return (
    <section
      id="testimonials"
      className="py-20 lg:py-28 bg-[#EAF8FF] relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 lg:px-20 relative z-10 text-center">
        
        {/* Section Heading */}
        <div className="inline-block mb-12 lg:mb-16">
          <div className="mb-2">
            <span className="text-xs md:text-sm font-extrabold tracking-[0.18em] text-[#0153AD] uppercase">
              PATIENT EXPERIENCES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#013A8F] tracking-tight">
            What Our Patients Say
          </h2>
          <div className="w-14 h-1 bg-[#0153AD] mx-auto mt-3 rounded-full" />
        </div>

        {/* Carousel Container */}
        <div
          className="relative max-w-[1240px] mx-auto overflow-hidden px-2"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`flex ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
            style={{
              transform: `translateX(-${(currentIndex * 100) / itemsPerPage}%)`,
            }}
          >
            {EXTENDED_TESTIMONIALS.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="w-full md:w-1/2 lg:w-1/3 shrink-0 p-3 sm:p-4"
              >
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl border border-[#D8F2FE] flex flex-col justify-between h-full transition-all duration-300 text-left group">
                  
                  {/* Rating Stars & Quote */}
                  <div>
                    <div className="flex items-center gap-1 mb-4 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  {/* Reviewer Meta */}
                  <div className="flex items-center gap-3.5 pt-4 border-t border-[#D8F2FE]">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#47D2FD]/50 shadow-xs">
                      <Image
                        src={getAssetPath(item.avatar)}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-heading font-bold text-sm sm:text-base text-[#013A8F] group-hover:text-[#0153AD] transition-colors">
                        {item.name}
                      </span>
                      <span className="text-xs text-[#0153AD] font-semibold">
                        {item.treatment}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-[#0153AD] hover:border-[#0153AD] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS_DATA.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex % TESTIMONIALS_DATA.length === i
                      ? "w-8 bg-[#0153AD]"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-[#0153AD] hover:border-[#0153AD] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* View More Reviews Button */}
          <div className="mt-10 flex justify-center">
            <a
              href="https://www.google.com/search?q=32+smiles+dental+clinic&rlz=1C1ONGR_en-GBIN1218IN1220&oq=32+smi&gs_lcrp=EgZjaHJvbWUqBwgBEAAYgAQyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDINCAMQLhivARjHARiABDIKCAQQABiABBi0BzIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABDIHCAkQABiABNIBCDkyNDZqMGo3qAIAsAIA&sourceid=chrome&source=chrome.ob&ie=UTF-8#lrd=0x3a381f102ccba7f1:0x96be51550d0fab62,1,,,,"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#0153AD] hover:bg-[#013A8F] text-white font-bold text-sm sm:text-base rounded-full shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <span>View More</span>
              <ExternalLink className="w-4 h-4 text-[#47D2FD]" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
