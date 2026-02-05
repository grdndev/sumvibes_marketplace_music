import Link from "next/link";

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-bold">Blog / News</h1>
      <p className="mt-4 text-slate-400">Articles et actualités. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/blog/welcome" className="text-brand-gold hover:underline">Lire un article</Link>
      </div>
    </main>
  );
}
