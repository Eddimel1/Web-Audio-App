import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export class Camera extends THREE.PerspectiveCamera {
  initialWidth: number
  initialHeight: number
  constructor(
    fov: number,
    aspect: number = window.innerWidth / window.innerHeight,
    near: number,
    far: number,
    initialWidth: number,
    initialHeight: number
  ) {
    super(fov, aspect, near, far)
    this.initialWidth = initialWidth
    this.initialHeight = initialHeight
  }
}

export class WebGlRenderer extends THREE.WebGLRenderer {
  constructor(params: THREE.WebGLRendererParameters | undefined) {
    super(params)
    this.setSize(window.innerWidth, window.innerHeight)
    this.setPixelRatio(window.devicePixelRatio)
    document.body.appendChild(this.domElement)
  }
}

export class SceneIniter {
  controls: OrbitControls
  camera: THREE.PerspectiveCamera | Camera
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  time: number
  animationId: number | null
  sceneType: 'home' | 'piano'
  constructor(
    renderer: THREE.WebGLRenderer,
    sceneType: 'piano' | 'home',
    camera?: THREE.PerspectiveCamera | Camera,
    iscontrols?: boolean,
    scene?: THREE.Scene
  ) {
    this.camera = camera ? camera : new THREE.PerspectiveCamera()
    this.scene = scene ? scene : new THREE.Scene()
    this.renderer = renderer
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.sceneType = sceneType
    iscontrols
      ? (this.controls.enabled = true)
      : (this.controls.enabled = false)
    this.time = 0.01
    this.scene.add(this.camera)
    this.animationId = null

    window.addEventListener('resize', () => this.onWindowResize(), false)
  }

  onWindowResize() {
    const pixelRatio = window.devicePixelRatio
    const initialScale = this.sceneType === 'home' ? 1 : 0.9
    const camera = this.camera as Camera

    let scale1 = Math.min(
      Math.abs(this.renderer.domElement.clientWidth - camera.initialWidth) /
        1000,
      0.4
    )

    let scalingOffSet = this.sceneType === 'home' ? 1.3 : 1.5
    const scalingXFactor =
      initialScale +
      scale1 +
      Math.abs(1 - this.renderer.domElement.clientWidth / camera.initialWidth)
    const scalingYFactor =
      initialScale +
      scale1 +
      Math.abs(1 - this.renderer.domElement.clientHeight / camera.initialHeight)
    this.camera.aspect =
      ((window.innerWidth * scalingXFactor) / window.innerHeight) *
      scalingYFactor
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(pixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.render()
  }
  render() {
    this.renderer.render(this.scene, this.camera)
  }
  animate(cb: any) {
    this.controls.update()
    this.render()
    this.time += 0.001

    cb(this.time)

    setTimeout(() => {
      this.animationId = window.requestAnimationFrame(
        this.animate.bind(this, cb)
      )
    }, 1000 / 60)
  }
}
