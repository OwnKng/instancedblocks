// @ts-nocheck
import { forwardRef, useMemo } from "react"
import { Uniform } from "three"
import { Effect } from "postprocessing"

const fragmentShader = `    
    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

        float r = texture2D(inputBuffer, vec2(uv.x - 0.01, uv.y - 0.01)).r * 0.5;
        vec2 gb = texture2D(inputBuffer, vec2(uv.x + 0.01, uv.y + 0.01)).gb * 0.2;

        outputColor = vec4(vec3(r, gb), 1.0);  
    }
`

let _uParam: any

// Effect implementation
class MyCustomEffectImpl extends Effect {
  constructor({ param = 0.1 } = {}) {
    super("MyCustomEffect", fragmentShader, {
      uniforms: new Map([["param", new Uniform(param)]]),
    })

    _uParam = param
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get("param").value = _uParam
  }
}

// Effect component
const MyEffect = forwardRef(({ param }, ref) => {
  const effect = useMemo(() => new MyCustomEffectImpl(param), [param])
  return <primitive ref={ref} object={effect} dispose={null} />
})

export default MyEffect
