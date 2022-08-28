import { filterType } from '../components/Classes/Oscillator'

type inputType = 'default' | 'box' | 'envelope' | 'filter'
type envelopeType = 'attack' | 'decay' | 'sustain' | 'fade'
export interface commonInputType {
  type: inputType
  name: string
  min: string
  max: string
  step: string
  defaultValue: string
}

type filterValueType = {
  min: string
  max: string
  step: string
  defaultValue: string
}
export interface boxInput extends commonInputType {
  boxValues?: string[]
}
export interface envelopeInput extends commonInputType {
  envelopeType?: envelopeType
}

type filtersType = {
  filterType: filterType
  Q: filterValueType
  frequency: filterValueType
}
type optionsArrayType = Array<boxInput & commonInputType & envelopeInput>
export const optionsArray: optionsArrayType = [
  {
    type: 'default',
    name: 'detune',
    min: '-1000',
    max: '1000',
    step: '10',
    defaultValue: '0',
  },
  {
    type: 'box',
    name: 'wave',
    min: '0',
    max: '100',
    step: '1',
    defaultValue: '0',
    boxValues: ['si', 'sq', 'tri', 'saw'],
  },
  {
    type: 'envelope',
    name: 'attack',
    envelopeType: 'attack',
    min: '0',
    max: '2',
    step: '0.01',
    defaultValue: '0',
  },
  {
    type: 'envelope',
    envelopeType: 'decay',
    name: 'decay',
    min: '0',
    max: '2',
    step: '0.01',
    defaultValue: '0',
  },
  {
    type: 'envelope',
    name: 'sustain',
    envelopeType: 'sustain',
    min: '0',
    max: '2',
    step: '0.01',
    defaultValue: '0',
  },
  {
    type: 'envelope',
    envelopeType: 'fade',
    name: 'fade',
    min: '0',
    max: '2',
    step: '0.01',
    defaultValue: '0',
  },
]

export const filterInputArray: filtersType[] = [
  {
    filterType: 'lowpass',
    Q: { min: '0.0001', max: '1000', step: '1', defaultValue: '1' },
    frequency: { min: '10', max: '1000', step: '1', defaultValue: '350' },
  },
  {
    filterType: 'highpass',
    Q: { min: '0.0001', max: '1000', step: '1', defaultValue: '1' },
    frequency: { min: '10', max: '1000', step: '1', defaultValue: '350' },
  },
  {
    filterType: 'bandpass',
    Q: { min: '0.0001', max: '1000', step: '1', defaultValue: '1' },
    frequency: { min: '1 ', max: '1000', step: '1', defaultValue: '350' },
  },
  {
    filterType: 'lowshelf',
    Q: { min: '0.0001', max: '1000', step: '1', defaultValue: '1' },
    frequency: { min: '10', max: '1000', step: '1', defaultValue: '350' },
  },
  {
    filterType: 'highshelf',
    Q: { min: '0.0001', max: '1000', step: '1', defaultValue: '1' },
    frequency: { min: '10', max: '1000', step: '1', defaultValue: '350' },
  },
  {
    filterType: 'peaking',
    Q: { min: '0.0001', max: '1000', step: '1', defaultValue: '1' },
    frequency: { min: '10', max: '1000', step: '1', defaultValue: '350' },
  },
  {
    filterType: 'notch',
    Q: { min: '0.0001', max: '1000', step: '1', defaultValue: '1' },
    frequency: { min: '10', max: '1000', step: '1', defaultValue: '350' },
  },
  {
    filterType: 'allpass',
    Q: { min: '0.0001', max: '1000', step: '1', defaultValue: '1' },
    frequency: { min: '10', max: '1000', step: '1', defaultValue: '350' },
  },
]
