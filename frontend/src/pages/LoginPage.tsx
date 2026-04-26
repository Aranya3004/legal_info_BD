import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { Scale, ArrowRight, Mail, Lock, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success('Welcome back.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-stone-50">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#006a4e] p-12 relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-20 -right-10 w-64 h-64 rounded-full bg-[#f42a41]/10 pointer-events-none" />
        <div className="absolute -top-10 left-1/3 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Scale className="w-5 h-5 text-white" /></div>
          <span className="text-white font-black italic uppercase tracking-tight text-lg">LegalInfo BD</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Bangladesh Labour Act 2006</p>
          <h1 className="text-5xl xl:text-6xl font-black italic uppercase tracking-tight text-white leading-none mb-6">
            Deciphering<br /><span className="text-[#f9a825]">the Law</span><br />for every<br />citizen.
          </h1>
          <p className="text-white/50 font-medium text-sm max-w-xs leading-relaxed">AI-powered, citation-verified, bilingual legal guidance — built for Bangladesh.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="relative z-10 grid grid-cols-3 gap-4">
          {[['350+', 'Sections'], ['2006', 'Labour Act'], ['Bilingual', 'BN / EN']].map(([val, label]) => (
            <div key={label} className="bg-white/10 rounded-3xl p-4 backdrop-blur-sm">
              <div className="text-[#f9a825] font-black italic text-2xl uppercase">{val}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-stone-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="w-full max-w-md">

          {/* ✅ BACK TO HOME LINK */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-stone-400 hover:text-[#006a4e] transition-colors font-black uppercase tracking-widest text-[10px] mb-8 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Scale className="w-6 h-6 text-[#006a4e]" />
            <span className="font-black italic uppercase text-[#006a4e] tracking-tight">LegalInfo BD</span>
          </div>

          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Welcome back</p>
            <h2 className="text-4xl font-black italic uppercase tracking-tight text-[#1a2f23]">Sign In</h2>
            <p className="text-stone-500 font-medium mt-2">Access your legal workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-2">Email Address</label>
              <div className="flex items-center gap-3 bg-stone-100 rounded-full border-2 border-stone-200 focus-within:border-[#006a4e] transition-all px-5 py-3.5">
                <Mail className="w-4 h-4 text-stone-400 flex-shrink-0" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@lawfirm.com" className="flex-1 bg-transparent outline-none text-[#1a2f23] font-medium placeholder:text-stone-400 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-2">Password</label>
              <div className="flex items-center gap-3 bg-stone-100 rounded-full border-2 border-stone-200 focus-within:border-[#006a4e] transition-all px-5 py-3.5">
                <Lock className="w-4 h-4 text-stone-400 flex-shrink-0" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="flex-1 bg-transparent outline-none text-[#1a2f23] font-medium placeholder:text-stone-400 text-sm" />
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#006a4e] text-white font-black italic uppercase tracking-tight rounded-full py-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
              {isLoading ? 'Signing in...' : (<><ArrowRight className="w-4 h-4" /> Sign In</>)}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-200" />
            <div className="w-2 h-2 rounded-full bg-[#f42a41]" />
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <p className="text-center text-stone-500 font-medium text-sm">
            New to LegalInfo BD?{' '}
            <Link to="/register" className="text-[#006a4e] font-black hover:text-[#f42a41] transition-colors">Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
