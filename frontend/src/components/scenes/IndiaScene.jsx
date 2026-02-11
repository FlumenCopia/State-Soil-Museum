// "use client";
// import { useEffect, useRef } from "react";
// import gsap from "gsap";

// export default function IndiaScene() {
//   const meshRef = useRef();

//   useEffect(() => {
//     // Fade in the map after the globe rotation and camera zoom are mostly done
//     gsap.to(meshRef.current.material, {
//       opacity: 1,
//       duration: 2,
//       delay: 1.5, // Sync this with your camera/globe animation duration
//     });
//   }, []);

//   return (
//     <mesh ref={meshRef} position={[0, 0, 105]} rotation={[0, 0, 0]}>
//       {/* Use a Plane instead of a Box to avoid the "line" look */}
//       <planeGeometry args={[150, 150]} /> 
//       <meshStandardMaterial 
//         color="#f6f3ef" 
//         transparent 
//         opacity={0} // Start invisible
//       />
//     </mesh>
//   );
// }



"use client";

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { Extrude } from "@react-three/drei";
import gsap from "gsap";

export default function IndiaScene() {
  const groupRef = useRef();

  // Create a "Dummy" India Shape (Procedural)
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
      
      // 2. Animate IN after the delay
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