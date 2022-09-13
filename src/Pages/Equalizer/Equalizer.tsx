import React, { useEffect, useRef, useState } from 'react'
import classes from './Equalizer.module.css'
import { Analyzer } from '../../components/Classes/Analyzer'
import { configType, equalizerT, globalSettings } from './types/configTypes'
import {
  drawWithImage,
  drawWithImageOptions,
} from './drawFunctions/withDrawImage'
import {
  drawWithCircles,
  drawWithCirclesOptions,
} from './drawFunctions/drawCircles'
import { globalOptions } from './types/configTypes'
import { GlobalOptions } from './Options/globalOptions'
import { OptionsBarContainer } from './UI/optionsBarContainer/optionsBarContainer'
import { drawWithTree, drawWithTreeOptions } from './drawFunctions/drawWithTree'
import { SvgConductor } from './drawFunctions/svgAssets/svgConductor'
import { drawWithSvg, drawWithSvgOptions } from './drawFunctions/drawWithSvg'
import { EqualizerTransition } from './UI/animationComps/equalizerTransition/equalizerTransition'
import { OptionsToggler } from './UI/animationComps/optionsToggler/optionsToggler'
import { EqualizerUpperPanel } from './UI/equalizerUpperPanel/equalizerUpperPanel'
import { globalModes } from './drawFunctions/types'
import { throttle } from './drawFunctions/drawingUtils'
import { Instructions } from './UI/instructions/instructions'

const globalConfigInit: globalSettings = {
  kind: 'global',
  globalAlpha: 1,
  globalCompositeOperation: 'source-over',
  lineCap: 'butt',
  lineDashOffset: 0,
  lineWidth: 3,
  lineJoin: 'miter',
  shadowBlur: 0,
  shadowColor: '#0xFFFFFF',
  shadowOffsetX: 0,
  shadowOffsetY: 0,
}

const drawingConfig: configType = {
  drawWithImage: {
    kind: 'drawWithImage',
    quietness: 30,
    hueRotate: 1,
    brightness: 2,
    saturate: 15,
    dropShadow: 5,
    sepiaFilter: 1,
    blur: 4,
    invertFilter: 0.15,
    shadowColor: 'black',
    mode: 'mode1',
    smoothness: 1,
  },
  drawWithCircle: {
    kind: 'drawWithCircles',
    sensitivity: 0.9,
    rotOffSet: 15,
    rotSpeed: 1,
    point1: 0,
    point2: 0,
    point3: 0,
    point4: 0,
    point5: 0,
    point6: 0,
    width: 0,
    height: 0,
    color: '#0xFFFFFF',
    speed: 13,
    smothness: 10,
  },
  drawWithTree: {
    kind: 'drawWithTree',
    branch1: 1,
    branch2: 1,
    branch3: 1,
    branch4: 1,
    branch5: 1,
    branch6: 1,
    rotation: 20,
    lineWidth: 5,
    size: 50,
    shadowColor: 'white',
    smothness: 1,
  },
  drawWithSvg: {
    kind: 'drawWithSvg',
    sensivity: 1.5,
    brightness: 30,
    saturate: 30,
    rotate: 5.6,
    invert: 0,
    wings3: 10,
    hueRotate: 1,
    wings2: 10,
    shadow: 'white',
    mode: 'mode1',
    smothness: 1,
  },
}

