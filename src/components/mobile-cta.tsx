"use client";

// Pasek z przyciskiem na dole ekranu, tylko na telefonach.
// Pojawia się, gdy hero zniknie z ekranu, i chowa się przy końcowej sekcji z kontaktem.
import { AnimatePresence, motion } from "motion/react";
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
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/85 px-4 pt-3 backdrop-blur-xl md:hidden"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
          <div className="flex gap-2.5">
            <a
              href={`tel:${site.demoPhone}`}
              className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-amber font-semibold text-ink transition-transform active:scale-95"
            >
              Zadzwoń do demo
            </a>
            <a
              href={site.calendlyUrl}
              className="flex min-h-12 items-center justify-center rounded-full border border-white/20 px-5 font-semibold text-parchment transition-transform active:scale-95"
            >
              Umów rozmowę
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
