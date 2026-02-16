


"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function StateScene() {
  const meshRef = useRef();


  return (
    <mesh ref={meshRef} position={[0, 0, 105]} rotation={[0, 0, 0]}>
    </mesh>
  );
}