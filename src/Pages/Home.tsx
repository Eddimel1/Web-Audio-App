import React, { useEffect, useRef, useState } from 'react'
import classes from './Home.module.css'
import {
  Camera,
  WebGlRenderer,
  SceneIniter,
} from '../components/Classes/SceneInit1'
import * as THREE from 'three'
//@ts-ignore
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import vertex from '../components/shaders/planeVertex.glsl'
import fragment from '../components/shaders/planeFragment.glsl'
import sphereVertex from '../components/shaders/sphereVertex.glsl'
import sphereFragment from '../components/shaders/sphereFragment.glsl'
import { NavBar } from './Equalizer/UI/navBar/navBar'

export const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const modelRef = useRef<GLTF | null>(null)
  const rendererRef = useRef<WebGlRenderer | null>(null)
  const scene = new THREE.Scene()
  const progressBarRef = useRef<HTMLProgressElement | null>(null)
  const arrayofActiveModels = useRef<THREE.Group[]>([])
  const camera = new Camera(
    40,
    innerWidth / innerHeight,
    1,
    10000,
    innerWidth,
    innerHeight
  )

  const activeClip = useRef<THREE.AnimationClip | null>(null)
  const arrayOfMixer = useRef<THREE.AnimationMixer[]>([])
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const sceneIniterRef = useRef<SceneIniter>()

  type activeMeshes = {
    model: GLTF
    plane: THREE.Mesh<THREE.PlaneBufferGeometry, THREE.ShaderMaterial>
    earth: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>
    points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>
    space: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>
  }
  const activeMeshes = useRef<activeMeshes>({} as activeMeshes)
  const loadingManager = new THREE.LoadingManager()
  const discoTexture = new THREE.TextureLoader(loadingManager).load('snow.jpg')
  const discoTexture1 = new THREE.TextureLoader(loadingManager).load(
    'discoTexture.jpg'
  )
  const spaceTexture = new THREE.TextureLoader(loadingManager).load(
    'space7.jpg'
  )
  const loader = new GLTFLoader(loadingManager)
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  const clock = new THREE.Clock()

  let uniforms = {
    u_time: {
      type: 'f',
      value: 0,
    },
    u_mouse: {
      type: 'v2',
      value: new THREE.Vector2(),
    },
    u_t1: {
      type: 't',
      value: discoTexture,
    },
    u_t2: {
      type: 't',
      value: discoTexture1,
    },
  }
  const createAndPlayAnimations = () => {
    arrayofActiveModels.current.forEach((model, i, array) => {
      const mixer = new THREE.AnimationMixer(model)
      arrayOfMixer.current.push(mixer)
      if (activeClip.current) {
        const action = mixer.clipAction(activeClip.current)
        action.play()
      }
    })
  }
  const animateModel = () => {
    const delta = clock.getDelta()
    arrayOfMixer.current.forEach((mixer) => {
      mixer.update(delta)
    })
  }
  const onMouseMove = (event: MouseEvent) => {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    activeMeshes.current.plane.material.uniforms.u_mouse.value = mouse
  }

  useEffect(() => {
    if (canvasRef.current) {
      window.addEventListener('pointermove', onMouseMove)
      if (rendererRef.current) {
        rendererRef.current.shadowMap.enabled = true
      }
      //LIGHTS
      const light2 = new THREE.AmbientLight(0xffffff, 1)
      scene.add(light2)
      const pointLight = new THREE.PointLight(0xffffff, 1, 1000)
      pointLight.castShadow = true
      pointLight.position.set(111, 370, -480)
      scene.add(pointLight)
      //LIGHTS

      camera.position.x = 800
      camera.position.y = 440

      const renderer = new WebGlRenderer({
        canvas: canvasRef.current,
        antialias: true,
      })

      rendererRef.current = renderer
      const sceneIniter = new SceneIniter(renderer, 'home', camera, true, scene)
      sceneIniterRef.current = sceneIniter

      //PLANE
      const planeMaterial = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: uniforms,
        side: THREE.DoubleSide,
        wireframe: true,
      })
      const planeGeometry = new THREE.PlaneBufferGeometry(1000, 1000, 10, 10)
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
      const count = planeGeometry.attributes.position.count //number of vertices in the geometry
      const randoms = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        randoms[i] = Math.random()
      }

      planeGeometry.setAttribute(
        'aRandom',
        new THREE.BufferAttribute(randoms, 1)
      )
      planeMesh.rotation.x = 4.7
      planeMesh.receiveShadow = true
      activeMeshes.current.plane = planeMesh

      //PLANE
      //EARTH
      const earthMaterial = new THREE.MeshStandardMaterial({
        roughness: 1,
        metalness: 0,
        map: new THREE.TextureLoader().load('earthmap1k.jpg'),
        bumpMap: new THREE.TextureLoader().load('earthbump.jpg'),
        bumpScale: 1,
      })

      //DISCOSPHERE
      const discoSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(100, 30, 30),
        new THREE.ShaderMaterial({
          vertexShader: sphereVertex,
          fragmentShader: sphereFragment,
          uniforms: uniforms,
        })
      )
      discoSphere.position.set(0, -450, 170)
      //DISCOSPHERE

      //EARTH
      const sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(450, 32, 32),
        earthMaterial
      )
      activeMeshes.current.earth = sphereMesh
      sphereMesh.receiveShadow = true
      sphereMesh.castShadow = true
      sphereMesh.position.set(-800, 800, -150)
      const cloudGeometry = new THREE.SphereGeometry(460, 32, 32)
      const cloudMetarial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('earthCloud.png'),
        transparent: true,
      })
      const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMetarial)
      //EARTH

      //SPACESPHERE
      const spaceMaterial = new THREE.MeshStandardMaterial({
        map: spaceTexture,
        side: THREE.DoubleSide,
      })
      const spaceMesh = new THREE.Mesh(
        new THREE.SphereGeometry(3000, 32, 32),
        spaceMaterial
      )
      activeMeshes.current.space = spaceMesh
      //SPACESPHERE

      //PARTICLES
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
      activeMeshes.current.points = points
      //PARTICLES
      loadingManager.onProgress = function (url, loaded, total) {
        if (progressBarRef.current) {
          progressBarRef.current.value = (loaded / total) * 100
        }
      }
      loadingManager.onLoad = function () {
        if (progressBarRef.current) {
          setIsLoaded(true)
          scene.add(planeMesh)
          scene.add(spaceMesh)
          scene.add(cloudMesh)
          scene.add(points)
          sphereMesh.add(cloudMesh)
          planeMesh.add(sphereMesh)
          planeMesh.add(discoSphere)
        }
      }
      //ADD ALL TOGETHER

      //ADD ALL TOGETHER

      let mixer: THREE.AnimationMixer

      //ON MODEL LOAD
      loader.load('scene.gltf', (model) => {
        model.scene.traverse((mesh) => {
          //@ts-ignore
          if (mesh.isMesh) {
            mesh.castShadow = true
            mesh.receiveShadow = true
          }
        })
        model.scene.scale.set(150, 150, 150)
        model.scene.updateMatrix()
        model.scene.position.set(680, 266, -219)
        model.scene.rotation.x = 1.45
        model.scene.castShadow = true
        modelRef.current = model
        arrayofActiveModels.current.push(model.scene)
        activeMeshes.current.model = model
        planeMesh.add(model.scene)

        //ANIMATION SETUP
        mixer = new THREE.AnimationMixer(model.scene)
        const clips = model.animations
        const clip = THREE.AnimationClip.findByName(clips, 'mixamo.com')
        activeClip.current = clip
        const action = mixer.clipAction(clip)
        action.play()

        // CLONE MODELS AND ADD THEM TO THE PLANE AS A CHILDREN
        const modelClone = clone(modelRef.current.scene)
        arrayofActiveModels.current.push(modelClone)
        modelClone.position.set(680, 366, -219)

        planeMesh.add(modelClone)
        const modelClone1 = clone(modelRef.current.scene)
        modelClone1.position.set(680, 466, -219)
        arrayofActiveModels.current.push(modelClone1)
        planeMesh.add(modelClone1)
        const modelClone2 = clone(modelRef.current.scene)
        modelClone2.position.set(680, 566, -219)
        arrayofActiveModels.current.push(modelClone2)
        planeMesh.add(modelClone2)
        createAndPlayAnimations()
      })

      const animateEarth = (time: number) => {
        activeMeshes.current.earth.rotation.z = +time * 1.2
        activeMeshes.current.points.position.x = Math.sin(time) * 1000
        activeMeshes.current.points.position.y = Math.cos(time) * 1000
        activeMeshes.current.plane.material.uniforms.u_time.value =
          clock.elapsedTime
        activeMeshes.current.space.rotation.y =
          Math.cos(time) * 10 * Math.sin(time)
        activeMeshes.current.space.rotation.x =
          Math.cos(time) * 10 * Math.sin(time)
        activeMeshes.current.space.rotation.z =
          Math.cos(time) * 10 * Math.sin(time)

        animateModel()
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(scene.children)
        if (intersects.length > 0) {
        }
      }

      sceneIniter.animate(animateEarth)
    }

    return () => {
      window.removeEventListener('pointermove', onMouseMove)
    }
  }, [])
  const resizeCb = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
    }
  }
  useEffect(() => {
    window.addEventListener('resize', resizeCb)
    return () => {
      window.removeEventListener('resize', resizeCb)
    }
  }, [])

  return (
    <>
      <canvas className={classes.canvasElem} ref={canvasRef}></canvas>

      <div
        style={{ display: isLoaded ? 'none' : 'flex' }}
        className={classes.progressContainer}
      >
        <label className={classes.label} htmlFor="progressBar">
          Loading.....
        </label>
        <progress
          value="0"
          max="100"
          className={classes.progress}
          ref={progressBarRef}
          id="progressBar"
        ></progress>
        <label className={classes.label} htmlFor="progressBar">
          {progressBarRef.current && progressBarRef.current.value + '%'}
        </label>
      </div>
      <NavBar
        transitionFromTheEdge={true}
        navContainerStyles={{ color: 'white', position: 'absolute' }}
      ></NavBar>
    </>
  )
}
