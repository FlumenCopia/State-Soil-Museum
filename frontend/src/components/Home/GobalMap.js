"use client";

import CanvasWrapper from "@/components/canvas/CanvasWrapper";
import GlobeScene from "@/components/scenes/GlobeScene";
import IndiaScene from "@/components/scenes/IndiaScene";
import StateScene from "@/components/scenes/StateScene";
import { useAppStore } from "@/store/useAppStore";

export default function GobalMap() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);

  return (
    <>
     <CanvasWrapper>
      {/* ALWAYS keep the globe visible so it doesn't "vanish" */}
      <GlobeScene />
      
      {/* Layer the maps on top of the globe when their state is active */}
      {view === "india" && <IndiaScene />}
      {view === "kerala" && <StateScene />}
    </CanvasWrapper>

      {/* Temporary controls for testing */}
      <div style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 10,
        zIndex: 10
      }}>
        <button onClick={() => setView("globe")}>Globe</button>
        <button onClick={() => setView("india")}>India</button>
        <button onClick={() => setView("kerala")}>Kerala</button>
      </div>
    </>
  );
}
