"use client";

import { useEffect, useRef } from "react";
import CanvasWrapper from "@/components/canvas/CanvasWrapper";
import GlobeScene from "@/components/scenes/GlobeScene";
import IndiaScene from "@/components/scenes/IndiaScene";
import { useAppStore } from "@/store/useAppStore";
import Indiasoilmap2 from "./Indiasoilmap2";

export default function GobalMap() {
  const sectionRef = useRef(null);
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);

  // ✅ Scroll detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setView("india"); // first show 3D India
        } else {
          setView("globe");
        }
      },
      { threshold: 0.6 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [setView]);

  // ✅ After 2 seconds of India → show 2nd image
  useEffect(() => {
    if (view === "india") {
      const timer = setTimeout(() => {
        setView("indiaImage");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [view, setView]);

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
      {/* 🔵 3D Canvas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: view === "indiaImage" ? 0 : 1,
          transition: "opacity 1.5s ease",
        }}
      >
        <CanvasWrapper>
          <GlobeScene />
          {view === "india" && <IndiaScene />}
        </CanvasWrapper>
      </div>


      {/* 🟢 2nd Image */}
      {view === "indiaImage" && (
         <div
style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "black",
            animation: "fadeIn 1.5s forwards",
        }}
        >

       <Indiasoilmap2 />
       </div>
      )}



      {/* Animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
