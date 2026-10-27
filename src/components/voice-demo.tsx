"use client";
import { useEffect, useRef, useState } from "react";
import { demoBusinesses, type DemoIndustry, type DemoMessage } from "@/lib/demo-agent";
import { startVoiceRecording } from "@/lib/voice-recorder";

export function VoiceDemo() {
  const [industry,setIndustry]=useState<DemoIndustry>('uslugi');
  const [messages,setMessages]=useState<DemoMessage[]>([]);
  const [available,setAvailable]=useState(false),[consent,setConsent]=useState(false);
  const [status,setStatus]=useState<'idle'|'permission'|'recording'|'thinking'>('idle');
  const [error,setError]=useState(''),[seconds,setSeconds]=useState(0),[remaining,setRemaining]=useState(10);
  const [audio,setAudio]=useState<string|null>(null);
  const recorder=useRef<Awaited<ReturnType<typeof startVoiceRecording>>|null>(null);
  const mounted=useRef(true),busy=useRef(false),abort=useRef<AbortController|null>(null);
  const player=useRef<HTMLAudioElement>(null);
  useEffect(()=>{mounted.current=true;const controller=new AbortController();fetch('/api/demo/voice',{signal:controller.signal,cache:'no-store'}).then(r=>r.json()).then(d=>setAvailable(d.available===true)).catch(()=>{});return()=>{mounted.current=false;controller.abort();abort.current?.abort();recorder.current?.cancel();};},[]);
  useEffect(()=>{if(status!=='recording')return;const timer=setInterval(()=>setSeconds(s=>Math.min(20,s+1)),1000);return()=>clearInterval(timer);},[status]);
  const disabled=!available||!consent||remaining===0||messages.length>=20;
  async function finish(){
    const current=recorder.current;if(!current)return;recorder.current=null;
    setStatus('thinking');
    const controller=new AbortController();abort.current=controller;const timeout=setTimeout(()=>controller.abort(),80000);
    try{
      const recording=current.finish();
      const response=await fetch('/api/demo/voice',{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({industry,messages,audio:recording})});
      const data=await response.json();if(!mounted.current)return;
      if(typeof data.remaining==='number')setRemaining(data.remaining);
      if(!response.ok)throw Error(data.error||'Nie udało się uzyskać odpowiedzi.');
      setMessages([...messages,{role:'user',content:data.transcript},{role:'assistant',content:data.text}]);
      if(data.audio)setAudio('data:audio/mpeg;base64,'+data.audio);
      else setError('Odpowiedź jest gotowa poniżej, ale dźwięk jest chwilowo niedostępny.');
    }catch(e){if(mounted.current)setError(e instanceof Error&&e.name!=='AbortError'?e.message:'Połączenie przerwane. Spróbuj ponownie.');}
    finally{clearTimeout(timeout);busy.current=false;if(mounted.current)setStatus('idle');}
  }
  async function start(){
    if(disabled||busy.current)return;busy.current=true;setError('');setSeconds(0);setAudio(null);player.current?.pause();setStatus('permission');
    try {const recording=await startVoiceRecording(()=>void finish());if(!mounted.current){recording.cancel();return;}recorder.current=recording;setStatus('recording');}
    catch(e){busy.current=false;if(mounted.current){setStatus('idle');setError(e instanceof DOMException&&e.name==='NotAllowedError'?'Mikrofon jest zablokowany. Zezwól na dostęp w przeglądarce lub skorzystaj z czatu.':e instanceof Error?e.message:'Nie udało się uruchomić mikrofonu.');}}
  }
  function cancel(){recorder.current?.cancel();recorder.current=null;busy.current=false;setStatus('idle');setSeconds(0);}
  return <section className="nk-voice" id="demo-glos" aria-labelledby="voice-title">
    <div><p className="nk-voice-eyebrow">DEMO GŁOSOWE</p><h3 id="voice-title">Powiedz to Mai.</h3><p>Nagraj pytanie. Asystentka odpowie głosem i pokaże zapis rozmowy. To próba w przeglądarce, bez wykonywania połączenia telefonicznego.</p>
      <label htmlFor="voice-industry">Wybierz fikcyjną firmę</label><select id="voice-industry" value={industry} disabled={status!=='idle'} onChange={e=>{setIndustry(e.target.value as DemoIndustry);setMessages([]);setAudio(null);setError('');}}>{Object.entries(demoBusinesses).map(([key,c])=><option key={key} value={key}>{c.name} — {c.label}</option>)}</select>
      <label className="nk-live-consent"><input type="checkbox" checked={consent} disabled={status!=='idle'} onChange={e=>setConsent(e.target.checked)}/>Chcę przetestować głos AI. Nagranie i treść rozmowy zostaną przesłane do OpenAI. Użyję fikcyjnych danych.</label>
      <a href="/polityka-prywatnosci">Jak przetwarzamy dane?</a>
    </div>
    <div className="nk-voice-panel">
      <div className={`nk-voice-orb ${status==='recording'?'is-recording':''}`} aria-hidden="true">M</div>
      <p role="status">{!available?'Demo głosowe przygotowywane do uruchomienia':status==='permission'?'Zezwól na dostęp do mikrofonu':status==='recording'?`Słucham · ${seconds}/20 s`:status==='thinking'?'Maja przygotowuje odpowiedź…':'Maja · asystentka AI'}</p>
      <div className="nk-actions">{status==='recording'?<><button className="nk-button" onClick={()=>void finish()}>Wyślij nagranie</button><button className="nk-text-link" onClick={cancel}>Anuluj</button></>:<button className="nk-button" disabled={disabled||status!=='idle'} onClick={()=>void start()}>Nagraj pytanie <span aria-hidden="true">↗</span></button>}</div>
      <p className="nk-live-footnote">Do 20 sekund na pytanie. Wspólny limit czatu i głosu: 10 prób na sieć / 24 h.</p>
      {error&&<p role="alert" className="nk-live-error">{error}</p>}
      {audio&&<audio ref={player} src={audio} controls autoPlay aria-label="Odpowiedź Mai — głos wygenerowany przez AI"/>}
      <div className="nk-voice-transcript" role="log" aria-live="polite" aria-label="Zapis rozmowy głosowej">{messages.map((m,i)=><div key={i}><strong>{m.role==='user'?'Ty':'Maja · AI'}</strong><p>{m.content}</p></div>)}</div>
      {!!messages.length&&<button className="nk-text-link" disabled={status!=='idle'} onClick={()=>{setMessages([]);setAudio(null);setError('');}}>Wyczyść rozmowę</button>}
    </div>
  </section>;
}
