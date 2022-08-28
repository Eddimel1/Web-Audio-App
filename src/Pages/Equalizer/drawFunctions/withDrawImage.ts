import { Analyzer } from 'components/Classes/Analyzer'
import { Bar, updateCbType } from './drawingClasses/Bar'
import { getVolume, normalize } from './drawingUtils'
import { executeMode } from './drawingUtils/globalMode'
import { drawingCbType, globalModes } from './types'

const skull = new Image()
skull.src = 'skull.png'

export type drawWithImageConf = {
  kind: 'drawWithImage'
  quietness: number
  hueRotate: number
  brightness: number
  shadowColor: string
  saturate: number
  dropShadow: number
  sepiaFilter: number
  blur: number
  invertFilter: number
  mode: string
  smoothness: number
}

export type drawWithImageConfKeys = keyof drawWithImageConf
type UValues = drawWithImageConf[keyof drawWithImageConf]
export type drawWithImageConfType = Record<drawWithImageConfKeys, UValues>
export type drawWithImageOptionsType = {
  kind: 'drawWithImage'
  type: 'number' | 'color' | 'select'
  option: drawWithImageConfKeys
  selectOptions?: string[] | undefined
  multiplier?: number
  min?: number
  max?: number
  step?: number
}

const modes = ['mode1', 'mode2', 'mode3']
export const drawWithImageOptions: drawWithImageOptionsType[] = [
  {
    kind: 'drawWithImage',
    type: 'number',
    option: 'quietness',
    multiplier: 1,
    min: 0.001,
    max: 100,
    step: 0.01,
  },
  {
    kind: 'drawWithImage',
    type: 'number',
    option: 'hueRotate',
    multiplier: 4,
    min: 0.001,
    max: 100,
    step: 0.01,
  },
  {
    kind: 'drawWithImage',
    type: 'number',
    option: 'dropShadow',
    multiplier: 1,
    min: 0.001,
    max: 100,
    step: 0.01,
  },
  {
    kind: 'drawWithImage',
    type: 'number',
    option: 'sepiaFilter',
    multiplier: 0.05,
    min: 0.001,
    max: 100,
    step: 0.01,
  },
  {
    kind: 'drawWithImage',
    type: 'number',
    option: 'brightness',
    multiplier: 0.1,
    min: 0.001,
    max: 1,
    step: 0.01,
  },
  {
    kind: 'drawWithImage',
    type: 'number',
    option: 'saturate',
    multiplier: 0.2,
    min: 0.001,
    max: 100,
    step: 0.01,
  },
  {
    kind: 'drawWithImage',
    type: 'number',
    option: 'blur',
    multiplier: 0.5,
    min: 0.01,
    max: 100,
    step: 0.01,
  },
  {
    kind: 'drawWithImage',
    type: 'number',
    option: 'invertFilter',
    multiplier: 0.01,
    min: 0.001,
    max: 1,
    step: 0.001,
  },
  {
    kind: 'drawWithImage',
    type: 'number',
    option: 'smoothness',
    multiplier: 1,
    min: 0.001,
    max: 10,
    step: 0.01,
  },
  {
    kind: 'drawWithImage',
    type: 'select',
    option: 'mode',
    selectOptions: modes,
  },
  { kind: 'drawWithImage', type: 'color', option: 'shadowColor' },
]

const barArr = [] as Bar[]
const createBars = (arr: any[], count: number) => {
  for (let i = 0; i < count; i++) {
    arr.push(new Bar(10, 20, 40, 40, '#FF00FF'))
  }
}

createBars(barArr, 256)

