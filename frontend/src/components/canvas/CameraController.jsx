// "use client";

// import { useThree, useFrame } from "@react-three/fiber";
// import { useEffect } from "react";
// import gsap from "gsap";
// import { useAppStore } from "@/store/useAppStore";

// const CAMERA_POSES = {
// //   globe: {
// //     position: [0, 80, 220],
// //     target: [0, 0, 0],
// //   },
// globe: {
//     position: [0, 0, 320], // Centered and at a distance that fills the frame
//     target: [0, 0, 0],
//   },
//   india: {
//     position: [10, 45, 110],
//     target: [6, 12, 0],
//   },
//   kerala: {
//     position: [0, 25, 60],
//     target: [0, 8, 0],
//   },
// };

// export default function CameraController() {
//   const { camera } = useThree();
//   const view = useAppStore((s) => s.view);

//   useEffect(() => {
//     const pose = CAMERA_POSES[view];
//     if (!pose) return;

//     gsap.to(camera.position, {
//       x: pose.position[0],
//       y: pose.position[1],
//       z: pose.position[2],
//       duration: 1.6,
//       ease: "expo.out",
//     });

//     gsap.to(camera, {
//       onUpdate: () => {
//         camera.lookAt(
//           pose.target[0],
//           pose.target[1],
//           pose.target[2]
//         );
//       },
//       duration: 1.6,
//     });
//   }, [view, camera]);

//   return null;
// }






// "use client";

// import { useThree } from "@react-three/fiber";
// import { useEffect } from "react";
// import gsap from "gsap";
// import { useAppStore } from "@/store/useAppStore";
// import * as THREE from "three";

// const CAMERA_POSES = {
    
//   globe: {
//     position: new THREE.Vector3(0, 0, 320),
//     target: new THREE.Vector3(0, 0, 0),
//   },
//   india: {
//     position: new THREE.Vector3(10, 45, 110),
//     target: new THREE.Vector3(6, 12, 0),
//   },
//   kerala: {
//     position: new THREE.Vector3(0, 25, 60),
//     target: new THREE.Vector3(0, 8, 0),
//   },
// };

// export default function CameraController() {
//   const { camera } = useThree();
//   const view = useAppStore((s) => s.view);

//   useEffect(() => {
//     const pose = CAMERA_POSES[view];
//     if (!pose) return;

    

//     gsap.to(camera.position, {
//       x: pose.position.x,
//       y: pose.position.y,
//       z: pose.position.z,
//       duration: 1.8,
//       ease: "expo.out",
//     });

//     const lookAtTarget = { ...camera.position };

//     gsap.to(lookAtTarget, {
//       x: pose.target.x,
//       y: pose.target.y,
//       z: pose.target.z,
//       duration: 1.8,
//       ease: "expo.out",
//       onUpdate: () => {
//         camera.lookAt(
//           lookAtTarget.x,
//           lookAtTarget.y,
//           lookAtTarget.z
//         );
//       },
//     });
//   }, [view, camera]);

//   return null;
// }








// "use client";

// import { useThree } from "@react-three/fiber";
// import { useEffect } from "react";
// import gsap from "gsap";
// import { useAppStore } from "@/store/useAppStore";
// import * as THREE from "three";

// const CAMERA_POSES = {
//   globe: {
//     position: new THREE.Vector3(0, 0, 320),
//     target: new THREE.Vector3(0, 0, 0),
//   },
//   india: {
//     position: new THREE.Vector3(10, 45, 110),
//     target: new THREE.Vector3(6, 12, 0),
//   },
//   kerala: {
//     position: new THREE.Vector3(0, 25, 60),
//     target: new THREE.Vector3(0, 8, 0),
//   },
// };

// export default function CameraController() {
//   const { camera } = useThree();
//   const view = useAppStore((s) => s.view);

//   useEffect(() => {
//     const pose = CAMERA_POSES[view];
//     if (!pose) return;

//     gsap.to(camera.position, {
//       x: pose.position.x,
//       y: pose.position.y,
//       z: pose.position.z,
//       duration: 1.8,
//       ease: "expo.out",
//     });

//     const lookAtTarget = {
//       x: camera.position.x,
//       y: camera.position.y,
//       z: camera.position.z,
//     };

//     gsap.to(lookAtTarget, {
//       x: pose.target.x,
//       y: pose.target.y,
//       z: pose.target.z,
//       duration: 1.8,
//       ease: "expo.out",
//       onUpdate: () => {
//         camera.lookAt(
//           lookAtTarget.x,
//           lookAtTarget.y,
//           lookAtTarget.z
//         );
//       },
//     });
//   }, [view, camera]);

