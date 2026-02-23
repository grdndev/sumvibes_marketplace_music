"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import {
  Music,
  Play,
  Pause,
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  Heart,
  ShoppingCart,
  ChevronDown,
  Clock,
} from "lucide-react";
import { useBeats } from "@/hooks/useBeats";

const GENRES = ["Tous", "Trap", "Hip-Hop", "R&B", "Afrobeat", "Drill", "Pop", "Reggaeton", "Lo-Fi", "Boom Bap"];
const MOODS  = ["Tous", "Dark", "Chill", "Uplifting", "Energetic", "Romantic", "Aggressive", "Melancholic"];

const GENRE_GRADIENT: Record<string, string> = {
  "Trap":      "from-red-500/40 to-orange-600/25",
  "Hip-Hop":   "from-blue-500/40 to-cyan-600/25",
  "R&B":       "from-purple-500/40 to-pink-600/25",
  "Afrobeat":  "from-green-500/40 to-emerald-600/25",
  "Drill":     "from-slate-400/40 to-zinc-600/25",
  "Pop":       "from-yellow-400/40 to-amber-600/25",
  "Reggaeton": "from-lime-500/40 to-green-600/25",
  "Lo-Fi":     "from-indigo-500/40 to-violet-600/25",
  "Boom Bap":  "from-orange-500/40 to-red-600/25",
};

const GENRE_EMOJI: Record<string, string> = {
  "Trap": "🔥", "Hip-Hop": "🎤", "R&B": "💜", "Afrobeat": "🌍",
  "Drill": "⚡", "Pop": "🌟", "Reggaeton": "🌴", "Lo-Fi": "🌙", "Boom Bap": "🥁",
};

