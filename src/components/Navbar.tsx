"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Menu, X, Calendar, LogIn, UserCheck } from "lucide-react";
import { getAssetPath } from "@/lib/getAssetPath";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { name: "Home", href: "#home" },
  { name: "About Us", href: "#about" },
  { name: "Our Services", href: "#services" },
  { name: "Gallery", href: "#gallery" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact Us", href: "#contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } catch (e) {
        console.error("Auth status check failed:", e);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const sectionIds = ["home", "about", "doctor", "services", "gallery", "testimonials", "contact"];
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) {
          const navbarHeight = 76;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: "smooth",
          });
        }
      }, 150);
    }
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);

    if (href === "#home") {
      const homeEl = document.getElementById("home");
      if (homeEl) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", window.location.pathname);
      } else {
        e.preventDefault();
        window.location.href = getAssetPath("/");
      }
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navbarHeight = 76;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth",
      });
      window.history.pushState(null, "", href);
    } else {
      e.preventDefault();
      window.location.href = getAssetPath(`/${href}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-xs">
      {/* Main Navigation Bar (White Background) */}
      <div className="w-full bg-white relative h-[76px] flex items-center border-b border-[#D8F2FE]">
        <div className="max-w-[1360px] mx-auto w-full px-6 md:px-12 lg:px-20 flex items-center justify-between">
          
          {/* 32 Smiles Logo with Uploaded Tooth Emblem */}
          <div className="relative z-20 shrink-0 flex items-center">
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, "#home")}
              className="flex items-center gap-3 transition-transform hover:scale-[1.01] py-1"
            >
              <div className="relative w-[48px] h-[44px] sm:w-[54px] sm:h-[48px] rounded-xl overflow-hidden shadow-xs border border-[#D8F2FE] shrink-0">
                <Image
                  src={getAssetPath("/32smiles-logo.jpg")}
                  alt="32 Smiles Multispeciality Dental Clinic Logo"
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-heading font-extrabold text-[19px] sm:text-[22px] text-[#013A8F] leading-tight tracking-tight">
                  32 <span className="text-[#01B0FD]">Smiles</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#0153AD] tracking-wider uppercase leading-none mt-0.5">
                  Multispeciality Dental Clinic
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 ml-auto mr-5">
            {NAV_ITEMS.map((item) => {
              const itemId = item.href.replace("#", "");
              const isActive = activeSection === itemId;

              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`relative text-[15px] font-bold transition-colors duration-200 py-1 ${
                    isActive ? "text-[#0153AD]" : "text-[#013A8F] hover:text-[#01B0FD]"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#0153AD] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action Buttons: Primary Button (#0153AD, hover #013A8F) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <a
              href="https://calendly.com/32smiles-dental-clinic/30min?month=2026-10&date=2026-10-03"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[14px] font-bold text-white bg-[#0153AD] hover:bg-[#013A8F] rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </a>
            <a
              href="tel:08143148485"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[14px] font-bold text-[#013A8F] bg-[#EAF8FF] hover:bg-[#D8F2FE] rounded-lg transition-all duration-200 active:scale-95 border border-[#D8F2FE]"
              title="Call 081431 48485"
            >
              <Phone className="w-4 h-4 text-[#0153AD]" />
              <span>Call</span>
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="flex lg:hidden items-center gap-2.5">
            <a
              href="https://calendly.com/32smiles-dental-clinic/30min?month=2026-10&date=2026-10-03"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-xs font-bold text-white bg-[#0153AD] hover:bg-[#013A8F] rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </a>
            <a
              href="tel:08143148485"
              className="px-3 py-2 text-xs font-bold text-[#013A8F] bg-[#EAF8FF] hover:bg-[#D8F2FE] rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#0153AD]" />
              <span>Call</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#013A8F] hover:text-[#01B0FD] transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-white border-b border-[#D8F2FE] shadow-xl px-6 py-5 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="py-2 text-base font-semibold text-[#013A8F] hover:text-[#01B0FD] transition-colors border-b border-slate-100"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <a
              href="https://calendly.com/32smiles-dental-clinic/30min?month=2026-10&date=2026-10-03"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 text-center text-sm font-bold text-white bg-[linear-gradient(110deg,#013A8F,#0153AD,#01B0FD)] rounded-lg shadow-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment (Calendly)</span>
            </a>
            <a
              href="tel:08143148485"
              className="flex items-center justify-center gap-2 py-2 text-sm text-[#013A8F] font-semibold bg-[#EAF8FF] hover:bg-[#D8F2FE] rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4 text-[#0153AD]" />
              <span>Call Us: 081431 48485</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
