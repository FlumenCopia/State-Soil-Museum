
"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAppStore } from "@/store/useAppStore";
import * as THREE from "three";

const CAMERA_TRANSITION_DURATION = 3.8;
const CAMERA_TRANSITION_EASE = "power3.inOut";

const INDIA_CAMERA_POSITION = new THREE.Vector3(0, 0, 190);
const INDIA_CAMERA_TARGET = new THREE.Vector3(0, 0, 0);
const INDIA_CAMERA_POSITION_PORTRAIT = new THREE.Vector3(0, 6, 240);
const INDIA_CAMERA_TARGET_PORTRAIT = new THREE.Vector3(0, 4, 0);

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
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const isPortraitIndiaView =
    view === "india" &&
    viewportSize.width > 0 &&
    viewportSize.width <= 1100 &&
    viewportSize.height > viewportSize.width;

  useEffect(() => {
    const updateViewport = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const pose = isPortraitIndiaView
      ? {
          position: INDIA_CAMERA_POSITION_PORTRAIT,
          target: INDIA_CAMERA_TARGET_PORTRAIT,
        }
      : CAMERA_POSES[view];
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
  }, [view, isPortraitIndiaView, camera, setIndiaRevealReady, setOverlayMapView]);

  return null;
}
