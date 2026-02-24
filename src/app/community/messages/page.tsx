"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronLeft, Search, Send, MoreHorizontal, Check, CheckCheck, Loader2, User, AlertCircle, MessageSquare } from "lucide-react";

interface Conversation {
  userId: string;
  username: string;
  displayName: string | null;
  avatar: string | null;
  artistName: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  read: boolean;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    userId: "mock-1",
    username: "melody_queen",
    displayName: "MelodyQueen",
    artistName: "MelodyQueen",
    avatar: "https://i.pravatar.cc/150?u=melody",
    lastMessage: "Yes, ce BPM est parfait! On part là dessus.",
    lastMessageAt: new Date().toISOString(),
    unreadCount: 2,
  },
  {
    userId: "mock-2",
    username: "beatmaker92",
    displayName: "BeatMaker92",
    artistName: "BeatMaker92",
    avatar: "https://i.pravatar.cc/150?u=beatmaker",
    lastMessage: "Tu peux m'envoyer les stems séparés ?",
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    unreadCount: 0,
  },
  {
    userId: "mock-3",
    username: "trapking_fr",
    displayName: "TrapKing_FR",
    artistName: "TrapKing_FR",
    avatar: "https://i.pravatar.cc/150?u=trap",
    lastMessage: "J'ai écouté ton dernier post, lourd mec 🔥",
    lastMessageAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    unreadCount: 0,
  },
  {
    userId: "mock-4",
    username: "studiopro",
    displayName: "StudioPro (Mixage)",
    artistName: "StudioPro",
    avatar: "https://i.pravatar.cc/150?u=studio",
    lastMessage: "Le rendu final est dispo sur le drive.",
    lastMessageAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    unreadCount: 0,
  },
];

