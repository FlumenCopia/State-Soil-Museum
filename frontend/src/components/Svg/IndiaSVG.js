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
      }}
    >
 
   
    </svg>
  );
});

IndiaSVG.displayName = "IndiaSVG";

export default IndiaSVG;
