class NokturnRecorder extends AudioWorkletProcessor {
  constructor() { super(); this.frames = 0; }
  process(inputs) {
    const channel = inputs[0]?.[0];
    if (channel && this.frames < sampleRate * 20) {
      const copy = channel.slice(0, Math.min(channel.length, sampleRate * 20 - this.frames));
      this.frames += copy.length;
      this.port.postMessage(copy, [copy.buffer]);
    }
    return true;
  }
}
registerProcessor('nokturn-recorder', NokturnRecorder);
