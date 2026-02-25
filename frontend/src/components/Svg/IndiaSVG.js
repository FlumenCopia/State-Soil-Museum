"use client";

import { forwardRef } from "react";

const IndiaSVG = forwardRef(({ width, height }, ref) => {
  return (
    <svg
      ref={ref}
      viewBox="0 0 595.28 841.89"
  style={{
    width,
    maxHeight: height,
    height: "auto",

    /* 3D slab position (like your example image) */
    transform: "perspective(1300px) rotateX(42deg) rotateY(-8deg) rotateZ(0deg) translateZ(0px) translateY(0px)",
    transformOrigin: "50% 50%",


    /* depth + highlight */
    filter: `
  drop-shadow(0 1px 0 #d6d6d6)

    `,
  }}
    >

     


    </svg>
  );
});

IndiaSVG.displayName = "IndiaSVG";

export default IndiaSVG;

