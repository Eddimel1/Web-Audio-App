export class Filter extends BiquadFilterNode {
  target: AudioDestinationNode | GainNode | BiquadFilterNode | OscillatorNode
  constructor(
    ctx: AudioContext,
    type: BiquadFilterType | undefined,
    target: AudioDestinationNode | GainNode | BiquadFilterNode | OscillatorNode
  ) {
    super(ctx, { type: type })
    this.target = target
    target.connect(this)
  }
}
