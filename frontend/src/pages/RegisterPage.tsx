import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, ArrowRight, Mail, Lock, User, Briefcase, Hash, BookOpen, Building2, ArrowLeft } from 'lucide-react';

// MOVED OUTSIDE: PillInput is now an independent component
const PillInput = ({ 
  icon: Icon, 
  name, 
  type = 'text', 
  value, 
  placeholder, 
  onChange, 
  required = false 
}: {
  icon: any; 
  name: string; 
  type?: string; 
  value: string; 
  placeholder: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => (
  <div className="flex items-center gap-3 bg-stone-100 rounded-full border-2 border-stone-200 focus-within:border-[#006a4e] transition-all px-5 py-3.5">
    <Icon className="w-4 h-4 text-stone-400 flex-shrink-0" />
    <input 
      type={type} 
      name={name} 
      value={value} 
      onChange={onChange} 
      required={required} 
      placeholder={placeholder} 
      className="flex-1 bg-transparent outline-none text-[#1a2f23] font-medium placeholder:text-stone-400 text-sm" 
    />
  </div>
);

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '', password: '', full_name: '',
    role: 'lawyer' as 'lawyer' | 'worker',
    bar_number: '', specialization: '', department: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData);
      toast.success('Account created. Welcome.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed.');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-lg">

        {/* ✅ BACK TO HOME LINK */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-[#006a4e] transition-colors font-black uppercase tracking-widest text-[10px] mb-6 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#006a4e] flex items-center justify-center"><Scale className="w-5 h-5 text-white" /></div>
            <span className="font-black italic uppercase tracking-tight text-[#006a4e] text-xl">LegalInfo BD</span>
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tight text-[#1a2f23]">Create Account</h1>
          <p className="text-stone-500 font-medium text-sm mt-1">Join the Legal Information System</p>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl shadow-green-900/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-2">Full Name</label>
              <PillInput icon={User} name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Your full name" required />
            </div>
            
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-2">Email</label>
              <PillInput icon={Mail} name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@lawfirm.com" required />
            </div>
            
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-2">Password</label>
              <PillInput icon={Lock} name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" required />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-3">Select Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setFormData({ ...formData, role: 'lawyer' })}
                  className={`rounded-3xl p-5 text-left border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    formData.role === 'lawyer' ? 'bg-[#ecf7f1] border-[#006a4e] shadow-lg shadow-green-900/10' : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                  }`}>
                  <Briefcase className={`w-6 h-6 mb-2 ${formData.role === 'lawyer' ? 'text-[#006a4e]' : 'text-stone-400'}`} />
                  <div className={`font-black text-sm uppercase tracking-tight ${formData.role === 'lawyer' ? 'text-[#006a4e]' : 'text-stone-500'}`}>Lawyer</div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">Legal Professional</div>
                </button>
                <button type="button" onClick={() => setFormData({ ...formData, role: 'worker' })}
                  className={`rounded-3xl p-5 text-left border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    formData.role === 'worker' ? 'bg-[#fff8e1] border-[#f9a825] shadow-lg shadow-yellow-900/10' : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                  }`}>
                  <User className={`w-6 h-6 mb-2 ${formData.role === 'worker' ? 'text-[#f9a825]' : 'text-stone-400'}`} />
                  <div className={`font-black text-sm uppercase tracking-tight ${formData.role === 'worker' ? 'text-[#c8860b]' : 'text-stone-500'}`}>Worker</div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">Staff / Employee</div>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {formData.role === 'lawyer' && (
                <motion.div key="lawyer-fields" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-2">Bar Number</label>
                    <PillInput icon={Hash} name="bar_number" value={formData.bar_number} onChange={handleChange} placeholder="BAR-2025-001" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-2">Specialization</label>
                    <PillInput icon={BookOpen} name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Labour Law" />
                  </div>
                </motion.div>
              )}
              {formData.role === 'worker' && (
                <motion.div key="worker-fields" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-2">Department</label>
                  <PillInput icon={Building2} name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Paralegal, Admin" />
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#006a4e] text-white font-black italic uppercase tracking-tight rounded-full py-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 mt-2">
              {isLoading ? 'Creating Account...' : (<><ArrowRight className="w-4 h-4" /> Create Account</>)}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-stone-500 font-medium text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#006a4e] font-black hover:text-[#f42a41] transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
