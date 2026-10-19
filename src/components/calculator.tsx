"use client";

// Kwota przewija się jak licznik: "Number Ticker Currency Counter" z 21st.dev.
import NumberFlow from "@number-flow/react";
import NumberTicker from "@/components/ui/number-ticker-02";
import { useId, useState } from "react";

const WEEKS_PER_MONTH = 4.3;

// Polska odmiana: 1 zlecenie, 2–4 zlecenia (ale 12–14 zleceń), 5+ zleceń
function zlecenia(n: number) {
  if (n === 1) return "zlecenie";
  const d = n % 10;
  const dd = n % 100;
  if (d >= 2 && d <= 4 && !(dd >= 12 && dd <= 14)) return "zlecenia";
  return "zleceń";
}

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: React.ReactNode;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex justify-between gap-3 font-semibold">
        <span>{label}</span>
        <span className="tabular-nums">{display}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-[30px] w-full"
      />
    </div>
  );
}

export function Calculator() {
  const [missed, setMissed] = useState(8);
  const [value, setValue] = useState(600);
  const [conv, setConv] = useState(40);

  const jobs = Math.round(missed * WEEKS_PER_MONTH * (conv / 100));
  const lost = Math.round((missed * WEEKS_PER_MONTH * (conv / 100) * value) / 100) * 100;
  const pln = { style: "currency", currency: "PLN", maximumFractionDigits: 0 } as const;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="flex flex-col gap-[30px] rounded-[18px] border border-hairline bg-white p-8">
        <Slider label="Nieodebrane telefony w tygodniu" value={missed} display={missed} min={1} max={40} step={1} onChange={setMissed} />
        <Slider
          label="Średnia wartość zlecenia"
          value={value}
          display={new Intl.NumberFormat("pl-PL", pln).format(value)}
          min={100}
          max={3000}
          step={50}
          onChange={setValue}
        />
        <Slider label="Ile z nich byłoby zleceniem" value={conv} display={`${conv}%`} min={10} max={80} step={5} onChange={setConv} />
      </div>

      <div className="flex min-h-[280px] flex-col items-center justify-center gap-1.5 rounded-[18px] bg-parchment p-8 text-center">
        <p className="text-muted">Miesięcznie tracisz około</p>
        <NumberTicker
          value={lost}
          currency="PLN"
          decimals={0}
          locales="pl-PL"
          className="text-[clamp(56px,7vw,80px)] font-semibold leading-[1.05] tracking-[-0.04em] tabular-nums"
        />
        <p className="text-muted">
          {jobs === 0 ? (
            "czyli mniej niż jedno zlecenie w miesiącu."
          ) : (
            <>
              czyli około <NumberFlow value={jobs} locales="pl-PL" /> {zlecenia(jobs)}, które {jobs === 1 ? "trafia" : "trafiają"} do konkurencji.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
