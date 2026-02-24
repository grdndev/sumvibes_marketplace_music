"use client";

import { useState } from "react";
import { Search, Phone, Video, MoreVertical, Plus, Image as ImageIcon, Smile, Mic, Send, MessageSquare } from "lucide-react";

const MOCK_CONTACTS = [
  { id: "1", name: "MelodyQueen", lastMessage: "Yes, ce BPM est parfait! On part là dessus.", time: "14:32", unread: 2, online: true },
  { id: "2", name: "BeatMaker92", lastMessage: "Tu peux m'envoyer les stems séparés ?", time: "Hier", unread: 0, online: false },
  { id: "3", name: "TrapKing_FR", lastMessage: "J'ai écouté ton dernier post, lourd mec 🔥", time: "Hier", unread: 0, online: true },
  { id: "4", name: "StudioPro (Mixage)", lastMessage: "Le rendu final est dispo sur le drive.", time: "Lun", unread: 0, online: false },
];

const MOCK_MESSAGES = [
  { id: "1", senderId: "1", text: "Salut ! J'ai bien reçu la prod.", time: "14:15", isMe: false },
  { id: "2", senderId: "me", text: "Super ! Dis moi ce que tu penses de l'arrangement au refrain.", time: "14:20", isMe: true },
  { id: "3", senderId: "1", text: "Honnêtement c'est lourd. J'ai posé un premier yaourt dessus, je te l'envoie ce soir pour que tu vois la vibe.", time: "14:25", isMe: false },
  { id: "4", senderId: "1", text: "Yes, ce BPM est parfait! On part là dessus.", time: "14:32", isMe: false },
];

