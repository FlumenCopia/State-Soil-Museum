"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import CanvasWrapper from "@/components/canvas/CanvasWrapper";
import GlobeScene from "@/components/scenes/GlobeScene";
import IndiaScene from "@/components/scenes/IndiaScene";
import StateScene from "@/components/scenes/StateScene";
import { useAppStore } from "@/store/useAppStore";

export default function GobalMap() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    setView("globe");

    const ctx = gsap.context(() => {
      // INDIA SECTION
      ScrollTrigger.create({
        trigger: "/IndiaScene",
        start: "top center",
        end: "bottom center",
        onEnter: () => setView("india"),
        onLeaveBack: () => setView("globe"),
      });

      // KERALA SECTION
      ScrollTrigger.create({
        trigger: "/StateScene",
        start: "top center",
        end: "bottom center",
        onEnter: () => setView("kerala"),
        onLeaveBack: () => setView("india"),
      });
    }, containerRef);

    return () => ctx.revert();
  }, [setView]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <div
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 0,
        }}
      >
        <CanvasWrapper>
          <GlobeScene />
          {view === "india" && <IndiaScene />}
          {view === "kerala" && <StateScene />}
        </CanvasWrapper>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 12,
          zIndex: 10,
        }}
      >
        <button onClick={() => setView("globe")}>Globe</button>
        <button onClick={() => setView("india")}>India</button>
        <button onClick={() => setView("kerala")}>Kerala</button>
      </div>
    </div>
  );
}
