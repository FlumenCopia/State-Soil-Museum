
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
const GLOBE_FOCUS_DURATION = 2.2;
const GLOBE_FOCUS_EASE = "power3.inOut";
const GLOBE_POINTER_TILT_X = 0.16;
const GLOBE_POINTER_TILT_Z = 0.12;
const GLOBE_POINTER_FOLLOW = 3.2;
const GLOBE_TEXTURE_ANISOTROPY = 4;
const GLOBE_SURFACE_SEGMENTS = 64;
const GLOBE_CLOUD_SEGMENTS = 56;
const GLOBE_AURA_SEGMENTS = 40;

export default function GlobeScene() {
  const earthGroup = useRef();
  const cloudsRef = useRef();
  const previousViewRef = useRef("globe");
  const pointerTiltRef = useRef({ x: 0, z: 0 });
  const { gl, scene } = useThree();
  const { view } = useAppStore();
  const sceneBackground = useTexture("/images/g.png");
  const earthColor = useTexture("/images/e4-transformed.webp");
  const earthNormal = useTexture("/images/earth_normal.webp");
  const cloudsTexture = useTexture("/images/e1-transformed.webp");

  useEffect(() => {
    if (!sceneBackground) return;
    sceneBackground.colorSpace = THREE.SRGBColorSpace;
    scene.background = sceneBackground;

    return () => {
      if (scene.background === sceneBackground) {
        scene.background = null;
      }
    };
  }, [sceneBackground, scene]);

  useEffect(() => {
    if (sceneBackground) {
      sceneBackground.anisotropy = 1;
      sceneBackground.generateMipmaps = false;
      sceneBackground.minFilter = THREE.LinearFilter;
      sceneBackground.magFilter = THREE.LinearFilter;
      sceneBackground.needsUpdate = true;
    }

    const cappedAnisotropy = Math.min(
      gl.capabilities.getMaxAnisotropy(),
      GLOBE_TEXTURE_ANISOTROPY
    );

    [earthColor, earthNormal, cloudsTexture].forEach((tex) => {
      if (!tex) return;
      tex.anisotropy = cappedAnisotropy;
      tex.needsUpdate = true;
    });

    if (earthColor) earthColor.colorSpace = THREE.SRGBColorSpace;
  }, [sceneBackground, earthColor, earthNormal, cloudsTexture, gl]);
  useEffect(() => {
    const handlePointerMove = (event) => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      const normalizedX = event.clientX / width - 0.5;
      const normalizedY = event.clientY / height - 0.5;

      pointerTiltRef.current.x = -normalizedY * GLOBE_POINTER_TILT_X * 2;
      pointerTiltRef.current.z = -normalizedX * GLOBE_POINTER_TILT_Z * 2;
    };

    const resetPointerTilt = () => {
      pointerTiltRef.current.x = 0;
      pointerTiltRef.current.z = 0;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", resetPointerTilt);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", resetPointerTilt);
    };
  }, []);

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

  useFrame((_, delta) => {
    if (earthGroup.current && view === "globe") {
      earthGroup.current.rotation.y += delta * GLOBE_IDLE_ROTATION_SPEED;
      const followStrength = 1 - Math.exp(-delta * GLOBE_POINTER_FOLLOW);
      earthGroup.current.rotation.x = THREE.MathUtils.lerp(
        earthGroup.current.rotation.x,
        pointerTiltRef.current.x,
        followStrength
      );
      earthGroup.current.rotation.z = THREE.MathUtils.lerp(
        earthGroup.current.rotation.z,
        pointerTiltRef.current.z,
        followStrength
      );
    }
  });
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
      <Sphere args={[100, GLOBE_SURFACE_SEGMENTS, GLOBE_SURFACE_SEGMENTS]}>
        <meshStandardMaterial
          map={earthColor}
          normalMap={earthNormal}
          roughness={0.8}
        />
      </Sphere>

      {/* Clouds Layer */}
      <Sphere ref={cloudsRef} args={[101.2, GLOBE_CLOUD_SEGMENTS, GLOBE_CLOUD_SEGMENTS]}>
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </Sphere>


      <Sphere args={[102, GLOBE_AURA_SEGMENTS, GLOBE_AURA_SEGMENTS]}> 
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





