import Link from "next/link";

export default function CommunityPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-bold">Communauté</h1>
      <p className="mt-4 text-slate-400">Forum, annonces de services et messagerie. Contenu à compléter.</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/community/forum" className="text-brand-gold hover:underline">Forum</Link>
        <Link href="/community/services" className="text-brand-gold hover:underline">Petites annonces</Link>
        <Link href="/community/messages" className="text-brand-gold hover:underline">Messagerie</Link>
      </div>
    </main>
  );
}
