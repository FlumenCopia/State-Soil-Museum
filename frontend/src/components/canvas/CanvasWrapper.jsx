
"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CameraController from "./CameraController";
import Lights from "./Lights";
import MovingStars from "./MovingStars";

export default function CanvasWrapper({ children }) {
  return (
    <div style={{ width: "100vw", height: "100vh", pointerEvents: "none" }}>
      <Canvas
        dpr={[1, 2]}
        gl={{ alpha: true }}
        camera={{ fov: 45, near: 0.1, far: 5000, position: [0, 0, 320] }}
        style={{ pointerEvents: "none", background: "transparent" }}
             >
        <Suspense fallback={null}>
          <MovingStars />
          <Lights />
          <CameraController />
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
