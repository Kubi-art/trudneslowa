"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("nk-revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    el.classList.add("nk-reveal-ready");
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref}>{children}</div>;
}
export function SignalArt() {
  return (
    <div className="nk-wave" aria-hidden="true">
      {Array.from({ length: 29 }, (_, i) => (
        <i
          key={i}
          style={{
            height: `${12 + ((i * 17 + 9) % 49)}px`,
            animationDelay: `${i * 35}ms`,
          }}
        />
      ))}
    </div>
  );
}
const examples = {
  uslugi: {
    label: "Firma usługowa",
    question: "Czy macie wolny termin w piątek?",
    answer: "Mogę przyjąć zapytanie. Jaka usługa Cię interesuje?",
    detail: "Czyszczenie kanapy. Najlepiej po 15:00.",
    final:
      "Zapisuję: czyszczenie kanapy, piątek po 15:00. Zespół potwierdzi dostępność i cenę.",
    subject: "Zapytanie o czyszczenie kanapy",
    when: "Piątek, po 15:00",
    next: "Potwierdź termin i wyceń usługę.",
  },
  salon: {
    label: "Salon beauty",
    question: "Chciałabym umówić koloryzację. Czy macie termin?",
    answer: "Zbiorę szczegóły dla salonu. Jaki dzień i godziny Ci odpowiadają?",
    detail: "Czwartek po 16:00, włosy do ramion.",
    final:
      "Przekażę zapytanie o koloryzację. Salon skontaktuje się, żeby ustalić usługę i potwierdzić termin.",
    subject: "Zapytanie o koloryzację",
    when: "Czwartek, po 16:00",
    next: "Ustal zakres koloryzacji i dostępność.",
  },
  biuro: {
    label: "Biuro i doradztwo",
    question: "Prowadzę małą firmę i szukam obsługi księgowej.",
    answer: "Chętnie przekażę zapytanie. Jaka to forma działalności?",
    detail: "Jednoosobowa działalność, około 20 faktur miesięcznie.",
    final:
      "Zapisuję informacje dla biura. Doradca przedstawi dopasowaną ofertę podczas dalszego kontaktu.",
    subject: "Obsługa księgowa dla JDG",
    when: "Do ustalenia z klientem",
    next: "Przygotuj ofertę dla około 20 faktur miesięcznie.",
  },
} as const;
type Industry = keyof typeof examples;
export function ProductDemo() {
  const [industry, setIndustry] = useState<Industry>("uslugi");
  const [channel, setChannel] = useState<"telefon" | "czat">("telefon");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const ex = examples[industry];
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === "#demo-czat") {
        setChannel("czat");
        setStep(0);
        setPlaying(false);
      } else if (window.location.hash === "#demo-telefon") {
        setChannel("telefon");
        setStep(0);
        setPlaying(false);
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => {
      if (step >= 4) {
        setPlaying(false);
      } else setStep((s) => s + 1);
    }, 1400);
    return () => clearTimeout(id);
  }, [playing, step]);
  const play = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (step >= 4) setStep(0);
    setPlaying(true);
  };
  const messages = [ex.question, ex.answer, ex.detail, ex.final];
  return (
    <div className="nk-demo" id="demo-telefon">
      <span id="demo-czat" className="nk-anchor" />
      <div className="nk-demo-toolbar">
        <div className="nk-segment" aria-label="Kanał prezentacji">
          {(["telefon", "czat"] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={channel === c}
              onClick={() => {
                setChannel(c);
                setStep(0);
                setPlaying(false);
              }}
            >
              {c === "telefon" ? "↗ Telefon AI" : "⌁ Chatbot AI"}
            </button>
          ))}
        </div>
        <label className="nk-industry-label">
          Przykład dla
          <select
            value={industry}
            onChange={(e) => {
              setIndustry(e.target.value as Industry);
              setStep(0);
              setPlaying(false);
            }}
          >
            {Object.entries(examples).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="nk-demo-body">
        <div className="nk-conversation">
          <div className="nk-demo-title">
            <span className="nk-icon">{channel === "telefon" ? "↗" : "⌁"}</span>
            <div>
              {channel === "telefon"
                ? "Przykładowa rozmowa"
                : "Przykładowy czat"}
              <small>
                {channel === "telefon"
                  ? "Transkrypcja · bez dźwięku"
                  : "Widżet na stronie firmy"}
              </small>
            </div>
            <span className="nk-demo-tag">SYMULACJA</span>
          </div>
          <div
            className="nk-messages"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {step === 0 ? (
              <div className="nk-demo-idle">
                <div className="nk-idle-ring">
                  {channel === "telefon" ? "↗" : "⌁"}
                </div>
                <h3>
                  Każda rozmowa
                  <br />
                  zaczyna się od pytania.
                </h3>
                <p>Uruchom przykład i zobacz kolejne kroki.</p>
              </div>
            ) : (
              messages.slice(0, step).map((m, i) => (
                <div
                  key={industry + channel + i}
                  className={`nk-message ${i % 2 === 0 ? "nk-from-client" : "nk-from-ai"}`}
                >
                  <small>{i % 2 === 0 ? "Klient" : "NOKTURN"}</small>
                  <p>{m}</p>
                </div>
              ))
            )}
          </div>
          <div className="nk-demo-controls">
            <button
              type="button"
              className="nk-button nk-button-small"
              onClick={play}
            >
              {playing
                ? "Wstrzymaj"
                : step === 4
                  ? "Odtwórz ponownie"
                  : step > 0
                    ? "Kontynuuj"
                    : "Uruchom przykład"}{" "}
              <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
            </button>
            <button
              type="button"
              className="nk-next"
              disabled={step >= 4}
              onClick={() => {
                setPlaying(false);
                setStep((s) => Math.min(s + 1, 4));
              }}
            >
              Następny krok →
            </button>
            <span>{step}/4</span>
          </div>
        </div>
        <aside className="nk-summary">
          <p className="nk-eyebrow">PO TWOJEJ STRONIE</p>
          <h3>
            Rozmowa się kończy.
            <br />
            <span>Szczegóły zostają.</span>
          </h3>
          <p>
            Zamiast domyślać się, kto dzwonił — masz punkt wyjścia do dalszego
            kontaktu.
          </p>
          <div
            className={`nk-summary-card ${step === 4 ? "nk-summary-ready" : ""}`}
            aria-live="polite"
          >
            <div className="nk-summary-status">
              <span className={step === 4 ? "nk-status" : ""} />
              {step === 4 ? "Zgłoszenie gotowe" : "Podgląd podsumowania"}
            </div>
            <h4>{step === 4 ? ex.subject : "Tutaj pojawi się zapytanie"}</h4>
            <dl>
              <div>
                <dt>Kanał</dt>
                <dd>{channel === "telefon" ? "Telefon" : "Czat na stronie"}</dd>
              </div>
              <div>
                <dt>Preferowany termin</dt>
                <dd>{step === 4 ? ex.when : "Czekamy na szczegóły"}</dd>
              </div>
              <div>
                <dt>Kolejny krok</dt>
                <dd>{step === 4 ? ex.next : "Odtwórz scenariusz po lewej"}</dd>
              </div>
            </dl>
            <div className="nk-summary-footer">
              <span aria-hidden="true">↗</span>{" "}
              {step === 4
                ? "Gotowe do kontaktu z klientem"
                : "Wszystko w jednym miejscu"}
            </div>
          </div>
          <p className="nk-demo-note">
            Przykładowy scenariusz, nie aktywny model AI. Żadne dane nie są
            wysyłane.
          </p>
        </aside>
      </div>
    </div>
  );
}
