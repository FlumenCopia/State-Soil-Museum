// "use client";

// import { Canvas } from "@react-three/fiber";
// import { Suspense } from "react";
// import CameraController from "./CameraController";
// import Lights from "./Lights";

// export default function CanvasWrapper({ children }) {
//   return (
//     <Canvas
//       shadows={false}
//       dpr={[1, 2]}
//       camera={{ fov: 45, near: 0.1, far: 2000 }}
//     >
//       <Suspense fallback={null}>
//         <CameraController />
//         <Lights />
//         {children}
//       </Suspense>
//     </Canvas>
//   );
// }









// // src/components/canvas/CanvasWrapper.jsx
// "use client";

// import { Canvas } from "@react-three/fiber";
// import { Suspense } from "react";
// import { OrbitControls } from "@react-three/drei"; // Add this
// import CameraController from "./CameraController";
// import Lights from "./Lights";
// import MovingStars from "./MovingStars";

// export default function CanvasWrapper({ children }) {
//   return (
//     <Canvas
//       shadows={false}
//       dpr={[1, 2]}
//       camera={{ fov: 45, near: 0.1, far: 5000 }}
//     >
//       <Suspense fallback={null}>
//         <MovingStars /> 
//         <CameraController />
//         <Lights />
//         {children}
        
//         {/* This adds the sliding and rotating interaction */}
//         <OrbitControls 
//           makeDefault 
//           enablePan={false}        // Prevents sliding the globe off-screen
//           enableZoom={true}       // Allows zooming in/out
//           enableDamping={true}    // This is the "Smoothness"
//           dampingFactor={0.05}    // Adjusts how much "weight" the slide has
//           rotateSpeed={0.5}       // How fast it rotates when you drag
//         />
//       </Suspense>
//     </Canvas>
//   );
// }









// "use client";

// import { Canvas } from "@react-three/fiber";
// import { Suspense } from "react";
// import { PresentationControls } from "@react-three/drei";
// import CameraController from "./CameraController";
// import Lights from "./Lights";
// import MovingStars from "./MovingStars";

// export default function CanvasWrapper({ children }) {
//   return (
//     <div style={{ width: "100vw", height: "100vh" }}>
//       <Canvas
//         dpr={[1, 2]}
//         camera={{ fov: 45, near: 0.1, far: 5000 }}
//       >
//         <Suspense fallback={null}>
//           <MovingStars /> 
//           <Lights />
//           <CameraController />
          
//           {/* PresentationControls physically rotates the GLOBE.
//               The camera and lights stay perfectly still. 
//           */}
//           <PresentationControls
//             global={true} 
//             cursor={true}
//             snap={false}
//             speed={2} 
//             zoom={1}
//             polar={[-Math.PI / 3, Math.PI / 3]} // Vertical limits
//             azimuth={[-Infinity, Infinity]}     // Infinite horizontal spin
//             config={{ mass: 2, tension: 170, friction: 26 }} // Smooth inertia
//           >
//             {children}
//           </PresentationControls>
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// }











// "use client";

// import { Canvas } from "@react-three/fiber";
// import { Suspense } from "react";
// import { PresentationControls } from "@react-three/drei";
// import CameraController from "./CameraController";
// import Lights from "./Lights";
// import MovingStars from "./MovingStars";

// export default function CanvasWrapper({ children }) {
//   return (
//     <div style={{ width: "100vw", height: "100vh" }}>
//       <Canvas
//         dpr={[1, 2]}
//         camera={{ fov: 45, near: 0.1, far: 5000 }}
//       >
//         <Suspense fallback={null}>
//           <MovingStars /> 
//           <Lights /> {/* Light is outside, so it stays fixed */}
//           <CameraController />
          
//           <PresentationControls
//             global={true} 
//             cursor={true}
//             snap={false}
//             speed={2} 
//             zoom={1.5} // Allow zooming up to 1.5x
//             polar={[-Math.PI / 3, Math.PI / 3]} 
//             azimuth={[-Infinity, Infinity]} 
//             config={{ mass: 2, tension: 170, friction: 26 }}
//           >
//             {/* We wrap children in a group to ensure scale and rotation apply correctly */}
//             <group scale={1}>
//               {children}
//             </group>
//           </PresentationControls>
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// }






"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CameraController from "./CameraController";
import Lights from "./Lights";
import MovingStars from "./MovingStars";

export default function CanvasWrapper({ children }) {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
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
    </div>
  );
}
