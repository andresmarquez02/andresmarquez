import { Component, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

// One wireframe knot that turns slowly and leans toward the pointer. It lives only in the footer.
function Knot() {
  const ref = useRef(null);
  useFrame(({ clock, pointer }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime;
    m.rotation.x += (t * 0.15 + pointer.y * 0.6 - m.rotation.x) * 0.04;
    m.rotation.y += (t * 0.2 + pointer.x * 0.8 - m.rotation.y) * 0.04;
  });
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1.25, 0.38, 160, 16]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.32} />
    </mesh>
  );
}

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function FooterScene() {
  return (
    <Boundary>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7.2], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        eventSource={document.documentElement}
        eventPrefix="client"
      >
        <Knot />
      </Canvas>
    </Boundary>
  );
}
