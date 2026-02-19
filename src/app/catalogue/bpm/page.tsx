"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ChevronLeft, Play, ShoppingCart, Heart, Clock, Music } from "lucide-react";

const bpmRanges = [
  { id: "60-80", label: "60-80 BPM", description: "Ballades, Lo-Fi, Chill", emoji: "🌙", count: 87 },
  { id: "80-100", label: "80-100 BPM", description: "R&B, Soul, Reggaeton", emoji: "💜", count: 156 },
  { id: "100-120", label: "100-120 BPM", description: "Pop, Dancehall, Afrobeat", emoji: "🌟", count: 203 },
  { id: "120-140", label: "120-140 BPM", description: "House, Électro, Dance", emoji: "💿", count: 134 },
  { id: "140-160", label: "140-160 BPM", description: "Trap, Drill, Hip-Hop", emoji: "🔥", count: 298 },
  { id: "160-180", label: "160-180 BPM", description: "Drum & Bass, Jungle", emoji: "⚡", count: 65 },
  { id: "180+", label: "180+ BPM", description: "Hardstyle, Speedcore", emoji: "🚀", count: 28 },
];

const beatsByBpm: Record<string, Array<{ title: string; producer: string; bpm: number; price: number; genre: string; key: string; duration: string }>> = {
  "60-80": [
    { title: "Midnight Rain", producer: "ChillMaster", bpm: 72, price: 24.99, genre: "Lo-Fi", key: "Am", duration: "3:45" },
    { title: "Slow Burn", producer: "MelodyQueen", bpm: 68, price: 29.99, genre: "R&B", key: "Fm", duration: "4:10" },
    { title: "Whisper", producer: "SoulVibes", bpm: 75, price: 19.99, genre: "Soul", key: "Bb", duration: "3:22" },
  ],
  "140-160": [
    { title: "Dark Shadows", producer: "BeatMaker92", bpm: 140, price: 29.99, genre: "Trap", key: "Cm", duration: "3:24" },
    { title: "Night Rider", producer: "TrapKing_FR", bpm: 145, price: 39.99, genre: "Trap", key: "Gm", duration: "3:12" },
    { title: "Venom", producer: "DrillKid", bpm: 150, price: 34.99, genre: "Drill", key: "Dm", duration: "2:58" },
    { title: "Inferno", producer: "BassMaster", bpm: 142, price: 24.99, genre: "Trap", key: "Em", duration: "3:45" },
  ],
  "100-120": [
    { title: "Sunshine", producer: "AfroKing", bpm: 108, price: 34.99, genre: "Afrobeat", key: "G", duration: "3:35" },
    { title: "Fiesta", producer: "LatinFlow", bpm: 100, price: 29.99, genre: "Reggaeton", key: "Am", duration: "3:18" },
    { title: "Island Breeze", producer: "TropicalProd", bpm: 112, price: 24.99, genre: "Dancehall", key: "C", duration: "3:42" },
  ],
};

export default function BpmPage() {
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  const currentBeats = selectedRange ? beatsByBpm[selectedRange] || [] : [];

  return (
    <div className="relative min-h-screen bg-gradient-premium">
      <Navbar />

      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Link href="/catalogue" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-gold mb-6">
            <ChevronLeft className="w-5 h-5" /> Retour au catalogue
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-gradient mb-4">Explorer par BPM</h1>
            <p className="text-xl text-slate-300">Trouvez le tempo parfait pour votre projet</p>
          </div>

          {/* BPM Ranges */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {bpmRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setSelectedRange(selectedRange === range.id ? null : range.id)}
                className={`glass rounded-2xl p-6 text-left hover:scale-[1.03] transition-all group ${
                  selectedRange === range.id ? "ring-2 ring-brand-gold bg-brand-gold/5" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{range.emoji}</span>
                  <span className="glass px-3 py-1 rounded-full text-xs">{range.count} beats</span>
                </div>
                <h3 className="text-xl font-bold group-hover:text-brand-gold">{range.label}</h3>
                <p className="text-sm text-slate-400 mt-1">{range.description}</p>
                {/* Visual BPM bar */}
                <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-gold to-yellow-500 rounded-full"
                    style={{ width: `${Math.min(100, (range.count / 300) * 100)}%` }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* BPM Slider visualization */}
          <div className="glass rounded-3xl p-8 mb-12">
            <h3 className="font-bold font-display text-lg mb-4 flex items-center gap-2">
              <Music className="w-5 h-5 text-brand-gold" /> Distribution des BPM
            </h3>
            <div className="flex items-end gap-2 h-32">
              {bpmRanges.map((range) => (
                <div key={range.id} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      selectedRange === range.id ? "bg-brand-gold" : "bg-brand-gold/30 hover:bg-brand-gold/50"
                    }`}
                    style={{ height: `${Math.max(20, (range.count / 300) * 100)}%` }}
                  />
                  <span className="text-xs text-slate-400 text-center">{range.label.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Beats for selected range */}
          {selectedRange && (
            <div>
              <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-3">
                <span>{bpmRanges.find((r) => r.id === selectedRange)?.emoji}</span>
                Beats {bpmRanges.find((r) => r.id === selectedRange)?.label}
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
                        <span className="text-brand-gold font-bold">{beat.bpm} BPM</span>
                        <span className="glass px-2 py-0.5 rounded-full">{beat.genre}</span>
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
                  <p className="text-slate-400">Aucun beat disponible dans cette plage de BPM pour le moment.</p>
                  <Link href="/catalogue" className="text-brand-gold text-sm mt-2 inline-block hover:underline">
                    Voir tout le catalogue
                  </Link>
                </div>
              )}
            </div>
          )}

          {!selectedRange && (
            <div className="glass rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-bold mb-2">Sélectionnez une plage de BPM</h3>
              <p className="text-slate-400">Cliquez sur un tempo ci-dessus pour découvrir les beats disponibles.</p>
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
