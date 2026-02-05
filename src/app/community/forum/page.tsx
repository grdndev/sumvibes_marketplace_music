import Link from "next/link";

export default function CommunityForumPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-bold">Forum</h1>
      <p className="mt-4 text-slate-400">Discussions et fils d’actualité. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/community" className="text-brand-gold hover:underline">Retour à la communauté</Link>
      </div>
    </main>
  );
}
