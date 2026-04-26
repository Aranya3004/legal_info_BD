import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Bot, FolderOpen, BookOpen, CheckSquare, Info, ArrowRight } from 'lucide-react';

const popularQuestions = [
  { en: 'What is the legal overtime rate?', bn: 'আইনি ওভারটাইম রেট কত?', section: 'Section 108' },
  { en: 'How many days of maternity leave am I entitled to?', bn: 'মাতৃত্বকালীন ছুটি কতদিন?', section: 'Section 46' },
  { en: 'What is the minimum notice period for termination?', bn: 'চাকরি ছাঁটাইয়ের নোটিশ কতদিন?', section: 'Section 26' },
  { en: 'What are my rights regarding gratuity?', bn: 'গ্র্যাচুইটির অধিকার কী?', section: 'Section 52' },
  { en: 'Maximum working hours per week?', bn: 'সপ্তাহে সর্বোচ্চ কতঘণ্টা কাজ?', section: 'Section 100' },
  { en: 'Can my employer deduct wages without reason?', bn: 'কারণ ছাড়া বেতন কাটা যাবে?', section: 'Section 125' },
];

const DashboardPage = () => {
  const { user, isLawyer } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-66px)] bg-stone-50 font-manrope">
      {/* Unified Header */}
      <div className="bg-[#006a4e] px-8 py-6 border-b-4 border-[#f42a41]">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
            LegalInfo BD · Bangladesh Labour Act 2006
          </p>
          <h1 className="font-garamond italic font-black text-3xl text-white tracking-tight">
            Welcome back, <span className="text-[#f9a825]">{user?.full_name}</span>
          </h1>
          <p className="text-white/60 text-sm font-medium mt-1">
            {isLawyer
              ? 'Access AI legal research, manage cases, and validate responses.'
              : 'Browse cases and explore the Bangladesh Labour Act 2006.'}
          </p>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-12 gap-6 px-6 py-8 max-w-[1400px] mx-auto">
        {isLawyer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            onClick={() => navigate('/ai-chat')}
            className="col-span-12 md:col-span-5 bg-[#006a4e] rounded-[40px] p-8 shadow-2xl shadow-green-900/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group"
          >
            <div className="bg-white/10 rounded-2xl p-3 w-fit mb-5">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-black italic uppercase tracking-tight text-white text-2xl mb-2">
              AI Legal Assistant
            </h3>
            <p className="text-white/60 font-medium text-sm leading-relaxed mb-6">
              Chat with Claude AI. Get research, drafts, and case strategy instantly.
            </p>
            <div className="flex items-center gap-2 text-white/60 font-black text-xs uppercase tracking-widest group-hover:text-white transition-colors">
              Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate('/cases')}
          className="col-span-12 md:col-span-4 bg-white rounded-[40px] border-2 border-stone-100 shadow-lg p-8 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all hover:border-[#006a4e]/30 group"
        >
          <div className="bg-[#ecf7f1] rounded-2xl p-3 w-fit mb-5">
            <FolderOpen className="w-7 h-7 text-[#006a4e]" />
          </div>
          <h3 className="font-black italic uppercase tracking-tight text-[#1a2f23] text-2xl mb-2">
            Cases
          </h3>
          <p className="text-stone-500 font-medium text-sm leading-relaxed mb-6">
            {isLawyer ? 'Manage your assigned cases and track progress.' : 'View all cases in the system.'}
          </p>
          <div className="flex items-center gap-2 text-stone-400 font-black text-xs uppercase tracking-widest group-hover:text-[#006a4e] transition-colors">
            Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => navigate('/labor-law')}
          className="col-span-12 md:col-span-3 bg-[#f9a825] rounded-[40px] p-8 shadow-xl shadow-yellow-900/10 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group"
        >
          <div className="bg-white/20 rounded-2xl p-3 w-fit mb-5">
            <BookOpen className="w-7 h-7 text-[#1a2f23]" />
          </div>
          <h3 className="font-black italic uppercase tracking-tight text-[#1a2f23] text-2xl mb-2">
            Labour Act
          </h3>
          <p className="text-[#1a2f23]/60 font-medium text-sm leading-relaxed mb-6">
            Browse all 350+ sections. Keyword search with highlighting.
          </p>
          <div className="flex items-center gap-2 text-[#1a2f23]/60 font-black text-xs uppercase tracking-widest group-hover:text-[#1a2f23] transition-colors">
            Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>

        {isLawyer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/validation')}
            className="col-span-12 md:col-span-4 bg-white rounded-[40px] border-2 border-stone-100 shadow-lg p-8 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all hover:border-[#f42a41]/30 group"
          >
            <div className="bg-[#fdf2f3] rounded-2xl p-3 w-fit mb-5">
              <CheckSquare className="w-7 h-7 text-[#f42a41]" />
            </div>
            <h3 className="font-black italic uppercase tracking-tight text-[#1a2f23] text-2xl mb-2">
              Validation Panel
            </h3>
            <p className="text-stone-500 font-medium text-sm leading-relaxed mb-6">
              Review AI-generated answers. Validate or flag for correction.
            </p>
            <div className="flex items-center gap-2 text-stone-400 font-black text-xs uppercase tracking-widest group-hover:text-[#f42a41] transition-colors">
              Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        )}

        {!isLawyer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 md:col-span-4 bg-[#fdf2f3] rounded-[40px] border-2 border-[#f42a41]/20 p-8"
          >
            <div className="bg-[#f42a41]/10 rounded-2xl p-3 w-fit mb-5">
              <Info className="w-7 h-7 text-[#f42a41]" />
            </div>
            <h3 className="font-black italic uppercase tracking-tight text-[#1a2f23] text-2xl mb-2">
              AI Features
            </h3>
            <p className="text-stone-500 font-medium text-sm leading-relaxed">
              AI Legal Chat is available to Lawyers only. Contact your supervisor for elevated access.
            </p>
          </motion.div>
        )}
      </div>

      {/* Popular Questions */}
      <div className="px-6 pb-8 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-[#f42a41] rounded-full text-[10px] font-black uppercase tracking-widest text-white px-4 py-1.5">
            Popular
          </span>
          <div className="flex-1 h-px bg-stone-200" />
          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
            Bangladesh Labour Act 2006
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularQuestions.map((q, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              onClick={() => navigate('/ai-chat', { state: { question: q.en } })}
              className="bg-white rounded-3xl border-2 border-stone-100 p-5 text-left hover:border-[#006a4e] hover:bg-[#ecf7f1] hover:scale-[1.01] transition-all group"
            >
              <p className="font-bold text-[#1a2f23] text-sm mb-1">{q.en}</p>
              <p className="text-stone-400 font-medium text-xs mb-3">{q.bn}</p>
              <span className="bg-[#ecf7f1] text-[#006a4e] text-[10px] font-black rounded-full px-2 py-0.5">
                {q.section}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;