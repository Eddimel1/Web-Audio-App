import classes from './Piano.module.css'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  SceneIniter,
  WebGlRenderer,
  Camera,
} from '../components/Classes/SceneInit1'
import { KeyGroup } from '../components/Classes/KeyGroup'
import { Oscillator } from '../components/Classes/Oscillator'
import { Options } from '../components/options/options'
import {
  PianoContextProvider,
  pianoContextType,
  createCtx,
  useCtx,
} from '../contexts/PianoContext'
import { NavBar } from '../components/navBar/navBar'
import { EqualizerTransition } from './Equalizer/UI/animationComps/equalizerTransition/equalizerTransition'
export const context = createCtx<pianoContextType>()
export const Piano = () => {
  const audioCtx = useRef<AudioContext | undefined>(undefined)
  const oscRef = useRef<Oscillator | undefined>(undefined)
  const keyGroupRef = useRef<KeyGroup | undefined>(undefined)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rendererRef = useRef<WebGlRenderer | null>(null)
  const sceneIniterRef = useRef<SceneIniter>()
  const camera = new Camera(
    40,
    innerWidth / innerHeight,
    1,
    1000,
    innerWidth,
    innerHeight
  )

  useEffect(() => {
    if (canvasRef.current) {
      rendererRef.current = new WebGlRenderer({
        canvas: canvasRef.current,
        antialias: true,
      })
    }
    
    const vertices = []
    for (let i = 0; i < 10000; i++) {
      const x = THREE.MathUtils.randFloatSpread(3000)
      const y = THREE.MathUtils.randFloatSpread(3000)
      const z = THREE.MathUtils.randFloatSpread(3000)

      vertices.push(x, y, z)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    )

    const pointMaterial = new THREE.PointsMaterial({ color: 0x888888 })

    const points = new THREE.Points(geometry, pointMaterial)

    camera.position.z = 140
    camera.position.x = -200
    camera.position.y = 140
    const sceneIniter =
      rendererRef.current &&
      new SceneIniter(rendererRef.current, 'piano', camera, false)
    const keyGroup = new KeyGroup({ x: -150, y: -57, z: -75 })
    keyGroup.keyGroup.name = 'piano'

    if (sceneIniter) {
      sceneIniterRef.current = sceneIniter
    }

    sceneIniter &&
      sceneIniter.scene.add(
        keyGroup.returnGroup().rotateX(-1.62).rotateY(0.05).rotateZ(-0.95)
      )
    keyGroupRef.current = keyGroup
    audioCtx.current = new AudioContext()
    oscRef.current = new Oscillator(audioCtx.current, 300, 'sine', 0)
    const light = new THREE.AmbientLight(0xffffff)
    if (sceneIniter) {
      sceneIniter.scene.add(light)
      sceneIniter.scene.add(points)
      sceneIniter.scene.background = new THREE.Color(0x000000)
      sceneIniter.animate((time: number) => {
        points.position.x = Math.sin(time) * 1000
        points.position.y = Math.cos(time) * 1000
      })
    }
  }, [])
  useEffect(() => {
    const resizeCb = () => {
      if (sceneIniterRef.current && sceneIniterRef.current.animationId)
        window.cancelAnimationFrame(sceneIniterRef.current.animationId)
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }

    window.addEventListener('resize', resizeCb)
    return () => {
      window.removeEventListener('resize', resizeCb)
    }
  }, [])

  return (
    <>
      <EqualizerTransition></EqualizerTransition>

      <canvas
        className={classes.canvas}
        style={{ margin: 0, padding: 0 }}
        ref={canvasRef}
      ></canvas>
      <PianoContextProvider ctx={context}>
        <Options ctx={audioCtx} keyGroup={keyGroupRef} osc={oscRef} />
        <NavBar
          transitionFromTheEdge={true}
          navContainerStyles={{ color: 'white' }}
        ></NavBar>
      </PianoContextProvider>
    </>
  )
}
