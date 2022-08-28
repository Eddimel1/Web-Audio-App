import {
  globalSettings,
  uninonSettingsType,
} from 'Pages/Equalizer/types/configTypes'
import { drawingCbType, globalModes } from '../types'

export type configForDrawing = Exclude<uninonSettingsType, globalSettings>
export type updateCbType = (
  bit: number,
  height: number,
  isHigh: boolean,
  isLow: boolean,
  i: number,
  time: number,
  arr: Uint8Array,
  smoothness: number
) => void

export class Bar {
  x: number
  y: number
  width: number
  height: number
  color: string
  isHighFreq: boolean = false
  isLowFreq: boolean = false
  arr: Uint8Array = [] as unknown as Uint8Array
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
  }

  update(
    bit: number,
    isHigh: boolean,
    isLow: boolean,
    i: number,
    time: number,
    arr: Uint8Array,
    smoothness: number,
    cb: updateCbType
  ) {
    this.arr = arr
    this.isHighFreq = isHigh
    this.isLowFreq = isLow
    cb(bit, this.height, isHigh, isLow, i, time, arr, smoothness)
  }

  draw(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    i: number,
    time: number,
    arr: Uint8Array,
    fc: drawingCbType,
    conf: configForDrawing,
    img?: HTMLImageElement,
    svgRefs?: SVGPathElement[],
    container?:
      | React.RefObject<HTMLDivElement>
      | React.MutableRefObject<HTMLCanvasElement | null>,
    mode?: globalModes
  ) {
    if (fc) {
      fc(
        ctx,
        canvasWidth,
        canvasHeight,
        this.color,
        this.height,
        this.x,
        this.y,
        i,
        time,
        this.arr,
        conf,
        img ?? undefined,
        svgRefs ?? undefined,
        container,
        mode
      )
    }
  }
}
