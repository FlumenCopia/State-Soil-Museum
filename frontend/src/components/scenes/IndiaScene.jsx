"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useAppStore } from "@/store/useAppStore";
import { INDIA_MAP_IMAGE_URL } from "@/utils/indiaMapConfig";

const INDIA_LAT = 18.19;
const INDIA_LON = 78.96;
const EARTH_RADIUS = 100;
const MAP_RADIUS = 100.75;
// const MAP_SIZE = [47, 56];
const MAP_SIZE = [45, 54];
const MAP_OFFSET_EAST = 6;
const MAP_OFFSET_NORTH = 3.5;
const CLOUD_SIZE = [80, 80];
const CLOUD_PEAK_OPACITY = 0.26;
const CLOUD_RADIUS_SCALE = 1.32;
const CLOUD_LEFT_SHIFT = 190;
const MAP_VIEWPORT_PADDING = 28;
const MAP_FIT_LERP = 0.18;

// Fine-tune mask edges in screen pixels.
// Positive values trim inward on that edge. Negative values expand outward.
const MASK_INSET_LEFT = 0;
const MASK_INSET_RIGHT = 0;
const MASK_INSET_TOP = 0;
const MASK_INSET_BOTTOM = 0;

const MASK_NUDGE_X = 0;
const MASK_NUDGE_Y = 0;
const MASK_SCALE = 1;

const AUTO_BOUNDS_PADDING = 0;
const ALPHA_THRESHOLD = 8;

const DEFAULT_UV_CROP = Object.freeze({
  offsetX: 0,
  offsetY: 0,
  repeatX: 1,
  repeatY: 1,
});

