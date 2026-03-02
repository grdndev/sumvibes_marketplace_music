"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, UploadCloud, Save } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const serviceCategories = [
    { id: "mixage", label: "Mixage & Mastering" },
    { id: "ecriture", label: "Écriture / Toplining" },
    { id: "design", label: "Design & Artwork" },
    { id: "video", label: "Vidéo & Clips" },
    { id: "coaching", label: "Coaching" },
    { id: "promo", label: "Promotion" },
];

export default function CreateServicePage() {
    const router = useRouter();
    const { token, user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "mixage",
        price: "",
        deliveryTime: "",
        location: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
            };

            if (!token) {
                throw new Error("Vous devez être connecté pour proposer un service.");
            }

            const res = await fetch("/api/services", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Une erreur s'est produite");
            }

            router.push("/community/services");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-slate-200">
            <Navbar />

            <main className="pt-24 pb-20 px-4 md:px-6">
                <div className="mx-auto max-w-3xl">
                    <Link href="/community/services" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-gold mb-8 transition-colors text-sm font-medium">
                        <ChevronLeft className="w-5 h-5" /> Retour aux services
                    </Link>

                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold font-display leading-tight mb-2">
                            Proposer un <span className="text-gradient drop-shadow-lg">Service</span>
                        </h1>
                        <p className="text-slate-400 mb-8">
                            Mettez en avant vos compétences et proposez vos services à la communauté SumVibes.
                        </p>
                    </div>

                    {(!user || (user.role !== "SELLER" && user.role !== "ADMIN")) ? (
                        <div className="glass rounded-3xl p-16 text-center border border-white/10 bg-black/20">
                            <h3 className="text-2xl font-bold font-display mb-3">Accès Vendeur Requis</h3>
                            <p className="text-slate-400 max-w-md mx-auto mb-8 font-light">
                                Seuls les producteurs disposant d'un profil de Vendeur peuvent proposer des services sur cette plateforme.
                            </p>
                            <Link
                                href="/user/profile/upgrade"
                                className="btn-primary px-8 py-3 rounded-full font-bold shadow-lg"
                            >
                                Devenir vendeur
                            </Link>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 font-medium">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-10 border border-white/10 space-y-6 bg-black/40">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-semibold mb-2 text-slate-300">Titre du service *</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            required
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Ex: Mixage & Mastering Professionnel pour Rap"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 transition-colors text-white"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="category" className="block text-sm font-semibold mb-2 text-slate-300">Catégorie *</label>
                                        <select
                                            id="category"
                                            name="category"
                                            required
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 transition-colors text-white appearance-none"
                                        >
                                            {serviceCategories.map((cat) => (
                                                <option key={cat.id} value={cat.id} className="bg-neutral-900 text-white">
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-semibold mb-2 text-slate-300">Description détaillée *</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            required
                                            rows={6}
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Décrivez précisément ce que vous proposez, vos expériences, le matériel utilisé, etc."
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 transition-colors text-white resize-y"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="price" className="block text-sm font-semibold mb-2 text-slate-300">Prix de base (€) *</label>
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="Ex: 50"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 transition-colors text-white"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="deliveryTime" className="block text-sm font-semibold mb-2 text-slate-300">Délai de livraison estimé</label>
                                            <input
                                                type="text"
                                                id="deliveryTime"
                                                name="deliveryTime"
                                                value={formData.deliveryTime}
                                                onChange={handleChange}
                                                placeholder="Ex: 3-5 jours"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 transition-colors text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="location" className="block text-sm font-semibold mb-2 text-slate-300">Localisation (Optionnel)</label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="Ex: Paris ou En Ligne"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 transition-colors text-white"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-primary px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" /> Publication...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" /> Publier ce service
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
