import { Bar, updateCbType } from './drawingClasses/Bar'
import { Analyzer } from 'components/Classes/Analyzer'
import { getVolume } from './drawingUtils'
import { drawingCbType, globalModes } from './types'
import { executeMode } from './drawingUtils/globalMode'

export type drawWithTreeConf = {
  kind: 'drawWithTree'
  branch1: number
  branch2: number
  branch3: number
  branch4: number
  branch5: number
  branch6: number
  rotation: number
  lineWidth: number
  size: number
  shadowColor: string
  smothness: number
}
export type drawWithTreeKeys = keyof drawWithTreeConf

export type drawWithTreeOptionsType = {
  kind: 'drawing'
  type: 'number' | 'color'
  option: drawWithTreeKeys
  multiplier?: number
  min?: number
  max?: number
  step?: number
}

export const drawWithTreeOptions: drawWithTreeOptionsType[] = [
  {
    kind: 'drawing',
    type: 'number',
    option: 'branch1',
    multiplier: 1,
    min: -1000,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'branch2',
    multiplier: 1,
    min: -1000,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'branch3',
    multiplier: 1,
    min: -1000,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'branch4',
    multiplier: 1,
    min: -1000,
    max: 1000,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'branch5',
    multiplier: 1,
    min: -1000,
    max: 1000,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'branch6',
    multiplier: 1,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'rotation',
    multiplier: 0.4,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'lineWidth',
    multiplier: 1,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'size',
    multiplier: 1,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'smothness',
    multiplier: 1,
    min: 0,
    max: 100,
    step: 0.1,
  },
  { kind: 'drawing', type: 'color', option: 'shadowColor' },
]
const barArr = [] as Bar[]
const createBars = (arr: any[], count: number) => {
  for (let i = 0; i < count; i++) {
    arr.push(new Bar(10, 20, 40, 40, '#FF00FF'))
  }
}

createBars(barArr, 256)
function drawTree(
  startX: number,
  startY: number,
  len: number,
  angle: number,
  branchWidth: number,
  ctx: CanvasRenderingContext2D,
  color1: string,
  color2: string,
  conf: drawWithTreeConf,
  bit: number
) {
  ctx.beginPath()
  ctx.save()
  ctx.strokeStyle = color1
  ctx.fillStyle = color2
  ctx.lineWidth = branchWidth
  ctx.translate(startX + Math.sin(bit) - Math.sin(bit), startY)

  ctx.moveTo(0, 0)
  // ctx.lineTo(0, -len);
  if (angle > 0) {
    ctx.bezierCurveTo(
      50 + bit / 2 + conf.branch1,
      -len / 29 + conf.branch2,
      50 + bit + conf.branch3,
      -len / 2 + conf.branch4,
      0 + conf.branch5,
      -len - conf.branch6
    )
    ctx.rotate((angle * Math.PI) / 180 + Math.sin(bit / 100) * 0.05)
  } else {
    ctx.bezierCurveTo(
      50 - conf.branch1,
      -len / 2 - conf.branch2,
      -50 - bit / 2 + bit - conf.branch3,
      -len / 2 - conf.branch4,
      0 - conf.branch5,
      -len - conf.branch6
    )
    ctx.rotate((angle * Math.PI) / 180 - Math.sin(bit / 100) * 0.05)
  }
  ctx.stroke()
  if (len < 10) {
    ctx.arc(0, 0, bit / 50, 0, Math.PI * 2)
    ctx.fill()
    ctx.rect(0, 0, bit / 2, bit / 2)
    ctx.stroke()
    ctx.restore()
    return
  }
  drawTree(
    0,
    -len,
    len * 0.7,
    angle + 10 + bit / conf.rotation,
    branchWidth * 0.7,
    ctx,
    color1,
    color2,
    conf,
    bit
  )
  drawTree(
    0,
    -len,
    len * 0.7,
    angle - 10 - bit / conf.rotation,
    branchWidth * 0.7,
    ctx,
    color1,
    color2,
    conf,
    bit
  )
  ctx.restore()
}

