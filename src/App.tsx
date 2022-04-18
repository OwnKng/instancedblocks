import { Canvas } from "@react-three/fiber"

import "./App.css"
import Sketch from "./Sketch"
import * as THREE from "three"
import { EffectComposer } from "@react-three/postprocessing"
import Effect from "./Effect"

const App = () => (
  <div className='App'>
    <Canvas
      orthographic
      camera={{ zoom: 20 }}
      onCreated={({ camera }) => {
        camera.position.setFromSphericalCoords(20, Math.PI / 3, Math.PI / 4)
        camera.lookAt(0, 0, 0)
      }}
      shadows
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 10, 0]} intensity={1.0} />
      <Sketch />
      <EffectComposer>
        <Effect />
      </EffectComposer>
    </Canvas>
  </div>
)

export default App
