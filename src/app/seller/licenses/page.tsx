import Link from "next/link";

export default function SellerLicensesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-bold">Gestion des licences</h1>
      <p className="mt-4 text-slate-400">Paramétrage des licences et prix. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/seller/dashboard" className="text-brand-gold hover:underline">Retour au dashboard</Link>
      </div>
    </main>
  );
}
