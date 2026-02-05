import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-bold">Back-office admin</h1>
      <p className="mt-4 text-slate-400">Gestion utilisateurs, modération, commissions. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/" className="text-brand-gold hover:underline">Retour à l’accueil</Link>
      </div>
    </main>
  );
}
