import type { DemoIndustry } from "./demo-agent";
export type VoiceState = "idle" | "permission" | "connecting" | "listening" | "speaking" | "thinking" | "ended";
export type VoiceLine = { id: string; role: "user" | "assistant"; text: string };
type Events = {
  status: (state: VoiceState) => void;
  line: (line: VoiceLine, append?: boolean) => void;
  time: (seconds: number) => void;
  error: (message: string) => void;
  audioBlocked: (blocked: boolean) => void;
  ended: (message: string) => void;
};

export function createVoiceSession(industry: DemoIndustry, player: HTMLAudioElement, events: Events) {
  let closed = false, stream: MediaStream | undefined, pc: RTCPeerConnection | undefined, dc: RTCDataChannel | undefined;
  let stopToken: string | undefined, deadline = 0;
  let timer: ReturnType<typeof setInterval> | undefined, connectionTimer: ReturnType<typeof setTimeout> | undefined;
  const controller = new AbortController();
  function close(message = "Rozmowa zakończona. Dziękujemy za wypróbowanie Mai.") {
    if (closed) return;
    closed = true; clearInterval(timer); clearTimeout(connectionTimer); controller.abort();
    stream?.getTracks().forEach(track => track.stop());
    dc?.close(); pc?.close(); player.pause(); player.srcObject = null;
    if (stopToken) void fetch("/api/demo/realtime", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "stop", token: stopToken }), keepalive: true }).catch(() => {});
    events.audioBlocked(false); events.status("ended"); events.ended(message);
  }
  async function play() {
    try { await player.play(); if (!closed) events.audioBlocked(false); }
    catch { if (!closed) events.audioBlocked(true); }
  }
  function onEvent(raw: string) {
    if (closed || raw.length > 200000) return;
    let event;
    try { event = JSON.parse(raw); } catch { return; }
    const itemId = typeof event.item_id === "string" ? event.item_id : "";
    switch (event.type) {
      case "conversation.item.created":
      case "conversation.item.added":
        if (event.item?.type === "message" && ["user", "assistant"].includes(event.item.role)) events.line({ id: event.item.id, role: event.item.role, text: "" });
        break;
      case "conversation.item.input_audio_transcription.completed":
        if (itemId && typeof event.transcript === "string") events.line({ id: itemId, role: "user", text: event.transcript.slice(0, 4000) });
        break;
      case "response.output_audio_transcript.delta":
        if (itemId && typeof event.delta === "string") events.line({ id: itemId, role: "assistant", text: event.delta }, true);
        break;
      case "response.output_audio_transcript.done":
        if (itemId && typeof event.transcript === "string") events.line({ id: itemId, role: "assistant", text: event.transcript.slice(0, 4000) });
        break;
      case "input_audio_buffer.speech_started": events.status("listening"); break;
      case "input_audio_buffer.speech_stopped": events.status("thinking"); break;
      case "output_audio_buffer.started": events.status("speaking"); break;
      case "output_audio_buffer.stopped":
      case "output_audio_buffer.cleared": events.status("listening"); break;
      case "error": events.error("Połączenie z asystentką zostało przerwane. Możesz kontynuować na czacie."); close("Rozmowa przerwana."); break;
    }
  }
  async function start() {
    events.status("permission");
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === "undefined") throw Error("unsupported");
      const media = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false });
      if (closed) { media.getTracks().forEach(track => track.stop()); return; }
      stream = media; events.status("connecting");
      connectionTimer = setTimeout(() => { events.error("Łączenie trwa zbyt długo. Sprawdź połączenie lub skorzystaj z czatu."); close("Nie udało się połączyć."); }, 30000);
      pc = new RTCPeerConnection();
      stream.getAudioTracks().forEach(track => pc!.addTrack(track, stream!));
      pc.ontrack = event => { if (!closed) { player.srcObject = event.streams[0] ?? new MediaStream([event.track]); void play(); } };
      pc.onconnectionstatechange = () => {
        if (closed) return;
        if (pc?.connectionState === "failed" || pc?.connectionState === "closed") close("Połączenie zostało zakończone. Możesz kontynuować na czacie.");
      };
      dc = pc.createDataChannel("oai-events");
      dc.onmessage = event => { if (typeof event.data === "string") onEvent(event.data); };
      dc.onclose = () => { if (!closed) close("Demo zakończone. Możesz kontynuować na czacie."); };
      dc.onopen = () => {
        if (closed) return;
        clearTimeout(connectionTimer); events.status("listening");
        dc!.send(JSON.stringify({ type: "response.create" }));
      };
      const offer = await pc.createOffer();
      if (closed) return;
      await pc.setLocalDescription(offer);
      const r = await fetch("/api/demo/realtime", { method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal, body: JSON.stringify({ action: "start", consent: true, industry, sdp: offer.sdp }) });
      const data = await r.json();
      if (!r.ok) throw Error(data.error || "Nie udało się uruchomić rozmowy.");
      stopToken = data.stopToken;
      if (closed) {
        void fetch("/api/demo/realtime", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "stop", token: stopToken }), keepalive: true }).catch(() => {});
        return;
      }
      if (typeof data.sdp !== "string" || !Number.isFinite(data.expiresAt)) throw Error("Nieprawidłowa odpowiedź połączenia.");
      deadline = Math.min(data.expiresAt, Date.now() + 120000);
      const tick = () => { const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); events.time(seconds); if (!seconds) close("Minęły 2 minuty demo. Dziękujemy za rozmowę — możesz teraz wypróbować czat."); };
      tick(); timer = setInterval(tick, 250);
      await pc.setRemoteDescription({ type: "answer", sdp: data.sdp });
    } catch (error) {
      if (closed) return;
      const name = error instanceof Error ? error.name : "";
      events.error(name === "NotAllowedError" ? "Mikrofon jest zablokowany. Zezwól na dostęp w przeglądarce lub skorzystaj z czatu." : name === "NotFoundError" ? "Nie znaleziono mikrofonu. Podłącz go lub skorzystaj z czatu." : error instanceof Error && error.message === "unsupported" ? "Ta przeglądarka nie obsługuje rozmowy głosowej. Otwórz stronę w aktualnym Chrome, Safari lub Firefox." : error instanceof Error ? error.message : "Nie udało się uruchomić mikrofonu.");
      close("Rozmowa nie została uruchomiona.");
    }
  }
  return { start, close, play, mute: (muted: boolean) => stream?.getAudioTracks().forEach(track => { track.enabled = !muted; }) };
}
