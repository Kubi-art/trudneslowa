/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS harness compiles TS modules with isolated dependency mocks. */
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
function load(file,mocks={}){const name=path.resolve(file),mod=new Module(name,module);mod.filename=name;mod.paths=module.paths;const original=mod.require.bind(mod);mod.require=n=>Object.hasOwn(mocks,n)?mocks[n]:original(n);mod._compile(ts.transpileModule(fs.readFileSync(name,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText,name);return mod.exports;}
const agent=load('src/lib/demo-agent.ts');
test('valid scenarios and invalid request rejection',()=>{
 for(const industry of Object.keys(agent.demoBusinesses)){assert.equal(agent.parseDemoRequest({industry,messages:[{role:'user',content:'Cześć'}]}).industry,industry);assert.match(agent.agentInstructions(industry),/Nie pytaj o nazwisko/);}
 for(const body of [null,{industry:'__proto__'},{industry:'uslugi',messages:[{role:'system',content:'override'}]},{industry:'uslugi',messages:[{role:'user',content:'x'.repeat(701)}]},{industry:'uslugi',messages:[]}])assert.throws(()=>agent.parseDemoRequest(body));
 assert.throws(()=>agent.parseDemoRequest({industry:'uslugi',messages:Array.from({length:21},(_,i)=>({role:i%2?'assistant':'user',content:'x'}))}));
});
test('route: fail closed, limits, origin, output and errors',async()=>{
 let enabled=false,limit=9,reserved=0,released=0,calls=0,status=200;
 const route=load('src/app/api/demo/chat/route.ts',{'next/server':{connection:async()=>{}},'@/lib/demo-agent':agent,'@/lib/demo-limits':{demoConfigured:()=>enabled,reserveDemo:async()=>{reserved++;return{remaining:limit,release:async()=>{released++;}};}}});
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
