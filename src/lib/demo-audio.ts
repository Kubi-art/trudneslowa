// Only canonical, uncompressed mono PCM is accepted. Duration is derived on
// the server from actual sample bytes, never from client metadata.
export function validateDemoWav(encoded: unknown): Buffer {
  if (typeof encoded !== "string" || encoded.length > 854000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) throw Error("Invalid audio");
  const b = Buffer.from(encoded, "base64");
  if (b.length < 32044 || b.length > 640044 || b.toString("ascii",0,4) !== "RIFF" || b.toString("ascii",8,12) !== "WAVE" || b.toString("ascii",12,16) !== "fmt " || b.readUInt32LE(16) !== 16 || b.readUInt16LE(20) !== 1 || b.readUInt16LE(22) !== 1 || b.readUInt32LE(24) !== 16000 || b.readUInt32LE(28) !== 32000 || b.readUInt16LE(32) !== 2 || b.readUInt16LE(34) !== 16 || b.toString("ascii",36,40) !== "data" || b.readUInt32LE(40) !== b.length-44 || b.readUInt32LE(4) !== b.length-8 || (b.length-44)%2) throw Error("Invalid audio");
  return b;
}
