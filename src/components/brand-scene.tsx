"use client";

import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

export function BrandScene({ src }: { src: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  return (
    <section
      ref={ref}
      className="nk-brand-scene"
      aria-labelledby="brand-scene-title"
    >
      <motion.div className="nk-brand-photo" style={reduce ? undefined : { y }}>
        {/* A generated brand photograph, served as a static image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          width={4096}
          height={2304}
          loading="lazy"
          alt="Ciepłe światło lampy nad biurkiem z telefonem w spokojnym biurze po godzinach"
        />
      </motion.div>
      <div className="nk-brand-shade" />
      <div className="nk-wrap nk-brand-copy">
        <p className="nk-eyebrow">ŚWIATŁO ZOSTAJE WŁĄCZONE</p>
        <h2 id="brand-scene-title">
          Koniec Twojego dnia.
          <br />
          <em>Początek dobrej rozmowy.</em>
        </h2>
        <p>
          Klienci mają pytania także wtedy, gdy Ty masz inne plany. NOKTURN
          pomaga zadbać o pierwszy kontakt.
        </p>
        <a href="#demo" className="nk-text-link">
          Zobacz przykładową obsługę <span aria-hidden="true">↗</span>
        </a>
      </div>
      <span className="nk-scene-caption">NOKTURN / PO GODZINACH</span>
    </section>
  );
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="nk-mobile-menu">
      <button
        type="button"
        aria-label={open ? "Zamknij menu" : "Otwórz menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((v) => !v)}
        className="nk-menu-toggle"
      >
        <span aria-hidden="true">{open ? "×" : "☰"}</span>
      </button>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Nawigacja mobilna"
          className="nk-mobile-panel"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          {[
            ["#rozwiazania", "Rozwiązania"],
            ["#demo", "Interaktywne demo"],
            ["#wdrozenie", "Jak zaczynamy"],
          ].map(([href, label]) => (
            <a href={href} key={href} onClick={() => setOpen(false)}>
              {label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
          <p>Asystentka telefoniczna i chatbot AI.</p>
        </nav>
      )}
    </div>
  );
}
