
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function StateScene() {
  const meshRef = useRef();

  useEffect(() => {
    // Fade in the map after the globe rotation and camera zoom are mostly done
    gsap.to(meshRef.current.material, {
      opacity: 1,
      duration: 2,
      delay: 1.5, // Sync this with your camera/globe animation duration
    });
  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, 105]} rotation={[0, 0, 0]}>
      {/* Use a Plane instead of a Box to avoid the "line" look */}
      <planeGeometry args={[150, 150]} /> 
      <meshStandardMaterial 
        color="#f6f3ef" 
        transparent 
        opacity={0} // Start invisible
      />
    </mesh>
  );
}