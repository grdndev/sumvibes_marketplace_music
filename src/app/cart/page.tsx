import Link from "next/link";

export default function CartPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-bold">Panier</h1>
      <p className="mt-4 text-slate-400">Récapitulatif des achats. Contenu à compléter.</p>
      <div className="mt-8 flex gap-4">
        <Link href="/checkout" className="text-brand-gold hover:underline">Passer au paiement</Link>
        <Link href="/catalogue" className="text-brand-gold hover:underline">Continuer les achats</Link>
      </div>
    </main>
  );
}
