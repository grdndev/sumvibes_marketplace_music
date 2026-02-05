import Link from "next/link";

export default function CommunityServicesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-bold">Petites annonces</h1>
      <p className="mt-4 text-slate-400">Songwriting, toplining, mixage, etc. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/community" className="text-brand-gold hover:underline">Retour à la communauté</Link>
      </div>
    </main>
  );
}
