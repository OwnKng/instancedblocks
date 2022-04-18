import { useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { InstancedMesh } from "three"
import SimplexNoise from "simplex-noise"
import { useFrame } from "@react-three/fiber"

const simplex = new SimplexNoise()

const width = 50
const height = 50
const numberOfPoint = width * height

const tempObject = new THREE.Object3D()

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

const attributes = Array.from({ length: numberOfPoint }, (_, i) => ({
  x: i % width,
  y: Math.floor(i / width),
  scale: Math.random() * 3,
}))

const tempScale = Array.from({ length: numberOfPoint }, (_) => ({ scale: 1 }))

const getPositionAt = (instance: InstancedMesh, id: number) => {
  const tempMatrix = new THREE.Matrix4()
  const position = new THREE.Vector3()

  instance.getMatrixAt(id, tempMatrix)
  position.setFromMatrixPosition(tempMatrix)

  return position
}

const Sketch = () => {
  const ref = useRef<InstancedMesh>(null!)

  const [hovered, set] = useState()

  const instances = useMemo(
    () =>
      new THREE.InstancedMesh(
        new THREE.BoxGeometry(0.8, 0.1, 0.1),
        new THREE.MeshPhongMaterial({ color: "#F2E9DC" }),
        numberOfPoint
      ),
    []
  )

  useFrame(({ clock }) => {
    for (let i = 0; i < numberOfPoint; i++) {
      const z = cNoise(
        [
          (i % width) / width,
          Math.floor(i / width) / height,
          clock.getElapsedTime() * 0.05,
        ],
        1,
        5
      )

      const { x, y } = attributes[i]

      tempObject.position.set(x, y, z * 1.5)

      const hoverPosition = hovered ? getPositionAt(ref.current, hovered) : null
      const distance = hoverPosition
        ? tempObject.position.distanceTo(hoverPosition)
        : 10

      const scale = (tempScale[i].scale = THREE.MathUtils.lerp(
        tempScale[i].scale,
        distance < 5 ? 10 : attributes[i].scale,
        0.1
      ))

      tempObject.scale.set(scale, scale, scale)
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
      onPointerMove={(e: any) => set(e.instanceId)}
      onPointerOut={(e: any) => set(undefined)}
      onPointerDown={(e: any) => set(e.instanceId)}
    />
  )
}

export default Sketch
