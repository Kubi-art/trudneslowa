"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const MESSAGES = [
  { from: "bot", text: "Dzień dobry, pogotowie hydrauliczne. Jestem wirtualnym asystentem, rozmowa jest nagrywana. W czym pomóc?" },
  { from: "client", text: "Pękła rura pod zlewem, woda leje się na podłogę." },
  { from: "bot", text: "Proszę zakręcić główny zawór. Pod jaki adres przyjechać?" },
  { from: "client", text: "Lipowa 4, mieszkanie 12, Nowy Dwór." },
  { from: "bot", text: "Zapisane. Fachowiec oddzwoni za kilka minut." },
] as const;

const FINAL_STEP = MESSAGES.length + 1;
const STEP_MS = 1800;

export function PhoneCall() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const play = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (reduce) {
      setStep(FINAL_STEP);
      return;
    }
    setStep(1);
    timer.current = setInterval(() => {
      setStep((s) => {
        const next = s + 1;
        if (next >= FINAL_STEP && timer.current) clearInterval(timer.current);
        return next;
      });
    }, STEP_MS);
  }, [reduce]);

  useEffect(() => {
    const start = setTimeout(play, 1200);
    return () => {
      clearTimeout(start);
      if (timer.current) clearInterval(timer.current);
    };
  }, [play]);

  const visible = MESSAGES.slice(0, Math.min(step, MESSAGES.length));
  const done = step >= FINAL_STEP;

  return (
    // Stały rozmiar telefonu: nowe wiadomości przesuwają starsze w górę, nic się nie wydłuża.
    <div className="relative mx-auto aspect-[9/19] w-[min(340px,82vw)] rounded-[54px] bg-[#2a2a2c] p-[11px] shadow-[0_0_0_1px_#3a3a3c,0_40px_80px_-20px_rgba(0,0,0,0.8),0_0_120px_-30px_rgba(245,165,36,0.35)]">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[44px] bg-[#0b0b0d] text-left">
        {/* pasek statusu */}
        <div className="flex shrink-0 items-center justify-between px-7 pt-4 text-[13px] font-semibold tabular-nums text-parchment">
          <span>3:14</span>
          <span className="h-[25px] w-[88px] rounded-full bg-black" aria-hidden="true" />
          <span className="font-normal text-muted-dark">LTE</span>
        </div>

        {/* baner SMS jak powiadomienie iOS: nachodzi na ekran, nie zmienia rozmiaru telefonu */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0, transitionEnd: { transform: "none" } }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="absolute inset-x-2.5 top-12 z-10 flex flex-col gap-[3px] rounded-[22px] bg-[#f2f2f4] px-3.5 py-3 text-ink shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between text-[12px] text-muted">
                <strong className="font-semibold text-ink">Wiadomości · NOKTURN</strong>
                <span>teraz</span>
              </div>
              <p className="text-[13px] leading-[1.35]">
                <strong className="font-semibold">Pilne:</strong> pęknięta rura, woda na podłodze. Lipowa 4/12, Nowy Dwór. Zawór zakręcony. Oddzwoń: 600 *** ***
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex shrink-0 flex-col items-center gap-0.5 pb-3 pt-5 text-center">
          <span className="text-[12px] text-muted-dark">{done ? "połączenie zakończone" : "rozmowa w toku"}</span>
          <span className="text-[20px] font-semibold tracking-[-0.02em] text-parchment">Pogotowie hydrauliczne</span>
        </div>

        {/* rozmowa: stała wysokość, wiadomości od dołu */}
        <div className="relative min-h-0 flex-1 overflow-hidden px-3.5">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-10 bg-gradient-to-b from-[#0b0b0d] to-transparent" />
          <div aria-live="polite" className="flex h-full flex-col justify-end gap-2 pb-3 text-[14px] leading-[1.38]">
            <AnimatePresence initial={false}>
              {visible.map((m) => (
                <motion.div
                  key={m.text}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transitionEnd: { transform: "none" } }}
                  transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                  className={
                    m.from === "bot"
                      ? "max-w-[86%] shrink-0 self-start rounded-[18px] bg-[#2c2c2e] px-3 py-2 text-parchment"
                      : "max-w-[86%] shrink-0 self-end rounded-[18px] bg-amber px-3 py-2 text-ink"
                  }
                >
                  {m.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex shrink-0 justify-center pb-6 pt-2">
          <button
            type="button"
            onClick={play}
            className="min-h-11 rounded-full bg-[rgba(210,210,215,0.14)] px-[18px] text-[13px] text-parchment transition-transform duration-200 ease-apple active:scale-95"
          >
            Odtwórz rozmowę ponownie
          </button>
        </div>
      </div>
    </div>
  );
}
