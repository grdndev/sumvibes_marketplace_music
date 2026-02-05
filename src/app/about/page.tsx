import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-bold">À propos</h1>
      <p className="mt-4 text-slate-400">
        Présentation de SUMVIBES, mission, valeurs et vision. Contenu à compléter.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/" className="text-brand-gold hover:underline">Retour à l’accueil</Link>
        <Link href="/catalogue" className="text-brand-gold hover:underline">Voir le catalogue</Link>
      </div>
    </main>
  );
}
