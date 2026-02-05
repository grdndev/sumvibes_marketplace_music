import Link from "next/link";

export default function AccountSettingsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-bold">Paramètres du compte</h1>
      <p className="mt-4 text-slate-400">Gestion du profil et préférences. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/account" className="text-brand-gold hover:underline">Retour au compte</Link>
      </div>
    </main>
  );
}
