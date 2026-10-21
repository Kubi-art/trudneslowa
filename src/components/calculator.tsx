"use client";

import { useId, useState } from "react";
import NumberTicker from "@/components/ui/number-ticker-02";

const pln = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 0,
});

function Slider({
  label,
  value,
  display,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="nk-calc-field">
      <label htmlFor={id}>
        {label}
        <output htmlFor={id}>{display}</output>
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        aria-valuetext={display}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="nk-range-limits" aria-hidden="true">
        <span>0</span>
        <span>{max.toLocaleString("pl-PL")}</span>
      </div>
    </div>
  );
}

export function Calculator() {
  const [missed, setMissed] = useState(8);
  const [value, setValue] = useState(600);
  const [conversion, setConversion] = useState(40);
  const monthlyCalls = missed * 4.3;
  const estimatedOrders = (monthlyCalls * conversion) / 100;
  const estimatedValue = Math.round(estimatedOrders * value);
  return (
    <div className="nk-calculator">
      <div className="nk-calc-inputs">
        <Slider
          label="Nieodebrane połączenia w tygodniu"
          value={missed}
          display={String(missed)}
          max={40}
          onChange={setMissed}
        />
        <Slider
          label="Średnia wartość zlecenia"
          value={value}
          display={pln.format(value)}
          max={3000}
          step={50}
          onChange={setValue}
        />
        <Slider
          label="Jaki procent zapytań kończy się zleceniem?"
          value={conversion}
          display={`${conversion}%`}
          max={100}
          step={5}
          onChange={setConversion}
        />
        <button
          className="nk-calc-reset"
          type="button"
          onClick={() => {
            setMissed(8);
            setValue(600);
            setConversion(40);
          }}
        >
          Przywróć przykładowe wartości
        </button>
      </div>
      <div className="nk-calc-result">
        <p>Szacowana wartość potencjalnych zleceń / miesiąc</p>
        <div aria-live="polite" aria-atomic="true">
          <NumberTicker
            value={estimatedValue}
            currency="PLN"
            decimals={0}
            locales="pl-PL"
            className="nk-calc-total"
          />
        </div>
        <p>
          Przy tych założeniach: około{" "}
          <strong>{Math.round(monthlyCalls)} połączeń</strong> i{" "}
          <strong>
            {estimatedOrders.toLocaleString("pl-PL", {
              maximumFractionDigits: 1,
            })}{" "}
            zleceń
          </strong>{" "}
          w miesiącu.
        </p>
        <details>
          <summary>Jak to liczymy?</summary>
          <p>
            {missed} połączeń × 4,3 tygodnia × {conversion}% ×{" "}
            {pln.format(value)}. Wynik zaokrąglamy do pełnych złotych.
          </p>
        </details>
        <p className="nk-calc-note">
          To ilustracja oparta na Twoich założeniach, nie prognoza przychodu ani
          oszczędności z AI. Część klientów może zadzwonić ponownie. Wynik nie
          uwzględnia kosztów obsługi ani wdrożenia.
        </p>
        <a href="#wdrozenie" className="nk-text-link">
          Zobacz, jak wygląda wdrożenie <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
