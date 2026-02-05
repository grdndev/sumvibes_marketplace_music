import Link from "next/link";

type BlogCategoryPageProps = {
  params: { slug: string };
};

export default function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-bold">Catégorie : {params.slug}</h1>
      <p className="mt-4 text-slate-400">Liste des articles par catégorie. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/blog" className="text-brand-gold hover:underline">Retour au blog</Link>
      </div>
    </main>
  );
}
