"use client";
import { useEffect, useRef, useState } from "react";
import { demoBusinesses, type DemoIndustry } from "@/lib/demo-agent";
import { createVoiceSession, type VoiceLine, type VoiceState } from "@/lib/realtime-client";

const labels: Record<VoiceState, string> = { idle: "Maja jest gotowa do rozmowy", permission: "Zezwól na dostęp do mikrofonu", connecting: "Łączę Cię z Mają…", listening: "Maja słucha", speaking: "Maja mówi · możesz jej przerwać", thinking: "Maja przygotowuje odpowiedź…", ended: "Rozmowa zakończona" };
export function VoiceDemo() {
  const [industry, setIndustry] = useState<DemoIndustry>("uslugi");
  const [messages, setMessages] = useState<VoiceLine[]>([]);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [consent, setConsent] = useState(false), [muted, setMuted] = useState(false), [audioBlocked, setAudioBlocked] = useState(false);
  const [status, setStatus] = useState<VoiceState>("idle"), [seconds, setSeconds] = useState(120);
  const [error, setError] = useState(""), [notice, setNotice] = useState("");
  const session = useRef<ReturnType<typeof createVoiceSession> | null>(null), player = useRef<HTMLAudioElement>(null), mounted = useRef(false);
  const active = !["idle", "ended"].includes(status);
  const connected = ["listening", "speaking", "thinking"].includes(status);
  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    fetch("/api/demo/realtime", { signal: controller.signal, cache: "no-store" }).then(r => r.json()).then(d => { if (mounted.current) setAvailable(d.available === true); }).catch(() => { if (mounted.current) setAvailable(false); });
    const leave = () => session.current?.close();
    window.addEventListener("pagehide", leave);
    return () => { mounted.current = false; controller.abort(); window.removeEventListener("pagehide", leave); session.current?.close(); };
  }, []);
  function start() {
    if (!available || !consent || active || !player.current || session.current) return;
    setError(""); setNotice(""); setMessages([]); setSeconds(120); setMuted(false); setAudioBlocked(false);
    const current = createVoiceSession(industry, player.current, {
      status: state => { if (mounted.current) setStatus(state); },
      time: value => { if (mounted.current) setSeconds(value); },
      error: value => { if (mounted.current) setError(value); },
      audioBlocked: value => { if (mounted.current) setAudioBlocked(value); },
      ended: value => { session.current = null; if (mounted.current) setNotice(value); },
      line: (line, append = false) => {
        if (!mounted.current) return;
        setMessages(previous => {
          const index = previous.findIndex(item => item.id === line.id);
          if (index < 0) return [...previous, line].slice(-26);
          const updated = [...previous];
          updated[index] = { ...line, text: (append ? previous[index].text + line.text : line.text || previous[index].text).slice(0, 4000) };
          return updated;
        });
      },
    });
    session.current = current; void current.start();
  }
  return <section className="nk-voice-demo" id="demo-glos" aria-labelledby="voice-title">
    <div>
      <p className="nk-voice-eyebrow">ROZMOWA NA ŻYWO</p>
      <h3 id="voice-title">Po prostu<br />porozmawiaj.</h3>
      <p>Włącz mikrofon i zadaj Mai własne pytanie. Odpowie głosem, zapamięta kontekst i wysłucha Cię, gdy jej przerwiesz.</p>
      <p className="nk-voice-detail">2 minuty · po polsku · bez numeru telefonu</p>
      <label htmlFor="voice-industry">Jaką firmę ma reprezentować Maja?</label>
      <select id="voice-industry" value={industry} disabled={active} onChange={e => { setIndustry(e.target.value as DemoIndustry); setMessages([]); setError(""); setNotice(""); }}>{Object.entries(demoBusinesses).map(([key, company]) => <option key={key} value={key}>{company.name} — {company.label}</option>)}</select>
      <label className="nk-live-consent"><input type="checkbox" checked={consent} disabled={active} onChange={e => setConsent(e.target.checked)} />Rozumiem, że rozmawiam z AI, a dźwięk jest przesyłany na żywo do OpenAI. Użyję wyłącznie fikcyjnych danych.</label>
      <a href="/polityka-prywatnosci">Jak przetwarzamy dane?</a>
    </div>
    <div className="nk-voice-panel">
      <div className="nk-voice-topline"><span>MAJA / {demoBusinesses[industry].name}</span><span className="nk-voice-timer" aria-label="Pozostały czas rozmowy">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</span></div>
      <div className={`nk-voice-orb ${connected && !muted ? "is-recording" : ""}`} aria-hidden="true">M</div>
      <p role="status">{available === null ? "Sprawdzam dostępność…" : !available ? "Rozmowa na żywo chwilowo niedostępna" : muted && connected ? "Mikrofon wyciszony" : labels[status]}</p>
      <div className="nk-actions">
        {active ? <>
          {connected && <button className="nk-voice-secondary" aria-pressed={muted} onClick={() => { session.current?.mute(!muted); setMuted(!muted); }}>{muted ? "Włącz mikrofon" : "Wycisz mikrofon"}</button>}
          <button className="nk-button nk-voice-end" onClick={() => session.current?.close()}>{connected ? "Zakończ rozmowę" : "Anuluj łączenie"}</button>
        </> : <button className="nk-button" disabled={!available || !consent} onClick={start}>Porozmawiaj z Mają <span aria-hidden="true">↗</span></button>}
      </div>
      {!active && !consent && available && <p className="nk-voice-hint">Zaznacz zasady demo, aby włączyć mikrofon.</p>}
      {audioBlocked && <button className="nk-voice-secondary" onClick={() => void session.current?.play()}>Włącz dźwięk odpowiedzi</button>}
      <p className="nk-live-footnote">Jedna próba głosowa na sieć / 24 h. Do 2 minut; rozmowa może zakończyć się wcześniej po osiągnięciu limitu użycia. Firmy, ceny i zgłoszenia są przykładowe.</p>
      {error && <p role="alert" className="nk-live-error">{error}</p>}
      {notice && !error && <p className="nk-voice-hint">{notice}</p>}
      <audio ref={player} autoPlay aria-label="Głos Mai wygenerowany przez AI" />
      {!!messages.length && <details className="nk-voice-log" open><summary>Zapis tej rozmowy</summary><div className="nk-voice-transcript" role="log" aria-live="off" aria-label="Zapis rozmowy głosowej">{messages.filter(m => m.text).map(m => <div key={m.id}><strong>{m.role === "user" ? "Ty" : "Maja · AI"}</strong><p>{m.text}</p></div>)}</div></details>}
      <a className="nk-voice-chat-link" href="#rozmowa-ai" onClick={() => session.current?.close()}>Wolisz pisać? Przejdź do czatu →</a>
    </div>
  </section>;
}
