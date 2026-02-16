// src/utils/geoUtils.js

/**
 * Safely extract district name from TopoJSON feature properties
 * Supports multiple Kerala GIS datasets
 */
export function getDistrictName(properties) {
  if (!properties) return null;

  return (
    properties.district ||
    properties.DISTRICT ||
    properties.DIST_NAME ||
    properties.NAME ||
    properties.NAME_2 ||
    null
  );
}
