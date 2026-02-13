"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CameraController from "./CameraController";
import Lights from "./Lights";
import MovingStars from "./MovingStars";

export default function CanvasWrapper({ children }) {
  return (
    <section
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "black", // 👈 makes section clearly visible
        overflow: "hidden",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 45, near: 0.1, far: 5000, position: [0, 0, 320] }}
      >
        <Suspense fallback={null}>
          <MovingStars />
          <Lights />
          <CameraController />
          {children}
        </Suspense>
      </Canvas>
    </section>
  );
}
