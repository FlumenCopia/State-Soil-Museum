


"use client";

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { Extrude } from "@react-three/drei";
import gsap from "gsap";

export default function IndiaScene() {
  const groupRef = useRef();
  const indiaShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 15);   
    shape.lineTo(12, 5);   
    shape.lineTo(3, -15);  
    shape.lineTo(-10, -5); 
    shape.lineTo(-5, 5);   
    return shape;
  }, []);

  useEffect(() => {
    if (groupRef.current) {
      // 1. Start invisible (to avoid white flash)
      groupRef.current.scale.set(0.1, 0.1, 0.1); 
      // Delay = 2.5s (Zoom time) + 1s (Pause time) = 3.5s
      gsap.to(groupRef.current.scale, {
        x: 0.5, y: 0.5, z: 0.5, // Target scale
        duration: 1.5,
        delay: 3.0, 
        ease: "back.out(1.7)",
      });
    }
  }, []);

  return (
    <group ref={groupRef} position={[0, -5, 0]} rotation={[-Math.PI / 4, 0, 0]}>
      {/* The Dummy Map */}
      <Extrude args={[indiaShape, { depth: 2, bevelEnabled: true, bevelThickness: 0.5 }]}>
        <meshStandardMaterial 
            color="#d2b48c" 
            roughness={0.4} 
            transparent={true} 
            opacity={1} 
        />
      </Extrude>
    </group>
  );
}