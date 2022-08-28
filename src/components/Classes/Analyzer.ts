export class Analyzer extends AnalyserNode {
  constructor(
    ctx: AudioContext,
    fftSize: number | undefined,
    maxDecibels?: number | undefined,
    minDecibels?: number | undefined,
    smoothingTimeConstant?: number | undefined,
    channelCount?: number | undefined
  ) {
    super(ctx, {
      fftSize,
      maxDecibels,
      minDecibels,
      smoothingTimeConstant,
      channelCount,
    })
  }
  createBuffer() {
    const bufferLength = this.frequencyBinCount
    const buffer = new Uint8Array(bufferLength)
    return buffer
  }
}
