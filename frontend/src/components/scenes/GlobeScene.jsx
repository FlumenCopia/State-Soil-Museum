

"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere, useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useAppStore } from "@/store/useAppStore";

export default function GlobeScene() {
  const earthGroup = useRef();
  const cloudsRef = useRef();
  const { gl } = useThree();
  const { view, setView } = useAppStore();

  // Load textures
  const earthColor = useTexture("/textures/earth/earth_color4.jpg");
  const earthNormal = useTexture("/textures/earth/earth_normal.webp");
  const cloudsTexture = useTexture("/textures/earth/earth_clouds1.jpg");

  // FIX 1: Restore High-Quality Texture Settings
  useEffect(() => {
    [earthColor, earthNormal, cloudsTexture].forEach((tex) => {
      if (!tex) return;
      tex.anisotropy = gl.capabilities.getMaxAnisotropy();
      tex.needsUpdate = true;
    });
    if (earthColor) earthColor.colorSpace = THREE.SRGBColorSpace;
  }, [earthColor, earthNormal, cloudsTexture, gl]);

  // FIX 2: Automatic Trigger to India after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setView("india");
    }, 2000);
    return () => clearTimeout(timer);
  }, [setView]);

  // Handle Zoom/Rotation to India or Kerala
  useEffect(() => {
    if (earthGroup.current && (view === "india" || view === "kerala")) {
      const targets = {
        india: { lat: 20.59, lon: 78.96, tiltZ: 0 },
        kerala: { lat: 10.85, lon: 76.27, tiltZ: -0.15 } 
      };

      const { lat, lon, tiltZ } = targets[view];
      const OFFSET = -Math.PI / 2;

      const targetX = lat * (Math.PI / 180);
      const targetY = -(lon * (Math.PI / 180)) + OFFSET;

      // Shortest Path Calculation
      const currentY = earthGroup.current.rotation.y;
      const TWO_PI = Math.PI * 2;
      let diffY = (targetY - currentY) % TWO_PI;
      
      if (diffY > Math.PI) diffY -= TWO_PI;
      if (diffY < -Math.PI) diffY += TWO_PI;

      // Animate the Globe
      gsap.to(earthGroup.current.rotation, {
        x: targetX,
        y: currentY + diffY,
        z: tiltZ,
        duration: 2.5,
        ease: "power2.inOut",
      });
    }
  }, [view]);

  // Handle idle rotation
  useFrame((_, delta) => {
    if (earthGroup.current && view === "globe") {
      // Rotate the entire group (Earth + Clouds) at the same speed
      earthGroup.current.rotation.y += delta * 0.15;
    }
    
    // --- CHANGE MADE HERE ---
    // I removed the separate cloud rotation block. 
    // Since 'cloudsRef' is inside 'earthGroup', it will now 
    // automatically rotate at the exact same speed as the earth.
  });

  return (
    <group ref={earthGroup}>
      {/* Main Earth */}
      <Sphere args={[100, 128, 128]}>
        <meshStandardMaterial
          map={earthColor}
          normalMap={earthNormal}
          roughness={0.8}
        />
      </Sphere>

      {/* Clouds Layer */}
      <Sphere ref={cloudsRef} args={[101.2, 128, 128]}>
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </Sphere>

      {/* Atmosphere */}
      {/* <Sphere args={[104, 128, 128]}>
        <meshBasicMaterial
          color="#4ea9ff"
          transparent
        //   opacity={0.12}
          opacity={0.06}
          side={THREE.BackSide}
        />
      </Sphere> */}


      <Sphere args={[102, 128, 128]}> 
  <meshBasicMaterial
    color="#4ea9ff"
    transparent
    opacity={0.06} // You can also increase this slightly if it becomes too faint
    side={THREE.BackSide}
  />
</Sphere>
    </group>
  );
}





