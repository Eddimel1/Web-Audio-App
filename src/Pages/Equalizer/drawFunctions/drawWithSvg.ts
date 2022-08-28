import { Analyzer } from 'components/Classes/Analyzer'
import { Bar, updateCbType } from './drawingClasses/Bar'
import { getVolume } from './drawingUtils'
import { executeMode } from './drawingUtils/globalMode'
import { drawingCbType, globalModes } from './types'

export type drawWithSvgConf = {
  kind: 'drawWithSvg'
  sensivity: number
  brightness: number
  saturate: number
  rotate: number
  invert: number
  shadow: string
  hueRotate: number
  wings2: number
  wings3: number
  mode: string
  smothness: number
}

export type drawWithSvgOptionsType = {
  kind: 'drawing'
  type: 'number' | 'color' | 'select'
  option: keyof drawWithSvgConf
  selectOptions?: string[] | undefined
  multiplier?: number
  min?: number
  max?: number
  step?: number
}

const modes = ['mode1', 'mode2', 'mode3']
export const drawWithSvgOptions: drawWithSvgOptionsType[] = [
  {
    kind: 'drawing',
    type: 'number',
    option: 'sensivity',
    multiplier: 0.05,
    min: -1000,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'brightness',
    multiplier: 1,
    min: -1000,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'saturate',
    multiplier: 1,
    min: -1000,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'rotate',
    multiplier: 0.1,
    min: -10,
    max: 10,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'invert',
    multiplier: 0.01,
    min: -1000,
    max: 1000,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'hueRotate',
    multiplier: 1,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'wings2',
    multiplier: 1,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    kind: 'drawing',
    type: 'number',
    option: 'wings3',
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
  { kind: 'drawing', type: 'select', option: 'mode', selectOptions: modes },
  { kind: 'drawing', type: 'color', option: 'shadow' },
]
const barArr = [] as Bar[]
const createBars = (arr: any[], count: number) => {
  for (let i = 0; i < count; i++) {
    arr.push(new Bar(10, 20, 40, 40, '#FF00FF'))
  }
}

createBars(barArr, 256)
function drawHeart(
  fromx: number,
  fromy: number,
  lw: number,
  hlen: number,
  color: string,
  ctx: CanvasRenderingContext2D,
  bit: number,
  i: number
) {
  const x = fromx
  const y = fromy
  const width = lw
  const height = hlen
  ctx.save()

  ctx.beginPath()

  var topCurveHeight = height * 0.3 + bit / 100
  ctx.moveTo(x, y + topCurveHeight)
  // top left curve
  ctx.bezierCurveTo(x, y, x - width / 2, y, x - width / 2, y + topCurveHeight)

  // bottom left curve
  ctx.bezierCurveTo(
    x - width / 2,
    y + (height + topCurveHeight) / 2,
    x,
    y + (height + topCurveHeight) / 2,
    x,
    y + height
  )

  // bottom right curve
  ctx.bezierCurveTo(
    x,
    y + (height + topCurveHeight) / 2,
    x + width / 2,
    y + (height + topCurveHeight) / 2,
    x + width / 2,
    y + topCurveHeight
  )

  // top right curve
  ctx.bezierCurveTo(x + width / 2, y, x, y, x, y + topCurveHeight)

  ctx.closePath()
  ctx.fillStyle = `rgb(${bit + Math.random() * 25} ${
    bit + Math.random() * 15
  } ${bit + Math.random() * 10})`
  ctx.strokeStyle = `rgb(${Math.random() * 255 + bit / 20} ${
    Math.random() * 255 + bit / 40
  } 10)`
  ctx.stroke()
  ctx.fill()
  ctx.restore()
}
const drawWings = (
  beginX: number,
  beginY: number,
  angle: number,
  ctx: CanvasRenderingContext2D
) => {
  let region = new Path2D()
  ctx.rotate(angle)
  ctx.lineWidth = 1

  region.moveTo(beginX, beginY + 150)
  region.lineTo(beginX - 200, beginY - 300)

  region.lineTo(beginX - 75, beginY - 100)

  region.lineTo(beginX - 50, beginY - 250)

  region.lineTo(beginX - 25, beginY - 150)

  region.lineTo(beginX, beginY - 350)

  region.lineTo(beginX + 25, beginY - 200)

  region.lineTo(beginX + 75, beginY - 350)

  region.lineTo(beginX + 100, beginY - 150)

  region.lineTo(beginX + 300, beginY - 300)

  region.lineTo(beginX + 300, beginY - 300)
  region.closePath()

  ctx.strokeStyle = '#df4b26'
  ctx.stroke()
  ctx.fillStyle = 'green'
  ctx.fill(region, 'evenodd')
}

const drawWithSvgCb: drawingCbType = (
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
  svgRefs,
  container?:
    | React.RefObject<HTMLDivElement>
    | React.MutableRefObject<HTMLCanvasElement | null>,
  mode?: globalModes
) => {
  const conf = config as drawWithSvgConf
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
  const bit = arr[i] * coeff * 0.9
  const sensitiveBit = bit * conf.sensivity
  const time = time1 * 50
  const heartOffSetForFullScreen =
    document.fullscreenElement?.nodeName === 'DIV' ? +20 : 0
  const cont = container as React.RefObject<HTMLDivElement>
  const bit1 = arr[i] * 0.5
  if (mode) executeMode(mode, i, bit1, normalVolume, time)
  if (cont && cont.current && i % 2 === 0) {
    const var1 = 20
    cont.current.style.filter = `blur(0.5px) brightness(${
      conf.brightness / 100
    }) saturate(${conf.saturate}) hue-rotate(${
      conf.hueRotate * 50
    }deg) invert(${conf.invert}) drop-shadow(${var1}px ${var1}px ${var1}px ${
      conf.shadow || '0xFFFFFF'
    })`
    cont.current.style.transform = `translateX(${
      (Math.cos(time / 100) * sensitiveBit) / 25
    }px) translateY(${(Math.sin(time / 100) * sensitiveBit) / 25}px)`
  }

  if (bit && !isNaN(bit) && conf.mode === 'mode1')
    drawHeart(
      canvasWidth / 2 + 50,
      canvasHeight / 2 - 110 + heartOffSetForFullScreen,
      80,
      80,
      'red',
      ctx,
      bit,
      i
    )

  ctx.save()

  ctx.translate(
    canvasWidth / 2 + 155,
    canvasHeight / 2 - 100 + heartOffSetForFullScreen
  )
  ctx.rotate(-Math.PI / 8)
  // if(i > 10){
  //     if(i % 2 ===0 ) ctx.rotate(-bit/1200)
  //     else{
  //         ctx.rotate(bit/1200)
  //     }
  // }

  if (conf.mode === 'mode2') {
    ctx.rotate(
      i * 0.01 + conf.rotate + 0.2 + Math.cos(time / 800) * 10 + bit / 35
    )
  } else if (conf.mode === 'mode1') {
    ctx.rotate(i * 0.01 + conf.rotate)
  }
  ctx.beginPath()
  ctx.strokeStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${
    Math.random() * 255
  },1)`

  ctx.moveTo(i + 400, i + Math.sin(time / 200) * bit)
  ctx.translate(Math.cos(sensitiveBit) * 5, Math.sin(sensitiveBit) * 5)
  if (i % 3 === 0) {
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(
      20,
      100 + conf.wings2 * 10 + Math.sin(bit / 20) * 200,
      50 + bit,
      50 + bit,
      200 + bit,
      400 + bit + conf.wings3
    )
  }
  if (i % 2 !== 0) {
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(
      20,
      100 + Math.sin(bit / 10) * 100,
      20 + bit,
      20 + bit,
      100 + bit,
      300 + bit
    )
  }
  if (bit > 140) {
    ctx.fillStyle = 'black'
  }
  if (bit > 170) {
    ctx.fillStyle = 'yellow'
  }
  if (bit > 200) {
    ctx.fillStyle = 'blue'
  }
  if (bit > 50) {
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(
      20,
      200 + Math.sin(bit / 20) * 300,
      50 + bit,
      100 + bit,
      300 + bit,
      400 + bit
    )
  }

  ctx.fill()
  ctx.stroke()
  ctx.restore()
  ctx.save()

  ctx.translate(
    canvasWidth / 2 - 13,
    canvasHeight / 2 - 120 + heartOffSetForFullScreen
  )
  ctx.rotate(-Math.PI / 8)

  if (conf.mode === 'mode2') {
    ctx.rotate(
      i * 0.01 - conf.rotate + 1 + Math.cos(time / 800) * 10 + bit / 35
    )
  } else if (conf.mode === 'mode1') {
    ctx.rotate(i * 0.01 - conf.rotate + 0.9)
  }
  ctx.beginPath()
  ctx.strokeStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${
    Math.random() * 255
  },1)`

  ctx.moveTo(i - 800, i - Math.sin(time / 200) * bit + conf.wings3)
  ctx.translate(Math.cos(sensitiveBit) * 5, Math.sin(sensitiveBit) * 5)
  if (i % 3 === 0) {
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(
      20,
      100 + conf.wings2 * 10 + Math.sin(bit / 20) * 200,
      50 + bit,
      70 + bit,
      200 + bit,
      400 + bit + conf.wings3
    )
  }
  if (i % 2 !== 0) {
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(
      20,
      100 + Math.sin(bit / 10) * 100,
      20 + bit,
      20 + bit,
      100 + bit,
      300 + bit
    )
  }
  if (bit > 140) {
    ctx.fillStyle = 'black'
  }
  if (bit > 170) {
    ctx.fillStyle = 'violet'
  }
  if (bit > 200) {
    ctx.fillStyle = 'blue'
  }
  if (bit > 50) {
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(
      20,
      200 + Math.sin(bit / 20) * 300,
      50 + bit,
      100 + bit,
      300 + bit,
      400 + bit
    )
  }

  ctx.fill()
  ctx.stroke()
  ctx.restore()
  if (svgRefs && svgRefs[0])
    svgRefs[0].style.transform = `translate(${canvasWidth / 2 - 300}px,${
      canvasHeight / 2 - 330
    }px)`

  for (let i = 0; i < 6; i++) {
    if (svgRefs && svgRefs[i] && bit) {
      svgRefs[i].style.transformOrigin = 'center'
      svgRefs[0].style.left = (canvasWidth / 300).toString()

      const random = Math.random() * 200 + 10
      const random1 = Math.random() * 50
      const random2 = Math.random() * 20
      // svgRefs[i].style.strokeDasharray = '5000'
      // svgRefs[i].style.strokeDashoffset = '0'
      if (i === 0) {
        // refs[0].style.transform = `translateX(${random}px)`
        // refs[0].style.transform = `translateY(${random}px)`
        // refs[0].style.transform = `rotate(${random1}deg)`
        if (time % 20000 === 0) {
          svgRefs[0].style.transform = `skew(${bit / 20}deg)`
        }
        if (i % 25 === 0) {
          svgRefs[0].style.transform = `rotate(${volume / 50}deg)`
        }
        if (i % 200 === 0) {
          svgRefs[0].style.transform = `scale(${volume / 50})`
        }

        svgRefs[0].style.transform = `rotate(${
          Math.sin(((time / 400) * bit) / 100) * 0.05
        }deg)`
      }
      if (i !== 0) {
        svgRefs[i].style.stroke = `rgba(${random1},${Math.random() * bit},${
          Math.random() * bit
        },${Math.random() * bit})`
        svgRefs[i].style.fill = `rgba(${random1},${bit},${random - 20},${
          coeff * 10
        })`
      }
    }
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

export const drawWithSvg = (
  conf: drawWithSvgConf,
  analyzer: Analyzer,
  ctx: CanvasRenderingContext2D,
  barWidth: number,
  dataArray: Uint8Array,
  canvas: HTMLCanvasElement,
  x: number,
  time: number,
  svgRefs: SVGPathElement[],
  container: React.RefObject<HTMLDivElement>,
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
      bar.draw(
        ctx,
        canvas.width,
        canvas.height,
        i,
        time,
        dataArray,
        drawWithSvgCb,
        conf,
        undefined,
        svgRefs,
        container,
        mode
      )
    }
  })
}
