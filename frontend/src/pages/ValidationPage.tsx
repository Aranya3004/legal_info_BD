import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Flag, Edit3, AlertTriangle, Scale, ChevronRight, Zap } from 'lucide-react';

interface PendingItem {
  id: number;
  question: string;
  aiAnswer: string;
  citation: string;
  askedAt: string;
  status: 'pending' | 'validated' | 'flagged';
  flagComment?: string;
}

const MOCK_QUEUE: PendingItem[] = [
  {
    id: 1,
    question: 'What are the legal limits for overtime work for garment workers in Dhaka export zones?',
    aiAnswer: 'Based on the Bangladesh Labour Act 2006, specifically Section 100 and Section 108: No adult worker shall ordinarily be required to work more than eight hours in any day. However, they may work up to ten hours subject to Section 108. For garment workers in export zones, total working hours inclusive of overtime cannot exceed 60 hours in a week, and the average must not exceed 56 hours per week over a year. Where a worker works overtime, they are entitled to wages at twice the ordinary rate of basic wages and dearness allowance.',
    citation: 'Sections 100, 108 — Bangladesh Labour Act 2006',
    askedAt: '2 minutes ago',
    status: 'pending',
  },
  {
    id: 2,
    question: 'কতদিনের মাতৃত্বকালীন ছুটি পাওয়ার অধিকার আছে? (How many days of maternity leave am I entitled to?)',
    aiAnswer: 'বাংলাদেশ শ্রম আইন ২০০৬ এর ৪৬ ও ৫০ ধারা অনুযায়ী, একজন মহিলা শ্রমিক মোট ষোল (১৬) সপ্তাহের মাতৃত্বকালীন ছুটির অধিকারী। এর মধ্যে ৮ সপ্তাহ প্রসবের আগে এবং ৮ সপ্তাহ প্রসবের পরে ব্যবহার করা যাবে।',
    citation: 'Sections 46, 47, 50 — Bangladesh Labour Act 2006',
    askedAt: '1 hour ago',
    status: 'pending',
  },
  {
    id: 3,
    question: 'What is the minimum notice period required before termination?',
    aiAnswer: 'Under Section 26 of the Bangladesh Labour Act 2006, no employer shall dismiss or terminate the services of a permanent worker without giving written notice. The notice period is 120 days for monthly rated workers and 60 days for workers rated otherwise. Alternatively, the employer may pay wages in lieu of notice for the applicable period.',
    citation: 'Section 26 — Bangladesh Labour Act 2006',
    askedAt: '3 hours ago',
    status: 'validated',
  },
  {
    id: 4,
    question: 'Am I entitled to gratuity after 2 years of service?',
    aiAnswer: 'Yes. Under Section 52 of the Bangladesh Labour Act 2006, any worker who has completed at least one year of continuous service is entitled to gratuity at the rate of 30 days wages for every completed year of service. After 2 years, you would be entitled to 60 days wages as gratuity.',
    citation: 'Section 52 — Bangladesh Labour Act 2006',
    askedAt: 'Yesterday',
    status: 'flagged',
    flagComment: 'Need to verify if this applies to informal sector workers.',
  },
];

