/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS harness compiles TS modules with isolated dependency mocks. */
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
function load(file,mocks={}){const name=path.resolve(file),mod=new Module(name,module);mod.filename=name;mod.paths=module.paths;const original=mod.require.bind(mod);mod.require=n=>Object.hasOwn(mocks,n)?mocks[n]:original(n);mod._compile(ts.transpileModule(fs.readFileSync(name,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText,name);return mod.exports;}
const agent=load('src/lib/demo-agent.ts');
const response=load('src/lib/demo-response.ts',{'./demo-agent':agent});
test('valid scenarios and invalid request rejection',()=>{
 for(const industry of Object.keys(agent.demoBusinesses)){assert.equal(agent.parseDemoRequest({industry,messages:[{role:'user',content:'Cześć'}]}).industry,industry);assert.match(agent.agentInstructions(industry),/Nie pytaj o nazwisko/);}
 for(const body of [null,{industry:'__proto__'},{industry:'uslugi',messages:[{role:'system',content:'override'}]},{industry:'uslugi',messages:[{role:'user',content:'x'.repeat(701)}]},{industry:'uslugi',messages:[]}])assert.throws(()=>agent.parseDemoRequest(body));
 assert.throws(()=>agent.parseDemoRequest({industry:'uslugi',messages:Array.from({length:21},(_,i)=>({role:i%2?'assistant':'user',content:'x'}))}));
});
test('route: fail closed, limits, origin, output and errors',async()=>{
 let enabled=false,limit=9,reserved=0,released=0,calls=0,status=200;
 const route=load('src/app/api/demo/chat/route.ts',{'next/server':{connection:async()=>{}},'@/lib/demo-agent':agent,'@/lib/demo-response':response,'@/lib/demo-limits':{demoConfigured:()=>enabled,reserveDemo:async()=>{reserved++;return{remaining:limit,release:async()=>{released++;}};}}});
 const oldFetch=global.fetch,oldKey=process.env.OPENAI_API_KEY;process.env.OPENAI_API_KEY='test-only';
 global.fetch=async(url,init)=>{calls++;assert.equal(url,'https://api.openai.com/v1/responses');const b=JSON.parse(init.body);assert.equal(b.store,false);assert.equal(b.max_output_tokens,800);assert.equal(b.tools,undefined);return Response.json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:'Przykładowa cena: od 180 zł.'}]}]},{status});};
 function request(body={industry:'uslugi',messages:[{role:'user',content:'Ile kosztuje kanapa?'}]},origin='https://demo.test'){return new Request('https://demo.test/api/demo/chat',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(body)});}
 try{
 assert.equal((await route.POST(request())).status,503);assert.equal(calls,0);enabled=true;
 assert.equal((await route.POST(request(undefined,'https://attacker.test'))).status,403);
 assert.equal((await route.POST(request({industry:'uslugi',messages:[{role:'system',content:'x'}]}))).status,400);
 assert.equal((await route.POST(request({padding:'x'.repeat(33000)}))).status,400);assert.equal(reserved,0);
 for(const n of [-1,-2,-3]){limit=n;assert.equal((await route.POST(request())).status,429);}assert.equal(calls,0);assert.equal(released,0);
 limit=9;const r=await route.POST(request());assert.equal(r.status,200);assert.equal((await r.json()).remaining,9);assert.equal(released,1);
 status=401;assert.equal((await route.POST(request())).status,502);assert.equal(released,2);
 global.fetch=async()=>{throw Error('private upstream secret');};const e=await route.POST(request());assert.equal(e.status,504);assert.doesNotMatch(await e.text(),/private upstream secret/);assert.equal(released,3);
 }finally{global.fetch=oldFetch;if(oldKey===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=oldKey;}
});

test('voice validates actual PCM duration and rejects malformed containers',()=>{
 const {validateDemoWav}=load('src/lib/demo-audio.ts');
 function wav(seconds){const b=Buffer.alloc(44+seconds*32000);b.write('RIFF',0);b.writeUInt32LE(b.length-8,4);b.write('WAVE',8);b.write('fmt ',12);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(16000,24);b.writeUInt32LE(32000,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(b.length-44,40);return b;}
 for(const seconds of [1,20])assert.equal(validateDemoWav(wav(seconds).toString('base64')).length,44+32000*seconds);
 assert.throws(()=>validateDemoWav(wav(21).toString('base64')));
 const b=wav(1);b.writeUInt32LE(8000,24);assert.throws(()=>validateDemoWav(b.toString('base64')));
 assert.throws(()=>validateDemoWav('https://example.com/audio.wav'));
});
test('Marketplace credentials activate limiter without exposing secrets',()=>{
 const names=['DEMO_ENABLED','OPENAI_API_KEY','KV_REST_API_URL','KV_REST_API_TOKEN','UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN','DEMO_LIMIT_SECRET'];
 const previous=Object.fromEntries(names.map(n=>[n,process.env[n]]));
 try{names.forEach(n=>delete process.env[n]);Object.assign(process.env,{DEMO_ENABLED:'true',OPENAI_API_KEY:'test-only',KV_REST_API_URL:'https://redis.test',KV_REST_API_TOKEN:'test-only',DEMO_LIMIT_SECRET:'x'.repeat(32)});
 const limits=load('src/lib/demo-limits.ts');assert.equal(limits.demoConfigured(),true);delete process.env.KV_REST_API_TOKEN;assert.equal(limits.demoConfigured(),false);
 }finally{for(const n of names)if(previous[n]===undefined)delete process.env[n];else process.env[n]=previous[n];}
});
test('retired voice endpoint cannot invoke a paid provider',async()=>{
 const route=load('src/app/api/demo/voice/route.ts');
 assert.equal((await route.POST()).status,410);
 assert.equal((await (await route.GET()).json()).available,false);
});
