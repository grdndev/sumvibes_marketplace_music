"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ChevronLeft, User, Mail, Lock, Bell, Shield, Trash2, Save, Eye, EyeOff, Camera, Globe, Music } from "lucide-react";

const tabs = [
  { id: "profile", label: "Profil", icon: User },
  { id: "security", label: "Sécurité", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "preferences", label: "Préférences", icon: Music },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-premium">
      <Navbar />

      <main className="pt-20">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <Link href="/account" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-gold mb-6">
            <ChevronLeft className="w-5 h-5" /> Retour au compte
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold font-display text-gradient mb-8">Paramètres</h1>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeTab === tab.id ? "bg-brand-gold text-brand-purple" : "glass hover:bg-white/10"
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Success */}
          {saved && (
            <div className="glass rounded-xl p-4 mb-6 border border-green-500/20 bg-green-500/5 text-green-400 text-sm font-semibold">
              ✅ Modifications enregistrées avec succès !
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="glass rounded-3xl p-8">
              <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-brand-gold" /> Informations personnelles
              </h2>

              {/* Avatar */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-brand-gold to-yellow-500 flex items-center justify-center text-4xl font-bold text-brand-purple">
                    JD
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-gold text-brand-purple flex items-center justify-center hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold">Photo de profil</h3>
                  <p className="text-sm text-slate-400">JPG, PNG ou GIF. Max 2 Mo.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">Prénom</label>
                  <input type="text" defaultValue="John" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-gold/50" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">Nom</label>
                  <input type="text" defaultValue="Doe" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-gold/50" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">Nom d&apos;artiste</label>
                  <input type="text" defaultValue="JohnD_Music" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-gold/50" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block flex items-center gap-2"><Mail className="w-4 h-4" /> Email</label>
                  <input type="email" defaultValue="john.doe@email.com" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-gold/50" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">Bio</label>
                  <textarea rows={3} defaultValue="Passionné de musique, toujours à la recherche de nouveaux sons." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-gold/50 resize-none" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block flex items-center gap-2"><Globe className="w-4 h-4" /> Site web</label>
                  <input type="url" placeholder="https://votre-site.com" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold/50" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">Pays</label>
                  <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-gold/50">
                    <option value="FR">France</option>
                    <option value="BE">Belgique</option>
                    <option value="CH">Suisse</option>
                    <option value="CA">Canada</option>
                    <option value="SN">Sénégal</option>
                    <option value="CI">Côte d&apos;Ivoire</option>
                  </select>
                </div>
              </div>
              <button onClick={handleSave} className="btn-primary px-8 py-3 rounded-full font-semibold mt-8 flex items-center gap-2">
                <Save className="w-5 h-5" /> Enregistrer
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="glass rounded-3xl p-8">
                <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-brand-gold" /> Changer le mot de passe
                </h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm font-semibold text-slate-300 mb-2 block">Mot de passe actuel</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-gold/50 pr-12" />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-300 mb-2 block">Nouveau mot de passe</label>
                    <input type="password" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-gold/50" />
                    <p className="text-xs text-slate-400 mt-1">Minimum 8 caractères avec majuscules, chiffres et caractères spéciaux</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-300 mb-2 block">Confirmer le mot de passe</label>
                    <input type="password" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-gold/50" />
                  </div>
                  <button onClick={handleSave} className="btn-primary px-8 py-3 rounded-full font-semibold flex items-center gap-2">
                    <Save className="w-5 h-5" /> Modifier le mot de passe
                  </button>
                </div>
              </div>

              <div className="glass rounded-3xl p-8">
                <h2 className="text-2xl font-bold font-display mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-brand-gold" /> Authentification à deux facteurs
                </h2>
                <p className="text-slate-400 mb-4">Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
                <button className="glass px-6 py-3 rounded-full font-semibold hover:bg-white/10">
                  Activer la 2FA
                </button>
              </div>

              <div className="glass rounded-3xl p-8 border border-red-500/20">
                <h2 className="text-2xl font-bold font-display mb-4 flex items-center gap-2 text-red-400">
                  <Trash2 className="w-6 h-6" /> Zone dangereuse
                </h2>
                <p className="text-slate-400 mb-4">La suppression de votre compte est irréversible. Toutes vos données seront perdues.</p>
                <button className="glass px-6 py-3 rounded-full font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/10">
                  Supprimer mon compte
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="glass rounded-3xl p-8">
              <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6 text-brand-gold" /> Préférences de notification
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Nouveaux messages", desc: "Recevoir une notification pour chaque nouveau message", default: true },
                  { label: "Nouveaux beats", desc: "Être notifié des nouvelles publications de vos producteurs favoris", default: true },
                  { label: "Promotions", desc: "Recevoir les offres spéciales et codes promo", default: false },
                  { label: "Newsletter", desc: "Newsletter hebdomadaire avec les tendances et nouveautés", default: true },
                  { label: "Réponses forum", desc: "Notifications des réponses à vos discussions", default: true },
                  { label: "Mises à jour", desc: "Informations sur les nouvelles fonctionnalités de SUMVIBES", default: false },
                ].map((notif, i) => (
                  <div key={i} className="flex items-center justify-between glass rounded-xl p-4">
                    <div>
                      <div className="font-semibold text-sm">{notif.label}</div>
                      <div className="text-xs text-slate-400">{notif.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={notif.default} className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold" />
                    </label>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="btn-primary px-8 py-3 rounded-full font-semibold mt-6 flex items-center gap-2">
                <Save className="w-5 h-5" /> Enregistrer
              </button>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="glass rounded-3xl p-8">
              <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-2">
                <Music className="w-6 h-6 text-brand-gold" /> Préférences musicales
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-3 block">Genres préférés</label>
                  <div className="flex flex-wrap gap-2">
                    {["Trap", "R&B", "Pop", "Hip-Hop", "Afrobeat", "Drill", "Lo-Fi", "Soul", "Reggaeton", "Électro", "Dancehall", "Jazz"].map((genre) => (
                      <button
                        key={genre}
                        className="glass px-4 py-2 rounded-full text-sm hover:bg-brand-gold hover:text-brand-purple transition-all"
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-3 block">Moods préférés</label>
                  <div className="flex flex-wrap gap-2">
                    {["Sombre", "Joyeux", "Énergique", "Mélancolique", "Romantique", "Agressif", "Calme", "Festif"].map((mood) => (
                      <button
                        key={mood}
                        className="glass px-4 py-2 rounded-full text-sm hover:bg-brand-gold hover:text-brand-purple transition-all"
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">Langue</label>
                  <select className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-gold/50">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              <button onClick={handleSave} className="btn-primary px-8 py-3 rounded-full font-semibold mt-8 flex items-center gap-2">
                <Save className="w-5 h-5" /> Enregistrer
              </button>
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
