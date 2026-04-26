// CasesPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder, Plus, X, Trash2, CheckCircle, RefreshCw, BookOpen,
  Search, FileText, Scale, User, Briefcase, Calendar,
} from 'lucide-react';

/* ─────────────── Types ─────────────── */
interface CaseItem {
  id: number;
  case_number: string;
  title: string;
  description: string;
  status: string;
  case_type: string;
  client_name: string;
  priority: string;
  lawyer_name: string;
  created_at: string;
}

interface SectionItem {
  act_title: string;
  year: number;
  section: string;
  govt_system: string;
}

/* ─────────────── Badge helpers ─────────────── */
const priorityConfig: Record<string, { cls: string; label: string }> = {
  low:    { cls: 'bg-[#ecf7f1] text-[#006a4e]', label: 'Low' },
  medium: { cls: 'bg-[#fff8e1] text-[#f9a825]', label: 'Medium' },
  high:   { cls: 'bg-[#fdf2f3] text-[#f42a41]', label: 'High' },
  urgent: { cls: 'bg-[#fdf2f3] text-[#f42a41] font-black', label: 'Urgent' },
};
const statusConfig: Record<string, { cls: string; label: string }> = {
  open:     { cls: 'bg-[#ecf7f1] text-[#006a4e]', label: 'Open' },
  pending:  { cls: 'bg-[#fff8e1] text-[#f9a825]', label: 'Pending' },
  closed:   { cls: 'bg-stone-100 text-stone-500', label: 'Closed' },
  archived: { cls: 'bg-stone-100 text-stone-400', label: 'Archived' },
};

const Badge = ({ label, cls }: { label: string; cls: string }) => (
  <span className={`${cls} text-[10px] font-black uppercase tracking-widest rounded-full px-3 py-1`}>
    {label}
  </span>
);

