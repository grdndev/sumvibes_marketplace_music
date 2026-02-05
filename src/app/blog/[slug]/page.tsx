import Link from "next/link";

type BlogPostPageProps = {
  params: { slug: string };
};

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-bold">Article : {params.slug}</h1>
      <p className="mt-4 text-slate-400">Contenu de l’article. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/blog" className="text-brand-gold hover:underline">Retour au blog</Link>
      </div>
    </main>
  );
}
