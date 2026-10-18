"use client";

// "Sticky Scroll Reveal" (Aceternity UI przez 21st.dev, licencja MIT), to samo API: content = [{ title, description, content }].
// Kroki przewijają się po lewej z linią postępu, panel po prawej jest przypięty i zmienia się z aktywnym krokiem,
// a za panelem przesuwa się ciepła poświata. Sterowane przewijaniem strony.
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState, type ReactNode } from "react";

type Item = { title: string; description: string; content?: ReactNode };

// położenie poświaty za panelem dla kolejnych kroków
const glows = ["20% 30%", "70% 55%", "40% 85%"];

export function StickyScroll({ content }: { content: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(content.length - 1, Math.max(0, Math.floor(v * content.length)));
    if (next !== active) setActive(next);
  });

  return (
    <div className="relative overflow-hidden">
      {/* poświata za panelem, przesuwa się z krokiem */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        animate={{
          background: `radial-gradient(45% 40% at ${glows[active % glows.length]}, rgba(245,165,36,0.16), rgba(29,29,31,0) 70%)`,
        }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      />

      <div ref={ref} className="relative mx-auto grid max-w-[1080px] gap-10 px-5 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div className="relative md:pl-10">
          {/* linia postępu */}
          <div aria-hidden="true" className="absolute bottom-[12vh] left-0 top-[12vh] hidden w-[2px] rounded-full bg-white/10 md:block">
            <motion.div style={{ scaleY: progress }} className="h-full w-full origin-top rounded-full bg-amber" />
          </div>

          {content.map((item, i) => (
            <div key={item.title} className="relative flex min-h-[48vh] flex-col justify-center py-10">
              <span
                aria-hidden="true"
                className={`absolute -left-10 top-1/2 hidden h-3.5 w-3.5 -translate-x-[6px] -translate-y-1/2 rounded-full border-2 transition-colors duration-500 md:block ${
                  active >= i ? "border-amber bg-amber" : "border-white/25 bg-graphite"
                }`}
              />
              {/* Na telefonie obraz kroku jest nad tekstem, bo panel nie jest przypięty */}
              <div className="mb-6 aspect-[4/3] overflow-hidden rounded-[22px] md:hidden">{item.content}</div>
              <motion.h3
                animate={{ opacity: active === i ? 1 : 0.35 }}
                className="text-[clamp(26px,3vw,36px)] font-semibold tracking-[-0.025em] text-parchment"
              >
                {item.title}
              </motion.h3>
              <motion.p animate={{ opacity: active === i ? 1 : 0.35 }} className="mt-4 max-w-[38ch] text-[19px] text-muted-dark">
                {item.description}
              </motion.p>
            </div>
          ))}
        </div>

        <div className="hidden md:block">
          <div className="sticky top-[calc(50vh-15rem)] h-[30rem] overflow-hidden rounded-[30px] ring-1 ring-white/10 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute inset-0"
              >
                {content[active]?.content}
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute left-5 top-5 rounded-full bg-black/60 px-3 py-1 text-[13px] font-semibold tabular-nums text-parchment">
              Krok {active + 1} z {content.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