const drawWithImageCb: drawingCbType = (
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
  img,
  _,
  canvasRef,
  mode
) => {
  const conf = config as drawWithImageConf
  const isHighFreq = i > arr.length * 0.5
  const isLowFreq = i < arr.length * 0.5
  const time = time1 * 15
  const time2 = time1 * 5

  const time360 = time % 360 === 0 ? 0 : time
  const volume = getVolume(arr)
  const imgX = -200
  const imgY = -300
  const linesStartingPointX = 8
  const linesStartingPointY = -260
  const lineLength = 400
  const lineLength2 = 100
  const linesXoffSet = 0
  const linesYoffSet = 20
  const volume1 = normalize(getVolume(arr), 1, 0.11)
  let aspectRatioDivider = 4

  const bit = arr[i] / conf.quietness
  const bit1 = arr[i] * ((arr[i] / arr[i]) * 0.5)
  const bitCopy = arr[i]
  if (mode) executeMode(mode, i, bit1, volume1, time)
  ctx.save()

  //  if(mode) executeMode(mode,i,bit1,Math.random()*volume1*10,time)

  ctx.strokeStyle = `rgba(${(Math.random() * 255) / bit},${
    (Math.random() * 255) / bit / 40
  },${(Math.random() * 255) / bit / 100},${bit / 20})`
  ctx.fillStyle = `rgba(${(Math.random() * 255) / bit},${
    (Math.random() * 255) / bit / 40
  },${(Math.random() * 255) / bit / 100},${bit / 20})`

  if (i % 10 === 0) {
    if (canvasRef && canvasRef.current) {
      const var1 = conf.dropShadow
      canvasRef.current.style.filter = `invert(${conf.invertFilter}) blur(${
        conf.blur
      }px) sepia(${conf.sepiaFilter}) hue-rotate(${
        conf.hueRotate
      }deg) saturate(${conf.saturate}) brightness(${
        conf.brightness
      }) drop-shadow(${var1}px ${var1}px ${var1}px ${
        conf.shadowColor || '0xFFFFFF'
      })`
    }

    if (conf.mode === 'mode2') {
      ctx.globalAlpha = Math.sin(bit)
      if (i % 25 === 0) {
        ctx.globalCompositeOperation = 'hard-light'
      }
      if (i % 50 === 0) {
        ctx.globalCompositeOperation = 'xor'
      }

      if (i % 75 === 0) {
        ctx.globalCompositeOperation = 'saturation'
      }
      if (i % 100 === 0) {
        ctx.globalCompositeOperation = 'difference'
      }
    }
    const iCopy = i % 2 === 0 ? i : -i
    const y = conf.hueRotate + iCopy
    const linesXoffSet = 155
    ctx.save()
    ctx.fillStyle = '0xFFFF00'
    ctx.translate(
      canvasWidth / 2 + Math.cos(bit) * 10,
      canvasHeight / 2 + Math.sin(bit) * 10
    )

    ctx.globalAlpha = Math.sin(bit)
    for (let i = 0; i < 10; i++) {
      let lineYoffSet = 40

      if (i % 2 === 0) {
        ctx.beginPath()
        ctx.moveTo(linesStartingPointX, linesStartingPointY)
        ctx.lineTo(lineLength, -200 - linesYoffSet * i - bit / 20)
        ctx.moveTo(lineLength, -200 - linesYoffSet * i - bit / 20)
        ctx.lineTo(lineLength + lineLength2, -200 - linesYoffSet * i - bit / 20)
        ctx.arc(
          lineLength + lineLength2,
          -200 - linesYoffSet * i - bit / 20,
          bitCopy / 10,
          0,
          Math.PI * 2
        )
        ctx.moveTo(lineLength, -200 - linesYoffSet * i - bit / 20)
        ctx.lineTo(lineLength, -200 - linesYoffSet * i - bit / 20 + lineYoffSet)
        ctx.stroke()
      }
      ctx.beginPath()
      ctx.moveTo(linesStartingPointX, linesStartingPointY)
      ctx.lineTo(lineLength, -200 + linesYoffSet * i + bit / 20)
      ctx.moveTo(lineLength, -200 + linesYoffSet * i + bit / 20)
      ctx.lineTo(lineLength + lineLength2, -200 + linesYoffSet * i + bit / 20)
      ctx.arc(
        lineLength + lineLength2,
        -200 + linesYoffSet * i + bit / 20,
        bitCopy / 10,
        0,
        Math.PI * 2
      )
      ctx.moveTo(lineLength, -200 + linesYoffSet * i + bit / 20)
      ctx.lineTo(
        lineLength,
        -200 + linesYoffSet * i + bit / 20 + lineYoffSet + 30
      )
      ctx.stroke()
    }
    for (let i = 0; i < 10; i++) {
      let lineYoffSet = 40
      if (i % 2 === 0) {
        ctx.beginPath()
        ctx.moveTo(linesStartingPointX, linesStartingPointY)
        ctx.lineTo(-lineLength, -200 - linesYoffSet * i - bit / 20)
        ctx.moveTo(-lineLength, -200 - linesYoffSet * i - bit / 20)
        ctx.lineTo(
          -lineLength - lineLength2,
          -200 - linesYoffSet * i - bit / 20
        )
        ctx.arc(
          -lineLength - lineLength2,
          -200 - linesYoffSet * i - bit / 20,
          bitCopy / 10,
          0,
          Math.PI * 2
        )
        ctx.moveTo(-lineLength, -200 - linesYoffSet * i - bit / 20)
        ctx.lineTo(
          -lineLength,
          -200 - linesYoffSet * i - bit / 20 + lineYoffSet
        )
        ctx.stroke()
      }
      ctx.beginPath()
      ctx.moveTo(linesStartingPointX, linesStartingPointY)
      ctx.lineTo(-lineLength, -200 + linesYoffSet * i + bit / 20)
      ctx.moveTo(-lineLength, -200 + linesYoffSet * i + bit / 20)
      ctx.lineTo(-lineLength - lineLength2, -200 + linesYoffSet * i + bit / 20)
      ctx.arc(
        -lineLength - lineLength2,
        -200 + linesYoffSet * i + bit / 20,
        bitCopy / 10,
        0,
        Math.PI * 2
      )
      ctx.moveTo(-lineLength, -200 + linesYoffSet * i + bit / 20)
      ctx.lineTo(
        -lineLength,
        -200 + linesYoffSet * i + bit / 20 + lineYoffSet + 30
      )
      ctx.stroke()
    }
    ctx.restore()
    ctx.save()

    ctx.translate(
      canvasWidth / 2 + Math.cos(bit) * 10,
      canvasHeight / 2 + Math.sin(bit) * 10
    )

    if (conf.mode === 'mode2') {
      ctx.globalAlpha = Math.sin(bit)
      if (i % 25 === 0) {
        ctx.globalCompositeOperation = 'hard-light'
      }
      if (i % 50 === 0) {
        ctx.globalCompositeOperation = 'xor'
      }

      if (i % 75 === 0) {
        ctx.globalCompositeOperation = 'saturation'
      }
      if (i % 100 === 0) {
        ctx.globalCompositeOperation = 'difference'
      }
      if (i % 125 === 0) {
        ctx.globalCompositeOperation = 'hard-light'
      }
    }
    if (conf.mode === 'mode3') {
      ctx.globalAlpha = Math.sin(bit)
      if (bit > 100) {
        ctx.globalCompositeOperation = 'lighten'
        ctx.globalCompositeOperation = 'color-burn'
      }
    }

    if (img) {
      if (i > 8 && conf.mode === 'mode2') {
        if (i % 2 === 0) {
          ctx.drawImage(
            img,
            0 - 250 + Math.sin(time / 200) + Math.cos(bit),
            0 - 400 - i + (i + bit),
            img.naturalWidth / aspectRatioDivider,
            img.naturalHeight / aspectRatioDivider
          )
        }

        //    else if(i % 3 === 0) {
        //     ctx.drawImage(img,0-250+Math.sin(time/100) + Math.cos(bit) ,0-400-i+Math.sin(bit)*100,img.naturalWidth/aspectRatioDivider,img.naturalHeight/aspectRatioDivider)
        //    }
        else {
          ctx.drawImage(
            img,
            0 - 250 + Math.sin(time / 300) + Math.cos(bit),
            0 - 400 - i + bit,
            img.naturalWidth / aspectRatioDivider,
            img.naturalHeight / aspectRatioDivider
          )
        }
      } else if (i > 8 && conf.mode === 'mode3' && bit > 0) {
        if (i % 2 === 0) {
          ctx.drawImage(
            img,
            0 - 250 + Math.cos(bit + time / 400) * 40,
            0 - 400 + Math.sin(bit + time / 400) * 40,
            img.naturalWidth / aspectRatioDivider,
            img.naturalHeight / aspectRatioDivider
          )
        }

        if (i % 4 === 0) {
          ctx.drawImage(
            img,
            0 - 250 - Math.cos(bit + time / 400) * 42,
            0 - 400 - Math.sin(bit + time / 400) * 42,
            img.naturalWidth / aspectRatioDivider,
            img.naturalHeight / aspectRatioDivider
          )
        }
        ctx.drawImage(
          img,
          0 - 250 - Math.cos(time / 500) * 43,
          0 - 400 - Math.sin(time / 500) * 43,
          img.naturalWidth / aspectRatioDivider,
          img.naturalHeight / aspectRatioDivider
        )
      } else if (i > 8 && conf.mode === 'mode1') {
        if (i % 2 === 0) {
          ctx.drawImage(
            img,
            0 - 250 + Math.sin(time / 400) + Math.cos(bit / 40),
            0 - 400 + Math.abs(Math.sin((bit / 30) * i) * 300),
            img.naturalWidth / aspectRatioDivider,
            img.naturalHeight / aspectRatioDivider
          )
        }

        if (i % 3 === 0) {
          ctx.drawImage(
            img,
            0 - 250 + Math.sin(time / 400) - Math.cos(bit / 20),
            0 - 400 + Math.abs(Math.sin((bit / 400) * i) * 300),
            img.naturalWidth / aspectRatioDivider,
            img.naturalHeight / aspectRatioDivider
          )
        } else {
          ctx.drawImage(
            img,
            0 - 250 + Math.sin(time / 400) + Math.cos(bit / 30),
            0 - 400 + Math.abs(Math.sin((bit / 500) * i) * 300),
            img.naturalWidth / aspectRatioDivider,
            img.naturalHeight / aspectRatioDivider
          )
        }
      }
    }
    ctx.restore()

    if (bit > 0) {
      ctx.save()
      if (bit > 150) {
        ctx.translate(
          canvasWidth / 2 + Math.cos(bit) * 15,
          canvasHeight / 2 + Math.sin(bit) * 15
        )
      } else {
        ctx.translate(
          canvasWidth / 2 + Math.cos(bit) * 10,
          canvasHeight / 2 + Math.sin(bit) * 10
        )
      }
      ctx.beginPath()

      ctx.arc(0 - 400, 200, 150, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()

      ctx.ellipse(
        0 - 400 + Math.cos(i) * 50,
        0 + 200 + Math.sin(i) * 50,
        50,
        50,
        0,
        0,
        Math.PI * 2
      )
      ctx.stroke()
      ctx.beginPath()

      ctx.arc(0 + 400, 200, 150, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()

      ctx.ellipse(
        0 + 400 + Math.cos(i) * 50,
        200 + Math.sin(i) * 50,
        50,
        50,
        0,
        0,
        Math.PI * 2
      )
      ctx.stroke()
      ctx.restore()
    }
  }
  ctx.restore()
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
    height -= height * 0.01
  } else {
    height -= height * 0.001 * Math.sin(bit) * Math.cos(bit)
  }
}

export const drawWithImage = (
  conf: drawWithImageConf,
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

    bar.update(
      dataArray[i],
      isHighFreq,
      isLowFreq,
      i,
      time,
      dataArray,
      conf.smoothness,
      update1
    )
    if (canvasRef.current && i % 2 === 0) {
      bar.draw(
        ctx,
        canvasRef.current.width,
        canvasRef.current!.height,
        i,
        time,
        dataArray,
        drawWithImageCb,
        conf,
        skull,
        undefined,
        canvasRef,
        mode
      )
    }
  })
}
