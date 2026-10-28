import Link from "next/link";

export default function DocumentNotFound() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold">Documento non trovato</h1>
      <Link href="/documenti" className="mt-4 inline-block text-primary">
        Torna ai documenti
      </Link>
    </div>
  );
}
