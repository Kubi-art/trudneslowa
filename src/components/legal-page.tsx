import Link from "next/link";

export function LegalPage({ title }: { title: string }) {
  return (
    <main id="tresc" className="min-h-[100dvh] bg-parchment px-5 py-24">
      <div className="mx-auto max-w-[720px]">
        <Link href="/" className="text-amber-deep hover:underline">‹ Wróć na stronę główną</Link>
        <h1 className="mt-6 text-[40px] font-semibold leading-[1.1] tracking-[-0.03em]">{title}</h1>
        <p className="mt-6 text-muted">
          Treść tego dokumentu musi przygotować prawnik albo sprawdzony generator dokumentów RODO,
          z danymi Twojej firmy. Wklej ją tutaj przed uruchomieniem strony.
        </p>
      </div>
    </main>
  );
}
