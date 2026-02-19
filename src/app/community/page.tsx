"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { useForum } from "@/hooks/useForum";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Users, Briefcase, TrendingUp, Star, ArrowRight, Music, Flame, Loader2, Plus } from "lucide-react";

const stats = [
  { label: "Membres actifs", value: "12 500+", icon: Users },
  { label: "Discussions", value: "3 200+", icon: MessageSquare },
  { label: "Services proposés", value: "850+", icon: Briefcase },
  { label: "Collaborations", value: "1 400+", icon: TrendingUp },
];

const services = [
  { title: "Mixage & Mastering professionnel", author: "StudioPro", price: "À partir de 50€", category: "Mixage", emoji: "🎛️" },
  { title: "Toplining / Écriture de textes", author: "LyricQueen", price: "À partir de 30€", category: "Écriture", emoji: "✍️" },
  { title: "Artwork & Pochettes d'album", author: "DesignBeats", price: "À partir de 25€", category: "Design", emoji: "🎨" },
];

export default function CommunityPage() {
  const { user } = useAuth();
  const { posts, loading } = useForum();
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  
  // Get hot posts (posts with most replies)
  const hotPosts = [...posts]
    .sort((a, b) => (b._count?.replies || 0) - (a._count?.replies || 0))
    .slice(0, 4);

  return (
    <div className="relative min-h-screen bg-gradient-premium">
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative px-6 py-20">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-40 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-brand-purple/20 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl text-center">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm mb-6">
              <Users className="w-4 h-4 text-brand-gold" />
              <span className="text-brand-gold font-semibold">Communauté SUMVIBES</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
              <span className="text-gradient">Connectez-vous</span>
              <br />avec la communauté
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              Échangez avec des milliers de producteurs et artistes, trouvez des collaborateurs, et développez votre réseau musical.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/community/forum" className="btn-primary px-8 py-3 rounded-full font-semibold text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Accéder au Forum
              </Link>
              <Link href="/community/services" className="glass px-8 py-3 rounded-full font-semibold text-lg hover:bg-white/10 flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> Services
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-6 text-center">
                <s.icon className="w-8 h-8 text-brand-gold mx-auto mb-3" />
                <div className="text-2xl font-bold text-gradient">{s.value}</div>
                <div className="text-sm text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Sections */}
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Forum Preview */}
            <div className="lg:col-span-2 glass rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-brand-gold" /> Forum
                </h2>
                <Link href="/community/forum" className="text-brand-gold text-sm font-semibold flex items-center gap-1 hover:underline">
                  Tout voir <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 mx-auto mb-2 text-brand-gold animate-spin" />
                  <p className="text-slate-400 text-sm">Chargement...</p>
                </div>
              ) : hotPosts.length > 0 ? (
                <div className="space-y-3">
                  {hotPosts.map((post) => (
                    <Link key={post.id} href={`/community/forum/${post.id}`} className="flex items-center gap-4 glass rounded-xl p-4 hover:bg-white/5">
                      <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                        <Music className="w-5 h-5 text-brand-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm truncate">{post.title}</h4>
                          {(post._count?.replies || 0) > 20 && <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />}
                        </div>
                        <div className="text-xs text-slate-400">par {post.author.artistName || post.author.username} · {post.category}</div>
                      </div>
                      <div className="glass px-3 py-1 rounded-full text-xs flex-shrink-0">{post._count?.replies || 0} réponses</div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-400 mb-4">Aucune discussion pour le moment</p>
                  {user && (
                    <button 
                      onClick={() => setShowNewPostModal(true)}
                      className="btn-primary px-4 py-2 rounded-full text-sm inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Créer une discussion
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Top Members */}
            <div className="glass rounded-3xl p-8">
              <h2 className="text-2xl font-bold font-display flex items-center gap-2 mb-6">
                <Star className="w-6 h-6 text-brand-gold" /> Top Membres
              </h2>
              <div className="space-y-4">
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-gold to-yellow-500 flex items-center justify-center text-brand-purple font-bold">
                      1
                    </div>
                    <div>
                      <div className="font-bold text-sm">BeatMaker92</div>
                      <div className="text-xs text-brand-gold">Diamant 💎</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                    <span>145 beats</span>
                    <span>890 ventes</span>
                  </div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-300 to-slate-400 flex items-center justify-center text-brand-purple font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-sm">MelodyQueen</div>
                      <div className="text-xs text-brand-gold">Platine 🏆</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                    <span>98 beats</span>
                    <span>1200 ventes</span>
                  </div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 flex items-center justify-center text-brand-purple font-bold">
                      3
                    </div>
                    <div>
                      <div className="font-bold text-sm">TrapKing_FR</div>
                      <div className="text-xs text-brand-gold">Or 🥇</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                    <span>210 beats</span>
                    <span>650 ventes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold font-display flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-brand-gold" /> Services de la communauté
              </h2>
              <Link href="/community/services" className="text-brand-gold font-semibold flex items-center gap-1 hover:underline">
                Tous les services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <Link key={i} href="/community/services" className="glass rounded-2xl p-6 hover:scale-[1.02]">
                  <div className="text-4xl mb-4">{s.emoji}</div>
                  <div className="glass px-3 py-1 rounded-full text-xs text-brand-gold inline-block mb-3">{s.category}</div>
                  <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                  <p className="text-sm text-slate-400 mb-3">par {s.author}</p>
                  <div className="text-brand-gold font-bold">{s.price}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Messages CTA */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="glass rounded-3xl p-12 text-center bg-gradient-to-r from-brand-gold/5 to-brand-purple/10">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Messagerie privée</h2>
              <p className="text-slate-300 text-lg max-w-xl mx-auto mb-8">
                Échangez directement avec les producteurs et artistes. Négociez, collaborez, et créez ensemble.
              </p>
              <Link href="/community/messages" className="btn-primary px-8 py-3 rounded-full font-semibold text-lg inline-flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Ouvrir la messagerie
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto max-w-7xl text-center text-slate-500 text-sm">
          © 2026 SUMVIBES by SAS BE GREAT. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
