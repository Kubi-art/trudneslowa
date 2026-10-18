"use client";

// Pasek z przyciskiem na dole ekranu, tylko na telefonach.
// Pojawia się, gdy hero zniknie z ekranu, i chowa się przy końcowej sekcji z kontaktem.
//
// Safari na iPhonie: gdy przy przewijaniu w górę wysuwa się dolny pasek przeglądarki, elementy
// przyklejone do dołu z animacją transform i rozmyciem tła potrafią na chwilę zostać w starym miejscu
// i odsłonić szparę. Dlatego:
// - sam przyklejony kontener nie ma transform ani backdrop-filter, przesuwa się tylko jego zawartość,
// - tło paska jest pełne i ciągnie się 120 px poniżej krawędzi ekranu, więc ewentualna szpara jest zakryta,
// - strona ma viewport-fit=cover, więc odstęp od paska domowego iPhone'a jest liczony poprawnie.
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

export function MobileCta() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const contact = document.getElementById("kontakt");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setHeroVisible(e.isIntersecting);
        if (e.target === contact) setContactVisible(e.isIntersecting);
      }
    });
    if (hero) io.observe(hero);
    if (contact) io.observe(contact);
    return () => io.disconnect();
  }, []);

  const show = !heroVisible && !contactVisible;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 md:hidden ${show ? "" : "pointer-events-none"}`}
    >
      <div
        className={`relative bg-[#0b0b0d] px-4 pt-3 transition-[translate,opacity] duration-300 ease-apple after:absolute after:inset-x-0 after:top-full after:h-[120px] after:bg-[#0b0b0d] after:content-[''] ${
          show ? "translate-y-0 opacity-100" : "translate-y-[calc(100%+120px)] opacity-0"
        }`}
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
        <div className="flex gap-2.5">
          <a
            href={`tel:${site.demoPhone}`}
            tabIndex={show ? 0 : -1}
            className="flex min-h-12 flex-1 items-center justify-center whitespace-nowrap rounded-full bg-amber px-4 text-[16px] font-semibold text-ink active:scale-95"
          >
            Zadzwoń do demo
          </a>
          <a
            href={site.calendlyUrl}
            tabIndex={show ? 0 : -1}
            className="flex min-h-12 items-center justify-center whitespace-nowrap rounded-full border border-white/20 px-4 text-[16px] font-semibold text-parchment active:scale-95"
          >
            Umów się
          </a>
        </div>
      </div>
    </div>
  );
}
