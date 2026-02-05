import Link from "next/link";

export default function SellerDashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-bold">Dashboard vendeur</h1>
      <p className="mt-4 text-slate-400">Statistiques, ventes et retraits. Contenu à compléter.</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/seller/beats" className="text-brand-gold hover:underline">Gérer les beats</Link>
        <Link href="/seller/licenses" className="text-brand-gold hover:underline">Licences</Link>
        <Link href="/seller/withdrawals" className="text-brand-gold hover:underline">Demandes de retrait</Link>
      </div>
    </main>
  );
}