//   return null;
// }










// "use client";

// import { useThree } from "@react-three/fiber";
// import { useEffect } from "react";
// import gsap from "gsap";
// import { useAppStore } from "@/store/useAppStore";
// import * as THREE from "three";

// const CAMERA_POSES = {
//   globe: {
//     // "Zoomed Out" - Full Globe visible
//     position: new THREE.Vector3(0, 0, 320), 
//     target: new THREE.Vector3(0, 0, 0),
//   },
// //   india: {
// //     // "Zoomed In" - Close up
// //     // Since the globe rotates to face us, we keep the camera centered!
// //     position: new THREE.Vector3(0, 0, 150), 
// //     target: new THREE.Vector3(0, 0, 0),
// //   },
// india: {
// //   position: new THREE.Vector3(0, 0, 150), // Zoomed in straight
//   position: new THREE.Vector3(0, 0, 160), // Zoomed in straight
//   target: new THREE.Vector3(0, 0, 0),
// },
// kerala: {
//     position: [0, 0, 120], // Deep zoom (very close to surface)
//     target: [0, 0, 0],
//   },
// };

// export default function CameraController() {
//   const { camera } = useThree();
//   const view = useAppStore((s) => s.view);

//   useEffect(() => {
//     const pose = CAMERA_POSES[view];
//     if (!pose) return;

//     // Move Camera
//     gsap.to(camera.position, {
//       x: pose.position.x,
//       y: pose.position.y,
//       z: pose.position.z,
//       duration: 2,
//       ease: "power2.inOut",
//     });

//     // Animate LookAt
//     // (We use a proxy object to animate the lookAt target smoothly)
//     const lookAtTarget = { x: 0, y: 0, z: 0 }; // Default center
    
//     gsap.to(lookAtTarget, {
//       x: pose.target.x,
//       y: pose.target.y,
//       z: pose.target.z,
//       duration: 2,
//       ease: "power2.inOut",
//       onUpdate: () => {
//         camera.lookAt(lookAtTarget.x, lookAtTarget.y, lookAtTarget.z);
//       },
//     });
//   }, [view, camera]);

//   return null;
// }








// src/components/canvas/CameraController.jsx
"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAppStore } from "@/store/useAppStore";
import * as THREE from "three";

const CAMERA_TRANSITION_DURATION = 3.8;
const CAMERA_TRANSITION_EASE = "power3.inOut";

const INDIA_CAMERA_POSITION = new THREE.Vector3(0, 0, 167);
const INDIA_CAMERA_TARGET = new THREE.Vector3(0, 0, 0);

const CAMERA_POSES = {
  globe: {
    position: new THREE.Vector3(0, 0, 320), 
    target: new THREE.Vector3(0, 0, 0),
  },
  india: {
    position: INDIA_CAMERA_POSITION,
    target: INDIA_CAMERA_TARGET,
  },
  kerala: {
    // FIX: Changed from [0, 0, 120] to new THREE.Vector3
    // position: new THREE.Vector3(0, 0, 130), 
    position: new THREE.Vector3(0, 0, 125), 
    target: new THREE.Vector3(0, 0, 0),
  },
};

export default function CameraController() {
  const { camera } = useThree();
  const view = useAppStore((s) => s.view);
  const setIndiaRevealReady = useAppStore((s) => s.setIndiaRevealReady);
  const setOverlayMapView = useAppStore((s) => s.setOverlayMapView);
  const lookAtTargetRef = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const pose = CAMERA_POSES[view];
    if (!pose) return;
    const lookAtTarget = lookAtTargetRef.current;

    setIndiaRevealReady(false);

    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(lookAtTarget);

    let cancelled = false;

    gsap.to(camera.position, {
      x: pose.position.x,
      y: pose.position.y,
      z: pose.position.z,
      duration: CAMERA_TRANSITION_DURATION,
      ease: CAMERA_TRANSITION_EASE,
      onComplete: () => {
        if ((view === "india" || view === "kerala") && !cancelled) {
          setOverlayMapView(view);
          setIndiaRevealReady(true);
        }
      },
    });

    gsap.to(lookAtTarget, {
      x: pose.target.x,
      y: pose.target.y,
      z: pose.target.z,
      duration: CAMERA_TRANSITION_DURATION,
      ease: CAMERA_TRANSITION_EASE,
      onUpdate: () => {
        camera.lookAt(
          lookAtTarget.x,
          lookAtTarget.y,
          lookAtTarget.z
        );
      },
    });

    return () => {
      cancelled = true;
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(lookAtTarget);
    };
  }, [view, camera, setIndiaRevealReady, setOverlayMapView]);

  return null;
}
