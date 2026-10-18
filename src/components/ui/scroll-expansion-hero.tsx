"use client";

// "Scroll media expansion hero" z 21st.dev (@arunachalam, licencja MIT), w wersji bez przejmowania scrolla:
// to samo API (mediaType, mediaSrc, posterSrc, bgImageSrc, title, date, scrollToExpand, textBlend, children),
// ale rozszerzanie jest sterowane zwykłym przewijaniem strony (motion useScroll + sticky),
// więc działa płynnie na telefonie i nie blokuje kółka myszy.
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

type Props = {
  mediaType?: "image" | "video";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  alt?: string;
  children?: ReactNode;
};

export default function ScrollExpandMedia({
  mediaType = "image",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  alt = "",
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // 0 → 0.75: zdjęcie rośnie od karty do pełnego ekranu
  const width = useTransform(scrollYProgress, [0, 0.75], ["min(420px, 78vw)", "100vw"]);
  const height = useTransform(scrollYProgress, [0, 0.75], ["min(520px, 62vh)", "100vh"]);
  const radius = useTransform(scrollYProgress, [0, 0.75], [28, 0]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const leftX = useTransform(scrollYProgress, [0, 0.75], ["0vw", "-40vw"]);
  const rightX = useTransform(scrollYProgress, [0, 0.75], ["0vw", "40vw"]);
  const textOpacity = useTransform(scrollYProgress, [0.55, 0.75], [1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const shade = useTransform(scrollYProgress, [0, 0.75], [0.35, 0.15]);

  const words = title.split(" ");
  const half = Math.ceil(words.length / 2);
  const first = words.slice(0, half).join(" ");
  const second = words.slice(half).join(" ");

  if (reduce) {
    return (
      <section className="bg-[#09090b] text-parchment">
        <div className="relative h-[80vh] min-h-[480px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaSrc} alt={alt} className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-6 text-center">
            <h2 className="text-balance text-[clamp(40px,7vw,96px)] font-semibold leading-none tracking-[-0.04em]">{title}</h2>
          </div>
        </div>
        {children}
      </section>
    );
  }

  return (
    <section className="bg-[#09090b] text-parchment">
      <div ref={ref} className="relative h-[230vh]">
        <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden">
          <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bgImageSrc} alt="" aria-hidden="true" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>

          <motion.div
            style={{ width, height, borderRadius: radius }}
            className="relative z-10 overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
          >
            {mediaType === "video" ? (
              <video src={mediaSrc} poster={posterSrc} autoPlay muted loop playsInline className="h-full w-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mediaSrc} alt={alt} className="h-full w-full object-cover" />
            )}
            <motion.div style={{ opacity: shade }} className="absolute inset-0 bg-black" />
          </motion.div>

          <motion.div
            style={{ opacity: textOpacity }}
            className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 px-5 text-center ${textBlend ? "mix-blend-difference" : ""}`}
          >
            <h2 className="flex flex-col items-center text-[clamp(44px,8vw,112px)] font-semibold leading-[0.95] tracking-[-0.045em]">
              <motion.span style={{ x: leftX }}>{first}</motion.span>
              <motion.span style={{ x: rightX }}>{second}</motion.span>
            </h2>
            {date && <motion.p style={{ x: leftX }} className="text-[19px] text-[#d2d2d7]">{date}</motion.p>}
          </motion.div>

          {scrollToExpand && (
            <motion.p style={{ opacity: hintOpacity }} className="absolute bottom-8 z-20 text-[13px] text-[#d2d2d7]">
              {scrollToExpand}
            </motion.p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
