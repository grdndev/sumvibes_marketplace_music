import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-bold">Contact</h1>
      <p className="mt-4 text-slate-400">Formulaire de contact et informations. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/help" className="text-brand-gold hover:underline">Voir l’aide</Link>
      </div>
    </main>
  );
}