const drawLines = (
  level: number,
  maxLevel: number,
  branches: number,
  angle: number,
  ctx: CanvasRenderingContext2D,
  bit: number,
  canvasWidth: number,
  canvasHeight: number,
  conf: drawWithTreeConf
) => {
  if (level < 10) return

  ctx.strokeStyle = 'fff'
  ctx.lineWidth = level / 10

  ctx.save()
  ctx.beginPath()
  ctx.translate(canvasWidth / 2, canvasHeight / 2)

  ctx.moveTo(0, 0)
  ctx.arc(0 + maxLevel, 0, level, 0, Math.PI * 2)
  ctx.rotate(angle)

  ctx.stroke()
  ctx.restore()
  ctx.save()
  ctx.rotate(Math.PI / 24)
  ctx.save()
  ctx.rotate(Math.PI / 24 - conf.branch1 / 100)
  ctx.scale(0.8, 0.8)
  drawLines(
    level * 0.6,
    maxLevel * 0.7 + 200,
    branches,
    angle * 0.9,
    ctx,
    bit,
    canvasWidth,
    canvasHeight,
    conf
  )
  ctx.restore()
  ctx.save()
  ctx.rotate(-Math.PI / 16 - conf.branch2 / 100)
  drawLines(
    level * 0.6,
    -maxLevel * 0.7 - 100,
    branches,
    -angle * 0.9,
    ctx,
    bit,
    canvasWidth,
    canvasHeight,
    conf
  )
  ctx.restore()
  drawLines(
    level * 0.6,
    maxLevel * 0.7 + 100,
    branches,
    -angle * 0.9,
    ctx,
    bit,
    canvasWidth,
    canvasHeight,
    conf
  )
  ctx.restore()
}

const drawWithTreeCb: drawingCbType = (
  ctx,
  canvasWidth,
  canvasHeight,
  color,
  height,
  x,
  y,
  i,
  time,
  arr,
  config,
  _,
  __,
  canvasRef,
  mode
) => {
  const conf = config as drawWithTreeConf
  const rotCopy = arr[i]
  const volume = getVolume(arr) - 170
  const normalVolume = getVolume(arr)
  const isHighFreq = i > arr.length * 0.5
  const isLowFreq = i < arr.length * 0.5
  const coeff = rotCopy / rotCopy
  const copy2 = rotCopy * (coeff * 0.5)
  const copy3 = rotCopy * (coeff * 0.3) + i + Math.cos(rotCopy) * 150
  const copy4 = rotCopy * (coeff * 0.3) - i - Math.sin(rotCopy) * 150
  const colorCopy = arr[i] * 2
  const time2 = time * 50
  const bit = arr[i] * coeff * 0.9
  if (mode) executeMode(mode, i, bit, normalVolume, time2)
  const randColor1 = `rgba(${Math.random() * 255 + bit / 20},${
    Math.random() * 255 + bit / 40
  },${Math.random() * 255 + bit / 80})`
  const randColor2 = `rgba(${Math.random() * 255 - 20},${
    Math.random() * 255 - 66
  },${Math.random() * 255 - 24})`
  const maxLevel = 100
  const branches = 3
  const sides = Math.floor(Math.random() * 10) + 3
  const spread = Math.random() * 48 + 0.51
  const angle = Math.PI * 2 * spread
  if (canvasRef && canvasRef.current) {
    canvasRef.current.style.filter = `blur(0.5px) drop-shadow(10px 10px 10px ${
      conf.shadowColor || '0xFFFFFF'
    }) saturate(0.95) brightness(0.95)`
  }

  if (bit && !isNaN(bit) && i !== 0 && i % 25 === 0) {
    drawTree(
      canvasWidth / 2,
      canvasHeight - 100,
      100 + conf.size * 2,
      0,
      5 + conf.lineWidth,
      ctx,
      randColor1,
      randColor2,
      conf,
      bit
    )
    // drawLines(200 , maxLevel, branches, angle,ctx,bit,canvasWidth , canvasHeight , conf)
  }
}
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
    height -= height * (smoothness * 0.001)
  } else {
    height -= height * (smoothness * 0.001) * Math.sin(bit) * Math.cos(bit)
  }
}

export const drawWithTree = (
  conf: drawWithTreeConf,
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
    if (i % 3 === 0) {
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
          drawWithTreeCb,
          conf,
          undefined,
          undefined,
          canvasRef,
          mode
        )
    }
  })
}
