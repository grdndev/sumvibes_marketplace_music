import Link from "next/link";

export default function CataloguePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-bold">Catalogue</h1>
      <p className="mt-4 text-slate-400">Catalogue complet des beats. Contenu à compléter.</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/catalogue/style" className="text-brand-gold hover:underline">Par style</Link>
        <Link href="/catalogue/bpm" className="text-brand-gold hover:underline">Par BPM</Link>
        <Link href="/catalogue/filters/ambiance" className="text-brand-gold hover:underline">Filtres dynamiques</Link>
      </div>
    </main>
  );
}
