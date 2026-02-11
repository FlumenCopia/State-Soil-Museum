
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

export default function MovingStars() {
  const starsRef = useRef();

  useFrame((state, delta) => {

    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.003; 
      starsRef.current.rotation.x += delta * 0.001;
    }
  });

  return (
    <group ref={starsRef}>
      <Stars 
        radius={300} 
        depth={60} 
        count={20000} 
        factor={3}      // Small, steady points of light
        saturation={0} 
        fade 
        speed={0}       // SET TO 0: This stops the atmospheric "twinkling" effect
      />
    </group>
  );
}