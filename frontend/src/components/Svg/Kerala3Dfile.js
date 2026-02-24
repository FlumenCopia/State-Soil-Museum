"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

const KERALA_MODELS = Object.freeze({
  "cls-1": "/model/s9.glb",
  "cls-2": "/model/s7.glb",
  "cls-3": "/model/s3.glb",
  "cls-4": "/model/s8.glb",
  "cls-5": "/model/s5.glb",
  "cls-6": "/model/s1.glb",
  "cls-7": "/model/s3.glb",

  "cls-8": "/model/s4.glb",
  "cls-9": "/model/s2.glb",
  // "cls-10": "/model/s.glb",
  "cls-11": "/model/s2.glb",
});

Object.values(KERALA_MODELS).forEach((path) => useGLTF.preload(path));

function Model({ path }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={1.15} />;
}

export default function Kerala3Dfile({ selectedClass }) {
  const modelPath = selectedClass ? KERALA_MODELS[selectedClass] : null;
  if (!modelPath) return null;

  return (
    <div style={{ width: "min(62vw, 860px)", height: "min(72vh, 700px)" }}>
      <Canvas camera={{ position: [2.2, 1.8, 2.3], fov: 42 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.1} />
        <Suspense fallback={null}>
          <Model path={modelPath} />
        </Suspense>
        <OrbitControls enablePan={false} />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}