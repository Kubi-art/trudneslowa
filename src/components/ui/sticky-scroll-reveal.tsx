"use client";

// "Sticky Scroll Reveal" (Aceternity UI przez 21st.dev, licencja MIT), to samo API: content = [{ title, description, content }].
// Kroki przewijają się po lewej, panel po prawej jest przypięty i zmienia zawartość razem z aktywnym krokiem,
// a tło sekcji delikatnie zmienia odcień. Sterowane przewijaniem strony zamiast wewnętrznego okna przewijania.
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState, type ReactNode } from "react";

type Item = { title: string; description: string; content?: ReactNode };

const backgrounds = ["#1d1d1f", "#141416", "#18181b"];

export function StickyScroll({ content }: { content: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(content.length - 1, Math.max(0, Math.floor(v * content.length)));
    if (next !== active) setActive(next);
  });

  return (
    <motion.div
      animate={{ backgroundColor: backgrounds[active % backgrounds.length] }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div ref={ref} className="mx-auto grid max-w-[1080px] gap-10 px-5 md:grid-cols-2 md:gap-16">
        <div>
          {content.map((item, i) => (
            <div key={item.title} className="flex min-h-[70vh] flex-col justify-center py-10">
              {/* Na telefonie obraz kroku jest nad tekstem, bo panel nie jest przypięty */}
              <div className="mb-6 aspect-[4/3] overflow-hidden rounded-[22px] md:hidden">{item.content}</div>
              <motion.h3
                animate={{ opacity: active === i ? 1 : 0.3 }}
                className="text-[clamp(26px,3vw,36px)] font-semibold tracking-[-0.025em] text-parchment"
              >
                {item.title}
              </motion.h3>
              <motion.p animate={{ opacity: active === i ? 1 : 0.3 }} className="mt-4 max-w-[38ch] text-[19px] text-muted-dark">
                {item.description}
              </motion.p>
            </div>
          ))}
        </div>
        <div className="hidden md:block">
          <div className="sticky top-[calc(50vh-13rem)] h-[26rem] overflow-hidden rounded-[28px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute inset-0"
              >
                {content[active]?.content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
