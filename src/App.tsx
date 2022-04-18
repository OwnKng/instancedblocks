import { Canvas } from "@react-three/fiber"
import "./App.css"
import Sketch from "./Sketch"

const App = () => (
  <div className='App'>
    <Canvas
      orthographic
      camera={{ zoom: 15 }}
      onCreated={({ camera }) => {
        camera.position.setFromSphericalCoords(100, Math.PI / 3, Math.PI / 4)
        camera.lookAt(0, 0, 0)
      }}
      shadows
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 10, 0]} intensity={0.8} />
      <Sketch />
    </Canvas>
  </div>
)

export default App