export default function ChatPage() {
  const [activeContactId, setActiveContactId] = useState("1");
  const activeContact = MOCK_CONTACTS.find(c => c.id === activeContactId);

  return (
    <div className="glass rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex h-[70vh] min-h-[500px] relative">
      
      {/* ── Background Glow ── */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-purple/20 blur-[100px] rounded-full pointer-events-none" />

      {/* ── Contacts Sidebar ── */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col z-10 bg-black/20 ${activeContactId ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 md:p-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold font-display text-white">Messages</h1>
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white border border-white/10 shadow-sm shadow-white/5">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full bg-[#0a0520]/50 text-sm text-white placeholder-slate-500 rounded-full pl-10 pr-4 py-2.5 outline-none border border-white/5 focus:border-brand-gold/30 transition-all font-light"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto mt-2 pb-4 scrollbar-none">
          {MOCK_CONTACTS.map(contact => (
            <button
              key={contact.id}
              onClick={() => setActiveContactId(contact.id)}
              className={`w-full text-left p-4 flex items-center gap-4 transition-all duration-300 relative ${
                activeContactId === contact.id ? "bg-white/10 backdrop-blur-md" : "hover:bg-white/5"
              }`}
            >
              {activeContactId === contact.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-md bg-brand-gold shadow-[0_0_10px_rgba(254,204,51,0.5)]" />
              )}
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-300 font-medium overflow-hidden shadow-md">
                  <img src={`https://i.pravatar.cc/150?u=${contact.name}`} alt="" className="w-full h-full object-cover" />
                </div>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#150e3a] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-semibold text-[15px] truncate ${activeContactId === contact.id ? 'text-brand-gold' : 'text-slate-100'}`}>{contact.name}</span>
                  <span className={`text-[11px] font-medium ${contact.unread ? 'text-brand-gold' : 'text-slate-500'}`}>{contact.time}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm truncate font-light ${contact.unread ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                    {contact.lastMessage}
                  </p>
                  {contact.unread > 0 && (
                    <span className="bg-brand-gold text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(254,204,51,0.5)]">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat Window ── */}
      {activeContact ? (
        <div className={`flex-1 flex flex-col z-10 bg-black/10 ${!activeContactId ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="h-16 md:h-20 border-b border-white/10 flex items-center justify-between px-4 md:px-6 flex-shrink-0 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white"
                onClick={() => setActiveContactId("")}
              >
                ←
              </button>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shadow-sm">
                <img src={`https://i.pravatar.cc/150?u=${activeContact.name}`} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-bold text-slate-100">{activeContact.name}</h2>
                <p className="text-xs text-slate-400 font-light flex items-center gap-1">
                  {activeContact.online ? (
                    <><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" /> En ligne</>
                  ) : "Hors ligne"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <button className="p-2 hover:text-brand-gold transition-colors tooltip" data-tip="Appel audio"><Phone className="w-5 h-5 stroke-[1.5]" /></button>
              <button className="p-2 hover:text-brand-gold transition-colors tooltip" data-tip="Appel vidéo"><Video className="w-5 h-5 stroke-[1.5]" /></button>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <button className="p-2 hover:text-white transition-colors"><MoreVertical className="w-5 h-5 stroke-[1.5]" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 scrollbar-none">
            <div className="w-full text-center my-4 relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-full h-px bg-white/5" />
              </div>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-widest bg-[#0f0933] px-4 relative z-10 rounded-full border border-white/5 py-1">Aujourd'hui</span>
            </div>
            
            {MOCK_MESSAGES.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                <div className={`flex items-end gap-2 max-w-[75%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!msg.isMe && (
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 flex-shrink-0 mb-1">
                      <img src={`https://i.pravatar.cc/150?u=${activeContact.name}`} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className={`px-4 py-3 text-[15px] font-light leading-relaxed shadow-lg ${
                    msg.isMe 
                      ? 'bg-brand-gold text-black rounded-2xl rounded-br-sm shadow-[0_4px_15px_rgba(254,204,51,0.2)] font-medium' 
                      : 'bg-white/10 text-white rounded-2xl rounded-bl-sm border border-white/5 backdrop-blur-md'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium mb-1 px-1">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="p-4 md:p-6 flex-shrink-0 bg-white/5 backdrop-blur-sm border-t border-white/10">
            <div className="flex items-center gap-2 md:gap-4">
              <button className="p-2.5 text-slate-400 hover:text-brand-gold bg-white/5 hover:bg-white/10 rounded-full transition-all flex-shrink-0 border border-white/5">
                <Plus className="w-5 h-5 stroke-[2]" />
              </button>
              
              <div className="flex-1 relative flex items-center bg-[#0a0520]/50 rounded-full px-4 border border-white/10 focus-within:border-brand-gold/50 focus-within:shadow-[0_0_15px_rgba(254,204,51,0.15)] transition-all">
                <button className="p-2 -ml-2 text-slate-500 hover:text-brand-gold transition-colors hidden sm:block">
                  <Smile className="w-5 h-5 stroke-[1.5]" />
                </button>
                <input 
                  type="text" 
                  placeholder="Écrivez un message..." 
                  className="flex-1 bg-transparent py-3 md:py-3.5 px-2 text-sm text-white placeholder-slate-500 outline-none font-light"
                />
                <button className="p-2 -mr-2 text-slate-500 hover:text-brand-gold transition-colors hidden sm:block">
                  <ImageIcon className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="p-3 text-slate-400 hover:text-brand-gold transition-colors rounded-full hover:bg-white/5">
                  <Mic className="w-5 h-5 stroke-[1.5]" />
                </button>
                <button className="p-3.5 bg-brand-gold text-black rounded-full hover:scale-105 hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(254,204,51,0.4)]">
                  <Send className="w-5 h-5 stroke-[2] -translate-x-[1px] translate-y-[1px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex flex-col items-center justify-center text-slate-500 bg-black/10">
          <div className="w-20 h-20 rounded-full border border-white/5 bg-white/5 shadow-inner flex items-center justify-center mb-6">
            <MessageSquare className="w-8 h-8 stroke-[1] text-brand-gold" />
          </div>
          <h3 className="text-xl font-bold font-display text-white mb-2">Sélectionnez un contact</h3>
          <p className="font-light text-slate-400 max-w-xs text-center">Choisissez une conversation dans la liste pour commencer à échanger.</p>
        </div>
      )}
    </div>
  );
}
