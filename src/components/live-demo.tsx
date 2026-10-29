"use client";
import { useEffect, useRef, useState } from "react";
import { demoBusinesses, MAX_TEXT, MAX_TURNS, type DemoIndustry, type DemoMessage } from "@/lib/demo-agent";

export function LiveDemo() {
  const [industry, setIndustry] = useState<DemoIndustry>("uslugi");
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [available, setAvailable] = useState<boolean | null>(null);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState(10);
  const request = useRef<AbortController | null>(null);
  const sending = useRef(false);
  const end = useRef<HTMLDivElement>(null);
  const company = demoBusinesses[industry];
  useEffect(() => {
    const abort = new AbortController();
    fetch("/api/demo/chat", { signal: abort.signal, cache: "no-store" })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setAvailable(data.available === true))
      .catch(() => { if (!abort.signal.aborted) setAvailable(false); });
    return () => { abort.abort(); request.current?.abort(); };
  }, []);
  useEffect(() => { if (messages.length) end.current?.scrollIntoView({ block: "nearest" }); }, [messages, busy]);
  const turns = messages.filter(m => m.role === "user").length;
  const disabled = !available || !consent || busy || remaining === 0 || turns >= MAX_TURNS;
  async function send(text: string) {
    if (disabled || sending.current || !text.trim()) return;
    sending.current = true;
    setBusy(true); setError("");
    const next: DemoMessage[] = [...messages, { role: "user", content: text.trim() }];
    setMessages(next); setDraft("");
    const abort = new AbortController(); request.current = abort;
    const timeout = setTimeout(() => abort.abort(), 40000);
    try {
      const response = await fetch("/api/demo/chat", { method: "POST", signal: abort.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ industry, messages: next }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Nie udało się wysłać wiadomości.");
      setMessages([...next, { role: "assistant", content: data.text }]);
      setRemaining(data.remaining);
    } catch (e) {
      setMessages(messages); setDraft(text);
      setError(e instanceof Error && e.name !== "AbortError" ? e.message : "Połączenie zostało przerwane. Możesz spróbować ponownie.");
    } finally { clearTimeout(timeout); setBusy(false); sending.current = false; }
  }
  function reset(value: DemoIndustry) { if (busy) return; setIndustry(value); setMessages([]); setDraft(""); setError(""); }
  return <section className="nk-live" aria-labelledby="live-heading" id="rozmowa-ai">
    <div className="nk-live-intro">
      <h3 id="live-heading">Twoje pytanie.<br />Odpowiedź asystentki.</h3>
      <p>Wybierz fikcyjną firmę i sprawdź, jak Maja poprowadzi rozmowę. Możesz zapytać o ofertę, ceny lub przykładowe zgłoszenie.</p>
      <label htmlFor="live-industry">Wypróbuj obsługę firmy</label>
      <select id="live-industry" value={industry} disabled={busy} onChange={e => reset(e.target.value as DemoIndustry)}>
        {Object.entries(demoBusinesses).map(([key, value]) => <option key={key} value={key}>{value.label} — {value.name}</option>)}
      </select>
      <p className="nk-live-disclosure">Rozmawiasz z AI. Firmy i ceny są fikcyjne, a zgłoszenia nie są wysyłane. Wpisuj wyłącznie wymyślone dane. Treść rozmowy zostanie przesłana do OpenAI w celu wygenerowania odpowiedzi.</p>
      <label className="nk-live-consent"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} disabled={busy} />Rozumiem zasady demonstracji i chcę rozpocząć rozmowę.</label>
      <a href="/polityka-prywatnosci" className="nk-text-link">Polityka prywatności</a>
    </div>
    <div className="nk-live-chat">
      <div className="nk-live-header"><div><strong>Maja / {company.name}</strong><span>Asystentka AI · demonstracja</span></div><button type="button" disabled={busy || !messages.length} onClick={() => reset(industry)}>Nowa rozmowa</button></div>
      <div className="nk-live-messages" role="log" aria-label="Rozmowa z asystentką" aria-live="polite" aria-relevant="additions text">
        {!messages.length && <div className="nk-live-empty"><p>Cześć! Jestem Maja, asystentka AI firmy {company.name}. To fikcyjna firma do przetestowania obsługi. O co chcesz zapytać?</p>
          <div className="nk-live-suggestions">{company.questions.map(question => <button key={question} disabled={disabled} onClick={() => send(question)}>{question}</button>)}</div></div>}
        {messages.map((message, index) => <div key={index} className={`nk-live-message nk-live-${message.role}`}><span>{message.role === "user" ? "Ty" : "Maja · AI"}</span><p>{message.content}</p></div>)}
        {busy && <p role="status">Maja przygotowuje odpowiedź…</p>}
        <div ref={end} />
      </div>
      {available === false && <p className="nk-live-notice" role="status">Prawdziwe demo AI czeka na aktywację. Poniżej możesz obejrzeć gotową symulację.</p>}
      {available === null && <p className="nk-live-notice" role="status">Sprawdzam dostępność demo…</p>}
      {error && <p className="nk-live-error" role="alert">{error}</p>}
      <form onSubmit={e => { e.preventDefault(); void send(draft); }}>
        <label htmlFor="live-message">Twoja wiadomość</label>
        <textarea id="live-message" maxLength={MAX_TEXT} value={draft} onChange={e => setDraft(e.target.value)} disabled={disabled} rows={2} placeholder={consent ? "Zapytaj o ofertę lub przykładowy termin…" : "Najpierw zaakceptuj zasady demonstracji"} aria-describedby="live-limit" />
        <div className="nk-live-send"><span id="live-limit">{draft.length}/{MAX_TEXT} znaków · {Math.min(remaining, MAX_TURNS - turns)} pozostałych pytań</span><button type="submit" className="nk-button nk-button-small" disabled={disabled || !draft.trim()}>{busy ? "Odpowiadam…" : "Wyślij"}</button></div>
      </form>
      {(remaining === 0 || turns >= MAX_TURNS) && <p className="nk-live-notice">Koniec tej próby. Dziękujemy za przetestowanie asystentki.</p>}
      <p className="nk-live-footnote">Do 10 prób z jednej sieci w ciągu 24 h. Nowa rozmowa nie odnawia limitu. AI może się mylić.</p>
    </div>
  </section>;
}
