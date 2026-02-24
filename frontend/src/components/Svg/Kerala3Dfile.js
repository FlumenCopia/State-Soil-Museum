"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function Kerala3Dfile({ path }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={1} />;
}


const models = [
  { name: "cls-1", path: "/model/s6.glb" },
  { name: "cls-2", path: "/model/s2.glb" },
  { name: "cls-3", path: "/model/s3.glb" },
  { name: "cls-4", path: "/model/s4.glb" },
  { name: "cls-5", path: "/model/s5.glb" },
  { name: "cls-6", path: "/model/s6.glb" },
  { name: "cls-7", path: "/model/s7.glb" },
  { name: "cls-8", path: "/model/s8.glb" },
  { name: "cls-9", path: "/model/s9.glb" },
  // { name: "cls-10", path: "/models/file10.glb" },
  { name: "cls-11", path: "/model/s11.glb" },
];



models.forEach((model) => useGLTF.preload(model.path));
export default function Kerala3Dfile() {
  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {models.map((model, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="w-full h-[300px] bg-black rounded-lg">
            <Canvas camera={{ position: [2, 2, 2], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[10, 10, 5]} intensity={1} />

              <Suspense fallback={null}>
                <Model path={model.path} />
              </Suspense>

              <OrbitControls enableZoom={true} />
              <Environment preset="sunset" />
            </Canvas>
          </div>

          {/* 🔥 Show Model Name */}
          <p className="mt-2 text-sm font-medium text-gray-700">
            {model.name}
          </p>
        </div>
      ))}
    </div>
  );
}