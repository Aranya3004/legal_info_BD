import React from 'react';
import { Scale, AlertTriangle, BookOpen, Shield } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0f1e15] border-t-2 border-[#f42a41]/30 mt-auto">
      {/* Disclaimer banner — most prominent */}
      <div className="bg-[#f42a41]/8 border-b border-[#f42a41]/20 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-start gap-3">
          <div className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-[#f42a41]/20 flex items-center justify-center">
            <AlertTriangle className="w-3.5 h-3.5 text-[#f42a41]" />
          </div>
          <div>
            <p className="text-[#f42a41] text-[11px] font-black uppercase tracking-widest mb-1">
              Important Disclaimer
            </p>
            <p className="text-white/55 text-xs leading-relaxed max-w-4xl">
              <span className="text-white/80 font-semibold">LegalInfo BD</span> is intended solely
              for <span className="text-[#f9a825] font-semibold">research and educational purposes</span>.
              All content, AI-generated responses, case analyses, and legal summaries on this platform
              are <span className="text-white/80 font-semibold">not legal advice</span> and should{' '}
              <span className="text-white/80 font-semibold">not be relied upon</span> for real-life
              legal decisions. Predictions and suggestions made by AI tools are indicative only —
              always consult a qualified legal professional before taking any action.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#f42a41] rounded-full flex items-center justify-center">
            <Scale className="w-3 h-3 text-white" />
          </div>
          <span className="font-garamond italic font-black text-[#f9a825] text-sm tracking-tight">
            LegalInfo BD
          </span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-white/30 text-[10px] font-medium">© {year}</span>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest">
            <BookOpen className="w-3 h-3" />
            Research Only
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest">
            <Shield className="w-3 h-3" />
            Not Legal Advice
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
