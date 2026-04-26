import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Scale, ChevronRight, Building2, Handshake, Mountain } from 'lucide-react';

type ModalContent = {
  title: string;
  year?: string;
  govContext?: string;
  legalContext?: string;
};

const HeroPage = () => {
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  // ---- 1. VIEW PROTOCOL (Heat Protection Protocol) ----
  const handleViewProtocol = () => {
    setModalContent({
      title: 'Heat Protection Protocol 2024',
      year: '2024',
      govContext:
        'The Government of Bangladesh introduced mandatory heat protection measures for industrial workers following record temperatures in 2024. The Ministry of Labour and Employment issued directives to all factory owners.',
      legalContext:
        'Under the Bangladesh Labour Act 2006, employers are legally obligated to provide safe working conditions. The Heat Protection Protocol 2024 extends these obligations to include mandatory rest periods every 2 hours, free hydration stations, and shaded rest areas for outdoor workers during temperatures exceeding 38°C.',
    });
  };

  // ---- 2. SYLHET HILLS SPECIAL ACT ----
  const handleSylhetAct = () => {
    setModalContent({
      title: 'Sylhet Hills Special Act',
      year: '1962',
      govContext:
        'During the Pakistani administration period, the Sylhet Hills region required special governance due to its unique tea garden economy and tribal land ownership traditions inherited from British colonial rule.',
      legalContext:
        'The Sylhet Hills Special Act governs land rights, labor conditions, and taxation specifically for tea garden workers in the greater Sylhet region. It provides special protections for TCA (Tea Companies Association) garden laborers including housing rights, medical allowances, and minimum wage guarantees distinct from the general labour law.',
    });
  };

  // ---- 3. CHECK ELIGIBILITY ----
  const handleCheckEligibility = () => {
    setModalContent({
      title: 'Wage Adjustment Eligibility',
      year: '2024',
      govContext:
        'The Bangladesh Government proposed a 12% wage adjustment for the textile sector starting Q3 2024, affecting over 4 million garment workers nationwide.',
      legalContext:
        'Under the Minimum Wages Ordinance 1961 and the Bangladesh Labour Act 2006, all registered textile workers are eligible for the adjustment. Criteria include: active employment for at least 6 months, registration with a licensed factory, and membership in an approved workers union or direct employment contract.',
    });
  };

  const closeModal = () => setModalContent(null);

  return (
    <div className="min-h-screen bg-stone-50 font-manrope overflow-x-hidden">
      {/* ---- HEADER ---- */}
      <header className="bg-[#006a4e] border-b-4 border-[#f42a41] px-6 md:px-10 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-white no-underline">
            <div className="w-9 h-9 bg-[#f42a41] rounded-full flex items-center justify-center">
              <Scale className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-garamond italic font-black text-xl tracking-tight">LegalInfo BD</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest text-xs px-5 py-2.5 rounded-full border border-white/20 transition-all hover:scale-105"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-[#f42a41] text-white font-black uppercase tracking-widest text-xs px-5 py-2.5 rounded-full hover:bg-[#e01830] hover:scale-105 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* ---- HERO ---- */}
      <section className="text-center px-6 pt-20 pb-12 md:pt-28 md:pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-oswald font-black text-6xl md:text-7xl lg:text-8xl uppercase tracking-tighter text-[#1a2f23] leading-[1]"
        >
          EMPOWERING
          <br />
          YOUR <span className="text-[#f42a41] italic">RIGHTS</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 max-w-md mx-auto text-stone-500 font-medium"
        >
          Access authoritative legal guidance for the Bangladeshi workforce with total confidence and safety.
        </motion.p>
      </section>

      {/* ---- BENTO CARDS GRID ---- */}
      <div className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-4 gap-5 auto-rows-auto">

        {/* Main Green Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.01 }}
          className="lg:col-span-3 bg-[#006a4e] rounded-3xl p-6 md:p-8 relative overflow-hidden text-white shadow-2xl shadow-green-900/20"
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full border-[30px] border-white/10" />
          <div className="absolute bottom-[-60px] right-10 w-40 h-40 rounded-full border-[20px] border-white/5" />
          <div className="relative z-10">
            <div className="flex gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-widest">TRENDING</span>
              <span className="px-3 py-1 rounded-full bg-[#f42a41] text-[10px] font-black uppercase tracking-widest">NEW LAW</span>
            </div>
            <h2 className="font-oswald font-black text-3xl md:text-4xl italic leading-tight">
              Heat Protection<br />Protocol 2024
            </h2>
            <p className="mt-3 text-white/80 text-sm font-medium max-w-sm">
              New mandatory rest periods and safety hydration requirements for industrial workers during extreme heat.
            </p>
            <motion.button
              onClick={handleViewProtocol}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 border-2 border-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-white/15 transition-colors"
            >
              View Protocol <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Live Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-3xl p-5 shadow-lg border border-stone-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1a2f23]">Live Overview</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#006a4e] bg-[#ecf7f1] px-2 py-0.5 rounded-full">UPDATED</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ecf7f1] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#006a4e]" />
              </div>
              <div>
                <div className="font-oswald font-bold text-2xl text-[#1a2f23]">1.4k</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-stone-400">Active Cases</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ecf7f1] flex items-center justify-center">
                <Handshake className="w-5 h-5 text-[#006a4e]" />
              </div>
              <div>
                <div className="font-oswald font-bold text-2xl text-[#1a2f23]">98%</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-stone-400">Success Rate</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ecf7f1] flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#006a4e]" />
              </div>
              <div>
                <div className="font-oswald font-bold text-2xl text-[#1a2f23]">64</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-stone-400">Districts</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Yellow Card – Sylhet Act */}
        <motion.div
          onClick={handleSylhetAct}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="bg-[#f9a825] rounded-3xl p-5 flex items-start gap-4 cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-black/10 flex items-center justify-center flex-shrink-0">
            <Mountain className="w-5 h-5 text-[#1a2f23]" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-black/50 mb-1">TCA Gardens Law</div>
            <h3 className="font-oswald font-bold text-lg leading-tight text-[#1a2f23]">
              Sylhet Hills<br />Special Act
            </h3>
          </div>
        </motion.div>

        {/* Free Consult */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          whileHover={{ scale: 1.02 }}
          className="lg:col-span-2 bg-white border-2 border-stone-200 rounded-3xl p-5"
        >
          <div className="text-xs font-black uppercase tracking-widest text-[#006a4e] mb-2">Legal Heart</div>
          <h3 className="font-oswald font-black text-2xl leading-tight text-[#1a2f23]">
            100% Free<br />Consultation
          </h3>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-stone-400">
            Available everywhere in Bangladesh
          </p>
        </motion.div>

        {/* Wage Update Red Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          className="bg-[#f42a41] rounded-3xl p-5 text-white flex flex-col"
        >
          <h3 className="font-oswald font-black italic text-xl">Wage Update</h3>
          <p className="mt-2 text-sm text-white/90 font-medium flex-1">
            Proposed 12% textile sector wage adjustment starting Q3 2024.
          </p>
          <motion.button
            onClick={handleCheckEligibility}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 w-full py-3 bg-white text-[#f42a41] rounded-xl font-black uppercase tracking-widest text-xs hover:bg-stone-100 transition-colors"
          >
            Check Eligibility
          </motion.button>
        </motion.div>
      </div>

      {/* ---- MODAL ---- */}
      {modalContent && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-[#1a2f23] mb-4">{modalContent.title}</h2>

            {modalContent.year && (
              <p className="text-sm text-stone-500 mb-3">
                <strong className="text-[#1a2f23]">Year:</strong> {modalContent.year}
              </p>
            )}
            {modalContent.govContext && (
              <div className="mt-3 p-4 bg-[#ecf7f1] rounded-xl">
                <p className="text-xs font-black uppercase tracking-widest text-[#006a4e] mb-1">Government Context</p>
                <p className="text-sm text-stone-700">{modalContent.govContext}</p>
              </div>
            )}
            {modalContent.legalContext && (
              <div className="mt-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-xs font-black uppercase tracking-widest text-stone-400 mb-1">Legal Context</p>
                <p className="text-sm text-stone-700">{modalContent.legalContext}</p>
              </div>
            )}

            <button
              onClick={closeModal}
              className="mt-6 w-full bg-[#006a4e] text-white py-2 rounded-lg font-bold hover:bg-[#004d3a] transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HeroPage;