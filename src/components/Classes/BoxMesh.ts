import * as THREE from 'three'

type boxGeometryType = {
  width?: number
  height?: number
  depth?: number
  widthSegments?: number | undefined
  heightSegments?: number | undefined
  depthSegments?: number | undefined
}
type setMeshPositionType = (x: number, y: number, z: number) => void
export interface meshMethods {
  setMeshPosition: setMeshPositionType
}
export type position = {
  x: number
  y: number
  z: number
}

export class BoxMesh implements meshMethods {
  mesh: THREE.Mesh
  input: string

  constructor(
    boxGeometry: boxGeometryType,
    materialParameters: THREE.MeshStandardMaterialParameters | undefined,
    position: position,
    input: string
  ) {
    const {
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      depthSegments,
    } = boxGeometry
    const geometry = new THREE.BoxGeometry(
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      depthSegments
    )
    const material = new THREE.MeshStandardMaterial(materialParameters)
    const mesh = new THREE.Mesh(geometry, material)
    const { x, y, z } = position
    mesh.position.set(x, y, z)
    this.mesh = mesh
    this.input = input
  }
  setMeshPosition(x: number, y: number, z: number) {
    this.mesh.position.set(x, y, z)
  }
}
