// Znak NOKTURN „Okno”: cztery okna bloku nocą, prawe górne się pali.
export function LogoMark({ size = 20, dark = true, className = "" }: { size?: number; dark?: boolean; className?: string }) {
  const off = dark ? "#6e6e73" : "#1d1d1f";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <rect x="12" y="12" width="34" height="34" rx="6" fill={off} />
      <rect x="54" y="12" width="34" height="34" rx="6" fill="#F5A524" />
      <rect x="12" y="54" width="34" height="34" rx="6" fill={off} />
      <rect x="54" y="54" width="34" height="34" rx="6" fill={off} />
    </svg>
  );
}

export function Logo({ dark = true, className = "" }: { dark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={22} dark={dark} />
      <span className="font-bold tracking-[0.12em]">NOKTURN</span>
    </span>
  );
}
