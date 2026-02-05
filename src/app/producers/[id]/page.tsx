import Link from "next/link";

type ProducerPageProps = {
  params: { id: string };
};

export default function ProducerProfilePage({ params }: ProducerPageProps) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-bold">Profil Producteur</h1>
      <p className="mt-4 text-slate-400">Profil public de {params.id}. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/producers" className="text-brand-gold hover:underline">Retour aux producteurs</Link>
      </div>
    </main>
  );
}
