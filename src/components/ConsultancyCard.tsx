"use client";

import { useState } from "react";
import { CheckCircle, Send, Calendar } from "lucide-react";

export default function ConsultancyCard() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      const addressText = formData.address ? `, Address: ${formData.address}` : "";
      const msg = encodeURIComponent(
        `Hello 32 Smiles Multispeciality Dental Clinic, I would like to request an online consultation for ${formData.name}, Phone: ${formData.phone}, Email: ${formData.email}${addressText}`
      );
      window.open(`https://wa.me/918143148485?text=${msg}`, "_blank");
    }, 600);
  };

  return (
    <div id="consultancy" className="relative z-30 max-w-[1060px] mx-auto px-4 sm:px-6 w-full -mt-20 lg:-mt-24">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-[0_20px_60px_rgba(1,58,143,0.08)] border border-[#D8F2FE] p-6 md:p-10 lg:p-12 relative overflow-hidden">
        {/* Top Brand Color Bar with Primary Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[linear-gradient(110deg,#013A8F,#0153AD,#01B0FD)]" />
        
        {/* Subtle decorative tooth line-art watermark on the left side */}
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
          <svg width="280" height="280" viewBox="0 0 24 24" fill="none" stroke="#47D2FD" strokeWidth="1.5">
            <path d="M12 2C8 2 5 4 5 7c0 3 1.5 5 2 7.5S8 22 10 22s2-3.5 2-6c0 2.5 0 6 2 6s3-4.5 3-7.5 2-4.5 2-7.5c0-3-3-5-7-5z" />
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Heading */}
          <div className="lg:col-span-5 text-left">
            <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#013A8F] tracking-tight leading-[1.25]">
              Quick Online<br />
              Consultancy Only<br />
              in <span className="text-[#01B0FD] relative inline-block">Few Minutes<span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#0153AD] rounded-full" /></span>
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
              Fill in your contact details below, or book a confirmed slot instantly via Calendly.
            </p>
            <div className="mt-4">
              <a
                href="https://calendly.com/32smiles-dental-clinic/30min?month=2026-10&date=2026-10-03"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0153AD] hover:text-[#01B0FD] transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#01B0FD]" />
                <span>Prefer instant booking? Pick a time slot on Calendly →</span>
              </a>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-[#EAF8FF] border border-[#D8F2FE] rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
                <CheckCircle className="w-10 h-10 text-[#0153AD] mx-auto mb-2" />
                <h4 className="text-lg font-bold text-[#013A8F]">Consultation Request Received!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Thank you, {formData.name}. Our clinic team will reach out to you shortly via WhatsApp / Phone at 081431 48485.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="https://calendly.com/32smiles-dental-clinic/30min?month=2026-10&date=2026-10-03"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0153AD] text-white text-xs font-bold rounded-lg shadow-xs hover:bg-[#013A8F]"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#47D2FD]" />
                    <span>Schedule on Calendly</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", phone: "", email: "", address: "" });
                    }}
                    className="text-xs font-semibold text-[#0153AD] underline hover:text-[#013A8F] px-2 py-1"
                  >
                    Submit another request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                {/* 2x2 Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Name*"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-11 px-4 text-sm rounded-lg bg-[#f4f5f8] border border-transparent focus:border-[#0153AD] focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number*"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-11 px-4 text-sm rounded-lg bg-[#f4f5f8] border border-transparent focus:border-[#0153AD] focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Email*"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-11 px-4 text-sm rounded-lg bg-[#f4f5f8] border border-transparent focus:border-[#0153AD] focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Address / Area in Yanam"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full h-11 px-4 text-sm rounded-lg bg-[#f4f5f8] border border-transparent focus:border-[#0153AD] focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Submit button (#0153AD, hover #013A8F) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#0153AD] hover:bg-[#013A8F] text-white font-bold text-sm sm:text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <Send className="w-4 h-4 text-[#47D2FD]" />
                  <span>{loading ? "Submitting..." : "Get Free Online Consultation"}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
