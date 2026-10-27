export async function startVoiceRecording(onLimit: () => void) {
  if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) throw Error("Ta przeglądarka nie obsługuje nagrywania. Skorzystaj z czatu tekstowego.");
  const stream = await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true}});
  const context = new AudioContext();
  const chunks: Float32Array[]=[];
  let node: AudioWorkletNode | undefined, timer: ReturnType<typeof setTimeout> | undefined;
  let closed=false;
  const cleanup=()=>{if(closed)return;closed=true;clearTimeout(timer);stream.getTracks().forEach(t=>t.stop());node?.disconnect();void context.close();};
  try {
    await context.audioWorklet.addModule('/audio/recorder.js');
    await context.resume();
    node=new AudioWorkletNode(context,'nokturn-recorder');
    node.port.onmessage=e=>{if(!closed)chunks.push(e.data);};
    const source=context.createMediaStreamSource(stream);const gain=context.createGain();gain.gain.value=0;
    source.connect(node);node.connect(gain);gain.connect(context.destination);
    timer=setTimeout(onLimit,20000);
    return {cancel:cleanup,finish:()=>{
      cleanup();
      const length=chunks.reduce((n,c)=>n+c.length,0);
      const samples=new Float32Array(length);let offset=0;for(const chunk of chunks){samples.set(chunk,offset);offset+=chunk.length;}
      const count=Math.min(320000,Math.floor(length*16000/context.sampleRate));
      if(count<16000)throw Error('Powiedz krótkie pytanie — nagranie powinno trwać co najmniej sekundę.');
      const buffer=new ArrayBuffer(44+count*2);const v=new DataView(buffer);
      const ascii=(at:number,s:string)=>{for(let i=0;i<s.length;i++)v.setUint8(at+i,s.charCodeAt(i));};
      ascii(0,'RIFF');v.setUint32(4,buffer.byteLength-8,true);ascii(8,'WAVE');ascii(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,16000,true);v.setUint32(28,32000,true);v.setUint16(32,2,true);v.setUint16(34,16,true);ascii(36,'data');v.setUint32(40,count*2,true);
      for(let i=0;i<count;i++){const start=Math.floor(i*context.sampleRate/16000),end=Math.min(length,Math.floor((i+1)*context.sampleRate/16000));let sum=0;for(let j=start;j<end;j++)sum+=samples[j];const sample=Math.max(-1,Math.min(1,sum/Math.max(1,end-start)));v.setInt16(44+i*2,sample<0?sample*32768:sample*32767,true);}
      let binary='';const bytes=new Uint8Array(buffer);for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
      return btoa(binary);
    }};
  } catch(e){cleanup();throw e;}
}
