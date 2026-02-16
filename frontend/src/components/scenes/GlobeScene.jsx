

// "use client";

// import { useRef, useEffect } from "react";
// import { useFrame, useThree } from "@react-three/fiber";
// import { Sphere, useTexture } from "@react-three/drei";
// import * as THREE from "three";
// import gsap from "gsap";
// import { useAppStore } from "@/store/useAppStore";

// export default function GlobeScene() {
//   const earthGroup = useRef();
//   const cloudsRef = useRef();
//   const { gl } = useThree();
//   const { view, setView } = useAppStore();

//   // Load textures
//   const earthColor = useTexture("/textures/earth/earth_color4.jpg");
//   const earthNormal = useTexture("/textures/earth/earth_normal.webp");
//   const cloudsTexture = useTexture("/textures/earth/earth_clouds1.jpg");

//   // FIX 1: Restore High-Quality Texture Settings
//   useEffect(() => {
//     [earthColor, earthNormal, cloudsTexture].forEach((tex) => {
//       if (!tex) return;
//       tex.anisotropy = gl.capabilities.getMaxAnisotropy();
//       tex.needsUpdate = true;
//     });
//     if (earthColor) earthColor.colorSpace = THREE.SRGBColorSpace;
//   }, [earthColor, earthNormal, cloudsTexture, gl]);

//   // FIX 2: Automatic Trigger to India after 2 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setView("india");
//     }, 2000);
//     return () => clearTimeout(timer);
//   }, [setView]);

  

// useEffect(() => {
//   if (earthGroup.current && (view === "india" || view === "kerala")) {
    
//     const targets = {
//       india: { lat: 20.59, lon: 78.96, tiltZ: 0 },
//       // ADJUSTED TILT: -0.15 provides a better vertical alignment for Kerala
//       kerala: { lat: 10.85, lon: 76.27, tiltZ: -0.15 } 
//     };

//     const { lat, lon, tiltZ } = targets[view];
//     const OFFSET = -Math.PI / 2;

//     const targetX = lat * (Math.PI / 180);
//     const targetY = -(lon * (Math.PI / 180)) + OFFSET;

//     // Shortest Path Calculation
//     const currentY = earthGroup.current.rotation.y;
//     const TWO_PI = Math.PI * 2;
//     let diffY = (targetY - currentY) % TWO_PI;
    
//     if (diffY > Math.PI) diffY -= TWO_PI;
//     if (diffY < -Math.PI) diffY += TWO_PI;

//     // Animate the Globe (including the new Z tilt)
//     gsap.to(earthGroup.current.rotation, {
//       x: targetX,
//       y: currentY + diffY,
//       z: tiltZ, // This applies the global tilt you requested
//       duration: 2.5,
//       ease: "power2.inOut",
//     });
//   }
// }, [view]);

//   // Handle idle rotation (Existing logic preserved)
//   useFrame((_, delta) => {
//     if (earthGroup.current && view === "globe") {
//       earthGroup.current.rotation.y += delta * 0.15;
//     }
//     if (cloudsRef.current) {
//       cloudsRef.current.rotation.y += delta * 0.18;
//     }
//   });


//   return (
//     <group ref={earthGroup}>
//       {/* Main Earth */}
//       <Sphere args={[100, 128, 128]}>
//         <meshStandardMaterial
//           map={earthColor}
//           normalMap={earthNormal}
//           roughness={0.8}
//         />
//       </Sphere>

//       {/* Clouds Layer */}
//       <Sphere ref={cloudsRef} args={[101.2, 128, 128]}>
//         <meshStandardMaterial
//           map={cloudsTexture}
//           transparent
//           opacity={0.4}
//           depthWrite={false}
//         />
//       </Sphere>

//       {/* Atmosphere */}
//       <Sphere args={[104, 128, 128]}>
//         <meshBasicMaterial
//           color="#4ea9ff"
//           transparent
//           opacity={0.12}
//           side={THREE.BackSide}
//         />
//       </Sphere>
//     </group>
//   );
// }














"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere, useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useAppStore } from "@/store/useAppStore";

const INDIA_GLOBE_TARGET = Object.freeze({ lat: 22.59, lon: 78.96, tiltZ: 0 });
const KERALA_GLOBE_TARGET = Object.freeze({ lat: 10.55, lon: 75.27, tiltZ: -0.15 });
const GLOBE_IDLE_ROTATION_SPEED = 0.08;
const GLOBE_FOCUS_DURATION = 4.2;
const GLOBE_FOCUS_EASE = "power3.inOut";

export default function GlobeScene() {
  const earthGroup = useRef();
  const cloudsRef = useRef();
  const previousViewRef = useRef("globe");
  const { gl } = useThree();
  const { view } = useAppStore();

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
    // eslint-disable-next-line react-hooks/immutability
    if (earthColor) earthColor.colorSpace = THREE.SRGBColorSpace;
  }, [earthColor, earthNormal, cloudsTexture, gl]);

  // FIX 2: Automatic Trigger removed as per request
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setView("india");
  //   }, 2000);
  //   return () => clearTimeout(timer);
  // }, [setView]);

  // Handle Zoom/Rotation to India or Kerala
  useEffect(() => {
    if (earthGroup.current && (view === "india" || view === "kerala")) {
      const targets = {
        india: INDIA_GLOBE_TARGET,
        kerala: KERALA_GLOBE_TARGET,
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
        duration: GLOBE_FOCUS_DURATION,
        ease: GLOBE_FOCUS_EASE,
      });
    }
  }, [view]);

  // Handle idle rotation
  useFrame((_, delta) => {
    if (earthGroup.current && view === "globe") {
      // Rotate the entire group (Earth + Clouds) at the same speed
      earthGroup.current.rotation.y += delta * GLOBE_IDLE_ROTATION_SPEED;
    }
    
    // --- CHANGE MADE HERE ---
    // I removed the separate cloud rotation block. 
    // Since 'cloudsRef' is inside 'earthGroup', it will now 
    // automatically rotate at the exact same speed as the earth.
  });

  // Keep globe cloud layer subtle during close-up views so India remains visible.
  useEffect(() => {
    if (!cloudsRef.current || !cloudsRef.current.material) return;

    const material = cloudsRef.current.material;
    const previousView = previousViewRef.current;
    const CAMERA_ZOOM_DURATION = GLOBE_FOCUS_DURATION;

    gsap.killTweensOf(material);

    if (view === "globe") {
      gsap.to(material, {
        opacity: 0.4,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else if (view === "india" && previousView === "globe") {
      // Fade after zoom starts so clouds disappear during camera move, not before it.
      gsap.to(material, {
        opacity: 0.08,
        delay: CAMERA_ZOOM_DURATION * 0.45,
        duration: CAMERA_ZOOM_DURATION * 0.55,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    } else if (view === "india") {
      gsap.to(material, {
        opacity: 0.08,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else if (view === "kerala") {
      gsap.to(material, {
        opacity: 0.05,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    previousViewRef.current = view;
  }, [view]);

  return (
    <group ref={earthGroup} name="earth-group">
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





