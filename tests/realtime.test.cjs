/* eslint-disable @typescript-eslint/no-require-imports */
const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), Module=require('node:module'), ts=require('typescript'), {EventEmitter}=require('node:events');
function load(file,mocks={}){const name=path.resolve(file),mod=new Module(name,module);mod.filename=name;mod.paths=module.paths;const original=mod.require.bind(mod);mod.require=n=>Object.hasOwn(mocks,n)?mocks[n]:original(n);mod._compile(ts.transpileModule(fs.readFileSync(name,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,name);return mod.exports;}
const agent=load('src/lib/demo-agent.ts');
test('stop signatures reject forged, expired and arbitrary call IDs',()=>{
 const old=process.env.DEMO_LIMIT_SECRET;process.env.DEMO_LIMIT_SECRET='test-only-'.repeat(5);
 try {const limits=load('src/lib/realtime-limits.ts',{'./demo-limits':{}});const expiry=Date.now()+180000,token=limits.signCall('rtc_test',expiry);assert.equal(limits.verifyCall(token),'rtc_test');assert.equal(limits.verifyCall(token.replace('rtc_test','rtc_other')),null);assert.equal(limits.verifyCall(limits.signCall('rtc_test',Date.now()-1000)),null);assert.equal(limits.verifyCall('http://evil'),null);assert.equal(limits.verifyCall(null),null);}finally{if(old===undefined)delete process.env.DEMO_LIMIT_SECRET;else process.env.DEMO_LIMIT_SECRET=old;}
});
test('watchdog independently hangs up at deadline and on session tampering',async()=>{
 let sockets=[],hangups=0,paused=0;
 class Socket extends EventEmitter {constructor(){super();sockets.push(this);queueMicrotask(()=>this.emit('open'));}terminate(){this.emit('close');}}
 const old=global.fetch;global.fetch=async()=>{hangups++;return new Response(null,{status:200});};
 const a=load('src/lib/realtime-agent.ts',{'ws':Socket,'./demo-agent':agent,'./realtime-limits':{pauseRealtime:async()=>{paused++;},callClosed:async()=>false,markCallClosed:async()=>{}}});
 try{
 let w=a.watchRealtime('rtc_test',Date.now()+20);await w.ready;await w.done;assert.equal(hangups,1);
 w=a.watchRealtime('rtc_test',Date.now()+5000);await w.ready;sockets.at(-1).emit('message',Buffer.from(JSON.stringify({type:'session.updated'})));await w.done;assert.equal(hangups,2);
 w=a.watchRealtime('rtc_test',Date.now()+5000);await w.ready;sockets.at(-1).emit('message',Buffer.from(JSON.stringify({type:'response.done',response:{usage:{total_tokens:12000}}})));await w.done;assert.equal(hangups,3);
 global.fetch=async()=>new Response(null,{status:500});await assert.rejects(a.hangupCall('rtc_test'));assert.equal(paused,1);
 }finally{global.fetch=old;}
});
test('realtime rejects abuse before paid create and schedules watchdog before answering',async()=>{
 let enabled=true,reserved=0,result=0,paid=0,scheduled=0,stopped=0,ready=false;
 const route=load('src/app/api/demo/realtime/route.ts',{
 'next/server':{connection:async()=>{},after:fn=>{scheduled++;fn();}},'@/lib/demo-agent':agent,
 '@/lib/realtime-agent':{realtimeSession:()=>({model:'fixed',max_output_tokens:500}),hangupCall:async()=>{stopped++;},watchRealtime:()=>({ready:Promise.resolve().then(()=>{ready=true;}),done:Promise.resolve(),stop:async()=>{stopped++;}})},
 '@/lib/realtime-limits':{REALTIME_SECONDS:120,realtimeConfigured:()=>enabled,reserveRealtime:async()=>{reserved++;return result;},signCall:()=> 'signed-stop-only',verifyCall:t=>t==='signed-stop-only'?'rtc_test':null,pauseRealtime:async()=>{}}
 });
 const old=global.fetch;
 global.fetch=async(url,init)=>{paid++;assert.equal(reserved,1);assert.equal(JSON.parse(init.body.get('session')).model,'fixed');return new Response('v=0\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111',{headers:{location:'/v1/realtime/calls/rtc_test'}});};
 const valid={action:'start',industry:'uslugi',sdp:'v=0\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111',consent:true};
 const req=(body=valid,origin='https://demo.test')=>new Request('https://demo.test/api/demo/realtime',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(body)});
 try{
 assert.equal((await route.POST(req(valid,'https://evil.test'))).status,403);
 for(const b of [{...valid,consent:false},{...valid,industry:'__proto__'},{...valid,sdp:'x'.repeat(25000)},{...valid,sdp:'v=0\r\nm=audio\r\nm=video'}])assert.equal((await route.POST(req(b))).status,400);
 assert.equal(reserved,0);assert.equal(paid,0);
 enabled=false;assert.equal((await route.POST(req())).status,503);enabled=true;
 const r=await route.POST(req());assert.equal(r.status,200);assert.equal(ready,true);assert.equal(scheduled,1);assert.equal((await r.json()).stopToken,'signed-stop-only');
 result=-2;assert.equal((await route.POST(req())).status,429);assert.equal(paid,1);
 enabled=false;assert.equal((await route.POST(req({action:'stop',token:'forged'}))).status,403);assert.equal(stopped,0);
 assert.equal((await route.POST(req({action:'stop',token:'signed-stop-only'}))).status,200);assert.equal(stopped,1);
 }finally{global.fetch=old;}
});
test('client cancellation while microphone permission is pending stops late tracks without billing',async()=>{
 const client=load('src/lib/realtime-client.ts');const descriptor=Object.getOwnPropertyDescriptor(global,'navigator');let grant,tracksStopped=0,requests=0;
 Object.defineProperty(global,'navigator',{configurable:true,value:{mediaDevices:{getUserMedia:()=>new Promise(r=>{grant=r;})}}});
 const oldPC=global.RTCPeerConnection,oldFetch=global.fetch;global.RTCPeerConnection=function(){};global.fetch=async()=>{requests++;};
 const nothing=()=>{};
 try{const c=client.createVoiceSession('uslugi',{pause:nothing,srcObject:null},{status:nothing,line:nothing,time:nothing,error:nothing,audioBlocked:nothing,ended:nothing});const pending=c.start();c.close();grant({getTracks:()=>[{stop:()=>{tracksStopped++;}}]});await pending;assert.equal(tracksStopped,1);assert.equal(requests,0);}finally{if(descriptor)Object.defineProperty(global,'navigator',descriptor);else delete global.navigator;global.RTCPeerConnection=oldPC;global.fetch=oldFetch;}
});

test('confirmed hangup is idempotent across server workers',async()=>{
 const closed=new Set();let requests=0,paused=0;const old=global.fetch;
 const mocks={'./demo-agent':agent,'./realtime-limits':{callClosed:async id=>closed.has(id),markCallClosed:async id=>{closed.add(id);},pauseRealtime:async()=>{paused++;}}};
 global.fetch=async()=>{requests++;return new Response(null,{status:200});};
 try{await load('src/lib/realtime-agent.ts',mocks).hangupCall('rtc_repeat');
 global.fetch=async()=>{requests++;return new Response(null,{status:400});};
 await load('src/lib/realtime-agent.ts',mocks).hangupCall('rtc_repeat');
 assert.equal(requests,1);assert.equal(paused,0);
 }finally{global.fetch=old;}
});
