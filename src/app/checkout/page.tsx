import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-bold">Paiement</h1>
      <p className="mt-4 text-slate-400">Formulaire de paiement Stripe/PayPal. Contenu à compléter.</p>
      <div className="mt-8 flex gap-4">
        <Link href="/checkout/confirmation" className="text-brand-gold hover:underline">Confirmer l’achat</Link>
        <Link href="/cart" className="text-brand-gold hover:underline">Retour au panier</Link>
      </div>
    </main>
  );
}
