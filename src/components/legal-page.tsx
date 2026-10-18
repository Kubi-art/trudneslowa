import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main id="tresc" className="min-h-[100dvh] bg-parchment px-5 pb-28 pt-16 md:pb-24">
      <article className="mx-auto max-w-[720px]">
        <Link href="/" className="text-amber-deep hover:underline">
          ‹ Wróć na stronę główną
        </Link>
        <h1 className="mt-6 text-balance text-[clamp(32px,5vw,44px)] font-semibold leading-[1.1] tracking-[-0.03em]">{title}</h1>
        <p className="mt-3 text-[15px] text-muted">Ostatnia aktualizacja: {site.legalUpdated}</p>
        <div className="legal mt-10 flex flex-col gap-10">{children}</div>
      </article>
    </main>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[22px] font-semibold tracking-[-0.02em]">{title}</h2>
      {children}
    </section>
  );
}
