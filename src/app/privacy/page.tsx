import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-bold">Confidentialité</h1>
      <p className="mt-4 text-slate-400">Politique de confidentialité et RGPD. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/" className="text-brand-gold hover:underline">Retour à l’accueil</Link>
      </div>
    </main>
  );
}
