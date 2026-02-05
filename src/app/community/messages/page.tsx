import Link from "next/link";

export default function CommunityMessagesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-bold">Messagerie</h1>
      <p className="mt-4 text-slate-400">Messagerie instantanée. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/community" className="text-brand-gold hover:underline">Retour à la communauté</Link>
      </div>
    </main>
  );
}
