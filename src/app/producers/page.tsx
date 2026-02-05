import Link from "next/link";

export default function ProducersPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-bold">Producteurs / Artistes</h1>
      <p className="mt-4 text-slate-400">Listing des profils producteurs et artistes. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/producers/featured" className="text-brand-gold hover:underline">Voir un profil</Link>
      </div>
    </main>
  );
}