/* ─────────────── Main component ─────────────── */
const CasesPage = () => {
  const { isLawyer } = useAuth();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', case_type: '',
    client_name: '', client_email: '', priority: 'medium',
  });

  // Dynamic act panel state
  const [actTitle, setActTitle] = useState<string>('বাংলাদেশ শ্রম আইন, ২০০৬');
  const [actYear, setActYear] = useState<number>(2006);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [actLoading, setActLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionItem | null>(null);
  const [actSearch, setActSearch] = useState('');
  const [showActPanel, setShowActPanel] = useState(true);

  // Load cases
  useEffect(() => { fetchCases(); }, []);

  const fetchCases = async () => {
    try {
      const r = await api.get('/cases');
      setCases(r.data.cases);
    } catch { toast.error('Failed to load cases.'); }
    finally { setIsLoading(false); }
  };

  // Load act sections
  const fetchActSections = useCallback(async () => {
    setActLoading(true);
    try {
      const res = await api.get('/acts/sections', {
        params: { act_title: actTitle, year: actYear },
      });
      setSections(res.data.sections || []);
      setSelectedSection(null);  // clear previous selection when act changes
    } catch {
      toast.error('Failed to load act sections.');
    } finally {
      setActLoading(false);
    }
  }, [actTitle, actYear]);

  useEffect(() => { fetchActSections(); }, [fetchActSections]);

  /* ─────── Case CRUD ─────── */
const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await api.post('/cases', formData);
      setCases(prev => [r.data.case, ...prev]);
      setShowForm(false);
      setFormData({ title: '', description: '', case_type: '', client_name: '', client_email: '', priority: 'medium' });
      toast.success('Case created.');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create case.');
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const r = await api.put(`/cases/${id}`, { status });
      setCases(prev => prev.map(c => c.id === id ? r.data.case : c));
      toast.success(`Marked as ${status}.`);
    } catch { toast.error('Update failed.'); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this case permanently?')) return;
    try {
      await api.delete(`/cases/${id}`);
      setCases(prev => prev.filter(c => c.id !== id));
      toast.success('Case deleted.');
    } catch { toast.error('Delete failed.'); }
  };

  // Filter sections
  const filteredSections = actSearch.trim()
    ? sections.filter(s =>
        s.section.toLowerCase().includes(actSearch.toLowerCase()) ||
        s.act_title.toLowerCase().includes(actSearch.toLowerCase())
      )
    : sections;

  return (
    <div className="min-h-[calc(100vh-66px)] bg-stone-50 font-manrope">
      {/* Header */}
      <div className="bg-[#006a4e] px-8 py-5 border-b-4 border-[#f42a41]">
        <div className="max-w-[1500px] mx-auto flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Legal Case Management</p>
            <h1 className="text-3xl font-black italic uppercase tracking-tight text-white flex items-center gap-3">
              <Folder className="w-7 h-7" /> Cases
            </h1>
            <p className="text-white/40 font-medium text-xs mt-1">
              {isLawyer ? 'Manage your assigned cases' : 'All cases — read‑only view'}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setShowActPanel(v => !v)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] ${
                showActPanel ? 'bg-white/10 text-white border-2 border-white/20' : 'bg-white/5 text-white/50 border-2 border-white/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {showActPanel ? 'Hide' : 'Show'} Act Reference
            </button>
            {isLawyer && (
              <button
                onClick={() => setShowForm(v => !v)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] ${
                  showForm ? 'bg-white/10 text-white border-2 border-white/20' : 'bg-[#f42a41] text-white border-2 border-[#f42a41]'
                }`}
              >
                {showForm ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Plus className="w-3.5 h-3.5" /> New Case</>}
              </button>
            )}
            <select
              value={`${actTitle}|${actYear}`}
              onChange={(e) => {
                const [title, year] = e.target.value.split('|');
                setActTitle(title);
                setActYear(Number(year));
              }}
              className="bg-white/10 text-white text-xs rounded-full px-3 py-2 border border-white/20 outline-none"
            >
              <option value="বাংলাদেশ শ্রম আইন, ২০০৬|2006">বাংলাদেশ শ্রম আইন, ২০০৬</option>
              <option value="বাংলাদেশ শ্রম বিধিমালা, ২০১৫|2015">বাংলাদেশ শ্রম বিধিমালা, ২০১৫</option>
              <option value="The Minimum Wages Ordinance, 1961|1961">Minimum Wages Ordinance, 1961</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1500px] mx-auto p-6 grid gap-6"
           style={{ gridTemplateColumns: showActPanel ? '1fr 400px' : '1fr', alignItems: 'start' }}>

        {/* ===== LEFT COLUMN ===== */}
        <div>
          {/* 🔹 Section Reference Banner 🔹 */}
          <AnimatePresence>
            {selectedSection && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl shadow-lg border border-[#006a4e]/20 p-6 mb-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#f42a41] bg-[#f42a41]/10 rounded-full px-2 py-0.5">
                        § {selectedSection.section.match(/^(\d+)\./)?.[1] || '—'}
                      </span>
                      <span className="text-[10px] font-bold text-[#006a4e] bg-[#ecf7f1] rounded-full px-2 py-0.5">
                        {selectedSection.govt_system}
                      </span>
                    </div>
                    <div className="border-l-4 border-[#f42a41] pl-4">
                      <p className="text-stone-700 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                        {selectedSection.section}
                      </p>
                    </div>
                    <p className="text-[10px] text-stone-400 font-medium mt-2">
                      {actTitle}, {actYear}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSection(null)}
                    className="text-stone-300 hover:text-stone-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create Case Form (unchanged) */}
          {/* ... (same as before) ... */}

          {/* Cases list */}
          {isLoading && (
            <div className="text-center py-16 text-stone-400">
              <div className="text-2xl font-black italic uppercase tracking-tight text-stone-300">Loading...</div>
            </div>
          )}

          {!isLoading && cases.length === 0 && (
            <div className="text-center py-20">
              <Folder className="w-16 h-16 text-[#006a4e]/15 mx-auto mb-4" />
              <p className="text-xl font-black italic uppercase tracking-tight text-stone-300">No cases yet</p>
              {isLawyer && <p className="text-sm text-stone-400 mt-2 font-medium">Click "New Case" to get started.</p>}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {cases.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-3xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all p-6 flex justify-between items-start gap-4 border border-stone-100"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <h3 className="font-black italic uppercase tracking-tight text-[#1a2f23] text-lg truncate max-w-sm">
                      {c.title}
                    </h3>
                    <Badge label={statusConfig[c.status]?.label || c.status} cls={statusConfig[c.status]?.cls || 'bg-stone-100 text-stone-500'} />
                    <Badge label={priorityConfig[c.priority]?.label || c.priority} cls={priorityConfig[c.priority]?.cls || 'bg-stone-100 text-stone-400'} />
                  </div>
                  <div className="flex gap-4 flex-wrap mb-3 text-xs text-stone-400 font-bold">
                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{c.case_number}</span>
                    {c.case_type && <span className="flex items-center gap-1"><Scale className="w-3.5 h-3.5" />{c.case_type}</span>}
                    {c.client_name && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{c.client_name}</span>}
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{c.lawyer_name}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(c.created_at).toLocaleDateString('en-GB')}</span>
                  </div>
                  {c.description && (
                    <p className="text-xs text-stone-400 font-medium leading-relaxed">
                      {c.description.length > 130 ? c.description.slice(0, 130) + '…' : c.description}
                    </p>
                  )}
                </div>

                {isLawyer && (
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {c.status === 'open' && (
                      <button
                        onClick={() => handleStatusChange(c.id, 'closed')}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ecf7f1] text-[#006a4e] hover:scale-110 transition-all"
                        title="Close case"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {c.status === 'closed' && (
                      <button
                        onClick={() => handleStatusChange(c.id, 'open')}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:scale-110 transition-all"
                        title="Reopen case"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-[#fdf2f3] text-[#f42a41] hover:scale-110 transition-all"
                      title="Delete case"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* ===== RIGHT COLUMN: Dynamic Act Panel ===== */}
        {showActPanel && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1a2f23] rounded-[40px] overflow-hidden shadow-2xl shadow-green-900/30 sticky top-20 max-h-[calc(100vh-110px)] flex flex-col"
          >
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Act Section Reference</p>
                  <div className="text-white font-black italic uppercase tracking-tight text-sm">
                    {actTitle} ({actYear})
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2.5 border border-white/10">
                <Search className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                <input
                  value={actSearch}
                  onChange={e => setActSearch(e.target.value)}
                  placeholder="Search sections..."
                  className="flex-1 bg-transparent outline-none text-white text-xs font-medium placeholder:text-white/30"
                />
                {actSearch && (
                  <button onClick={() => setActSearch('')} className="text-white/30 hover:text-white/60">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Sections list */}
            {actLoading ? (
              <div className="flex-1 flex items-center justify-center text-white/40">Loading sections…</div>
            ) : (
              <div className="flex-1 overflow-y-auto p-3">
                {filteredSections.length === 0 ? (
                  <p className="text-center text-white/30 text-xs font-medium py-8">No sections found.</p>
                ) : (
                  filteredSections.map((s, i) => {
                    const secNum = s.section.match(/^(\d+)\./)?.[1] || i;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedSection(s)}
                        className={`w-full text-left p-3 border-b border-white/5 hover:bg-white/5 transition-all rounded-2xl ${
                          selectedSection === s ? 'bg-[#006a4e]/30 border-l-4 border-[#f42a41]' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#f42a41] bg-[#f42a41]/10 rounded-full px-2 py-0.5">
                            § {secNum}
                          </span>
                          <span className="text-[10px] text-white/30 font-medium">{s.govt_system}</span>
                        </div>
                        <div className="text-xs font-bold text-white/80 line-clamp-2">
                          {s.section}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            <div className="p-3 border-t border-white/5">
              <p className="text-[10px] text-white/20 font-medium">Data from context_legal_dataset</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CasesPage;
