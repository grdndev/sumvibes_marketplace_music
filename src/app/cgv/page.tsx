import Link from "next/link";

export default function CgvPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-bold">Conditions Générales de Vente</h1>
      <p className="mt-4 text-slate-400">Mentions légales et CGV. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/" className="text-brand-gold hover:underline">Retour à l’accueil</Link>
      </div>
    </main>
  );
}
