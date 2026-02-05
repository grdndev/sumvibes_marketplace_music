import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-4xl font-bold">Connexion</h1>
      <p className="mt-4 text-slate-400">Formulaire de connexion. Contenu à compléter.</p>
      <div className="mt-8">
        <Link href="/register" className="text-brand-gold hover:underline">Créer un compte</Link>
      </div>
    </main>
  );
}