const ValidationPage = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState<PendingItem[]>(MOCK_QUEUE);
  const [activeId, setActiveId] = useState<number>(MOCK_QUEUE[0].id);
  const [flagComment, setFlagComment] = useState('');
  const [showFlagInput, setShowFlagInput] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'validated' | 'flagged'>('all');

  const activeItem = queue.find(q => q.id === activeId);

  const handleValidate = (id: number) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'validated' } : q));
    toast.success('Response validated and marked as verified.');
    setShowFlagInput(false);
  };

  const handleFlag = (id: number) => {
    if (!flagComment.trim()) {
      toast.error('Please add a comment explaining the issue.');
      return;
    }
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'flagged', flagComment } : q));
    toast('Response flagged for correction.', { icon: '🚩' });
    setFlagComment('');
    setShowFlagInput(false);
  };

  const filteredQueue = queue.filter(q => filter === 'all' || q.status === filter);

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending:   'bg-[#fff8e1] text-[#f9a825] border-[#f9a825]/30',
      validated: 'bg-[#ecf7f1] text-[#006a4e] border-[#006a4e]/30',
      flagged:   'bg-[#fdf2f3] text-[#f42a41] border-[#f42a41]/30',
    };
    const labels: Record<string, string> = {
      pending: 'Pending',
      validated: 'Validated',
      flagged: 'Flagged',
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-[calc(100vh-66px)] bg-stone-50 font-manrope">
      {/* Header */}
      <div className="bg-[#006a4e] px-8 py-6 border-b-2 border-[#f42a41]">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#f9a825] mb-1">
            Workspace: ARCH-BLL-2024-{user?.id || '001'}
          </p>
          <h1 className="font-garamond italic font-black uppercase tracking-tight text-3xl text-white">
            Response Validation Pipeline
          </h1>
          <p className="text-white/60 text-sm font-medium mt-1 italic">
            Human expert validation is mandatory before AI interpretations can be cited in official documents.
          </p>
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="max-w-[1400px] mx-auto mt-6 px-6">
        <div className="bg-[#fdf2f3] border-l-4 border-[#f42a41] rounded-3xl px-5 py-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#f42a41] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#f42a41] mb-1">
              Confidential Judicial Disclosure
            </p>
            <p className="text-sm text-stone-700 font-medium">
              AI-generated responses are preliminary drafts based on RAG protocols. <strong>Human expert validation is mandatory</strong> before these can be cited in official judicial documents or legal filings.
            </p>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-6">
        {/* Left workspace */}
        <div className="space-y-6">
          {activeItem ? (
            <>
              {/* Query context */}
              <div className="bg-stone-100 rounded-3xl p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3">User Query Context</p>
                <p className="font-garamond italic font-bold text-xl md:text-2xl text-[#1a2f23] leading-relaxed">
                  "{activeItem.question}"
                </p>
              </div>

              {/* AI Response */}
              <div className="bg-white rounded-[40px] shadow-xl shadow-red-900/10 border-t-4 border-[#f42a41] p-6 md:p-8 relative">
                <span className="absolute -top-4 left-8 px-4 py-1.5 bg-[#fff8e1] text-[#f9a825] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#f9a825]/30">
                  ⚡ Awaiting Validation
                </span>
                <div className="mt-3 text-stone-700 font-medium leading-relaxed space-y-3">
                  {activeItem.aiAnswer.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                </div>
                <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1.5">Legal Citation</p>
                    <div className="bg-[#ecf7f1] rounded-2xl px-4 py-2.5 flex items-center gap-2 w-fit">
                      <Scale className="w-4 h-4 text-[#006a4e]" />
                      <span className="font-black text-[#006a4e] text-sm">{activeItem.citation}</span>
                    </div>
                  </div>
                  <div className="ml-auto">{statusBadge(activeItem.status)}</div>
                </div>
              </div>

              {/* Flag comment if flagged */}
              {activeItem.status === 'flagged' && activeItem.flagComment && (
                <div className="bg-[#fdf2f3] rounded-3xl border border-[#f42a41]/30 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Flag className="w-4 h-4 text-[#f42a41]" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#f42a41]">Flag Comment</p>
                  </div>
                  <p className="text-stone-700 font-medium">{activeItem.flagComment}</p>
                </div>
              )}

              {/* Action buttons */}
              {activeItem.status === 'pending' && (
                <div className="flex flex-wrap gap-3">
                  <motion.button whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }}
                    onClick={() => handleValidate(activeItem.id)}
                    className="px-6 py-3 bg-[#006a4e] text-white rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-green-900/20"
                  >
                    <CheckCircle className="w-4 h-4" /> Validate Response
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-stone-100 text-stone-600 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-stone-200"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Draft
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.98 }}
                    onClick={() => setShowFlagInput(v => !v)}
                    className="px-6 py-3 bg-[#fdf2f3] text-[#f42a41] rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2 border border-[#f42a41]/30 hover:bg-[#f42a41] hover:text-white transition-all"
                  >
                    <Flag className="w-4 h-4" /> Flag Inaccuracy
                  </motion.button>
                </div>
              )}

              {/* Flag input */}
              <AnimatePresence>
                {showFlagInput && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-3xl shadow-lg shadow-red-900/5 p-5 border border-[#f42a41]/20"
                  >
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#f42a41] mb-3">
                      Describe the inaccuracy
                    </label>
                    <div className="bg-stone-100 rounded-3xl border-2 border-stone-200 focus-within:border-[#f42a41] transition-all px-5 py-3.5 mb-4">
                      <textarea value={flagComment} onChange={e => setFlagComment(e.target.value)}
                        placeholder="e.g. This does not account for EPZ-specific regulations..."
                        rows={3}
                        className="w-full bg-transparent border-none outline-none resize-none text-stone-700 placeholder-stone-400 font-medium text-sm"
                      />
                    </div>
                    <div className="flex gap-3">
                      <motion.button whileTap={{ scale: 0.98 }}
                        onClick={() => handleFlag(activeItem.id)}
                        className="px-6 py-2.5 bg-[#f42a41] text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-[#e01830] transition-all"
                      >
                        Submit Flag
                      </motion.button>
                      <button onClick={() => { setShowFlagInput(false); setFlagComment(''); }}
                        className="px-6 py-2.5 bg-stone-100 rounded-full font-bold text-stone-500 text-xs hover:bg-stone-200 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Source citations */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3">Source Citations &amp; RAG Evidence</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { section: 'Section 100', excerpt: 'No adult worker shall ordinarily be required or allowed to work... more than eight hours...' },
                    { section: 'Section 108', excerpt: 'Where a worker works for more than the hours limited, he shall be entitled to wages at twice the ordinary rate...' },
                  ].map((cite, i) => (
                    <div key={i} className="bg-stone-50 rounded-3xl p-4 hover:bg-[#ecf7f1] transition-colors cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-black text-[#f42a41] uppercase tracking-wider">{cite.section}</span>
                        <ChevronRight className="w-4 h-4 text-[#006a4e]" />
                      </div>
                      <p className="text-xs text-stone-500 italic font-medium">"{cite.excerpt}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-20 text-stone-400 font-medium">
              No item selected.
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'validated', 'flagged'] as const).map(f => (
              <motion.button key={f} whileTap={{ scale: 0.95 }} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
                  filter === f
                    ? 'bg-[#006a4e] text-white border-[#006a4e] shadow-md shadow-green-900/20'
                    : 'bg-stone-100 text-stone-500 border-stone-200 hover:border-stone-300'
                }`}
              >
                {f}
              </motion.button>
            ))}
          </div>

          <div className="bg-white rounded-[40px] shadow-xl shadow-green-900/5 overflow-hidden border border-stone-100">
            <h3 className="px-5 py-4 font-garamond italic font-black text-xl text-[#1a2f23] border-b border-stone-100">
              Validation Queue
            </h3>
            <div className="max-h-96 overflow-y-auto">
              {filteredQueue.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveId(item.id); setShowFlagInput(false); }}
                  className={`w-full text-left p-4 border-b border-stone-50 transition-all border-l-4 ${
                    activeId === item.id
                      ? 'bg-[#ecf7f1] border-[#006a4e]'
                      : 'hover:bg-stone-50 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    {activeId === item.id && (
                      <span className="text-[10px] font-black text-[#006a4e] uppercase tracking-widest">Active</span>
                    )}
                    <span className="ml-auto">{statusBadge(item.status)}</span>
                  </div>
                  <p className="text-sm font-bold text-[#1a2f23] leading-snug line-clamp-2 mb-1">
                    {item.question}
                  </p>
                  <p className="text-xs text-stone-400 font-medium">{item.askedAt}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#006a4e] rounded-3xl p-5 flex items-center gap-4 shadow-lg shadow-green-900/20">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="font-black text-white text-lg font-garamond italic">
                {user?.full_name?.charAt(0) || '?'}
              </span>
            </div>
            <div>
              <p className="font-bold text-white">{user?.full_name}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#f9a825]">Senior Legal Validator</p>
            </div>
          </div>

          <div className="bg-[#1a2f23] rounded-3xl p-5 space-y-3">
            <Zap className="w-6 h-6 text-[#f9a825]" />
            <h4 className="font-black italic uppercase tracking-tight text-white text-xl leading-tight">Refine for Court</h4>
            <p className="text-white/60 text-sm font-medium leading-relaxed">
              Convert this validation to formal judicial citation format.
            </p>
            <motion.button whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }}
              className="w-full py-3 bg-[#f9a825] text-[#1a2f23] rounded-full text-sm font-black uppercase tracking-widest transition-all hover:bg-[#ffb833]"
            >
              Generate Citation
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationPage;