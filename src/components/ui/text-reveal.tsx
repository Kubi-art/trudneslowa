"use client";

// "Text Reveal" z 21st.dev / interior.dev (licencja MIT).
// Zbudowane według specyfikacji z rejestru interior.dev/r/text-reveal.json:
// podział na słowa lub znaki, każda jednostka wjeżdża z opacity 0, przesunięcia 10px i blur 8px,
// 0.6 s, opóźnienie wg indeksu przycięte przez maxDuration, start w widoku (useInView),
// pełne zdanie w sr-only, wyłączone przy prefers-reduced-motion.
// Dokładny plik: npx shadcn@latest add https://www.interior.dev/r/text-reveal.json
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ElementType } from "react";

type TextRevealProps = {
  text: string;
  by?: "word" | "character";
  stagger?: number;
  maxDuration?: number;
  startOnView?: boolean;
  play?: boolean;
  once?: boolean;
  amount?: number;
  as?: ElementType;
  className?: string;
};

export function useTextReveal({
  startOnView = true,
  play = true,
  once = true,
  amount = 0.5,
}: Pick<TextRevealProps, "startOnView" | "play" | "once" | "amount">) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, amount });
  const active = play && (startOnView ? inView : true);
  return { ref, active };
}

export function TextReveal({
  text,
  by = "word",
  stagger = 0.06,
  maxDuration = 1.2,
  startOnView = true,
  play = true,
  once = true,
  amount = 0.5,
  as: Tag = "p",
  className,
}: TextRevealProps) {
  const reduce = useReducedMotion();
  const { ref, active } = useTextReveal({ startOnView, play, once, amount });

  const units =
    by === "word"
      ? text.split(/(\s+)/).filter((u) => u.length > 0)
      : Array.from(text);
  const animated = units.filter((u) => !/^\s+$/.test(u)).length;
  const step = animated > 1 ? Math.min(stagger, maxDuration / (animated - 1)) : 0;

  let index = -1;

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {units.map((unit, i) => {
          if (/^\s+$/.test(unit)) return <span key={i}>{unit}</span>;
          index += 1;
          if (reduce) return <span key={i}>{unit}</span>;
          return (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={active ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
              transition={{ duration: 0.6, delay: index * step, ease: [0.2, 0.65, 0.3, 0.9] }}
            >
              {unit}
            </motion.span>
          );
        })}
      </span>
    </Tag>
  );
}

export default TextReveal;
