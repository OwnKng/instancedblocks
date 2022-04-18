import { useLayoutEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { InstancedMesh } from "three"
import SimplexNoise from "simplex-noise"
import { useFrame } from "@react-three/fiber"

const simplex = new SimplexNoise()

const width = 50
const height = 50
const numberOfPoint = width * height

const tempObject = new THREE.Object3D()

const pNoise = (
  coords: [number, number],
  frequency: number,
  amplitude: number
) => simplex.noise2D(coords[0] * frequency, coords[1] * frequency) * amplitude

const cNoise = (
  coords: [number, number, number],
  frequency: number,
  amplitude: number
) =>
  simplex.noise3D(
    coords[0] * frequency,
    coords[1] * frequency,
    coords[2] * frequency
  ) * amplitude

const Sketch = () => {
  const ref = useRef<InstancedMesh>(null!)

  const instances = useMemo(
    () =>
      new THREE.InstancedMesh(
        new THREE.BoxGeometry(0.8, 0.1, 0.1),
        new THREE.MeshPhongMaterial({ color: "white" }),
        numberOfPoint
      ),
    []
  )

  const attributes = useMemo(
    () =>
      Array.from({ length: numberOfPoint }, (_, i) => ({
        x: i % width,
        y: Math.floor(i / width),
        scale: Math.random() * 3,
      })),
    []
  )

  useFrame(({ clock }) => {
    for (let i = 0; i < numberOfPoint; i++) {
      const z = cNoise(
        [
          (i % width) / width,
          Math.floor(i / width) / height,
          clock.getElapsedTime(),
        ],
        1,
        5
      )

      const { x, y, scale } = attributes[i]

      tempObject.position.set(x, y, z)
      tempObject.scale.set(scale, scale, 1)
      tempObject.rotation.set(z, z, z)
      tempObject.updateMatrix()

      ref.current.setMatrixAt(i, tempObject.matrix)
    }

    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <primitive
      rotation={[-Math.PI * 0.5, 0, 0]}
      position={[-width / 2, -1, width / 2]}
      ref={ref}
      object={instances}
      castShadow
      receiveShadow
    />
  )
}

export default Sketch
