"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

const INDIA_MODELS = Object.freeze({
  "IndiaSVG-20": "/model/s1.glb",
  "IndiaSVG-21": "/model/s2.glb",
  "IndiaSVG-22": "/model/s3.glb",
});

Object.values(INDIA_MODELS).forEach((path) => useGLTF.preload(path));

function Model({ path }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={1.15} />;
}

export default function Indian3Dfile({ selectedClass }) {
  const modelPath = selectedClass ? INDIA_MODELS[selectedClass] : null;
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