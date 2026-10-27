import { connection } from "next/server";
import { parseDemoRequest } from "@/lib/demo-agent";
import { demoConfigured, reserveDemo } from "@/lib/demo-limits";
import { validateDemoWav } from "@/lib/demo-audio";
import { generateDemoAnswer } from "@/lib/demo-response";
export const maxDuration = 90;
const headers = { "Cache-Control": "no-store" };
const failure = (error: string, status: number, remaining?: number) => Response.json({error, remaining}, {status, headers});
export async function GET() {
  await connection();
  return Response.json({available: demoConfigured() && process.env.VOICE_DEMO_ENABLED === "true"}, {headers});
}
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return failure("Otwórz demo na stronie NOKTURN.",403);
  if (!demoConfigured() || process.env.VOICE_DEMO_ENABLED !== "true") return failure("Demo głosowe jest chwilowo niedostępne.",503);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return failure("Nieprawidłowy format.",415);
  let wav: Buffer, input: ReturnType<typeof parseDemoRequest>;
  try {
    if (!request.body) throw Error();
    const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let size=0;
    try { while (true) { const {done,value}=await reader.read(); if(done) break; size+=value.length; if(size>900000){await reader.cancel();throw Error();} chunks.push(value); } } finally {reader.releaseLock();}
    const body=JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!Array.isArray(body.messages) || body.messages.length%2) throw Error();
    input=parseDemoRequest({industry:body.industry,messages:[...body.messages,{role:"user",content:"Nagranie"}]});
    wav=validateDemoWav(body.audio);
  } catch {return failure("Nagraj od 1 do 20 sekund. Możesz też skorzystać z czatu.",400);}
  let slot: Awaited<ReturnType<typeof reserveDemo>>;
  try {slot=await reserveDemo(request,100);} catch {return failure("Demo jest chwilowo niedostępne.",503);}
  if(slot.remaining<0) return failure(slot.remaining===-3 ? "Poczekaj na zakończenie poprzedniej odpowiedzi." : "Limit prób został wykorzystany. Wróć później.",429);
  const auth={Authorization:`Bearer ${process.env.OPENAI_API_KEY}`};
  try {
    const form=new FormData(); form.set("model","gpt-transcribe"); form.append("languages[]","pl"); form.set("file",new Blob([new Uint8Array(wav)],{type:"audio/wav"}),"pytanie.wav");
    const transcriptResponse=await fetch("https://api.openai.com/v1/audio/transcriptions",{method:"POST",headers:auth,body:form,signal:AbortSignal.timeout(20000)});
    if(!transcriptResponse.ok) throw Error();
    const transcript=(await transcriptResponse.json()).text;
    if(typeof transcript!=="string" || !transcript.trim() || transcript.length>700) return failure("Nie udało się odczytać krótkiego pytania. Spróbuj ponownie lub napisz na czacie.",422,slot.remaining);
    input=parseDemoRequest({...input,messages:[...input.messages.slice(0,-1),{role:"user",content:transcript}]});
    const text=await generateDemoAnswer(input);
    // Speech failure still returns the useful text answer; no automatic paid retry.
    let audio: string | null=null;
    try {
      const speech=await fetch("https://api.openai.com/v1/audio/speech",{method:"POST",headers:{...auth,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4o-mini-tts",voice:"coral",input:text.slice(0,1200),instructions:"Mów po polsku, naturalnie, spokojnie i życzliwie. Jesteś asystentką obsługi klienta.",response_format:"mp3"}),signal:AbortSignal.timeout(20000)});
      if(speech.ok) audio=Buffer.from(await speech.arrayBuffer()).toString("base64");
    } catch {}
    return Response.json({transcript,text,audio,remaining:slot.remaining},{headers});
  } catch {return failure("Nie udało się przygotować odpowiedzi. Spróbuj czatu tekstowego.",502,slot.remaining);}
  finally {await slot.release().catch(()=>{});}
}
