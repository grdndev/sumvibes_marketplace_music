"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ChevronLeft, Play, ShoppingCart, Heart, Clock } from "lucide-react";

const styles = [
  { id: "trap", label: "Trap", emoji: "🔥", count: 342, color: "from-red-500/20 to-orange-500/10" },
  { id: "rnb", label: "R&B", emoji: "💜", count: 189, color: "from-purple-500/20 to-pink-500/10" },
  { id: "pop", label: "Pop", emoji: "🌟", count: 267, color: "from-yellow-500/20 to-amber-500/10" },
  { id: "hip-hop", label: "Hip-Hop", emoji: "🎤", count: 298, color: "from-blue-500/20 to-cyan-500/10" },
  { id: "afrobeat", label: "Afrobeat", emoji: "🌍", count: 156, color: "from-green-500/20 to-emerald-500/10" },
  { id: "drill", label: "Drill", emoji: "⚡", count: 134, color: "from-slate-500/20 to-zinc-500/10" },
  { id: "reggaeton", label: "Reggaeton", emoji: "🌴", count: 98, color: "from-lime-500/20 to-green-500/10" },
  { id: "lo-fi", label: "Lo-Fi", emoji: "🌙", count: 112, color: "from-indigo-500/20 to-violet-500/10" },
  { id: "soul", label: "Soul", emoji: "🎷", count: 76, color: "from-amber-500/20 to-yellow-500/10" },
  { id: "dancehall", label: "Dancehall", emoji: "🏖️", count: 64, color: "from-teal-500/20 to-cyan-500/10" },
  { id: "electro", label: "Électro", emoji: "💿", count: 87, color: "from-fuchsia-500/20 to-pink-500/10" },
  { id: "jazz", label: "Jazz", emoji: "🎺", count: 45, color: "from-orange-500/20 to-amber-500/10" },
];

const beatsByStyle: Record<string, Array<{ title: string; producer: string; bpm: number; price: number; key: string; duration: string }>> = {
  trap: [
    { title: "Dark Shadows", producer: "BeatMaker92", bpm: 140, price: 29.99, key: "Cm", duration: "3:24" },
    { title: "Night Rider", producer: "TrapKing_FR", bpm: 145, price: 39.99, key: "Gm", duration: "3:12" },
    { title: "Inferno", producer: "BassMaster", bpm: 138, price: 24.99, key: "Dm", duration: "3:45" },
    { title: "Ice Cold", producer: "FrostBeats", bpm: 142, price: 34.99, key: "Em", duration: "3:30" },
  ],
  rnb: [
    { title: "Velvet Dreams", producer: "MelodyQueen", bpm: 85, price: 34.99, key: "Ab", duration: "3:50" },
    { title: "Moonlight", producer: "SoulVibes", bpm: 90, price: 29.99, key: "Db", duration: "4:02" },
    { title: "Silk", producer: "SmoothProd", bpm: 82, price: 39.99, key: "Eb", duration: "3:38" },
  ],
};

export default function StylePage() {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const currentBeats = selectedStyle ? beatsByStyle[selectedStyle] || [] : [];

  return (
    <div className="relative min-h-screen bg-gradient-premium">
      <Navbar />

      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Link href="/catalogue" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-gold mb-6">
            <ChevronLeft className="w-5 h-5" /> Retour au catalogue
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-gradient mb-4">Explorer par Style</h1>
            <p className="text-xl text-slate-300">Découvrez des beats classés par genre musical</p>
          </div>

          {/* Style Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {styles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(selectedStyle === style.id ? null : style.id)}
                className={`glass rounded-2xl p-6 text-center hover:scale-[1.03] transition-all group ${
                  selectedStyle === style.id ? "ring-2 ring-brand-gold bg-brand-gold/5" : ""
                }`}
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${style.color} flex items-center justify-center mb-3`}>
                  <span className="text-3xl">{style.emoji}</span>
                </div>
                <h3 className="font-bold text-lg group-hover:text-brand-gold">{style.label}</h3>
                <p className="text-sm text-slate-400">{style.count} beats</p>
              </button>
            ))}
          </div>

          {/* Beats for selected style */}
          {selectedStyle && (
            <div>
              <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-3">
                <span>{styles.find((s) => s.id === selectedStyle)?.emoji}</span>
                Beats {styles.find((s) => s.id === selectedStyle)?.label}
              </h2>
              {currentBeats.length > 0 ? (
                <div className="space-y-3">
                  {currentBeats.map((beat, i) => (
                    <div key={i} className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-white/5">
                      <button className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center hover:bg-brand-gold/20 flex-shrink-0">
                        <Play className="w-5 h-5 text-brand-gold ml-0.5" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm">{beat.title}</h4>
                        <p className="text-xs text-slate-400">{beat.producer}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
                        <span>{beat.bpm} BPM</span>
                        <span>{beat.key}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {beat.duration}</span>
                      </div>
                      <button className="glass p-2 rounded-lg hover:bg-white/10"><Heart className="w-4 h-4" /></button>
                      <div className="text-brand-gold font-bold text-sm">{beat.price}€</div>
                      <button className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1">
                        <ShoppingCart className="w-4 h-4" /> Ajouter
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass rounded-2xl p-8 text-center">
                  <p className="text-slate-400">Aucun beat disponible pour ce style pour le moment.</p>
                  <Link href="/catalogue" className="text-brand-gold text-sm mt-2 inline-block hover:underline">
                    Voir tout le catalogue
                  </Link>
                </div>
              )}
            </div>
          )}

          {!selectedStyle && (
            <div className="glass rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-bold mb-2">Sélectionnez un style</h3>
              <p className="text-slate-400">Cliquez sur un genre musical ci-dessus pour découvrir les beats disponibles.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto max-w-7xl text-center text-slate-500 text-sm">
          © 2026 SUMVIBES by SAS BE GREAT. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
