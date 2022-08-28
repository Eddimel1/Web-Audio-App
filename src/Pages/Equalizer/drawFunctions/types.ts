import { uninonSettingsType } from '../types/configTypes'

export type drawingCbType = (
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  color: string,
  height: number,
  x: number,
  y: number,
  i: number,
  time: number,
  arr: Uint8Array,
  conf: uninonSettingsType,
  img?: HTMLImageElement,
  svgRefs?: SVGPathElement[],
  container?:
    | React.RefObject<HTMLDivElement>
    | React.MutableRefObject<HTMLCanvasElement | null>,
  mode?: globalModes
) => void

export type globalModes = 'normal' | 'shaking'
