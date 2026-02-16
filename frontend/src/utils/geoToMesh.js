// src/utils/geoToMesh.js

import * as topojson from "topojson-client";
import * as THREE from "three";
import { getDistrictName } from "./geoUtils";

/**
 * FINAL, PRODUCTION-SAFE Kerala TopoJSON → Mesh converter
 */
export function topoToDistrictMeshes(
  topoData,
  objectName,
  soilMap,
  soilDefs
) {
  /** @type {THREE.Mesh[]} */
  const meshes = [];

  if (!topoData || !topoData.objects || !topoData.objects[objectName]) {
    console.error("Invalid TopoJSON object:", objectName);
    return meshes;
  }

  const geojson = topojson.feature(
    topoData,
    topoData.objects[objectName]
  );

  geojson.features.forEach((feature) => {
    const districtName = getDistrictName(feature.properties);
    if (!districtName) return;

    const soilId = soilMap[districtName];
    if (!soilId) return;

    const soil = soilDefs.find((s) => s.id === soilId);
    if (!soil) return;

    const material = new THREE.MeshStandardMaterial({
      color: soil.color,
      roughness: 0.6,
      metalness: 0.02
    });

    const buildPolygon = (coordinates) => {
      const shape = new THREE.Shape();
      const [outer, ...holes] = coordinates;

      outer.forEach(([x, y], i) => {
        if (i === 0) shape.moveTo(x, -y);
        else shape.lineTo(x, -y);
      });

      holes.forEach((holeCoords) => {
        const hole = new THREE.Path();
        holeCoords.forEach(([x, y], i) => {
          if (i === 0) hole.moveTo(x, -y);
          else hole.lineTo(x, -y);
        });
        shape.holes.push(hole);
      });

      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 1.5,
        bevelEnabled: false
      });

      const mesh = new THREE.Mesh(geometry, material);

      mesh.userData = {
        district: districtName,
        soilId
      };

      meshes.push(mesh);
    };

    if (feature.geometry.type === "Polygon") {
      buildPolygon(feature.geometry.coordinates);
    }

    if (feature.geometry.type === "MultiPolygon") {
      feature.geometry.coordinates.forEach(buildPolygon);
    }
  });

  return meshes;
}
