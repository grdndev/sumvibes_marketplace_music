"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Music, Play, Search, SlidersHorizontal, Grid3X3, List, Heart, ShoppingCart, ChevronDown } from "lucide-react";
import { useBeats } from "@/hooks/useBeats";

const GENRES = ["Tous", "Trap", "Hip-Hop", "R&B", "Afrobeat", "Drill", "Pop", "Reggaeton", "Lo-Fi", "Boom Bap"];
const MOODS = ["Tous", "Dark", "Chill", "Uplifting", "Energetic", "Romantic", "Aggressive", "Melancholic"];

export default function CataloguePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Tous");
  const [selectedMood, setSelectedMood] = useState("Tous");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'price_low' | 'price_high'>("latest");
  const [showFilters, setShowFilters] = useState(false);

  // Mémoïser les filtres pour éviter les re-renders
  const filters = useMemo(() => ({
    genre: selectedGenre !== "Tous" ? selectedGenre : undefined,
    mood: selectedMood !== "Tous" ? selectedMood : undefined,
    search: searchQuery || undefined,
    sort: sortBy,
    limit: 50
  }), [selectedGenre, selectedMood, searchQuery, sortBy]);

  const { beats, loading, total } = useBeats(filters);

  return (
    <div className="relative min-h-screen bg-gradient-premium">
      <Navbar />

      <main className="pt-20">
        {/* Header */}
        <section className="px-6 py-12 md:py-16">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-4">
              Catalogue <span className="text-gradient">Musical</span> 🎶
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl">
              Explorez des milliers de productions premium. Filtrez par genre, BPM et ambiance.
            </p>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/catalogue/style" className="glass px-4 py-2 rounded-full text-sm hover:bg-white/10">Par Style</Link>
              <Link href="/catalogue/bpm" className="glass px-4 py-2 rounded-full text-sm hover:bg-white/10">Par BPM</Link>
              <Link href="/catalogue/filters/ambiance" className="glass px-4 py-2 rounded-full text-sm hover:bg-white/10">Par Ambiance</Link>
            </div>
          </div>
        </section>

        {/* Search & Filters Bar */}
        <section className="px-6 pb-8">
          <div className="mx-auto max-w-7xl">
            <div className="glass rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par titre, producteur..."
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold/50"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="glass px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-white/10 lg:hidden"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filtres
              </button>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-3">
                <div className="relative">
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white text-sm focus:outline-none focus:border-brand-gold/50 cursor-pointer"
                  >
                    {GENRES.map((g) => <option key={g} value={g} className="bg-brand-dark">{g}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white text-sm focus:outline-none focus:border-brand-gold/50 cursor-pointer"
                  >
                    {MOODS.map((m) => <option key={m} value={m} className="bg-brand-dark">{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white text-sm focus:outline-none focus:border-brand-gold/50 cursor-pointer"
                  >
                    <option value="latest" className="bg-brand-dark">Plus récents</option>
                    <option value="popular" className="bg-brand-dark">Populaires</option>
                    <option value="price_low" className="bg-brand-dark">Prix ↑</option>
                    <option value="price_high" className="bg-brand-dark">Prix ↓</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* View Mode */}
              <div className="hidden lg:flex items-center gap-1 glass rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-brand-gold/20 text-brand-gold" : "text-slate-400 hover:text-white"}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${viewMode === "list" ? "bg-brand-gold/20 text-brand-gold" : "text-slate-400 hover:text-white"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="glass rounded-2xl p-6 mt-4 space-y-4 lg:hidden">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Genre</label>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map((g) => (
                      <button key={g} onClick={() => setSelectedGenre(g)}
                        className={`px-3 py-1.5 rounded-full text-sm ${selectedGenre === g ? "bg-brand-gold text-black font-bold" : "glass hover:bg-white/10"}`}
                      >{g}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Ambiance</label>
                  <div className="flex flex-wrap gap-2">
                    {MOODS.map((m) => (
                      <button key={m} onClick={() => setSelectedMood(m)}
                        className={`px-3 py-1.5 rounded-full text-sm ${selectedMood === m ? "bg-brand-gold text-black font-bold" : "glass hover:bg-white/10"}`}
                      >{m}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <p className="text-slate-400">{loading ? "Chargement..." : `${total} résultat${total > 1 ? "s" : ""}`}</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass rounded-3xl p-5 animate-pulse">
                    <div className="aspect-square bg-white/5 rounded-2xl mb-5"></div>
                    <div className="h-6 bg-white/5 rounded mb-2"></div>
                    <div className="h-4 bg-white/5 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : beats.length === 0 ? (
              <div className="text-center py-20">
                <Music className="w-20 h-20 mx-auto mb-4 text-slate-600" />
                <p className="text-xl text-slate-400">Aucun beat trouvé</p>
                <p className="text-sm text-slate-500 mt-2">Essayez de modifier vos filtres</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {beats.map((beat) => (
                  <div key={beat.id} className="glass group relative overflow-hidden rounded-3xl p-5 hover:-translate-y-3 hover:shadow-2xl hover:shadow-brand-purple/30">
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-brand-purple/20 to-brand-pink/20">
                      {beat.coverImage ? (
                        <img src={beat.coverImage} alt={beat.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Music className="w-20 h-20 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100">
                        <Link href={`/product/${beat.slug}`} className="rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-dark p-5 text-black shadow-2xl hover:scale-110 glow-gold">
                          <Play className="h-8 w-8 fill-current" />
                        </Link>
                      </div>
                      <button className="absolute top-3 left-3 glass p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/20">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-5">
                      <h3 className="font-bold text-xl mb-1">{beat.title}</h3>
                      <p className="text-sm text-slate-400 mb-1">Prod. by {beat.seller.displayName || beat.seller.username}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                        <span className="glass px-2 py-1 rounded">{beat.bpm} BPM</span>
                        <span className="glass px-2 py-1 rounded">{beat.genre}</span>
                        {beat.mood && <span className="glass px-2 py-1 rounded">{beat.mood}</span>}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div>
                          <span className="text-2xl font-bold text-gradient">{Number(beat.basicPrice ?? 0).toFixed(2)} €</span>
                          <span className="text-xs text-slate-500 ml-2">Basic</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="glass rounded-xl p-2 hover:bg-brand-purple/20">
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                          <Link href={`/product/${beat.slug}`} className="glass rounded-xl px-4 py-2 text-sm font-semibold hover:bg-brand-purple/20">
                            Voir
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {beats.map((beat) => (
                  <div key={beat.id} className="glass rounded-2xl p-5 flex items-center gap-6 hover:scale-[1.01] group">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-pink/20 flex items-center justify-center overflow-hidden">
                      {beat.coverImage ? (
                        <img src={beat.coverImage} alt={beat.title} className="w-full h-full object-cover" />
                      ) : (
                        <Music className="w-8 h-8 text-white/30" />
                      )}
                      <Link href={`/product/${beat.slug}`} className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-xl">
                        <Play className="w-6 h-6 text-brand-gold fill-current" />
                      </Link>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{beat.title}</h3>
                      <p className="text-sm text-slate-400">{beat.seller.displayName || beat.seller.username}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-3 text-xs text-slate-500">
                      <span className="glass px-2 py-1 rounded">{beat.bpm} BPM</span>
                      <span className="glass px-2 py-1 rounded">{beat.genre}</span>
                      {beat.mood && <span className="glass px-2 py-1 rounded">{beat.mood}</span>}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gradient">{Number(beat.basicPrice ?? 0).toFixed(2)} €</div>
                      <div className="text-xs text-slate-500">{beat.plays.toLocaleString()} écoutes</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="glass rounded-xl p-2 hover:bg-brand-purple/20">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="glass rounded-xl p-2 hover:bg-brand-purple/20">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <Link href={`/product/${beat.slug}`} className="glass rounded-xl px-4 py-2 text-sm font-semibold hover:bg-brand-purple/20">
                        Détails
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
