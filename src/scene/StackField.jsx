import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color } from "three";
import { STACK_GROUPS } from "../data/content";
import { journey } from "./journey";
import { constellationLayout, mulberry32, nearStation, routePosition } from "./math";
import { ROUTE, stageOffset, stageScale, stationU } from "./route";
import { dotTexture } from "./textures";

const TINTS = [new Color("#FCD34D"), new Color("#4F8CFF")];

// One small constellation per stack group. Deliberately quiet: the stack is
// supporting cast, the process is the story.
export default function StackField() {
  const group = useRef(null);
  const aspect = useThree((s) => s.viewport.aspect);
  const station = useMemo(() => ROUTE.getPoint(stationU("stack")), []);
  const dot = useMemo(dotTexture, []);

  const { positions, colors, lines } = useMemo(() => {
    const { stars, segments } = constellationLayout(
      STACK_GROUPS.map((g) => g.items.length),
      mulberry32(9)
    );
    const positions = new Float32Array(stars.length * 3);
    const colors = new Float32Array(stars.length * 3);
    stars.forEach((star, i) => {
      positions.set([star.x, star.y, star.z], i * 3);
      TINTS[star.group % 2].toArray(colors, i * 3);
    });
    const lines = new Float32Array(segments.length * 6);
    segments.forEach(([a, b], i) => {
      lines.set(positions.subarray(a * 3, a * 3 + 3), i * 6);
      lines.set(positions.subarray(b * 3, b * 3 + 3), i * 6 + 3);
    });
    return { positions, colors, lines };
  }, []);

  useFrame(({ clock }) => {
    group.current.visible = nearStation(routePosition(journey.section), "stack");
    if (!group.current.visible) return;
    stageOffset("stack", aspect, group.current.position).add(station);
    group.current.scale.setScalar(stageScale(aspect));
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.1) * 0.25;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.5} map={dot} vertexColors transparent depthWrite={false} toneMapped={false} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#8a8aa0" transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}
