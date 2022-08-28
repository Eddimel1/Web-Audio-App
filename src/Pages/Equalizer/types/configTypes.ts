import {
  drawWithSvgOptions,
  drawWithSvgOptionsType,
} from './../drawFunctions/drawWithSvg'
import {
  drawWithCirclesConf,
  drawWithCirclesOptionsType,
} from '../drawFunctions/drawCircles'
import { drawWithSvgConf } from '../drawFunctions/drawWithSvg'
import {
  drawWithTreeConf,
  drawWithTreeOptionsType,
} from '../drawFunctions/drawWithTree'
import {
  drawWithImageConf,
  drawWithImageConfType,
  drawWithImageOptionsType,
} from '../drawFunctions/withDrawImage'

export const arrayOfCompositeOperation = [
  'source-over',
  'lighter',
  'xor',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
]
export const lineCapOptions = ['butt', 'round', 'square']
export const lineJoinOptions = ['round', 'bevel', 'miter']
export type selectOptions =
  | typeof arrayOfCompositeOperation
  | typeof lineCapOptions
  | typeof lineJoinOptions[]
export const globalOptions: globalOptionsType[] = [
  {
    kind: 'global',
    type: 'select',
    option: 'globalCompositeOperation',
    selectOptions: arrayOfCompositeOperation,
  },
  {
    kind: 'global',
    type: 'number',
    option: 'lineWidth',
    multiplier: 1,
    min: 0.1,
    max: 100,
    step: 1,
  },
  {
    kind: 'global',
    type: 'number',
    option: 'globalAlpha',
    multiplier: 0.01,
    min: 0.001,
    max: 1,
    step: 0.01,
  },
  {
    kind: 'global',
    type: 'number',
    option: 'lineDashOffset',
    multiplier: 1,
    min: 0.1,
    max: 100,
    step: 1,
  },

  {
    kind: 'global',
    type: 'number',
    option: 'shadowBlur',
    multiplier: 1,
    min: 0,
    max: 100,
    step: 1,
  },

  {
    kind: 'global',
    type: 'number',
    option: 'shadowOffsetX',
    multiplier: 6,
    min: 0,
    max: 1000,
    step: 10,
  },
  {
    kind: 'global',
    type: 'number',
    option: 'shadowOffsetY',
    multiplier: 6,
    min: 0,
    max: 1000,
    step: 10,
  },

  {
    kind: 'global',
    type: 'select',
    option: 'lineJoin',
    selectOptions: lineJoinOptions,
  },
  {
    kind: 'global',
    type: 'select',
    option: 'lineCap',
    selectOptions: lineCapOptions,
  },
  { kind: 'global', type: 'color', option: 'shadowColor' },
]

export type globalOptionsType = {
  kind: 'global'
  type: 'number' | 'select' | 'color'
  option: globalSettingUnion
  selectOptions?:
    | typeof arrayOfCompositeOperation
    | typeof lineCapOptions
    | typeof lineJoinOptions
  multiplier?: number
  min?: number
  max?: number
  step?: number
}

export type globalCompositeOperation =
  | 'source-over'
  | 'source-in'
  | 'source-out'
  | 'source-atop'
  | 'destination-in'
  | 'destination-out'
  | 'destination-atop'
  | 'lighter'
  | 'copy'
  | 'xor'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity'
export type lineCapType = 'butt' | 'round' | 'square'
export type lineJoinType = 'round' | 'bevel' | 'miter'
export type globalSettingUnion =
  | 'globalAlpha'
  | 'globalCompositeOperation'
  | 'lineCap'
  | 'lineDashOffset'
  | 'lineWidth'
  | 'lineJoin'
  | 'shadowBlur'
  | 'shadowColor'
  | 'shadowOffsetX'
  | 'shadowOffsetY'

export type globalSettings = {
  ['kind']: 'global'
  ['globalAlpha']: number
  ['globalCompositeOperation']: globalCompositeOperation
  ['lineCap']: lineCapType
  ['lineDashOffset']: number
  ['lineWidth']: number
  ['lineJoin']: lineJoinType
  ['shadowBlur']: number
  ['shadowColor']: string
  ['shadowOffsetX']: number
  ['shadowOffsetY']: number
}
export type genericConfigType = Record<
  globalSettingUnion,
  number | string | globalCompositeOperation | lineCapType | lineJoinType
>

export type configType = {
  drawWithImage: drawWithImageConf
  drawWithCircle: drawWithCirclesConf
  drawWithTree: drawWithTreeConf
  drawWithSvg: drawWithSvgConf
}

export type uninonSettingsType =
  | globalSettings
  | drawWithImageConf
  | drawWithCirclesConf
  | drawWithTreeConf
  | drawWithSvgConf
export type pickConfig<T> = T extends drawWithImageConf
  ? drawWithImageConf
  : T extends drawWithCirclesConf
  ? drawWithCirclesConf
  : T extends drawWithTreeConf
  ? drawWithTreeConf
  : never
export type optionsUnion =
  | globalOptionsType[]
  | drawWithCirclesOptionsType[]
  | drawWithImageOptionsType[]
  | drawWithTreeOptionsType[]
  | drawWithSvgOptionsType[]
export type equalizerT =
  | 'drawWithImage'
  | 'drawWithCircles'
  | 'drawWithTree'
  | 'drawWithSvg'
export type globalConfigKeyT =
  | keyof globalSettings
  | keyof drawWithCirclesConf
  | keyof drawWithImageConfType
  | keyof drawWithSvgConf