export const Equalizer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioCtxRef = useRef(new AudioContext())

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const currentSource = useRef<MediaElementAudioSourceNode | null>(null)
  const dataArray = useRef<Uint8Array>()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [equalizer, setEqualizer] = useState<equalizerT>('drawWithCircles')
  const drawWithCircleConfig = useRef<typeof drawingConfig['drawWithCircle']>(
    drawingConfig.drawWithCircle
  )
  const drawWithImageConfig = useRef<typeof drawingConfig['drawWithImage']>(
    drawingConfig.drawWithImage
  )
  const drawWithTreeConfig = useRef<typeof drawingConfig['drawWithTree']>(
    drawingConfig.drawWithTree
  )
  const drawWithSvgConfig = useRef<typeof drawingConfig['drawWithSvg']>(
    drawingConfig.drawWithSvg
  )
  const drawConfig = useRef<configType>(drawingConfig)
  const globalConfig = useRef<globalSettings>(globalConfigInit)
  const analyzerRef = useRef<Analyzer | undefined>(undefined)
  const [svgRefs, setSvgRefs] = useState<SVGPathElement[]>(
    [] as SVGPathElement[]
  )
  const svgRef = useRef<SVGPathElement[]>()
  const [globalMode, setGlobalMode] = useState<globalModes>('normal')
  const [refsArePlaced, setRefsArePlaced] = useState<boolean>(false)
  const divFullScreen = useRef<HTMLDivElement>(null)
  const animationId = useRef<number>()
  const initialCanvasSize = useRef<{ width: number; height: number }>({
    width: innerWidth,
    height: innerHeight,
  })
  let timeoutId: number | null = null
  let oldTimeStamp: number = 0
  const maxFps = 120
  // fps throttling is not working , on 120 fps it may look different

  const animate = (
    timestamp: number,
    time: number,
    svgRefs1: SVGPathElement[],
    globalMode: globalModes
  ) => {
    time++
    let x: number = 0

    const ctx = ctxRef.current
    if (globalMode === 'normal') {
      document.body.style.backgroundColor = ''
      document.body.style.transform = ''
      document.body.style.transform = ''
    }
    if (ctx && canvasRef.current && analyzerRef.current && dataArray.current) {
      canvasRef.current.style.filter = ''
      if (
        equalizer !== 'drawWithSvg' &&
        divFullScreen &&
        divFullScreen.current
      ) {
        divFullScreen.current.style.transform = ''
        divFullScreen.current.style.filter = ''
      }

      ctx.clearRect(
        0,
        0,
        canvasRef.current.width + 400,
        canvasRef.current.height + 400
      )

      ctx.globalCompositeOperation =
        globalConfig.current.globalCompositeOperation
      ctx.globalAlpha = globalConfig.current.globalAlpha
      ctx.lineDashOffset = globalConfig.current.lineDashOffset
      ctx.lineWidth = globalConfig.current.lineWidth
      ctx.shadowColor = globalConfig.current.shadowColor
      ctx.shadowOffsetX = globalConfig.current.shadowOffsetX
      ctx.shadowOffsetY = globalConfig.current.shadowOffsetY
      ctx.shadowBlur = globalConfig.current.shadowBlur
      ctx.lineJoin = globalConfig.current.lineJoin
      ctx.lineCap = globalConfig.current.lineCap

      const widthSegment =
        ctx.canvas.width / analyzerRef.current.frequencyBinCount
      const barWidth = canvasRef.current.width / dataArray.current.length

      analyzerRef.current.getByteFrequencyData(dataArray.current)

      {
        equalizer === 'drawWithCircles'
          ? drawWithCircles(
              drawConfig.current.drawWithCircle,
              analyzerRef.current,
              ctx,
              barWidth,
              dataArray.current,
              x,
              time,
              canvasRef,
              globalMode
            )
          : equalizer === 'drawWithImage'
          ? drawWithImage(
              drawConfig.current.drawWithImage,
              analyzerRef.current,
              ctx,
              barWidth,
              dataArray.current,
              x,
              time,
              canvasRef,
              globalMode
            )
          : equalizer === 'drawWithTree'
          ? drawWithTree(
              drawWithTreeConfig.current,
              analyzerRef.current,
              ctx,
              barWidth,
              dataArray.current,
              x,
              time,
              canvasRef,
              globalMode
            )
          : equalizer === 'drawWithSvg' && svgRefs
          ? drawWithSvg(
              drawWithSvgConfig.current,
              analyzerRef.current,
              ctx,
              barWidth,
              dataArray.current,
              canvasRef.current,
              x,
              time,
              svgRefs1,
              divFullScreen,
              globalMode
            )
          : () => {}
      }

      throttleFps(timestamp, time)
    }
  }
  // not working
  function throttleFps(timestamp: number, time: number) {
    if (timestamp - oldTimeStamp < 1000 / maxFps) return
    animationId.current && window.cancelAnimationFrame(animationId.current)
    animationId.current = requestAnimationFrame(function (timestamp) {
      animate(timestamp, time, svgRefs, globalMode)
    })
    oldTimeStamp = timestamp
  }
  const resizeCb = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
    }

    if (
      ctxRef.current &&
      animationId.current &&
      innerWidth / innerHeight < 1.1
    ) {
      if (initialCanvasSize.current) {
        let xScaleFactor =
          ctxRef.current.canvas.width / initialCanvasSize.current.width
        let yScaleFactor =
          ctxRef.current.canvas.height / initialCanvasSize.current.height

        if (
          xScaleFactor < 0.8 &&
          xScaleFactor > 0.65 &&
          equalizer !== 'drawWithSvg'
        ) {
          ctxRef.current.scale(xScaleFactor, xScaleFactor)
        } else if (xScaleFactor < 0.65 && equalizer === 'drawWithSvg') {
          ctxRef.current.scale(xScaleFactor + 0.7, xScaleFactor + 0.7)
        } else if (xScaleFactor < 0.65 && equalizer !== 'drawWithSvg') {
          ctxRef.current.scale(xScaleFactor + 0.5, xScaleFactor + 0.5)
        }
      }
    }
  }
  
  const throttledResizeCb = throttle(resizeCb, 300)
  useEffect(() => {
    const analyzer = new Analyzer(audioCtxRef.current, 256)
    dataArray.current = analyzer.createBuffer()
    analyzerRef.current = analyzer
    if (canvasRef.current) {
      canvasRef.current.height = window.innerHeight
      canvasRef.current.width = window.innerWidth
      ctxRef.current = canvasRef.current.getContext('2d')
    }
  }, [])
  useEffect(() => {
    if (canvasRef.current) {
      initialCanvasSize.current.width = canvasRef.current.width
      initialCanvasSize.current.height = canvasRef.current.height
    }

    audioCtxRef.current.resume()
    window.addEventListener('resize', throttledResizeCb)
    return () => {
      window.removeEventListener('resize', throttledResizeCb)
    }
  }, [])
  useEffect(() => {
    globalConfig.current.globalCompositeOperation = 'source-over'
    if (equalizer === 'drawWithSvg') {
      svgRef.current = svgRefs
      setTimeout(() => {
        animationId.current && window.cancelAnimationFrame(animationId.current)
        animationId.current = requestAnimationFrame(function (timestamp) {
          animate(timestamp, 0, svgRefs, globalMode)
        })
      }, 0)
    } else {
      animationId.current && window.cancelAnimationFrame(animationId.current)

      animationId.current = requestAnimationFrame(function (timestamp) {
        animate(timestamp, 0, svgRefs, globalMode)
      })
    }
    return () => {
      animationId.current && window.cancelAnimationFrame(animationId.current)
    }
  }, [equalizer, setEqualizer, svgRefs, globalMode])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files?.length) {
      const file = files[0]
      const audio = URL.createObjectURL(file)
      if (analyzerRef.current && dataArray.current && audioRef.current) {
        analyzerRef.current.smoothingTimeConstant = 0.8
        audioRef.current.src = audio
        if (currentSource.current === null || undefined) {
          currentSource.current = audioCtxRef.current.createMediaElementSource(
            audioRef.current
          )

          currentSource.current.connect(analyzerRef.current)
          currentSource.current.connect(audioCtxRef.current.destination)
        }

        audioCtxRef.current.resume()
        audioRef.current.load()
        audioRef.current.play().catch((e) => console.log(e))
      }
    }
  }

  return (
    <>
      <OptionsToggler>
        <div className={`${classes.globalSideBarWrapper}`}>
          <EqualizerTransition></EqualizerTransition>
          <div className={classes.globalSideBarContainer}>
            <label className={classes.labelForInput}>
              <input
                onChange={onFileChange}
                type="file"
                accept="audio/*"
              ></input>
            </label>
            <OptionsBarContainer styles={{ border: 'none' }}>
              <GlobalOptions
                options={globalOptions}
                config={globalConfig}
              ></GlobalOptions>
            </OptionsBarContainer>
            <div style={{display:'flex' , justifyContent:'space-between' , alignItems:'center'}}>
            <audio controls ref={audioRef} style={{ height: '70px' }}></audio>
            <Instructions></Instructions>
            </div>
           
          </div>
        </div>
      </OptionsToggler>

      <div className={`${classes.optionsBarWrapper}`}>
        <OptionsToggler>
          {equalizer === 'drawWithCircles' ? (
            <OptionsBarContainer>
              <GlobalOptions
                options={drawWithCirclesOptions}
                config={drawWithCircleConfig}
              ></GlobalOptions>
            </OptionsBarContainer>
          ) : equalizer === 'drawWithImage' ? (
            <OptionsBarContainer>
              <GlobalOptions
                options={drawWithImageOptions}
                config={drawWithImageConfig}
              ></GlobalOptions>
            </OptionsBarContainer>
          ) : equalizer === 'drawWithTree' ? (
            <OptionsBarContainer>
              <GlobalOptions
                options={drawWithTreeOptions}
                config={drawWithTreeConfig}
              ></GlobalOptions>
            </OptionsBarContainer>
          ) : equalizer === 'drawWithSvg' ? (
            <OptionsBarContainer>
              <GlobalOptions
                options={drawWithSvgOptions}
                config={drawWithSvgConfig}
              ></GlobalOptions>
            </OptionsBarContainer>
          ) : null}
        </OptionsToggler>
      </div>

      <div className={classes.canvasWrapper} ref={divFullScreen}>
        {equalizer === 'drawWithSvg' ? (
          <SvgConductor
            setRefsArePlaced={setRefsArePlaced}
            setSvgRefs={setSvgRefs}
            dataArray={dataArray}
          ></SvgConductor>
        ) : null}

        {equalizer === 'drawWithImage' ? (
          <canvas ref={canvasRef} className={classes.canvas}></canvas>
        ) : (
          <canvas ref={canvasRef} className={classes.canvas}></canvas>
        )}
      </div>

      <div className={classes.togglerWrapper}>
        <EqualizerUpperPanel
          setGlobalMode={setGlobalMode}
          activeEqualizer={equalizer}
          fullscreenRef={divFullScreen}
          setEqualizer={setEqualizer}
          canvasRef={canvasRef}
        ></EqualizerUpperPanel>
      </div>
    </>
  )
}
