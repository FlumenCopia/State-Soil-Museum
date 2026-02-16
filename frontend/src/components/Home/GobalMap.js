"use client";

import { Suspense, useEffect, useRef } from "react";
import Image from "next/image";
import CanvasWrapper from "@/components/canvas/CanvasWrapper";
import GlobeScene from "@/components/scenes/GlobeScene";
import StateScene from "@/components/scenes/StateScene";
import { useAppStore } from "@/store/useAppStore";
import {
  INDIA_MAP_IMAGE_URL,
} from "@/utils/indiaMapConfig";
import {
  KERALA_MAP_IMAGE_URL,
} from "@/utils/KeralaMapconfig";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const INDIA_OVERLAY_WIDTH = "min(82vw, 770px)";
const INDIA_OVERLAY_MAX_HEIGHT = "87vh";
const INDIA_OVERLAY_OFFSET_X = 32;
const INDIA_OVERLAY_OFFSET_Y = 0;
const INDIA_OVERLAY_SCALE_IN =1.140;
const INDIA_OVERLAY_SCALE_OUT = 0.95;

const KERALA_OVERLAY_WIDTH = "min(72vw, 620px)";
const KERALA_OVERLAY_MAX_HEIGHT = "88vh";
const KERALA_OVERLAY_OFFSET_X = -96;
const KERALA_OVERLAY_OFFSET_Y = 8;

const INDIA_BG_BLUR_PX = 22;
const INDIA_BG_SATURATION = 0.72;
const INDIA_SCROLL_SCRUB = 2.2;
// const OVERLAY_BLUR_FADE_IN_DURATION = 1.6;
const OVERLAY_BLUR_FADE_IN_DURATION = 1.4;
// const OVERLAY_MAP_FADE_IN_DURATION = 2.35;
const OVERLAY_MAP_FADE_IN_DURATION = 2.25;
const OVERLAY_MAP_FADE_IN_DELAY = 0.18;
const OVERLAY_FADE_IN_EASE = "sine.out";
const OVERLAY_MAP_HIDE_DURATION = 0.55;
const OVERLAY_BLUR_HIDE_DURATION = 0.5;


