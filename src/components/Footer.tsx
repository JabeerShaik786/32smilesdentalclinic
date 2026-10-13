"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, MessageSquare, Clock, Calendar, LogIn } from "lucide-react";
import { getAssetPath } from "@/lib/getAssetPath";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        if (href === "#home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          window.history.pushState(null, "", window.location.pathname);
          return;
        }
        const headerEl = document.querySelector("header");
        const navbarHeight = headerEl ? headerEl.getBoundingClientRect().height + 16 : 96;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 12;
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: "smooth",
        });
        window.history.pushState(null, "", href);
      } else {
        e.preventDefault();
        window.location.href = getAssetPath(`/${href}`);
      }
    }
  };

  return (
    <footer className="w-full bg-[#013A8F] text-white/90 pt-16 lg:pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
      {/* Top Subtle Blue Stripe with Primary Gradient */}
      <div className="w-full h-1.5 bg-[linear-gradient(110deg,#013A8F,#0153AD,#01B0FD)] absolute top-0 left-0" />

      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#01B0FD]/10 blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#0153AD]/20 blur-[120px] -z-10 pointer-events-none" />

      {/* Upper Footer Section: 4 columns on desktop, 2-col tablet, 1-col mobile */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
        
        {/* Column 1 — Clinic branding */}
        <div className="flex flex-col gap-6 text-left">
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, "#home")}
            className="flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="relative w-[52px] h-[46px] rounded-xl overflow-hidden border border-white/20 shadow-xs shrink-0">
              <Image
                src={getAssetPath("/32smiles-logo.jpg")}
                alt="32 Smiles Multispeciality Dental Clinic"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-heading font-extrabold text-lg text-white leading-tight">
                32 <span className="text-[#01B0FD]">Smiles</span>
              </span>
              <span className="text-[10px] font-bold text-[#47D2FD] tracking-wider uppercase mt-0.5">
                Multispeciality Dental Clinic
              </span>
            </div>
          </a>

          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Transforming Smiles, Enhancing Confidence. Providing premier multispeciality dental care, advanced dental implants, and comfortable cosmetic treatments in Yanam.
          </p>

          <div className="flex flex-col gap-2">
            <span className="text-[12px] bg-[#0153AD]/40 text-white px-3.5 py-1.5 rounded-full font-medium border border-[#47D2FD]/30 flex items-center gap-1.5 w-fit">
              <Clock className="w-3.5 h-3.5 text-[#47D2FD]" />
              Mon – Sat: 9:30 AM – 8:30 PM
            </span>
            <span className="text-[11px] text-rose-300 font-medium pl-3">
              * Sunday: Closed
            </span>
          </div>
        </div>

        {/* Column 2 — Navigation */}
        <div className="flex flex-col gap-5 text-left">
          <h4 className="font-heading font-bold text-base text-white tracking-wide uppercase flex items-center gap-2">
            Navigation
            <span className="w-1.5 h-1.5 rounded-full bg-[#01B0FD]" />
          </h4>
          <ul className="flex flex-col gap-3.5 text-sm text-white/70">
            {[
              { name: "Home", href: "#home" },
              { name: "About Us", href: "#about" },
              { name: "Our Services", href: "#services" },
              { name: "Gallery", href: "#gallery" },
              { name: "Testimonials", href: "#testimonials" },
              { name: "Contact Us", href: "#contact" },
            ].map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="hover:text-[#47D2FD] transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://calendly.com/32smiles-dental-clinic/30min?month=2026-10&date=2026-10-03"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#47D2FD] hover:text-white font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Appointment (Calendly)</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 — Services */}
        <div className="flex flex-col gap-5 text-left">
          <h4 className="font-heading font-bold text-base text-white tracking-wide uppercase flex items-center gap-2">
            Services
            <span className="w-1.5 h-1.5 rounded-full bg-[#01B0FD]" />
          </h4>
          <ul className="flex flex-col gap-3.5 text-sm text-white/70">
            {[
              { name: "Dental Implants", href: "#services" },
              { name: "Root Canal Treatment", href: "#services" },
              { name: "Braces & Clear Aligners", href: "#services" },
              { name: "Teeth Whitening", href: "#services" },
              { name: "Crowns & Bridges", href: "#services" },
              { name: "Wisdom Teeth Surgery", href: "#services" },
              { name: "Pediatric Dentistry", href: "#services" },
            ].map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="hover:text-[#47D2FD] transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 — Contact Us */}
        <div className="flex flex-col gap-5 text-left">
          <h4 className="font-heading font-bold text-base text-white tracking-wide uppercase flex items-center gap-2">
            Contact Us
            <span className="w-1.5 h-1.5 rounded-full bg-[#01B0FD]" />
          </h4>
          <div className="flex flex-col gap-4 text-sm text-white/70">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-[#47D2FD] shrink-0 mt-0.5" />
              <div className="flex flex-col text-left">
                <span className="leading-relaxed text-white/90">
                  D.No. 4-5-087, Pillaraya Street, Opp. Pillaraya Temple, Ambedkar Nagar, Yanam, Andhra Pradesh – 533464
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-[#47D2FD] shrink-0 mt-0.5" />
              <a href="tel:08143148485" className="hover:text-[#47D2FD] text-white/95 font-medium transition-colors">
                081431 48485
              </a>
            </div>
            <div className="flex gap-3">
              <MessageSquare className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
              <a
                href="https://wa.me/918143148485"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#25D366] text-white/95 font-medium transition-colors"
              >
                WhatsApp: 081431 48485
              </a>
            </div>
            <div className="flex gap-3">
              <Calendar className="w-5 h-5 text-[#47D2FD] shrink-0 mt-0.5" />
              <a
                href="https://calendly.com/32smiles-dental-clinic/30min?month=2026-10&date=2026-10-03"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white text-[#47D2FD] font-bold transition-colors"
              >
                Schedule on Calendly →
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Lower Footer Section */}
      <hr className="border-white/10 max-w-[1440px] mx-auto px-6 md:px-12" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50 text-center md:text-left">
        <p>© 2026 32 Smiles Multispeciality Dental Clinic. All rights reserved.</p>
        <p className="text-white/50 flex items-center justify-center gap-1.5">
          <Image
            src={getAssetPath("/jk-logo.png")}
            alt="JK & Co."
            width={18}
            height={18}
            className="w-[18px] h-[18px] object-contain shrink-0"
            unoptimized
          />
          <span>Designed and Managed by JK & Co.</span>
        </p>
        <div className="flex items-center justify-center gap-6">
          <Link href="/privacy-policy" className="hover:text-[#47D2FD] transition-colors duration-200">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-[#47D2FD] transition-colors duration-200">
            Terms of Service
          </Link>
          <Link href="/login" className="hover:text-[#47D2FD] transition-colors duration-200">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
