"use client";

// Nocne osiedle: sylwetki bloków, prawie wszystkie okna ciemne, kilka się świeci.
// Rysowane na canvas, żeby nie obciążać DOM. Przy ograniczonym ruchu obraz jest statyczny.
import { useEffect, useRef } from "react";

type Win = { x: number; y: number; w: number; h: number; lit: number; target: number };

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function NightCity({ className = "", density = 0.05 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let blocks: { x: number; y: number; w: number; h: number }[] = [];
    let wins: Win[] = [];
    let raf = 0;
    let last = 0;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const r = rand(7);
      blocks = [];
      wins = [];
      let x = -20;
      while (x < width + 20) {
        const w = 70 + r() * 110;
        const h = height * (0.35 + r() * 0.55);
        const y = height - h;
        blocks.push({ x, y, w, h });
        const cols = Math.max(3, Math.floor((w - 16) / 14));
        const rows = Math.floor((h - 16) / 18);
        const cw = (w - 16) / cols;
        for (let c = 0; c < cols; c++) {
          for (let rr = 0; rr < rows; rr++) {
            const lit = r() < density ? 1 : 0;
            wins.push({ x: x + 8 + c * cw + 2, y: y + 10 + rr * 18, w: cw - 5, h: 9, lit, target: lit });
          }
        }
        x += w + 6 + r() * 14;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const b of blocks) {
        ctx.fillStyle = "#0e0e11";
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = "rgba(245,245,247,0.05)";
        ctx.fillRect(b.x, b.y, b.w, 1);
      }
      for (const w of wins) {
        if (w.lit > 0.02) {
          ctx.shadowColor = "rgba(245,165,36,0.8)";
          ctx.shadowBlur = 10 * w.lit;
          ctx.fillStyle = `rgba(245,${150 + Math.round(30 * w.lit)},60,${0.25 + 0.75 * w.lit})`;
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#17171b";
        }
        ctx.fillRect(w.x, w.y, w.w, w.h);
      }
      ctx.shadowBlur = 0;
    };

    const tick = (t: number) => {
      if (t - last > 900) {
        last = t;
        // co chwilę gdzieś zapala się albo gaśnie jedno światło
        const w = wins[Math.floor(Math.random() * wins.length)];
        if (w) w.target = w.target ? 0 : Math.random() < density * 4 ? 1 : 0;
      }
      for (const w of wins) w.lit += (w.target - w.lit) * 0.06;
      draw();
      raf = requestAnimationFrame(tick);
    };

    build();
    draw();

    // animujemy tylko wtedy, gdy osiedle jest widoczne na ekranie
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting && !reduce) raf = requestAnimationFrame(tick);
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      build();
      draw();
    });
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none block h-full w-full ${className}`} />;
}
