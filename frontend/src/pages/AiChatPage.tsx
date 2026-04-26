import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, Send, Trash2, Plus, Languages, MessageSquare, BookOpen } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{ act_title: string; act_year?: number; relevance_score?: string }>;
  timestamp: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updated_at: number;
}

const SUGGESTED = [
  { en: 'What is the legal overtime rate?', bn: 'ওভারটাইম রেট কত?' },
  { en: 'How many days maternity leave?', bn: 'মাতৃত্বকালীন ছুটি কতদিন?' },
  { en: 'Minimum termination notice period?', bn: 'ছাঁটাইয়ের নোটিশ কতদিন?' },
  { en: 'Am I entitled to gratuity?', bn: 'গ্র্যাচুইটি পাবো কি?' },
];

const AiChatPage = () => {
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lang, setLang] = useState<'EN' | 'BN'>('EN');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('legal_ai_conversations');
    if (stored) {
      const parsed = JSON.parse(stored);
      setConversations(parsed);
      if (parsed.length > 0) setActiveConversation(parsed[0]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('legal_ai_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (location.state?.question) setInputText(location.state.question);
  }, [location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: `New Query ${conversations.length + 1}`,
      messages: [],
      updated_at: Date.now(),
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversation(newConv);
  };

  const updateConversationTitle = (convId: string, firstUserMessage: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === convId
          ? { ...conv, title: firstUserMessage.slice(0, 40) + (firstUserMessage.length > 40 ? '…' : '') }
          : conv
      )
    );
  };

  const sendMessage = async (text?: string) => {
    const content = text || inputText;
    if (!content.trim() || isLoading) return;

    let conv = activeConversation;
    if (!conv) {
      const newId = Date.now().toString();
      const newConv: Conversation = {
        id: newId,
        title: `New Query ${conversations.length + 1}`,
        messages: [],
        updated_at: Date.now(),
      };
      setConversations(prev => [newConv, ...prev]);
      conv = newConv;
      setActiveConversation(newConv);
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };
    const updatedMessages = [...conv!.messages, userMsg];
    setActiveConversation({ ...conv!, messages: updatedMessages, updated_at: Date.now() });
    setConversations(prev =>
      prev.map(c => (c.id === conv!.id ? { ...c, messages: updatedMessages, updated_at: Date.now() } : c))
    );
    setInputText('');
    setIsLoading(true);

    if (conv!.messages.length === 0) updateConversationTitle(conv!.id, content.trim());

    try {
      const response = await api.post('/ai/analyze-case', { lawyerQuery: content.trim() });
      const assistantContent = response.data.ai_response;
      const sources = response.data.sources_used || [];
      const citations = sources.map((title: string) => ({ act_title: title }));

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        citations: citations,
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setActiveConversation({ ...conv!, messages: finalMessages, updated_at: Date.now() });
      setConversations(prev =>
        prev.map(c => (c.id === conv!.id ? { ...c, messages: finalMessages, updated_at: Date.now() } : c))
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to get AI response.');
      setActiveConversation({ ...conv!, messages: conv!.messages, updated_at: Date.now() });
      setConversations(prev =>
        prev.map(c => (c.id === conv!.id ? { ...c, messages: conv!.messages, updated_at: Date.now() } : c))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openConversation = (conv: Conversation) => setActiveConversation(conv);

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newConversations = conversations.filter(c => c.id !== id);
    setConversations(newConversations);
    if (activeConversation?.id === id) setActiveConversation(newConversations[0] || null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-66px)] flex bg-stone-50 font-manrope">
      {/* Sidebar */}
      <aside className="w-72 bg-[#1a2f23] flex flex-col flex-shrink-0 border-r border-white/5">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-[#f42a41]/20 flex items-center justify-center">
              <Scale className="w-4 h-4 text-[#f42a41]" />
            </div>
            <span className="font-garamond italic font-black text-[#f9a825] text-lg tracking-tight">LegalInfo BD</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            onClick={createNewConversation}
            className="w-full py-3 bg-[#006a4e] text-white rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-900/30 hover:bg-[#007a5e] transition-all"
          >
            <Plus className="w-4 h-4" /> New Query
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
          {conversations.length === 0 && (
            <p className="text-white/30 text-xs font-medium p-5 italic">No conversations yet.</p>
          )}
          {conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => openConversation(conv)}
              className={`group px-4 py-3 cursor-pointer flex items-center justify-between transition-all ${
                activeConversation?.id === conv.id
                  ? 'bg-[#006a4e] border-l-4 border-[#f42a41]'
                  : 'hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <div className="overflow-hidden flex-1 flex items-center gap-2.5">
                <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${activeConversation?.id === conv.id ? 'text-white' : 'text-white/30'}`} />
                <div className="overflow-hidden">
                  <p className={`text-sm font-bold truncate ${activeConversation?.id === conv.id ? 'text-white' : 'text-white/70'}`}>
                    {conv.title}
                  </p>
                  <p className="text-[10px] font-medium text-white/30 mt-0.5">
                    {new Date(conv.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={e => deleteConversation(conv.id, e)}
                className="text-white/20 hover:text-[#f42a41] transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 ml-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5">
          <p className="text-[10px] font-medium text-white/25 leading-relaxed">
            Answers are based solely on the Bangladesh Labour Act 2006. Always verify with a qualified lawyer.
          </p>
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Unified header bar */}
        <div className="bg-[#006a4e] px-6 py-4 border-b-2 border-[#f42a41] flex items-center justify-between">
          <div>
            <h2 className="font-black uppercase tracking-tight text-white text-lg">
              {activeConversation ? activeConversation.title : 'Legal AI Assistant'}
            </h2>
            <p className="text-white/60 text-xs font-medium">
              {activeConversation ? 'Powered by Bangladesh Labour Act 2006 RAG' : 'Select or start a conversation'}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setLang(l => l === 'EN' ? 'BN' : 'EN')}
            className="px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white/20 transition-all"
          >
            <Languages className="w-4 h-4" />
            {lang === 'EN' ? 'বাংলা' : 'English'}
          </motion.button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!activeConversation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center pt-10"
            >
              <Scale className="w-16 h-16 mx-auto text-[#006a4e]/20 mb-5" />
              <h2 className="font-garamond italic font-black uppercase tracking-tight text-4xl text-[#1a2f23] mb-2">
                Bangladesh Labour Act 2006
              </h2>
              <p className="text-stone-500 font-medium mb-8">
                Ask in Bangla or English — citations included.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                {SUGGESTED.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      createNewConversation();
                      setTimeout(() => setInputText(lang === 'EN' ? s.en : s.bn), 100);
                    }}
                    className="p-4 bg-white border-2 border-stone-200 rounded-3xl text-left hover:border-[#006a4e] hover:bg-[#ecf7f1] transition-all"
                  >
                    <p className="font-bold text-[#1a2f23] text-sm mb-1">{lang === 'EN' ? s.en : s.bn}</p>
                    <p className="text-xs text-stone-400 font-medium">{lang === 'EN' ? s.bn : s.en}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {activeConversation?.messages.map((msg, idx) => (
              <motion.div
                key={msg.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-[#006a4e] flex items-center justify-center mr-3 mt-1 flex-shrink-0 shadow-lg shadow-green-900/20">
                    <Scale className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className={`max-w-[75%] ${
                  msg.role === 'user'
                    ? 'bg-[#006a4e] text-white rounded-[28px] rounded-br-sm px-5 py-3.5 shadow-lg shadow-green-900/20'
                    : 'bg-white border border-stone-200 rounded-[28px] rounded-bl-sm px-6 py-4 shadow-sm'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#006a4e] mb-2 flex items-center gap-1.5">
                      <Scale className="w-3 h-3" /> Legal AI · Bangladesh Labour Act 2006
                    </div>
                  )}
                  <p className={`font-medium whitespace-pre-wrap leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-stone-700'}`}>
                    {msg.content}
                  </p>

                  {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#f42a41] mb-2 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> Citations
                      </p>
                      <ul className="space-y-1">
                        {msg.citations.map((c, i) => (
                          <li key={i} className="text-xs text-stone-500 font-medium flex items-start gap-1.5">
                            <span className="text-[#006a4e] font-black mt-0.5">·</span>
                            {c.act_title} {c.act_year ? `(${c.act_year})` : ''} {c.relevance_score && `– ${c.relevance_score}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {msg.role === 'assistant' && (
                    <div className="mt-2 text-[10px] font-medium text-stone-400 flex items-center gap-1">
                      <Scale className="w-3 h-3 text-[#f42a41]" />
                      Verify with a qualified lawyer for official use
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#006a4e] flex items-center justify-center shadow-lg shadow-green-900/20">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-stone-200 rounded-[28px] rounded-bl-sm px-5 py-3.5 flex items-center gap-3 shadow-sm">
                <span className="flex space-x-1">
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 bg-[#006a4e]/40 rounded-full block"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </span>
                <span className="text-sm text-stone-400 font-medium italic">
                  Searching Bangladesh Labour Act 2006...
                </span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="px-6 py-4 bg-white border-t border-stone-100">
          {!activeConversation && (
            <p className="text-center text-xs text-stone-400 mb-3 font-medium">
              Start a new conversation first
            </p>
          )}
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-stone-100 rounded-3xl border-2 border-stone-200 focus-within:border-[#006a4e] transition-all px-5 py-3.5">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  activeConversation
                    ? lang === 'EN' ? 'Ask about labour rights, wages, overtime... (Enter to send)' : 'শ্রম অধিকার, মজুরি, ওভারটাইম সম্পর্কে জিজ্ঞেস করুন...'
                    : 'Start a new conversation first'
                }
                disabled={!activeConversation || isLoading}
                rows={2}
                className="w-full bg-transparent border-none outline-none resize-none text-stone-700 placeholder-stone-400 font-medium text-sm"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => sendMessage()}
              disabled={!activeConversation || !inputText.trim() || isLoading}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all flex-shrink-0 ${
                !activeConversation || !inputText.trim() || isLoading
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-[#006a4e] text-white shadow-lg shadow-green-900/20'
              }`}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Manrope:wght@400;500;600;700;800;900&display=swap');
        .font-garamond { font-family: 'EB Garamond', serif; }
        .font-manrope { font-family: 'Manrope', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default AiChatPage;