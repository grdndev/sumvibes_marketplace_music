import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-bold">Mon compte</h1>
      <p className="mt-4 text-slate-400">Dashboard personnel et statistiques. Contenu à compléter.</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/account/settings" className="text-brand-gold hover:underline">Paramètres</Link>
        <Link href="/account/downloads" className="text-brand-gold hover:underline">Téléchargements</Link>
        <Link href="/seller/dashboard" className="text-brand-gold hover:underline">Espace vendeur</Link>
      </div>
    </main>
  );
}
