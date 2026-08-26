"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function Core() {
  const shell = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (shell.current) {
      shell.current.rotation.y = t * 0.12;
      shell.current.rotation.x = Math.sin(t * 0.18) * 0.12;
    }
    if (inner.current) {
      const s = 1 + Math.sin(t * 2.1) * 0.07;
      inner.current.scale.setScalar(s);
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
      <mesh ref={inner}>
        <sphereGeometry args={[0.52, 64, 64]} />
        <meshStandardMaterial
          color="#14B8A6"
          emissive="#14B8A6"
          emissiveIntensity={2.4}
          roughness={0.15}
        />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.18, 1]} />
        <meshPhysicalMaterial
          color="#0F766E"
          metalness={0.15}
          roughness={0.06}
          transmission={0.88}
          thickness={1.4}
          ior={1.42}
          transparent
          opacity={0.92}
          envMapIntensity={1.6}
        />
      </mesh>
    </Float>
  );
}

function Rings() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.z += delta * 0.1;
    group.current.rotation.y += delta * 0.07;
  });

  return (
    <group ref={group}>
      {[
        { r: 1.78, c: "#14B8A6", tilt: 0.32 },
        { r: 2.32, c: "#FF6B5E", tilt: 0.72 },
        { r: 2.9, c: "#0F766E", tilt: 1.12 },
      ].map((ring) => (
        <mesh key={ring.r} rotation={[Math.PI / 2 + ring.tilt, ring.tilt * 0.4, 0]}>
          <torusGeometry args={[ring.r, 0.012, 12, 160]} />
          <meshBasicMaterial color={ring.c} transparent opacity={0.78} />
        </mesh>
      ))}
    </group>
  );
}

function Waveform({ bars = 28 }: { bars?: number }) {
  const group = useRef<THREE.Group>(null);
  const mats = useMemo(
    () =>
      Array.from({ length: bars }, (_, i) => {
        const color = new THREE.Color(i % 7 === 0 ? "#FF6B5E" : "#14B8A6");
        return new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 1.3,
          roughness: 0.35,
        });
      }),
    [bars],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const h = 0.22 + Math.abs(Math.sin(t * 2.3 + i * 0.38)) * 0.95;
      child.scale.y = h;
    });
  });

  return (
    <group ref={group} rotation={[Math.PI / 2, 0, 0]}>
      {Array.from({ length: bars }).map((_, i) => {
        const a = (i / bars) * Math.PI * 2;
        const r = 3.45;
        return (
          <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0]} material={mats[i]}>
            <boxGeometry args={[0.055, 1, 0.055]} />
          </mesh>
        );
      })}
    </group>
  );
}

function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame((state) => {
    if (reduced) {
      state.camera.lookAt(0, 0, 0);
      return;
    }
    const x = state.pointer.x * 1.35;
    const y = state.pointer.y * 0.55;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x, 0.035);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.15 + y, 0.035);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Effects({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom intensity={1.05} luminanceThreshold={0.18} luminanceSmoothing={0.35} mipmapBlur />
      <Vignette eskil={false} offset={0.28} darkness={0.72} />
    </EffectComposer>
  );
}

export default function HeloraScene({ compact = false }: { compact?: boolean }) {
  const [fx, setFx] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(motion);
    setFx(!motion && window.innerWidth >= 768);
  }, []);

  const bars = compact ? 18 : 28;

  return (
    <Canvas
      dpr={[1, 1.7]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.2, compact ? 7.2 : 6.4], fov: compact ? 42 : 38 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <color attach="background" args={["#05080a"]} />
      <fog attach="fog" args={["#05080a", 8, 18]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 4]} intensity={18} color="#14B8A6" distance={12} />
      <pointLight position={[-5, -2, -3]} intensity={10} color="#FF6B5E" distance={14} />
      <spotLight position={[0, 8, 2]} intensity={20} angle={0.45} penumbra={1} color="#f4efe6" />
      <Core />
      <Rings />
      <Waveform bars={bars} />
      <Sparkles count={compact ? 40 : 80} scale={8} size={2.2} speed={0.35} color="#14B8A6" opacity={0.55} />
      <Environment preset="night" />
      <CameraRig reduced={reduced} />
      <Effects enabled={fx} />
    </Canvas>
  );
}
