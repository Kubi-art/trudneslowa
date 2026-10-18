// Źródło: "Number Ticker Currency Counter" z 21st.dev (ShadcnSpace, licencja MIT)
// https://github.com/shadcnspace/shadcnspace  src/components/shadcn-space/number-ticker/number-ticker-02.tsx
// Komponent przeniesiony bez zmian; usunięte tylko demo.
"use client";

import NumberFlow, { type Value } from "@number-flow/react";

type NumberTickerProps = {
  value: Value;
  currency?: string;
  decimals?: number;
  className?: string;
};

/**
 * NumberTicker 02 - Money Flow
 * Premium currency display with smooth high-fidelity rolls.
 */
function NumberTicker({
  value,
  currency = "USD",
  decimals = 2,
  className,
}: NumberTickerProps) {
  return (
    <div className="inline-flex items-center gap-3">
      <NumberFlow
        value={value}
        format={{
          style: "currency",
          currency: currency,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }}
        className={className}
      />
    </div>
  );
}

export default NumberTicker;
