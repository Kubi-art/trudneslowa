// "Amber Glow Gradient Hero Background" z 21st.dev (czysty CSS).
// Bursztynowe światło wschodzi od dolnej krawędzi i przechodzi w głęboki brąz przed połową wysokości,
// górę zostawia ciemną pod biały nagłówek. Animacja: globals.css (.amber-glow).
// Jeśli wkleisz tu kod skopiowany przyciskiem "Copy" z 21st.dev, podmień zawartość tego pliku.
export function AmberGlow({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`amber-glow pointer-events-none absolute inset-0 ${className}`} />;
}
