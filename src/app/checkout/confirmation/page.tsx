import Link from "next/link";

export default function CheckoutConfirmationPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-bold">Confirmation</h1>
      <p className="mt-4 text-slate-400">Téléchargements et facture PDF. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/account/downloads" className="text-brand-gold hover:underline">Accéder aux téléchargements</Link>
      </div>
    </main>
  );
}
