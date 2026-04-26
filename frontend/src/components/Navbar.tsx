import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Scale,
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  BookOpen,
  CheckSquare,
  Globe,
  Phone,
  LogOut,
  AlertTriangle,
  X,
} from 'lucide-react';

const EMERGENCY_CONTACTS = [
  {
    label: 'Labour Affairs Helpline',
    number: '16357',
    description: 'Ministry of Labour & Employment',
    color: '#f9a825',
    tel: 'tel:16357',
  },
  {
    label: 'BD National Emergency',
    number: '999',
    description: 'Police · Fire · Ambulance',
    color: '#f42a41',
    tel: 'tel:999',
  },
  {
    label: 'BLAST Helpline',
    number: '02-8391970',
    description: 'Bangladesh Legal Aid & Services Trust',
    color: '#4caf82',
    tel: 'tel:0028391970',
  },
];

const Navbar = () => {
  const { user, isLawyer, logout } = useAuth();
  const navigate = useNavigate();
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setEmergencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
      isActive
        ? 'bg-white/20 text-white'
        : 'text-white/70 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <header className="bg-[#1a2f23] border-b-4 border-[#f42a41] sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 py-2.5 flex items-center justify-between">
        {/* Logo + primary nav */}
        <div className="flex items-center gap-6">
          <NavLink to="/dashboard" className="flex items-center gap-2 text-white no-underline">
            <div className="w-8 h-8 bg-[#f42a41] rounded-full flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <span className="font-garamond italic font-black text-[#f9a825] text-lg tracking-tight">
              LegalInfo BD
            </span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" className={linkClass} end>
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </NavLink>
            <NavLink to="/cases" className={linkClass}>
              <FolderOpen className="w-3.5 h-3.5" />
              Cases
            </NavLink>
            {isLawyer && (
              <NavLink to="/ai-chat" className={linkClass}>
                <MessageSquare className="w-3.5 h-3.5" />
                AI Chat
              </NavLink>
            )}
            <NavLink to="/labor-law" className={linkClass}>
              <BookOpen className="w-3.5 h-3.5" />
              Labour Act
            </NavLink>
            {isLawyer && (
              <NavLink to="/validation" className={linkClass}>
                <CheckSquare className="w-3.5 h-3.5" />
                Validate
              </NavLink>
            )}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-white/50 text-xs font-bold">
            {/* Language toggle */}
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-white/50">
              <Globe className="w-3.5 h-3.5" />
              BN
            </button>

            {/* Emergency Help Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setEmergencyOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all font-black text-xs uppercase tracking-widest border ${
                  emergencyOpen
                    ? 'bg-[#f42a41] text-white border-[#f42a41]'
                    : 'text-[#f42a41] border-[#f42a41]/40 hover:bg-[#f42a41]/10 hover:border-[#f42a41]'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Emergency Help
              </button>

              {emergencyOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0f1e15] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#f42a41]/10 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#f42a41]" />
                      <span className="text-white font-black text-xs uppercase tracking-widest">
                        Emergency Contacts
                      </span>
                    </div>
                    <button
                      onClick={() => setEmergencyOpen(false)}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Contact list */}
                  <div className="p-2 flex flex-col gap-1">
                    {EMERGENCY_CONTACTS.map((contact) => (
                      <a
                        key={contact.number}
                        href={contact.tel}
                        className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/5 transition-all group no-underline"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-white text-xs font-black uppercase tracking-wide">
                            {contact.label}
                          </span>
                          <span className="text-white/40 text-[10px] font-medium">
                            {contact.description}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="font-black text-sm tabular-nums"
                            style={{ color: contact.color }}
                          >
                            {contact.number}
                          </span>
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: contact.color + '20' }}
                          >
                            <Phone className="w-3 h-3" style={{ color: contact.color }} />
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* Footer hint */}
                  <div className="px-4 py-2.5 border-t border-white/5">
                    <p className="text-white/25 text-[10px] text-center font-medium">
                      Tap a number to call directly
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User area */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#f42a41] flex items-center justify-center text-white font-black text-xs">
                {user?.full_name?.charAt(0) || '?'}
              </div>
              <div>
                <p className="text-white text-xs font-bold">{user?.full_name}</p>
                <p className="text-[#f9a825] text-[10px] font-black uppercase tracking-widest">
                  {isLawyer ? 'LAWYER' : 'USER'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#f42a41] border border-[#f42a41]/20 hover:bg-[#f42a41]/10 transition-all text-xs font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <nav className="md:hidden flex overflow-x-auto px-4 py-2 gap-2 border-t border-white/5">
        <NavLink to="/dashboard" className={linkClass} end>
          <LayoutDashboard className="w-3.5 h-3.5" />
          Dash
        </NavLink>
        <NavLink to="/cases" className={linkClass}>
          <FolderOpen className="w-3.5 h-3.5" />
          Cases
        </NavLink>
        {isLawyer && (
          <NavLink to="/ai-chat" className={linkClass}>
            <MessageSquare className="w-3.5 h-3.5" />
            Chat
          </NavLink>
        )}
        <NavLink to="/labor-law" className={linkClass}>
          <BookOpen className="w-3.5 h-3.5" />
          Law
        </NavLink>
        {isLawyer && (
          <NavLink to="/validation" className={linkClass}>
            <CheckSquare className="w-3.5 h-3.5" />
            Validate
          </NavLink>
        )}
        {/* Mobile emergency button */}
        <a
          href="tel:999"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#f42a41] border border-[#f42a41]/40 text-xs font-black uppercase tracking-widest whitespace-nowrap hover:bg-[#f42a41]/10 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Emergency
        </a>
      </nav>
    </header>
  );
};

export default Navbar;