export default function GobalMap() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const indiaRevealReady = useAppStore((s) => s.indiaRevealReady);
  const overlayMapView = useAppStore((s) => s.overlayMapView);
  const scrollRef = useRef(null);
  const blurLayerRef = useRef(null);
  const mapOverlayRef = useRef(null);
  const overlayMode =
    view === "india" || view === "kerala" ? view : null;
  const showMapOverlay = overlayMode !== null && indiaRevealReady;
  const mapImageUrl =
    overlayMapView === "kerala" ? KERALA_MAP_IMAGE_URL : INDIA_MAP_IMAGE_URL;
  const overlayWidth =
    overlayMapView === "kerala" ? KERALA_OVERLAY_WIDTH : INDIA_OVERLAY_WIDTH;
  const overlayMaxHeight =
    overlayMapView === "kerala"
      ? KERALA_OVERLAY_MAX_HEIGHT
      : INDIA_OVERLAY_MAX_HEIGHT;
  const overlayOffsetX =
    overlayMapView === "kerala" ? KERALA_OVERLAY_OFFSET_X : INDIA_OVERLAY_OFFSET_X;
  const overlayOffsetY =
    overlayMapView === "kerala" ? KERALA_OVERLAY_OFFSET_Y : INDIA_OVERLAY_OFFSET_Y;

  useEffect(() => {
    // Register ScrollTrigger only on client side
    gsap.registerPlugin(ScrollTrigger);

    // ScrollTrigger logic
    // When scrolling down to the second section, trigger "india" view with zoom
    
    // Initial state
    setView("globe");

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#india-section",
        start: "top bottom", // Start earlier
        end: "center center", 
        scrub: INDIA_SCROLL_SCRUB, // Slower response for smoother transition
        onEnter: () => setView("india"),
        onLeaveBack: () => setView("globe"),
      });
      
      // DISABLED: Scroll trigger for Kerala to allow button control
      // ScrollTrigger.create({
      //   trigger: "#kerala-section",
      //   start: "top center",
      //   onEnter: () => setView("kerala"),
      //   onLeaveBack: () => setView("india"),
      // });

    }, scrollRef);

    return () => ctx.revert();
  }, [setView]);

  useEffect(() => {
    const blurLayer = blurLayerRef.current;
    const mapOverlay = mapOverlayRef.current;
    if (!blurLayer || !mapOverlay) return;

    gsap.killTweensOf([blurLayer, mapOverlay]);

    if (showMapOverlay) {
      gsap.to(blurLayer, {
        opacity: 1,
        duration: OVERLAY_BLUR_FADE_IN_DURATION,
        ease: OVERLAY_FADE_IN_EASE,
      });

      gsap.to(mapOverlay, {
        opacity: 1,
        scale: INDIA_OVERLAY_SCALE_IN,
        duration: OVERLAY_MAP_FADE_IN_DURATION,
        delay: OVERLAY_MAP_FADE_IN_DELAY,
        ease: OVERLAY_FADE_IN_EASE,
      });
      return;
    }

    gsap.to(mapOverlay, {
      opacity: 0,
      scale: INDIA_OVERLAY_SCALE_OUT,
      duration: OVERLAY_MAP_HIDE_DURATION,
      ease: "power2.inOut",
    });

    gsap.to(blurLayer, {
      opacity: 0,
      duration: OVERLAY_BLUR_HIDE_DURATION,
      delay: 0.05,
      ease: "power2.inOut",
    });
  }, [showMapOverlay, overlayMapView]);

  return (
    <main ref={scrollRef} style={{ width: "100%", position: "relative" }}>
      
      {/* 3D Scene Background - Fixed */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }}>
        <CanvasWrapper >
          {/* Keep globe in its own boundary so it does not blank during other scene loads */}
          <Suspense fallback={null}>
            <GlobeScene />
          </Suspense>
          
          <Suspense fallback={null}>
            {view === "kerala" && <StateScene />}
          </Suspense>
        </CanvasWrapper>
      </div>

      {/* Background blur layer for India soil-map reveal */}
      <div
        ref={blurLayerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 20,
          pointerEvents: "none",
          opacity: 0,
          background: "rgba(6, 10, 18, 0.18)",
          backdropFilter: `blur(${INDIA_BG_BLUR_PX}px) saturate(${INDIA_BG_SATURATION})`,
          WebkitBackdropFilter: `blur(${INDIA_BG_BLUR_PX}px) saturate(${INDIA_BG_SATURATION})`,
          willChange: "opacity",
        }}
      />

      {/* Soil indian  map image on top of blurred background  */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 30,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${overlayOffsetX}px, ${overlayOffsetY}px)`,
        }}
      >
        <div
          ref={mapOverlayRef}
          style={{
            opacity: 0,
            transform: `scale(${INDIA_OVERLAY_SCALE_OUT})`,
            transformOrigin: "center center",
            willChange: "opacity, transform",
          }}
        >
          
          <Image
            src={mapImageUrl}

            width={980}
            height={840}
            priority
            style={{
              width: overlayWidth,
              maxHeight: overlayMaxHeight,
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 14px 35px rgba(0, 0, 0, 0.35))",
            }}
          />
        </div>
        
      </div>

      {/* Soil kerala  map image on top of blurred background  */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 30,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${overlayOffsetX}px, ${overlayOffsetY}px)`,
        }}
      >
        <div
          ref={mapOverlayRef}
          style={{
            opacity: 0,
            transform: `scale(${INDIA_OVERLAY_SCALE_OUT})`,
            transformOrigin: "center center",
            willChange: "opacity, transform",
          }}
        >
          
          <Image
            src={mapImageUrl}
            width={980}
            height={840}
            priority
            style={{
              width: overlayWidth,
              maxHeight: overlayMaxHeight,
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 14px 35px rgba(0, 0, 0, 0.35))",
            }}
          />
        </div>
        
      </div>

      {/* UI Overlay for Interaction Buttons - Fixed on top */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 50,
          pointerEvents: "none", // Let clicks pass through to canvas if not on buttons
          display: "flex",
          justifyContent: "flex-end", // Align to right
          alignItems: "flex-end",     // Align to bottom
          padding: "2rem",            // specific spacing from edges
        }}
      >
        {/* BUTTON: Explore Kerala (Visible only when in India View) */}
        {view === "india" && (
          <button
            onClick={() => setView("kerala")}
            style={{
              pointerEvents: "auto",
              padding: "0.8rem 1.5rem", // Reduced padding
              fontSize: "1rem",         // Reduced font size
              fontWeight: "600",
              color: "#fff",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "30px",     // Smaller radius
              cursor: "pointer",
              boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.3)", // Softer shadow
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "2rem",    // Lift up slightly
              marginRight: "2rem",     // Push in from right
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Explore Kerala
          </button>
        )}

        {/* BUTTON: Back to India (Visible only when in Kerala View) */}
        {view === "kerala" && (
          <button
            onClick={() => setView("india")}
            style={{
              pointerEvents: "auto",
              padding: "0.8rem 1.5rem", // Reduced padding
              fontSize: "1rem",         // Reduced font size
              fontWeight: "600",
              color: "#fff",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "30px",     // Smaller radius
              cursor: "pointer",
              boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.3)", // Softer shadow
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "2rem",    // Lift up slightly
              marginRight: "2rem",     // Push in from right
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Back to India
          </button>
        )}
      </div>

      {/* Scrollable Content Layers - Foreground */}
      <div style={{ position: "relative", zIndex: 10, pointerEvents: "none" }}>
        
        {/* Section 1: Globe / Intro */}
        <section id="globe-section" style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Content overlay if needed */}
        </section>

        {/* Section 2: India / Scroll Target */}
        <section id="india-section" style={{ height: "200vh" }}>
           {/* Increased height for smoother transition */}
        </section>

        {/* Section 3: Kerala (Optional for future) */}
        <section id="kerala-section" style={{ height: "100vh" }}>
        </section>

      </div>
    </main>
  );
}
