import * as THREE from 'three'
import { BoxMesh, position } from './BoxMesh'
import { whiteKeys, blackKeys } from '../../Data/keys'
import woodTextureImg from '../../../assets/woodTexture.jpg'
import blackTextureImg from '../../../assets/blackTexture.jpg'
import displacement from '../../../assets/displacement.jpg'
import roughness from '../../../assets/roughness.jpg'

export class KeyGroup {
  keyGroup: THREE.Group
  boxMeshArray: BoxMesh[]
  constructor({ x, y, z }: position) {
    this.keyGroup = new THREE.Group()
    this.boxMeshArray = []
    this.keyGroup.position.x = x
    this.keyGroup.position.y = y
    this.keyGroup.position.z = z
    const woodTexture = new THREE.TextureLoader().load(woodTextureImg)
    const blackTexture = new THREE.TextureLoader().load(blackTextureImg)
    const displacementMap = new THREE.TextureLoader().load(displacement)
    const roughnessMap = new THREE.TextureLoader().load(roughness)

    whiteKeys.forEach((whiteKey) => {
      const meshWhiteKey = new BoxMesh(
        { width: 14.9, height: 40, depth: 20 },
        {
          map: woodTexture,
          displacementMap: displacementMap,
          normalMap: displacementMap,
          roughnessMap: roughnessMap,
          metalnessMap: roughnessMap,
          metalness: 1,
        },
        { x: whiteKey.xOffSet, y: 10, z: 10 },
        whiteKey.inputKey
      )

      this.boxMeshArray.push(meshWhiteKey)

      this.keyGroup.add(meshWhiteKey.mesh)
    })
    blackKeys.forEach((blackKey, i) => {
      const meshBlackKey = new BoxMesh(
        { width: 6, height: 35, depth: 20 },
        {
          map: blackTexture,
          displacementMap: displacementMap,
          normalMap: displacementMap,
          roughnessMap: roughnessMap,
        },
        { x: blackKey.xOffSet, y: 10, z: 15 },
        blackKey.inputKey
      )
      this.keyGroup.add(meshBlackKey.mesh)
      this.boxMeshArray.push(meshBlackKey)
    })
  }
  //@ts-ignore
  returnGroup() {
    return this.keyGroup
  }
  getMeshbyInputKey(input: string) {
    const mesh = this.boxMeshArray.find((mesh) => mesh.input === input)
    if (mesh !== undefined) return mesh
  }
  getFreqbyIndex(input: string) {
    const whiteKeyIndex = whiteKeys.findIndex((key) => key.inputKey === input)
    const blackKeyIndex = blackKeys.findIndex((key) => key.inputKey === input)
    if (whiteKeyIndex !== -1) {
      return whiteKeys[whiteKeyIndex].frequency
    } else if (blackKeyIndex !== -1) {
      return blackKeys[blackKeyIndex].frequency
    }
    return undefined
  }
  rotate(target: BoxMesh, angle: number) {
    const rotAngle = angle
    target.mesh.rotateX(rotAngle)

    window.setTimeout(() => {
      target.mesh.rotateX(-rotAngle)
    }, 500)
  }
}