function getOpaqueBounds(image, padding = AUTO_BOUNDS_PADDING) {
  if (!image?.width || !image?.height || typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;

  context.drawImage(image, 0, 0);
  const { data } = context.getImageData(0, 0, image.width, image.height);

  let minX = image.width;
  let maxX = -1;
  let minY = image.height;
  let maxY = -1;

  for (let y = 0; y < image.height; y += 1) {
    const rowStart = y * image.width * 4;
    for (let x = 0; x < image.width; x += 1) {
      const alpha = data[rowStart + x * 4 + 3];
      if (alpha <= ALPHA_THRESHOLD) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0 || maxY < 0) return null;

  return {
    minX: Math.max(0, minX - padding),
    maxX: Math.min(image.width - 1, maxX + padding),
    minY: Math.max(0, minY - padding),
    maxY: Math.min(image.height - 1, maxY + padding),
  };
}

const MASK_UV_CORNERS = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];

useTexture.preload("/textures/earth/earth_clouds1.jpg");
useTexture.preload(INDIA_MAP_IMAGE_URL);

export default function IndiaScene() {
  const indiaRevealReady = useAppStore((s) => s.indiaRevealReady);
  const indiaMaskReady = useAppStore((s) => s.indiaMaskReady);
  const setIndiaMaskReady = useAppStore((s) => s.setIndiaMaskReady);
  const groupRef = useRef();
  const mapFitRef = useRef();
  const cloudRef = useRef();
  const mapRef = useRef();
  const earthGroupRef = useRef();
  const maskVarsRef = useRef({
    left: Number.NaN,
    top: Number.NaN,
    width: Number.NaN,
    height: Number.NaN,
  });
  const scratchWorldCorner = useRef(new THREE.Vector3());
  const { camera, gl, scene, size } = useThree();

  const rawCloudTexture = useTexture("/textures/earth/earth_clouds1.jpg");
  const rawSoilTexture = useTexture(INDIA_MAP_IMAGE_URL);

  const indiaCenter = useMemo(() => {
    const phi = (90 - INDIA_LAT) * (Math.PI / 180);
    const theta = (INDIA_LON + 180) * (Math.PI / 180);

    return new THREE.Vector3(
      -(EARTH_RADIUS * Math.sin(phi) * Math.cos(theta)),
      EARTH_RADIUS * Math.cos(phi),
      EARTH_RADIUS * Math.sin(phi) * Math.sin(theta)
    );
  }, []);

  const mapBasis = useMemo(() => {
    const basePosition = indiaCenter.clone().setLength(MAP_RADIUS);
    const worldNorth = new THREE.Vector3(0, 1, 0);

    let normal = basePosition.clone().normalize();
    let east = new THREE.Vector3().crossVectors(worldNorth, normal);
    if (east.lengthSq() < 1e-6) east.set(1, 0, 0);
    east.normalize();
    let northTangent = new THREE.Vector3().crossVectors(normal, east).normalize();

    const shiftedPosition = basePosition
      .clone()
      .add(east.clone().multiplyScalar(MAP_OFFSET_EAST))
      .add(northTangent.clone().multiplyScalar(MAP_OFFSET_NORTH))
      .setLength(MAP_RADIUS);

    normal = shiftedPosition.clone().normalize();
    east = new THREE.Vector3().crossVectors(worldNorth, normal);
    if (east.lengthSq() < 1e-6) east.set(1, 0, 0);
    east.normalize();
    northTangent = new THREE.Vector3().crossVectors(normal, east).normalize();

    const basis = new THREE.Matrix4().makeBasis(east, northTangent, normal);
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(basis);

    return {
      position: shiftedPosition,
      quaternion,
    };
  }, [indiaCenter]);

  const mapPosition = useMemo(() => mapBasis.position.clone(), [mapBasis]);
  const cloudPosition = useMemo(() => {
    const outward = mapPosition.clone().setLength(EARTH_RADIUS * CLOUD_RADIUS_SCALE);
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
    return outward.add(right.multiplyScalar(-CLOUD_LEFT_SHIFT));
  }, [camera, mapPosition]);

  const mapQuaternion = useMemo(
    () => mapBasis.quaternion.clone(),
    [mapBasis]
  );

  const mapPositionArr = useMemo(
    () => [mapPosition.x, mapPosition.y, mapPosition.z],
    [mapPosition]
  );
  const cloudPositionArr = useMemo(
    () => [cloudPosition.x, cloudPosition.y, cloudPosition.z],
    [cloudPosition]
  );

  const cloudTexture = useMemo(() => {
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
    const texture = rawCloudTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = maxAnisotropy;
    texture.needsUpdate = true;
    return texture;
  }, [gl, rawCloudTexture]);

  const soilData = useMemo(() => {
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
    const texture = rawSoilTexture.clone();
    const image =
      rawSoilTexture.image ?? rawSoilTexture.source?.data ?? null;

    const texWidth = image?.width ?? 1;
    const texHeight = image?.height ?? 1;
    const bounds = getOpaqueBounds(image) ?? {
      minX: 0,
      maxX: texWidth - 1,
      minY: 0,
      maxY: texHeight - 1,
    };

    const cropWidth = Math.max(1, bounds.maxX - bounds.minX + 1);
    const cropHeight = Math.max(1, bounds.maxY - bounds.minY + 1);
    const uvOffsetX = bounds.minX / texWidth;
    const uvOffsetY = 1 - (bounds.maxY + 1) / texHeight;
    const uvRepeatX = cropWidth / texWidth;
    const uvRepeatY = cropHeight / texHeight;
    const uvCrop = {
      offsetX: uvOffsetX,
      offsetY: uvOffsetY,
      repeatX: uvRepeatX,
      repeatY: uvRepeatY,
    };

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = maxAnisotropy;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.offset.set(uvOffsetX, uvOffsetY);
    texture.repeat.set(uvRepeatX, uvRepeatY);
    texture.needsUpdate = true;
    return {
      texture,
      uvCrop,
    };
  }, [gl, rawSoilTexture]);
  const soilTexture = soilData.texture;
  const soilUvCrop = soilData.uvCrop ?? DEFAULT_UV_CROP;

  useEffect(() => {
    const rootStyle = document.documentElement.style;

    return () => {
      cloudTexture.dispose();
      soilTexture.dispose();
      setIndiaMaskReady(false);
      rootStyle.removeProperty("--india-mask-left");
      rootStyle.removeProperty("--india-mask-top");
      rootStyle.removeProperty("--india-mask-width");
      rootStyle.removeProperty("--india-mask-height");
    };
  }, [cloudTexture, soilTexture, setIndiaMaskReady]);

  useEffect(() => {
    if (!indiaRevealReady) {
      const rootStyle = document.documentElement.style;
      setIndiaMaskReady(false);
      rootStyle.removeProperty("--india-mask-left");
      rootStyle.removeProperty("--india-mask-top");
      rootStyle.removeProperty("--india-mask-width");
      rootStyle.removeProperty("--india-mask-height");
      maskVarsRef.current = {
        left: Number.NaN,
        top: Number.NaN,
        width: Number.NaN,
        height: Number.NaN,
      };
      if (mapRef.current) {
        mapRef.current.material.opacity = 0;
        mapRef.current.scale.setScalar(0.9);
      }
      if (mapFitRef.current) {
        mapFitRef.current.scale.setScalar(1);
      }
      if (cloudRef.current) {
        cloudRef.current.material.opacity = 0;
      }
      return;
    }

    if (!mapRef.current || !cloudRef.current) return;

    mapRef.current.material.opacity = 0;
    cloudRef.current.material.opacity = 0;
    mapRef.current.scale.setScalar(0.9);

    const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    timeline.to(
      cloudRef.current.material,
      {
        opacity: CLOUD_PEAK_OPACITY,
        duration: 1.1,
      },
      0.1
    );

    timeline.to(
      mapRef.current.material,
      {
        opacity: 1,
        duration: 1.05,
        ease: "power3.out",
      },
      0.8
    );

    timeline.to(
      mapRef.current.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.15,
        ease: "power3.out",
      },
      0.75
    );

    timeline.to(
      cloudRef.current.material,
      {
        opacity: 0,
        duration: 1.65,
      },
      1.2
    );

    return () => {
      timeline.kill();
    };
  }, [indiaRevealReady, setIndiaMaskReady]);

  useFrame((_, delta) => {
    if (!earthGroupRef.current) {
      earthGroupRef.current = scene.getObjectByName("earth-group");
    }

    if (groupRef.current && earthGroupRef.current) {
      groupRef.current.quaternion.copy(earthGroupRef.current.quaternion);
    }

    if (!indiaRevealReady) return;

    if (cloudRef.current) {
      cloudRef.current.rotation.z += delta * 0.05;
    }

    if (!mapRef.current || size.width === 0 || size.height === 0) return;

    const uvCrop = soilUvCrop;

    const projectBounds = () => {
      let minX = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      let minY = Number.POSITIVE_INFINITY;
      let maxY = Number.NEGATIVE_INFINITY;

      for (const [u, v] of MASK_UV_CORNERS) {
        const localX =
          ((u - uvCrop.offsetX) / uvCrop.repeatX - 0.5) * MAP_SIZE[0];
        const localY =
          ((v - uvCrop.offsetY) / uvCrop.repeatY - 0.5) * MAP_SIZE[1];

        const ndc = scratchWorldCorner.current
          .set(localX, localY, 0)
          .applyMatrix4(mapRef.current.matrixWorld)
          .project(camera);

        const screenX = ((ndc.x + 1) * 0.5) * size.width;
        const screenY = ((1 - ndc.y) * 0.5) * size.height;

        minX = Math.min(minX, screenX);
        maxX = Math.max(maxX, screenX);
        minY = Math.min(minY, screenY);
        maxY = Math.max(maxY, screenY);
      }

      return { minX, maxX, minY, maxY };
    };

    let { minX, maxX, minY, maxY } = projectBounds();

    if (mapFitRef.current) {
      const projectedWidth = Math.max(1, maxX - minX);
      const projectedHeight = Math.max(1, maxY - minY);
      const maxWidth = Math.max(1, size.width - MAP_VIEWPORT_PADDING * 2);
      const maxHeight = Math.max(1, size.height - MAP_VIEWPORT_PADDING * 2);
      const fitScale = Math.min(1, maxWidth / projectedWidth, maxHeight / projectedHeight);
      const targetScale = THREE.MathUtils.clamp(fitScale, 0.45, 1);
      const currentScale = mapFitRef.current.scale.x;
      const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, MAP_FIT_LERP);
      mapFitRef.current.scale.setScalar(nextScale);

      ({ minX, maxX, minY, maxY } = projectBounds());
    }

    const edgeLeft = minX + MASK_INSET_LEFT;
    const edgeRight = maxX - MASK_INSET_RIGHT;
    const edgeTop = minY + MASK_INSET_TOP;
    const edgeBottom = maxY - MASK_INSET_BOTTOM;

    const width = Math.max(1, edgeRight - edgeLeft);
    const height = Math.max(1, edgeBottom - edgeTop);
    const centerX = edgeLeft + width / 2;
    const centerY = edgeTop + height / 2;
    const tunedWidth = width * MASK_SCALE;
    const tunedHeight = height * MASK_SCALE;
    const left = centerX - tunedWidth / 2 + MASK_NUDGE_X;
    const top = centerY - tunedHeight / 2 + MASK_NUDGE_Y;

    const previous = maskVarsRef.current;
    const deltaLeft = Math.abs(left - previous.left);
    const deltaTop = Math.abs(top - previous.top);
    const deltaWidth = Math.abs(tunedWidth - previous.width);
    const deltaHeight = Math.abs(tunedHeight - previous.height);

    if (
      deltaLeft < 0.5 &&
      deltaTop < 0.5 &&
      deltaWidth < 0.5 &&
      deltaHeight < 0.5
    ) {
      return;
    }

    maskVarsRef.current = {
      left,
      top,
      width: tunedWidth,
      height: tunedHeight,
    };

    const rootStyle = document.documentElement.style;
    rootStyle.setProperty("--india-mask-left", `${left.toFixed(2)}px`);
    rootStyle.setProperty("--india-mask-top", `${top.toFixed(2)}px`);
    rootStyle.setProperty("--india-mask-width", `${tunedWidth.toFixed(2)}px`);
    rootStyle.setProperty("--india-mask-height", `${tunedHeight.toFixed(2)}px`);
    if (!indiaMaskReady) {
      setIndiaMaskReady(true);
    }
  });

  return (
    <group ref={groupRef}>
      <group
        ref={mapFitRef}
        position={mapPositionArr}
        quaternion={mapQuaternion}
      >
        <mesh ref={mapRef}>
          <planeGeometry args={MAP_SIZE} />
          <meshBasicMaterial
            map={soilTexture}
            transparent
            opacity={0}
            side={THREE.FrontSide}
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      <mesh
        ref={cloudRef}
        position={cloudPositionArr}
        quaternion={mapQuaternion}
      >
        <planeGeometry args={CLOUD_SIZE} />
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