function formatDuration(secs?: number | null) {
  if (!secs) return null;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function coverSrc(raw: string) {
  if (raw.startsWith("http") || raw.startsWith("/")) return raw;
  return `/uploads/covers/${raw}`;
}

export default function CataloguePage() {
  const [searchQuery,   setSearchQuery]   = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Tous");
  const [selectedMood,  setSelectedMood]  = useState("Tous");
  const [viewMode,      setViewMode]      = useState<"grid" | "list">("grid");
  const [sortBy,        setSortBy]        = useState<"latest" | "popular" | "price_low" | "price_high">("latest");
  const [showFilters,   setShowFilters]   = useState(false);
  const [playingId,     setPlayingId]     = useState<string | null>(null);
  const [likedIds,      setLikedIds]      = useState<Set<string>>(new Set());

  const togglePlay = (id: string) => setPlayingId(p => p === id ? null : id);
  const toggleLike = (id: string) => setLikedIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const filters = useMemo(() => ({
    genre:  selectedGenre !== "Tous" ? selectedGenre : undefined,
    mood:   selectedMood  !== "Tous" ? selectedMood  : undefined,
    search: searchQuery || undefined,
    sort:   sortBy,
  }), [selectedGenre, selectedMood, searchQuery, sortBy]);

  const { beats, loading, total } = useBeats(filters);

  return (
    <div className="relative min-h-screen bg-gradient-premium">
      <Navbar />

      <main className="pt-20">

        {/* ── Header ──────────────────────────────────────────────── */}
        <section className="px-6 py-12 md:py-16">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-4">
              Catalogue <span className="text-gradient">Musical</span> 🎶
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl">
              Explorez des milliers de productions premium. Filtrez par genre, BPM et ambiance.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/catalogue/style"            className="glass px-4 py-2 rounded-full text-sm hover:bg-white/10">Par Style</Link>
              <Link href="/catalogue/bpm"              className="glass px-4 py-2 rounded-full text-sm hover:bg-white/10">Par BPM</Link>
              <Link href="/catalogue/filters/ambiance" className="glass px-4 py-2 rounded-full text-sm hover:bg-white/10">Par Ambiance</Link>
            </div>
          </div>
        </section>

        {/* ── Filters Bar ─────────────────────────────────────────── */}
        <section className="px-6 pb-8">
          <div className="mx-auto max-w-7xl">
            <div className="glass rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center">

              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par titre, producteur..."
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold/50"
                />
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="glass px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-white/10 lg:hidden"
              >
                <SlidersHorizontal className="w-5 h-5" /> Filtres
              </button>

              {/* Desktop selects */}
              <div className="hidden lg:flex items-center gap-3">
                {[
                  { value: selectedGenre, onChange: setSelectedGenre, options: GENRES },
                  { value: selectedMood,  onChange: setSelectedMood,  options: MOODS  },
                ].map((sel, i) => (
                  <div key={i} className="relative">
                    <select
                      value={sel.value}
                      onChange={e => sel.onChange(e.target.value)}
                      className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white text-sm focus:outline-none focus:border-brand-gold/50 cursor-pointer"
                    >
                      {sel.options.map(o => (
                        <option key={o} value={o} className="bg-brand-dark">{o}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                ))}

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white text-sm focus:outline-none focus:border-brand-gold/50 cursor-pointer"
                  >
                    <option value="latest"     className="bg-brand-dark">Plus récents</option>
                    <option value="popular"    className="bg-brand-dark">Populaires</option>
                    <option value="price_low"  className="bg-brand-dark">Prix ↑</option>
                    <option value="price_high" className="bg-brand-dark">Prix ↓</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* View toggle */}
              <div className="hidden lg:flex items-center gap-1 glass rounded-xl p-1">
                <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-brand-gold/20 text-brand-gold" : "text-slate-400 hover:text-white"}`}>
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-brand-gold/20 text-brand-gold" : "text-slate-400 hover:text-white"}`}>
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile filters panel */}
            {showFilters && (
              <div className="glass rounded-2xl p-6 mt-4 space-y-4 lg:hidden">
                {[
                  { label: "Genre",    opts: GENRES, val: selectedGenre, set: setSelectedGenre },
                  { label: "Ambiance", opts: MOODS,  val: selectedMood,  set: setSelectedMood  },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-sm text-slate-400 mb-2 block">{f.label}</label>
                    <div className="flex flex-wrap gap-2">
                      {f.opts.map(o => (
                        <button
                          key={o}
                          onClick={() => f.set(o)}
                          className={`px-3 py-1.5 rounded-full text-sm ${f.val === o ? "bg-brand-gold text-black font-bold" : "glass hover:bg-white/10"}`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Results ─────────────────────────────────────────────── */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl">

            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-400 text-sm">
                {loading
                  ? "Chargement..."
                  : `${typeof total === "number" ? total : 0} résultat${(typeof total === "number" ? total : 0) > 1 ? "s" : ""}`}
              </p>
            </div>

            {/* ── Skeletons ── */}
            {loading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass rounded-xl p-4 flex items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/5 rounded w-1/3" />
                      <div className="h-3 bg-white/5 rounded w-1/5" />
                    </div>
                    <div className="hidden md:flex gap-6">
                      <div className="h-3 bg-white/5 rounded w-16" />
                      <div className="h-3 bg-white/5 rounded w-10" />
                      <div className="h-3 bg-white/5 rounded w-12" />
                    </div>
                    <div className="h-3 bg-white/5 rounded w-16" />
                    <div className="h-8 bg-white/5 rounded w-24" />
                  </div>
                ))}
              </div>

            ) : beats.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center">
                <div className="text-6xl mb-4">🎵</div>
                <p className="text-xl text-slate-400">Aucun beat trouvé</p>
                <p className="text-sm text-slate-500 mt-2">Essayez de modifier vos filtres</p>
              </div>

            ) : viewMode === "grid" ? (
              /* ══════════════════════════════════════════════════════
                 VUE GRILLE
              ══════════════════════════════════════════════════════ */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {beats.map((beat) => {
                  const genre0    = beat.genre?.[0] ?? "";
                  const mood0     = beat.mood?.[0]  ?? "";
                  const gradient  = GENRE_GRADIENT[genre0] ?? "from-brand-purple/30 to-brand-pink/25";
                  const emoji     = GENRE_EMOJI[genre0]    ?? "🎵";
                  const isLiked   = likedIds.has(beat.id);
                  const isPlaying = playingId === beat.id;
                  const duration  = formatDuration(beat.duration);

                  return (
                    <div
                      key={beat.id}
                      className={`glass group rounded-2xl p-6 text-center hover:scale-[1.03] hover:shadow-xl hover:shadow-black/30 transition-all duration-200 relative ${
                        isPlaying ? "ring-2 ring-brand-gold/50 bg-brand-gold/5" : ""
                      }`}
                    >
                      {/* Like */}
                      <button
                        onClick={() => toggleLike(beat.id)}
                        className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all ${
                          isLiked ? "text-rose-400 opacity-100" : "text-slate-600 opacity-0 group-hover:opacity-100 hover:text-rose-400"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                      </button>

                      {/* Cover / Emoji */}
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 relative overflow-hidden`}>
                        {beat.coverImage ? (
                          <Image
                            src={coverSrc(beat.coverImage)}
                            alt={beat.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-3xl">{emoji}</span>
                        )}
                        {isPlaying && (
                          <div className="absolute inset-0 bg-black/55 flex items-end justify-center gap-[3px] pb-1.5">
                            {[0.1, 0.22, 0.14].map((d, i) => (
                              <span
                                key={i}
                                className="w-[3px] bg-brand-gold rounded-sm"
                                style={{ height: "50%", animation: `eqBar 0.55s ease-in-out ${d}s infinite alternate` }}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Titre */}
                      <h3 className={`font-bold text-lg leading-tight mb-0.5 line-clamp-1 transition-colors ${isPlaying ? "text-brand-gold" : "group-hover:text-brand-gold"}`}>
                        {beat.title}
                      </h3>

                      {/* Producteur */}
                      <p className="text-sm text-slate-400 mb-3 line-clamp-1">
                        {beat.seller?.displayName || beat.seller?.username}
                      </p>

                      {/* Méta */}
                      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-4 flex-wrap">
                        {beat.bpm && <span>{beat.bpm} BPM</span>}
                        {beat.key && <><span className="text-slate-700">·</span><span>{beat.key}</span></>}
                        {duration && <><span className="text-slate-700">·</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{duration}</span></>}
                        {mood0    && <><span className="text-slate-700">·</span><span>{mood0}</span></>}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <span className="text-brand-gold font-bold text-sm">
                          {Number(beat.basicPrice ?? 0).toFixed(2)}€
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePlay(beat.id)}
                            className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center hover:bg-brand-gold/20 transition-colors"
                          >
                            {isPlaying
                              ? <Pause className="w-3.5 h-3.5 text-brand-gold fill-current" />
                              : <Play  className="w-3.5 h-3.5 text-brand-gold fill-current ml-0.5" />
                            }
                          </button>
                          <button className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1">
                            <ShoppingCart className="w-3.5 h-3.5" /> Ajouter
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            ) : (
              /* ══════════════════════════════════════════════════════
                 VUE LISTE
              ══════════════════════════════════════════════════════ */
              <div className="space-y-3">
                {beats.map((beat) => {
                  const genre0    = beat.genre?.[0] ?? "";
                  const isPlaying = playingId === beat.id;
                  const isLiked   = likedIds.has(beat.id);
                  const duration  = formatDuration(beat.duration);

                  return (
                    <div
                      key={beat.id}
                      className={`glass rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-white/5 ${
                        isPlaying ? "ring-1 ring-brand-gold/40 bg-brand-gold/5" : ""
                      }`}
                    >
                      {/* Cover miniature */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-brand-purple/20 to-brand-pink/20 relative">
                        {beat.coverImage ? (
                          <Image
                            src={coverSrc(beat.coverImage)}
                            alt={beat.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <Music className="w-6 h-6 text-white/30 absolute inset-0 m-auto" />
                        )}
                      </div>

                      {/* Bouton play rond doré */}
                      <button
                        onClick={() => togglePlay(beat.id)}
                        className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center hover:bg-brand-gold/20 transition-colors flex-shrink-0"
                      >
                        {isPlaying
                          ? <Pause className="w-5 h-5 text-brand-gold fill-current" />
                          : <Play  className="w-5 h-5 text-brand-gold ml-0.5" />
                        }
                      </button>

                      {/* Titre + producteur */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${beat.slug}`}
                          className={`font-bold text-sm block truncate transition-colors ${isPlaying ? "text-brand-gold" : "hover:text-brand-gold"}`}
                        >
                          {beat.title}
                        </Link>
                        <p className="text-xs text-slate-400 truncate">
                          {beat.seller?.displayName || beat.seller?.username}
                        </p>
                      </div>

                      {/* Méta */}
                      <div className="hidden md:flex items-center gap-6 text-xs text-slate-400 flex-shrink-0">
                        {beat.bpm  && <span>{beat.bpm} BPM</span>}
                        {beat.key  && <span>{beat.key}</span>}
                        {duration  && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{duration}</span>}
                        {genre0    && <span>{genre0}</span>}
                      </div>

                      {/* Like */}
                      <button
                        onClick={() => toggleLike(beat.id)}
                        className={`glass p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0 ${isLiked ? "text-rose-400" : ""}`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                      </button>

                      {/* Prix */}
                      <div className="text-brand-gold font-bold text-sm flex-shrink-0">
                        {Number(beat.basicPrice ?? 0).toFixed(2)}€
                      </div>

                      {/* Ajouter */}
                      <button className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 flex-shrink-0">
                        <ShoppingCart className="w-4 h-4" /> Ajouter
                      </button>
                    </div>
                  );
                })}
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

      <style>{`
        @keyframes eqBar {
          from { transform: scaleY(0.35); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}