"use client";
import { useRef } from "react";

export default function Indiasoilmap2() {
  const svgRef = useRef(null);

  const handleMouseEnter = (e) => {
    const hoveredColor = window.getComputedStyle(e.target).fill;
    const elements = svgRef.current.querySelectorAll(
      "path, polygon, rect"
    );

    elements.forEach((el) => {
      const elColor = window.getComputedStyle(el).fill;
      if (elColor === hoveredColor) {
        el.classList.add("highlight");
      }
    });
  };

  const handleMouseLeave = () => {
    const elements = svgRef.current.querySelectorAll(
      "path, polygon, rect"
    );
    elements.forEach((el) => el.classList.remove("highlight"));
  };

  return (
    <div className="container">
      <svg
        ref={svgRef}
        viewBox="0 0 720 1080"
        onMouseLeave={handleMouseLeave}
      >
      



       
      </svg>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          height: 100vh;
          background: #f5f5f5;
        }

        svg path,
        svg polygon,
        svg rect {
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .highlight {
          stroke: red;
          stroke-width: 2;
          transform-box: fill-box;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}
