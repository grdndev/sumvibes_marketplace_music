import Link from "next/link";

type ProductPageProps = {
  params: { slug: string };
};

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-bold">Produit : {params.slug}</h1>
      <p className="mt-4 text-slate-400">Player audio, métadonnées, licences et achat. Contenu à compléter.</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/cart" className="text-brand-gold hover:underline">Ajouter au panier</Link>
        <Link href="/catalogue" className="text-brand-gold hover:underline">Retour au catalogue</Link>
      </div>
    </main>
  );
}
