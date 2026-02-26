"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronLeft, Search, Send, Check, CheckCheck, Loader2, User, MessageSquare } from "lucide-react";
import io from "socket.io-client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface Conversation {
  userId: string;
  username: string;
  displayName?: string | null;
  avatar?: string | null;
  artistName?: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-premium flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-gold animate-spin" />
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("");
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);
  const [socket, setSocket] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const newUserId = searchParams?.get("new");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await fetch("/api/messages", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          let fetchedConversations = data.conversations || [];
          
          if (newUserId) {
            // Check if this user is already in contacts
            const existingConv = fetchedConversations.find((c: Conversation) => c.userId === newUserId);
            if (existingConv) {
              setActiveConvId(newUserId);
              setShowMobileList(false);
            } else {
              // Fetch the basic info for the new user to create a temporary conversation
              try {
                const userRes = await fetch(`/api/admin/users/${newUserId}`);
                if (userRes.ok) {
                  const userData = await userRes.json();
                  const targetUser = userData.user || userData;
                  const tempConv: Conversation = {
                    userId: targetUser.id,
                    username: targetUser.username,
                    displayName: targetUser.displayName || targetUser.sellerProfile?.artistName,
                    avatar: targetUser.avatar,
                    lastMessage: "Nouvelle conversation...",
                    lastMessageAt: new Date().toISOString(),
                    unreadCount: 0
                  };
                  fetchedConversations = [tempConv, ...fetchedConversations];
                  setActiveConvId(newUserId);
                  setShowMobileList(false);
                }
              } catch (err) {
                console.error("Error fetching new user profile", err);
              }
            }
          }
          
          setConversations(fetchedConversations);
        }
      } catch (e) {
        console.error("Error fetching contacts", e);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [user, newUserId]);

  // Socket Connection
  useEffect(() => {
    if (!user) return;

    const socketIo = io(undefined as any, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    socketIo.on("connect", () => {
      console.log("Connected to socket");
      socketIo.emit("join-room", user.id);
    });

    socketIo.on("new-message", (message: Message) => {
      setMessages((prev) => {
        if (message.senderId === activeConvId || message.recipientId === activeConvId) {
          return [...prev, message];
        }
        return prev;
      });

      setConversations((prev) => {
        return prev.map(c => {
          const isRelevant = c.userId === message.senderId || c.userId === message.recipientId;
          if (isRelevant) {
            return {
              ...c,
              lastMessage: message.content,
              lastMessageAt: message.createdAt,
              unreadCount: message.senderId === c.userId && activeConvId !== c.userId ? c.unreadCount + 1 : c.unreadCount
            };
          }
          return c;
        });
      });
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [user, activeConvId]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (!activeConvId) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`/api/messages?conversationId=${activeConvId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          
          setConversations(prev => prev.map(c => c.userId === activeConvId ? { ...c, unreadCount: 0 } : c));
        }
      } catch (e) {
        console.error("Error fetching messages", e);
      }
    };
    fetchMessages();
  }, [activeConvId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeConvId || !user) return;
    
    setSending(true);
    const content = text.trim();
    setText("");

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: activeConvId,
          content
        })
      });

      if (res.ok) {
        const savedMessage = await res.json();
        setMessages(prev => [...prev, savedMessage]);
        
        if (socket) {
          socket.emit("send-message", savedMessage);
        }

        setConversations(prev => prev.map(c => {
          if (c.userId === activeConvId) {
            return {
              ...c,
              lastMessage: savedMessage.content,
              lastMessageAt: savedMessage.createdAt,
            };
          }
          return c;
        }));
      }
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setSending(false);
    }
  };

  const selectConv = (conv: Conversation) => {
    setActiveConvId(conv.userId);
    setShowMobileList(false);
  };

  const filtered = conversations.filter(c => {
    const name = c.artistName || c.displayName || c.username;
    return name?.toLowerCase().includes(search.toLowerCase());
  });

  const timeAgo = (d: string) => {
    if (!d) return "";
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins === 0 ? 1 : mins}min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  const activeConv = conversations.find(c => c.userId === activeConvId);

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

          <div className="glass rounded-3xl overflow-hidden border border-white/10" style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}>
            <div className="flex h-full">
              {/* Sidebar */}
              <div className={`w-full md:w-80 border-r border-white/10 flex flex-col ${!showMobileList && activeConvId ? "hidden md:flex" : "flex"}`}>
                <div className="p-4 border-b border-white/10">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-gold transition-colors" />
                    <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-gold/50" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-none">
                  {loading ? (
                    <div className="flex items-center justify-center h-32"><Loader2 className="w-8 h-8 text-brand-gold animate-spin" /></div>
                  ) : filtered.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm font-light">Aucune conversation</div>
                  ) : filtered.map(conv => {
                    const name = conv.artistName || conv.displayName || conv.username;
                    const active = activeConv?.userId === conv.userId;
                    return (
                      <button key={conv.userId} onClick={() => selectConv(conv)} className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 text-left border-b border-white/5 ${active ? "bg-brand-gold/5 border-l-2 border-brand-gold" : ""}`}>
                        <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-brand-purple/30 to-brand-gold/30 flex items-center justify-center">
                          {conv.avatar ? <img src={conv.avatar} alt={name || "user"} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-brand-gold" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm truncate">{name}</span>
                            <span className="text-xs text-slate-400 flex-shrink-0 ml-1">{timeAgo(conv.lastMessageAt)}</span>
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

              {/* Chat Window */}
              <div className={`flex-1 flex flex-col ${showMobileList && !activeConvId ? "hidden md:flex" : "flex"}`}>
                {activeConv ? (
                  <>
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 flex items-center gap-3">
                      <button onClick={() => { setShowMobileList(true); setActiveConvId(""); }} className="md:hidden p-2 rounded-xl glass mr-1"><ChevronLeft className="w-5 h-5" /></button>
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-brand-purple/30 to-brand-gold/30 flex items-center justify-center">
                        {activeConv?.avatar ? <img src={activeConv.avatar} alt="" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-brand-gold" />}
                      </div>
                      <div>
                        <div className="font-bold">{activeConv?.artistName || activeConv?.displayName || activeConv?.username}</div>
                        <p className="text-xs text-brand-gold flex items-center gap-1">En ligne</p>
                      </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none">
                      {messages.map(msg => {
                        const isMine = msg.senderId === user?.id;
                        return (
                          <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMine ? "bg-brand-gold text-brand-purple font-medium rounded-br-sm shadow-[0_4px_15px_rgba(254,204,51,0.2)]" : "glass rounded-bl-sm"}`}>
                              <p>{msg.content}</p>
                              <div className={`flex items-center gap-1 mt-1 text-[10px] ${isMine ? "text-brand-purple/60 justify-end" : "text-slate-500"}`}>
                                {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                {isMine && (msg.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Composer */}
                    <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex items-center gap-3 bg-white/5 backdrop-blur-sm">
                      <input type="text" placeholder="Votre message..." value={text} onChange={e => setText(e.target.value)}
                        className="flex-1 px-4 py-3 bg-[#0a0520]/50 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 focus:shadow-[0_0_15px_rgba(254,204,51,0.15)] text-sm transition-all text-white" />
                      <button type="submit" disabled={!text.trim() || sending} className="p-3 bg-brand-gold rounded-xl text-black disabled:opacity-50 hover:scale-105 transition-transform disabled:hover:scale-100 shadow-[0_0_15px_rgba(254,204,51,0.4)]">
                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 -translate-x-[1px] translate-y-[1px]" />}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-black/10">
                    <div className="w-20 h-20 rounded-full border border-white/5 bg-white/5 shadow-inner flex items-center justify-center mb-6">
                      <MessageSquare className="w-8 h-8 stroke-[1] text-brand-gold" />
                    </div>
                    <h3 className="text-xl font-bold font-display text-white mb-2">Sélectionnez un contact</h3>
                    <p className="font-light text-slate-400 max-w-xs text-center">Choisissez une conversation dans la liste pour commencer à échanger.</p>
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
