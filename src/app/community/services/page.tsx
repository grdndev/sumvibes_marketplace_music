"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ChevronLeft, Search, Filter, MapPin, Star, Clock, ArrowRight, Plus, MessageSquare } from "lucide-react";

const serviceCategories = [
  { id: "all", label: "Tous", emoji: "🌐" },
  { id: "mixage", label: "Mixage & Mastering", emoji: "🎛️" },
  { id: "ecriture", label: "Écriture / Toplining", emoji: "✍️" },
  { id: "design", label: "Design & Artwork", emoji: "🎨" },
  { id: "video", label: "Vidéo & Clips", emoji: "🎬" },
  { id: "coaching", label: "Coaching", emoji: "🎓" },
  { id: "promo", label: "Promotion", emoji: "📢" },
];

const services = [
  { id: 1, title: "Mixage & Mastering professionnel", description: "Mixage et mastering haute qualité pour tous genres musicaux. 10 ans d'expérience, matériel professionnel.", author: "StudioPro", avatar: "🎛️", price: "À partir de 50€", category: "mixage", rating: 4.9, reviews: 127, location: "Paris", deliveryTime: "3-5 jours", featured: true },
  { id: 2, title: "Toplining / Écriture de textes", description: "Écriture de paroles et mélodies pour vos productions. Spécialisé R&B, Pop et Hip-Hop.", author: "LyricQueen", avatar: "✍️", price: "À partir de 30€", category: "ecriture", rating: 4.8, reviews: 89, location: "Lyon", deliveryTime: "2-4 jours", featured: true },
  { id: 3, title: "Artwork & Pochettes d'album", description: "Création graphique pour pochettes de singles, albums et playlists. Style moderne et impactant.", author: "DesignBeats", avatar: "🎨", price: "À partir de 25€", category: "design", rating: 4.7, reviews: 63, location: "Marseille", deliveryTime: "2-3 jours", featured: false },
  { id: 4, title: "Réalisation de clips musicaux", description: "Production de clips vidéo professionnels. Tournage, montage, effets spéciaux et color grading.", author: "ClipMaster", avatar: "🎬", price: "À partir de 200€", category: "video", rating: 4.9, reviews: 34, location: "Paris", deliveryTime: "7-14 jours", featured: false },
  { id: 5, title: "Coaching production musicale", description: "Sessions de coaching personnalisées pour améliorer vos skills en production. FL Studio, Ableton, Logic.", author: "ProCoach", avatar: "🎓", price: "À partir de 40€/h", category: "coaching", rating: 5.0, reviews: 45, location: "En ligne", deliveryTime: "Sur RDV", featured: true },
  { id: 6, title: "Promotion sur réseaux sociaux", description: "Promotion de vos productions sur Instagram, TikTok, YouTube. Stratégie marketing personnalisée.", author: "PromoKing", avatar: "📢", price: "À partir de 80€", category: "promo", rating: 4.6, reviews: 28, location: "En ligne", deliveryTime: "5-7 jours", featured: false },
  { id: 7, title: "Mastering analogique", description: "Mastering sur chaîne analogique haut de gamme. Neve, SSL, Manley. Son chaleureux et puissant.", author: "AnalogPro", avatar: "🔊", price: "À partir de 80€", category: "mixage", rating: 4.9, reviews: 56, location: "Bordeaux", deliveryTime: "3-5 jours", featured: false },
  { id: 8, title: "Enregistrement vocal professionnel", description: "Studio d'enregistrement avec micro Neumann U87 et préampli Avalon. Ambiance créative garantie.", author: "VocalStudio", avatar: "🎤", price: "À partir de 60€/h", category: "mixage", rating: 4.8, reviews: 41, location: "Paris", deliveryTime: "Sur RDV", featured: false },
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
    <div className="relative min-h-screen bg-gradient-premium">
      <Navbar />

      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Link href="/community" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-gold mb-6">
            <ChevronLeft className="w-5 h-5" /> Retour à la communauté
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-display text-gradient">Services</h1>
              <p className="text-slate-400 mt-2">Trouvez des professionnels pour vos projets musicaux</p>
            </div>
            <button className="btn-primary px-6 py-3 rounded-full font-semibold flex items-center gap-2 self-start">
              <Plus className="w-5 h-5" /> Proposer un service
            </button>
          </div>

          {/* Search & Filters */}
          <div className="glass rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold/50"
                />
              </div>
              <button className="glass px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-white/10">
                <Filter className="w-5 h-5" /> Filtrer
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {serviceCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat.id ? "bg-brand-gold text-brand-purple" : "glass hover:bg-white/10"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Featured */}
          {activeCategory === "all" && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold font-display mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-brand-gold" /> Services en vedette
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.filter((s) => s.featured).map((service) => (
                  <ServiceCard key={service.id} service={service} featured />
                ))}
              </div>
            </div>
          )}

          {/* All Services */}
          <div>
            <h2 className="text-2xl font-bold font-display mb-4">
              {activeCategory === "all" ? "Tous les services" : serviceCategories.find((c) => c.id === activeCategory)?.label}
            </h2>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="glass rounded-3xl p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">Aucun service trouvé</h3>
                <p className="text-slate-400">Modifiez vos critères de recherche ou proposez votre propre service.</p>
              </div>
            )}
          </div>
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

function ServiceCard({ service, featured }: { service: (typeof services)[number]; featured?: boolean }) {
  return (
    <div className={`glass rounded-2xl p-6 hover:scale-[1.01] transition-transform ${featured ? "border border-brand-gold/30" : ""}`}>
      {featured && (
        <div className="inline-flex items-center gap-1 bg-brand-gold/10 text-brand-gold text-xs font-bold px-3 py-1 rounded-full mb-3">
          <Star className="w-3 h-3" /> En vedette
        </div>
      )}
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl">{service.avatar}</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">{service.title}</h3>
          <p className="text-sm text-slate-400">par <span className="text-white">{service.author}</span></p>
        </div>
      </div>
      <p className="text-sm text-slate-300 mb-4 line-clamp-2">{service.description}</p>
      <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-4">
        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-brand-gold" /> {service.rating} ({service.reviews})</span>
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {service.location}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {service.deliveryTime}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-brand-gold font-bold">{service.price}</div>
        <div className="flex gap-2">
          <button className="glass px-3 py-2 rounded-xl text-sm hover:bg-white/10 flex items-center gap-1">
            <MessageSquare className="w-4 h-4" /> Contacter
          </button>
          <button className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
            Voir <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
