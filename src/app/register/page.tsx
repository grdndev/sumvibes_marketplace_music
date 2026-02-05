import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-4xl font-bold">Inscription</h1>
      <p className="mt-4 text-slate-400">Formulaire d’inscription et choix de rôle. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/login" className="text-brand-gold hover:underline">J’ai déjà un compte</Link>
      </div>
    </main>
  );
}
