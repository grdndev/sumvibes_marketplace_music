import Link from "next/link";

export default function CatalogueStylePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-bold">Catalogue par style</h1>
      <p className="mt-4 text-slate-400">Liste des styles musicaux et filtres. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/catalogue" className="text-brand-gold hover:underline">Retour au catalogue</Link>
      </div>
    </main>
  );
}
