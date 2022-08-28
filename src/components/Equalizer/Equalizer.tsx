import React, { FC, useEffect, useRef, useState } from 'react'
import { Analyzer } from '../Classes/Analyzer'
import { Oscillator } from '../Classes/Oscillator'
import classes from './Equalizer.module.css'
interface propType extends React.HTMLAttributes<HTMLCanvasElement> {
  osc: React.MutableRefObject<Oscillator | undefined>
  audioCtx: React.MutableRefObject<AudioContext | undefined>
}
export const Equalizer: FC<propType> = ({
  osc,
  audioCtx,
  ...canvasAttributes
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const analyzerRef = useRef<Analyzer | undefined>(undefined)
  const dataArray = useRef<Uint8Array>()
  const timerId = useRef<number | undefined>(undefined)
  const canvasConfig = useRef<drawingConfig>({
    fillStyle: 'red',
    lineWidth: 6,
    strokeStyle: 'rgb(19, 75, 32)',
  })
  const context = useRef<CanvasRenderingContext2D | null>(null)
  type drawingConfig = {
    fillStyle: string
    lineWidth: number
    strokeStyle: string
  }

  const setCanvasDrawingConfig = (config: drawingConfig) => {
    const ctx = context.current
    if (ctx) {
      ctx.fillStyle = config.fillStyle
      ctx.lineWidth = config.lineWidth
      ctx.strokeStyle = config.strokeStyle
    }
  }
  const animate = (time: number) => {
    const ctx = context.current
    if (time % 100) {
      if (
        ctx &&
        canvasRef.current &&
        analyzerRef.current &&
        dataArray.current
      ) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        const widthSegment =
          ctx!.canvas.width / analyzerRef.current.frequencyBinCount

        for (let i = 0; i < dataArray.current.length; i++) {
          let widthSegmentCounter = 0
          analyzerRef.current?.getByteTimeDomainData(dataArray.current)
          const bit = dataArray.current[i]

          const height = canvasRef.current.clientHeight / 12 + bit / 2
          if (i === 0) {
            ctx!.beginPath()
          }

          if (i > 1) {
            ctx.lineTo(widthSegment * i, height)
          }
        }

        ctx.stroke()
      }

      requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      const canvasCtx = canvasRef.current.getContext('2d')
      context.current = canvasCtx
      const co = canvasConfig.current
      const ctx = context.current
      if (canvasCtx && audioCtx.current) {
        if (co && ctx) {
          ctx.fillStyle = co.fillStyle
          ctx.lineWidth = co.lineWidth
          ctx.strokeStyle = co.strokeStyle
          ctx.imageSmoothingEnabled = true
        }

        if (osc.current) {
          const analyzer = new Analyzer(audioCtx.current, 2048)
          dataArray.current = analyzer.createBuffer()
          analyzerRef.current = analyzer
          osc.current.activeFilters.length != 0 &&
            osc.current.connectAudioNodeToTheLastAudioNode(analyzer)
        }
      }
    }

    return () => {
      if (timerId.current) window.cancelAnimationFrame(timerId.current)
    }
  }, [osc.current])

  useEffect(() => {
    timerId.current = requestAnimationFrame(animate)
  }, [])
  return (
    <canvas
      className={classes.canvasElem}
      {...canvasAttributes}
      ref={canvasRef}
    ></canvas>
  )
}
