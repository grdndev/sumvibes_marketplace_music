"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ChevronLeft, Search, Filter, MapPin, Star, Clock, ArrowRight, Plus, MessageSquare, Briefcase } from "lucide-react";

const serviceCategories = [
  { id: "all", label: "Tous", emoji: "??" },
  { id: "mixage", label: "Mixage & Mastering", emoji: "???" },
  { id: "ecriture", label: "Écriture / Toplining", emoji: "??" },
  { id: "design", label: "Design & Artwork", emoji: "??" },
  { id: "video", label: "Vidéo & Clips", emoji: "??" },
  { id: "coaching", label: "Coaching", emoji: "??" },
  { id: "promo", label: "Promotion", emoji: "??" },
];

const services = [
  { id: 1, title: "Mixage & Mastering professionnel", description: "Mixage et mastering haute qualité pour tous genres musicaux. 10 ans d'expérience, matériel professionnel.", author: "StudioPro", avatar: "???", price: "À partir de 50€", category: "mixage", rating: 4.9, reviews: 127, location: "Paris", deliveryTime: "3-5 jours", featured: true },
  { id: 2, title: "Toplining / Écriture de textes", description: "Écriture de paroles et mélodies pour vos productions. Spécialisé R&B, Pop et Hip-Hop.", author: "LyricQueen", avatar: "??", price: "À partir de 30€", category: "ecriture", rating: 4.8, reviews: 89, location: "Lyon", deliveryTime: "2-4 jours", featured: true },
  { id: 3, title: "Artwork & Pochettes d'album", description: "Création graphique pour pochettes de singles, albums et playlists. Style moderne et impactant.", author: "DesignBeats", avatar: "??", price: "À partir de 25€", category: "design", rating: 4.7, reviews: 63, location: "Marseille", deliveryTime: "2-3 jours", featured: false },
  { id: 4, title: "Réalisation de clips musicaux", description: "Production de clips vidéo professionnels. Tournage, montage, effets spéciaux et color grading.", author: "ClipMaster", avatar: "??", price: "À partir de 200€", category: "video", rating: 4.9, reviews: 34, location: "Paris", deliveryTime: "7-14 jours", featured: false },
  { id: 5, title: "Coaching production musicale", description: "Sessions de coaching personnalisées pour améliorer vos skills en production. FL Studio, Ableton, Logic.", author: "ProCoach", avatar: "??", price: "À partir de 40€/h", category: "coaching", rating: 5.0, reviews: 45, location: "En ligne", deliveryTime: "Sur RDV", featured: true },
  { id: 6, title: "Promotion sur réseaux sociaux", description: "Promotion de vos productions sur Instagram, TikTok, YouTube. Stratégie marketing personnalisée.", author: "PromoKing", avatar: "??", price: "À partir de 80€", category: "promo", rating: 4.6, reviews: 28, location: "En ligne", deliveryTime: "5-7 jours", featured: false },
  { id: 7, title: "Mastering analogique", description: "Mastering sur chaîne analogique haut de gamme. Neve, SSL, Manley. Son chaleureux et puissant.", author: "AnalogPro", avatar: "??", price: "À partir de 80€", category: "mixage", rating: 4.9, reviews: 56, location: "Bordeaux", deliveryTime: "3-5 jours", featured: false },
  { id: 8, title: "Enregistrement vocal professionnel", description: "Studio d'enregistrement avec micro Neumann U87 et préampli Avalon. Ambiance créative garantie.", author: "VocalStudio", avatar: "??", price: "À partir de 60€/h", category: "mixage", rating: 4.8, reviews: 41, location: "Paris", deliveryTime: "Sur RDV", featured: false },
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = services.filter((s) => {
    const matchCat = activeCategory === "all" || s.category === activeCategory;
    const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="relative flex-1 flex flex-col bg-gradient-premium">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/community" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-gold mb-8 transition-colors text-sm font-medium">
            <ChevronLeft className="w-5 h-5" /> Retour au Hub
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-gold/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 glass px-3 py-1 rounded-full text-xs mb-4 border border-brand-gold/20 text-brand-gold uppercase tracking-widest font-bold">
                <Briefcase className="w-3 h-3" /> Espace Pro
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight mb-2">
                <span className="text-gradient drop-shadow-lg">Services</span> Musicaux
              </h1>
              <p className="text-lg text-slate-300 font-light max-w-xl">
                Trouvez des professionnels de l'industrie pour donner vie à vos projets. Mixage, toplining, design...
              </p>
            </div>
            <button className="btn-primary px-8 py-3.5 rounded-full font-bold flex items-center gap-2 self-start shadow-[0_4px_20px_0_rgba(254,204,51,0.3)] hover:shadow-[0_6px_25px_rgba(254,204,51,0.25)] hover:scale-105 transition-all relative z-10">
              <Plus className="w-5 h-5" /> Proposer un service
            </button>
          </div>

          {/* Search & Filters */}
          <div className="glass rounded-3xl p-6 lg:p-8 mb-16 relative overflow-hidden border border-white/10 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-10">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-gold transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher un service, un producteur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold/50 focus:bg-white/5 transition-all shadow-inner"
                />
              </div>
              <button className="glass px-6 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 hover:border-brand-gold/30 transition-all font-semibold">
                <Filter className="w-5 h-5" /> Filtres avancés
              </button>
            </div>

            <div className="flex flex-wrap gap-3 relative z-10">
              {serviceCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md flex items-center gap-2 ${
                      isActive 
                        ? "bg-brand-gold text-black shadow-[0_0_15px_rgba(254,204,51,0.4)] scale-105" 
                        : "glass bg-black/40 hover:bg-white/10 border border-white/5 hover:border-white/20 text-slate-300"
                    }`}
                  >
                    <span>{cat.emoji}</span> {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured */}
          {activeCategory === "all" && !searchQuery && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold font-display mb-8 flex items-center gap-3">
                <Star className="w-8 h-8 text-brand-gold fill-brand-gold/20" /> Services premium
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.filter((s) => s.featured).map((service) => (
                  <ServiceCard key={service.id} service={service} featured />
                ))}
              </div>
            </div>
          )}

          {/* All Services */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold font-display">
                {searchQuery ? "Résultats de recherche" : activeCategory === "all" ? "Découvrir" : serviceCategories.find((c) => c.id === activeCategory)?.label}
              </h2>
              <span className="text-sm font-medium text-slate-400 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">{filtered.length} service{filtered.length > 1 ? 's' : ''}</span>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((service) => (
                  <ServiceCard key={service.id} service={service} featured={false} />
                ))}
              </div>
            ) : (
              <div className="glass rounded-3xl p-16 text-center border border-white/10 bg-black/20">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <span className="text-5xl">??</span>
                </div>
                <h3 className="text-2xl font-bold font-display mb-3">Aucun service trouvé</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-8 font-light">
                  Nous n'avons trouvé aucun service correspondant à vos critères actuels. Essayez de modifier vos filtres.
                </p>
                <button 
                  onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                  className="btn-primary px-8 py-3 rounded-full font-bold shadow-lg"
                >
                  Réinitialiser la recherche
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 mt-12 bg-black/20">
        <div className="mx-auto max-w-7xl text-center text-slate-500 text-sm font-medium">
          © 2026 SUMVIBES by SAS BE GREAT. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ service, featured }: { service: (typeof services)[number]; featured?: boolean }) {
  return (
    <div className={`glass rounded-3xl p-6 lg:p-8 hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col h-full ${
      featured 
        ? "border border-brand-gold/30 shadow-[0_10px_40px_rgba(254,204,51,0.08)] bg-gradient-to-br from-white/[0.07] to-white/[0.02]" 
        : "border border-white/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-black/20"
    }`}>
      {featured && (
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/10 blur-[50px] rounded-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
      )}
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl glass bg-black/40 flex items-center justify-center text-3xl shadow-inner border border-white/10 group-hover:scale-110 transition-transform">
            {service.avatar}
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-widest text-brand-gold uppercase mb-1 bg-brand-gold/10 inline-block px-2 py-0.5 rounded-md border border-brand-gold/20">
              {service.category}
            </div>
            <p className="text-sm font-medium text-slate-300">
              Par <span className="text-white hover:text-brand-gold transition-colors cursor-pointer">{service.author}</span>
            </p>
          </div>
        </div>
        
        {featured && (
          <div className="bg-brand-gold text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(254,204,51,0.4)] flex items-center gap-1">
            <Star className="w-3 h-3 fill-black" /> PRO
          </div>
        )}
      </div>

      <h3 className="font-bold text-xl mb-3 text-white leading-snug relative z-10 group-hover:text-brand-gold transition-colors line-clamp-2">
        {service.title}
      </h3>
      
      <p className="text-sm text-slate-400 mb-6 font-light line-clamp-3 relative z-10 flex-grow">
        {service.description}
      </p>

      <div className="flex flex-wrap gap-2 text-[11px] font-medium text-slate-300 mb-6 relative z-10">
        <span className="flex items-center gap-1.5 glass bg-black/40 px-3 py-1.5 rounded-lg border border-white/5"><Star className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" /> <span className="text-white">{service.rating}</span> ({service.reviews})</span>
        <span className="flex items-center gap-1.5 glass bg-black/40 px-3 py-1.5 rounded-lg border border-white/5"><MapPin className="w-3.5 h-3.5 text-brand-purple-light" /> {service.location}</span>
        <span className="flex items-center gap-1.5 glass bg-black/40 px-3 py-1.5 rounded-lg border border-white/5"><Clock className="w-3.5 h-3.5 text-green-400" /> {service.deliveryTime}</span>
      </div>

      <div className="pt-5 border-t border-white/10 flex items-center justify-between relative z-10 mt-auto">
        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-0.5">Tarif de base</span>
          <div className="text-brand-gold font-bold text-xl drop-shadow-md">{service.price}</div>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-xl glass bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white hover:text-brand-gold border border-white/10 hover:border-brand-gold/30">
            <MessageSquare className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center transition-all shadow-md group-hover:shadow-[0_4px_15px_rgba(254,204,51,0.4)]">
            <ArrowRight className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
