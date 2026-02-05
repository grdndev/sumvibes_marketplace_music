import Link from "next/link";

type FilterPageProps = {
  params: { filter: string };
};

export default function CatalogueFilterPage({ params }: FilterPageProps) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-bold">Filtre : {params.filter}</h1>
      <p className="mt-4 text-slate-400">Page de filtre dynamique. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/catalogue" className="text-brand-gold hover:underline">Retour au catalogue</Link>
      </div>
    </main>
  );
}
