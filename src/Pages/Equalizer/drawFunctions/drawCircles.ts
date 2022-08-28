import { Analyzer } from 'components/Classes/Analyzer'
import { Bar, updateCbType } from './drawingClasses/Bar'
import { getVolume, normalize } from './drawingUtils'
import { executeMode } from './drawingUtils/globalMode'
import { drawingCbType, globalModes } from './types'

export type drawWithCirclesConf = {
  kind: 'drawWithCircles'
  rotOffSet: number
  rotSpeed: number
  sensitivity: number
  width: number
  height: number
  point1: number
  point2: number
  point3: number
  point4: number
  point5: number
  point6: number
  color: string
  speed: number
  smothness: number
}

type UValues = drawWithCirclesConf[keyof drawWithCirclesConf]
export type drawConfKeys = keyof drawWithCirclesConf
export type drawWithCirclesConfig = Record<drawConfKeys, UValues>

export type drawWithCirclesOptionsType = {
  kind: 'drawing'
  type: 'number' | 'color'
  option: drawConfKeys
  multiplier?: number
  min?: number
  max?: number
  step?: number
}

export const drawWithCirclesOptions: drawWithCirclesOptionsType[] = [
  {
    kind: 'drawing',
    type: 'number',
    option: 'sensitivity',
    multiplier: 1,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'rotOffSet',
    multiplier: 1,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'rotSpeed',
    multiplier: 1,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'point1',
    multiplier: 2,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'point2',
    multiplier: 2,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'point3',
    multiplier: 2,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'point4',
    multiplier: 2,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'point5',
    multiplier: 2,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'point6',
    multiplier: 2,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'speed',
    multiplier: 1,
    min: 0,
    max: 100,
    step: 0.01,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'smothness',
    multiplier: 1,
    min: 0,
    max: 100,
    step: 0.01,
  },
  { kind: 'drawing', type: 'color', option: 'color' },
]

const update1: updateCbType = (
  bit,
  height,
  isHigh,
  isLow,
  i,
  time,
  arr,
  smoothness
) => {
  const sound = bit
  if (sound > height) {
    height = sound
  } else if (bit === 0) {
    height -= height * 0.001
  } else {
    height -= height * 0.0001 * Math.sin(bit) * Math.cos(bit)
  }
}

const drawWithCirclesCb: drawingCbType = (
  ctx,
  canvasWidth,
  canvasHeight,
  color,
  height,
  x,
  y,
  i,
  time1,
  arr,
  config,
  _,
  __,
  canvasRef,
  mode
) => {
  const isHighFreq = i > arr.length * 0.5
  const isLowFreq = i < arr.length * 0.5
  const conf = config as drawWithCirclesConf

  const rotCopy = arr[i]
  const nRotCopy = rotCopy / rotCopy
  const colorCopy = arr[i] * 2
  const bit = arr[i] * nRotCopy * 0.5 * conf.sensitivity
  const shakiness = (arr[i] * 0.9) / conf.sensitivity
  const volume = normalize(getVolume(arr), 1, 0.11)

  const shaking = isLowFreq ? 5 : 10
  let time = time1 * conf.speed
  let time2 = bit < 150 ? time1 * conf.speed : time1 * conf.speed * 50

  if (canvasRef && canvasRef.current && i > 20 && i % 2 === 0) {
    canvasRef.current.style.filter = `blur(${
      isLowFreq ? volume * 50 : 0
    }px) drop-shadow(5px 5px 5px black) invert(${Math.sin(time / 1000)})
            saturate(${isHighFreq ? volume / 120 : 10}) brightness(${
      isHighFreq ? volume / 120 : 5
    })
            `
  }

  if (mode) executeMode(mode, i, bit, volume, time)

  if (arr[i] < 10) return
  if (arr[i] > 255 && arr[i] < 210) return
  if (i < arr.length * 0.01) return
  //    ctx.strokeStyle = `rgba(${bit + i},${Math.cos(bit)},${bit+40},1)`
  ctx.strokeStyle = `hsl(${colorCopy} 100% 50%)`
  ctx.save()
  if (i % 255 === 0) ctx.fillStyle = `hsl(${colorCopy} 100% 50%)`
  else {
    ctx.fillStyle = conf.color
  }
  ctx.translate(
    canvasWidth / 2 + Math.cos(bit / shaking) * 10,
    canvasHeight / 2 + Math.sin(bit / shaking) * 10
  )

  if (i % 2 === 0) {
    ctx.scale(0.7 + volume / 700, 0.7 + volume / 700)
  } else if (i % 2 !== 0) {
    ctx.scale(
      0.36 + (volume * volume) / 44000,
      0.36 + (volume * volume) / 44000
    )
  }

  if (isHighFreq) {
    ctx.rotate(
      Math.sin(i + nRotCopy * conf.rotSpeed + nRotCopy * 0.9 * 10) -
        Math.cos(i * nRotCopy * conf.rotSpeed + nRotCopy * 0.9) * conf.rotOffSet
    )
  } else {
    ctx.rotate(
      Math.sin(i + nRotCopy * conf.rotSpeed + nRotCopy * 0.45 * 10) -
        Math.cos(i * nRotCopy * conf.rotSpeed + nRotCopy * 0.5) * conf.rotOffSet
    )
  }

  ctx.beginPath()
  ctx.moveTo(i, i)
  ctx.lineTo(
    bit / 40 + i - Math.random() * 10,
    bit / 40 + i - Math.random() * 10
  )
  ctx.bezierCurveTo(
    10 +
      Math.cos(time2 / Math.max(190, bit)) -
      Math.sin(time2 / Math.max(200, bit)) * (((300 * bit) / bit) * 0.9) +
      conf.point1,
    Math.cos(time2 / 230) * (((300 * bit) / bit) * 0.94) + conf.point2,
    0 + Math.cos(time2 / 240) * (((300 * bit) / bit) * 0.91) + conf.point3,
    Math.cos(time2 / 200) * (((300 * bit) / bit) * 0.89) + conf.point4,
    0 + Math.cos(time2 / 200) * (((300 * bit) / bit) * 0.86) + conf.point5,
    0 + Math.cos(time2 / 200) * (((300 * bit) / bit) * 0.9) + conf.point6
  )

  ctx.stroke()
  ctx.fill()
  ctx.beginPath()
  if (i < arr.length * 0.5) {
    ctx.arc(0, 0, bit / 8 + i, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.restore()
}
const barArr = [] as Bar[]
const createBars = (arr: any[], count: number) => {
  for (let i = 0; i < count; i++) {
    arr.push(new Bar(10, 20, 40, 40, '#FF00FF'))
  }
}

createBars(barArr, 256)
export type drawWithCircleOptions = 'sensitivity' | 'rotOffSet'
export const drawWithCircles = (
  conf: drawWithCirclesConf,
  analyzer: Analyzer,
  ctx: CanvasRenderingContext2D,
  barWidth: number,
  dataArray: Uint8Array,
  x: number,
  time: number,
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  mode: globalModes
) => {
  barArr.forEach((bar, i, arr) => {
    const isHighFreq = i > dataArray.length * 0.5
    const isLowFreq = i < dataArray.length * 0.5
    if (i > 10) {
      bar.update(
        dataArray[i],
        isHighFreq,
        isLowFreq,
        i,
        time,
        dataArray,
        conf.smothness,
        update1
      )
      canvasRef.current &&
        bar.draw(
          ctx,
          canvasRef.current.width,
          canvasRef.current.height,
          i,
          time,
          dataArray,
          drawWithCirclesCb,
          conf,
          undefined,
          undefined,
          canvasRef,
          mode
        )
    }
  })
}