const MOCK_MESSAGES_DATA: Record<string, Message[]> = {
  "mock-1": [
    { id: "msg-1", content: "Salut ! J'ai bien reçu la prod.", createdAt: new Date(Date.now() - 3600000).toISOString(), senderId: "mock-1", read: true },
    { id: "msg-2", content: "Super ! Dis moi ce que tu penses de l'arrangement au refrain.", createdAt: new Date(Date.now() - 3000000).toISOString(), senderId: "me", read: true },
    { id: "msg-3", content: "Honnêtement c'est lourd. J'ai posé un premier yaourt dessus, je te l'envoie ce soir pour que tu vois la vibe.", createdAt: new Date(Date.now() - 1500000).toISOString(), senderId: "mock-1", read: true },
    { id: "msg-4", content: "Yes, ce BPM est parfait! On part là dessus.", createdAt: new Date().toISOString(), senderId: "mock-1", read: false },
  ],
  "mock-2": [
    { id: "msg-5", content: "Yo bro, tu vends les stems de 'Dark Knight' ?", createdAt: new Date(Date.now() - 7200000).toISOString(), senderId: "mock-2", read: true },
    { id: "msg-6", content: "Salut, oui c'est dispo dans la licence Premium sur mon profil.", createdAt: new Date(Date.now() - 7000000).toISOString(), senderId: "me", read: true },
    { id: "msg-7", content: "Ok je vois ça. Tu peux m'envoyer les stems séparés ?", createdAt: new Date(Date.now() - 3600000).toISOString(), senderId: "mock-2", read: true },
  ]
};

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Si on veut brancher l'API plus tard :
    // fetch("/api/messages").then(...).catch(() => setConversations(MOCK_CONVERSATIONS));
  }, [user]);

  useEffect(() => {
    if (!activeConv) return;
    // Mock user.id as "me"
    const myId = user?.id || "me";
    const convMessages = MOCK_MESSAGES_DATA[activeConv.userId] || [];
    
    // Ensure "me" messages have the current user's ID
    const mappedMessages = convMessages.map(m => ({
      ...m,
      senderId: m.senderId === "me" ? myId : m.senderId
    }));
    
    setMessages(mappedMessages);
  }, [activeConv, user]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeConv) return;
    
    const myId = user?.id || "me";
    const newMsg: Message = {
      id: `new-${Date.now()}`,
      content: text.trim(),
      createdAt: new Date().toISOString(),
      senderId: myId,
      read: false
    };
    
    setMessages(prev => [...prev, newMsg]);
    setText("");
    
    // Update conversation last message visually
    setConversations(prev => prev.map(c => 
      c.userId === activeConv.userId 
        ? { ...c, lastMessage: text.trim(), lastMessageAt: newMsg.createdAt } 
        : c
    ));
  };

  const selectConv = (conv: Conversation) => {
    setActiveConv(conv);
    setShowMobileList(false);
  };

  const filtered = conversations.filter(c => {
    const name = c.artistName || c.displayName || c.username;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  /* 
  if (!user) return (
    <div className="relative min-h-screen bg-gradient-premium"><Navbar />
      <main className="pt-20 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">Connectez-vous pour accéder à vos messages</p>
          <Link href="/login" className="btn-primary px-6 py-3 rounded-full">Se connecter</Link>
        </div>
      </main>
    </div>
  );
  */

  return (
    <div className="relative min-h-screen bg-gradient-premium">
      <Navbar />

      <main className="pt-24 pb-20 px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/community" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-gold mb-8 transition-colors text-sm font-medium">
            <ChevronLeft className="w-5 h-5" /> Retour au Hub
          </Link>

          <div className="mb-8 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-gradient drop-shadow-lg mb-2">Messagerie Privée</h1>
            <p className="text-slate-300 font-light">Gérez vos collaborations et contrats en direct.</p>
          </div>

          <div className="glass rounded-3xl overflow-hidden border border-white/10" style={{ height: "calc(100vh - 200px)" }}>
            <div className="flex h-full">
              {/* Sidebar */}
              <div className={`w-full md:w-80 border-r border-white/10 flex flex-col ${!showMobileList ? "hidden md:flex" : "flex"}`}>
                <div className="p-4 border-b border-white/10">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-gold transition-colors" />
                    <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-gold/50" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-32"><Loader2 className="w-8 h-8 text-brand-gold animate-spin" /></div>
                  ) : filtered.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm font-light">Aucune conversation trouvée</div>
                  ) : filtered.map(conv => {
                    const name = conv.artistName || conv.displayName || conv.username;
                    const active = activeConv?.userId === conv.userId;
                    return (
                      <button key={conv.userId} onClick={() => selectConv(conv)} className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 text-left border-b border-white/5 ${active ? "bg-brand-gold/5 border-l-2 border-brand-gold" : ""}`}>
                        <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-brand-purple/30 to-brand-gold/30 flex items-center justify-center">
                          {conv.avatar ? <img src={conv.avatar} alt={name} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-brand-gold" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm truncate">{name}</span>
                            <span className="text-xs text-slate-400 flex-shrink-0 ml-1">{conv.lastMessageAt ? timeAgo(conv.lastMessageAt) : ""}</span>
                          </div>
                          <p className="text-xs text-slate-400 truncate">{conv.lastMessage}</p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-brand-gold text-brand-purple text-xs font-bold flex items-center justify-center flex-shrink-0">{conv.unreadCount}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat */}
              <div className={`flex-1 flex flex-col ${showMobileList ? "hidden md:flex" : "flex"}`}>
                {activeConv ? (
                  <>
                    {/* Header Actif */}
                    <div className="p-4 border-b border-white/10 flex items-center gap-3">
                      <button onClick={() => setShowMobileList(true)} className="md:hidden p-2 rounded-xl glass mr-1"><ChevronLeft className="w-5 h-5" /></button>
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-brand-purple/30 to-brand-gold/30 flex items-center justify-center">
                        {activeConv?.avatar ? <img src={activeConv.avatar || ""} alt="" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-brand-gold" />}
                      </div>
                      <div>
                        <div className="font-bold">{activeConv?.artistName || activeConv?.displayName || activeConv?.username || ""}</div>
                      </div>
                    </div>

                    {/* Zone de Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {messages.map(msg => {
                        const isMine = msg.senderId === (user?.id || "me");
                        return (
                          <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMine ? "bg-brand-gold text-brand-purple font-medium rounded-br-sm" : "glass rounded-bl-sm"}`}>
                              <p>{msg.content}</p>
                              <div className={`flex items-center gap-1 mt-1 text-xs ${isMine ? "text-brand-purple/60 justify-end" : "text-slate-500"}`}>
                                {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                {isMine && (msg.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Zone d'envoi */}
                    <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex items-center gap-3">
                      <input type="text" placeholder="Votre message..." value={text} onChange={e => setText(e.target.value)}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 text-sm" />
                      <button type="submit" disabled={!text.trim() || sending} className="p-3 bg-brand-gold rounded-xl text-brand-purple disabled:opacity-50">
                        <Send className="w-5 h-5" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center p-8">
                    <div>
                      <div className="text-6xl mb-4">💬</div>
                      <p className="text-slate-400">Sélectionnez une conversation ou démarrez-en une nouvelle depuis le profil d'un producteur</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
