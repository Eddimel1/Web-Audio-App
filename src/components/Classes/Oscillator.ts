import { Analyzer } from './Analyzer'
import { Filter } from './Filter'
import { filterOptionsArrayType } from '../UIComps/switcher'
export type waveType = 'sine' | 'square' | 'sawtooth' | 'triangle'
export type filterType =
  | 'lowpass'
  | 'highpass'
  | 'bandpass'
  | 'lowshelf'
  | 'highshelf'
  | 'peaking'
  | 'notch'
  | 'allpass'
type valueType = 'Q' | 'frequency'

export class Oscillator {
  ctx: AudioContext
  frequency: number
  dest: AudioDestinationNode
  mainGainNode: GainNode
  detuneValue: number
  osc: OscillatorNode
  filtersFreq: number
  filtersQ: number
  activeFilters: Filter[]
  resetFilterArray: boolean
  // filtersAreInitialized : boolean
  constructor(
    ctx: AudioContext,
    frequency: number,
    type: waveType,
    detuneValue: number
  ) {
    this.ctx = ctx
    this.frequency = frequency
    this.mainGainNode = ctx.createGain()
    this.mainGainNode.gain.value = 0
    this.dest = ctx.destination
    this.detuneValue = detuneValue
    this.osc = this.ctx.createOscillator()
    this.osc.detune.setValueAtTime(detuneValue, 0)
    this.osc.type = type
    this.ctx.resume()
    this.osc.start(this.ctx.currentTime)
    this.filtersFreq = 300
    this.filtersQ = 1
    this.activeFilters = []
    this.resetFilterArray = false
    this.createAndConnectFilters(['allpass'])
  }
  createAndConnectFilters(arrayofFilters: filterOptionsArrayType) {
    let prevFilter: Filter

    arrayofFilters.forEach((filter, i, array) => {
      let filterCount = array.length
      if (i === 0) {
        console.log('1', prevFilter)
        const curFilter = new Filter(this.ctx, filter, this.mainGainNode)
        this.activeFilters = [curFilter]
        prevFilter = curFilter
        filterCount === 1 && curFilter.connect(this.ctx.destination)

        console.log(this.activeFilters)
      } else if (i === 1) {
        console.log('2', prevFilter)
        const curFilter = new Filter(this.ctx, filter, prevFilter)
        this.activeFilters.push(curFilter)
        console.log(prevFilter)
        prevFilter = curFilter
        filterCount === 2 && curFilter.connect(this.ctx.destination)
        console.log(this.activeFilters)
      } else if (i === 2 || (i > 1 && i != array.length - 1)) {
        console.log('3', prevFilter)
        const curFilter = new Filter(this.ctx, filter, prevFilter)

        prevFilter = curFilter
        this.activeFilters.push(curFilter)
        console.log(this.activeFilters)
        filterCount === 3 && curFilter.connect(this.ctx.destination)
      } else if (i !== 0 && i === array.length - 1) {
        console.log('4', prevFilter)
        const curFilter = new Filter(this.ctx, filter, prevFilter)
        this.activeFilters.push(curFilter)
        prevFilter = curFilter
        curFilter.connect(this.ctx.destination)
        console.log(this.activeFilters)
        filterCount >= 4 && curFilter.connect(this.ctx.destination)
      }
    })
  }

  playSound(attack: number, decay: number, sustain: number, fade: number) {
    this.ctx.resume()
    const now = this.ctx.currentTime
    this.mainGainNode.gain.cancelScheduledValues(now)
    const attackEnd = now + attack
    const decayEnd = attackEnd + decay
    const sustainEnd = decayEnd + sustain
    const fadeEnd = sustainEnd + fade
    const duration = (attack + decay + sustain + fade) * 1000
    this.osc.connect(this.mainGainNode)
    this.mainGainNode.gain.linearRampToValueAtTime(1, attackEnd)
    this.mainGainNode.gain.setTargetAtTime(0.8, attackEnd, 0.2)
    this.mainGainNode.gain.linearRampToValueAtTime(0, fadeEnd)
  }
  connectAudioNodeToTheLastAudioNode(audionode: Analyzer | Filter | AudioNode) {
    this.activeFilters[this.activeFilters.length - 1].connect(audionode)
  }
  findFilterIndexByName(name: filterType) {
    const index = this.activeFilters.findIndex((filter) => filter.type === name)
    return index
  }
  setFilterValueByIndex(index: number, valueType: valueType, value: number) {
    this.activeFilters[index][valueType].setValueAtTime(
      value,
      this.ctx.currentTime
    )
  }
  changeFilterValues(freq: number, q: number) {
    this.filtersFreq = freq
    this.filtersQ = q
  }
  setupFilter(filter: Filter) {
    const now = this.ctx.currentTime
    filter.frequency.setValueAtTime(this.filtersFreq, now)
    filter.Q.setValueAtTime(this.filtersQ, now)
  }
  returnMainGainNode() {
    return this.mainGainNode
  }
  stopSound() {
    this.mainGainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2)
  }
}
