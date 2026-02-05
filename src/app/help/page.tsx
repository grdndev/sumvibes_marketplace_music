import Link from "next/link";

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-bold">Aide</h1>
      <p className="mt-4 text-slate-400">FAQ et support. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/contact" className="text-brand-gold hover:underline">Contacter le support</Link>
      </div>
    </main>
  );
}
