"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import gsap from "gsap";
import { useAppStore } from "@/store/useAppStore";
import * as THREE from "three";

const CAMERA_POSES = {
  globe: {
    position: new THREE.Vector3(0, 0, 320), 
    target: new THREE.Vector3(0, 0, 0),
  },
  india: {
    position: new THREE.Vector3(0, 0, 160), 
    target: new THREE.Vector3(0, 0, 0),
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

  useEffect(() => {
    const pose = CAMERA_POSES[view];
    if (!pose) return;

    // Now .x, .y, .z will work for ALL views including Kerala
    gsap.to(camera.position, {
      x: pose.position.x,
      y: pose.position.y,
      z: pose.position.z,
      duration: 2,
      ease: "power2.inOut",
    });

    const lookAtTarget = { x: 0, y: 0, z: 0 }; 
    
    gsap.to(lookAtTarget, {
      x: pose.target.x,
      y: pose.target.y,
      z: pose.target.z,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(lookAtTarget.x, lookAtTarget.y, lookAtTarget.z);
      },
    });
  }, [view, camera]);

  return null;
}