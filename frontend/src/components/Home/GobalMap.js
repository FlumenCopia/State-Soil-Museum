"use client";

import { useEffect, useRef, useState } from "react";
import CanvasWrapper from "@/components/canvas/CanvasWrapper";
import GlobeScene from "@/components/scenes/GlobeScene";
import IndiaScene from "@/components/scenes/IndiaScene";
import StateScene from "@/components/scenes/StateScene";
import { useAppStore } from "@/store/useAppStore";

export default function GobalMap() {
  const sectionRef = useRef(null);

  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);

  const [showButtons, setShowButtons] = useState(false);

  // 👇 Scroll Detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setView("india");      // When visible → show India
          setShowButtons(true);  // Show buttons
        } else {
          setShowButtons(false); // Hide buttons
          setView("globe");      // Back to Globe
        }
      },
      {
        threshold: 0.6, // 60% visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [setView]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* 3D Canvas */}
      <CanvasWrapper>
        {/* Always load globe */}
        <GlobeScene />

        {/* Conditional Scenes */}
        {view === "india" && <IndiaScene />}
        {view === "kerala" && <StateScene />}
      </CanvasWrapper>

      {/* UI Buttons */}
      {showButtons && (
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 15,
            zIndex: 10,
          }}
        >
          <button
            style={buttonStyle}
            onClick={() => setView("india")}
          >
            India
          </button>

          <button
            style={buttonStyle}
            onClick={() => setView("kerala")}
          >
            Kerala
          </button>
        </div>
      )}
    </section>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  background: "#ffffff",
  cursor: "pointer",
  fontWeight: 600,
};
