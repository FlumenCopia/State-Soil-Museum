"use client";

import { Suspense, useEffect, useRef } from "react";
import CanvasWrapper from "@/components/canvas/CanvasWrapper";
import GlobeScene from "@/components/scenes/GlobeScene";
import StateScene from "@/components/scenes/StateScene";
import { useAppStore } from "@/store/useAppStore";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import IndiaSVG from "../Svg/IndiaSVG";
import KeralaSVG from "../Svg/KeralaSVG";

/* CONSTANTS */
const SCALE_IN = 1.14;
const SCALE_OUT = 0.95;

// Kerala overlay controls (position + animation timings)
const OVERLAY_INITIAL_SCALE = 0.42;
const OVERLAY_FINAL_SCALE = 1.1;
const OVERLAY_POSITION_X = 0;
const OVERLAY_POSITION_Y = 0;
const OUTLINE_DELAY_SECONDS = 4;
const OUTLINE_DRAW_DURATION = 1.05;
const FILL_REVEAL_DURATION = 0.8;
const ZOOM_DURATION = 1.05;
const BLUR_FADE_IN_DURATION = 0.45;
const BLUR_DELAY_AFTER_ZOOM = 0.06;

const INDIA_WIDTH = "min(82vw, 770px)";
const INDIA_HEIGHT = "87vh";

const KERALA_WIDTH = "min(72vw, 620px)";
const KERALA_HEIGHT = "88vh";

const BG_BLUR = 22;
const BG_SATURATION = 0.72;

export default function GobalMap() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const indiaRevealReady = useAppStore((s) => s.indiaRevealReady);
  const overlayMapView = useAppStore((s) => s.overlayMapView);

  const scrollRef = useRef(null);
  const blurRef = useRef(null);
  const overlayRef = useRef(null);
  const keralaSvgRef = useRef(null);

  const indiaContainerRef = useRef(null);
  const keralaContainerRef = useRef(null);
  const keralaAnimRef = useRef(null);

  const showOverlay = (view === "india" || view === "kerala") && indiaRevealReady;
  const isKerala = overlayMapView === "kerala";
  const shouldRenderIndiaSvg = showOverlay && !isKerala;
  const shouldRenderKeralaSvg = showOverlay && isKerala;

  /* SCROLL TRIGGER */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    setView("globe");

    ScrollTrigger.create({
      trigger: "#india-section",
      start: "top bottom",
      end: "center center",
      scrub: 2,
      onEnter: () => setView("india"),
      onLeaveBack: () => setView("globe"),
    });
  }, [setView]);

  /* BLUR + OVERLAY ANIMATION */
  useEffect(() => {
    const blur = blurRef.current;
    const overlay = overlayRef.current;
    if (!blur || !overlay) return;

    gsap.killTweensOf([blur, overlay]);
    if (keralaAnimRef.current) {
      keralaAnimRef.current.kill();
      keralaAnimRef.current = null;
    }

    gsap.set(overlay, {
      x: OVERLAY_POSITION_X,
      y: OVERLAY_POSITION_Y,
      transformOrigin: "50% 50%",
    });

    if (showOverlay) {
      if (isKerala) {
        gsap.set(blur, { opacity: 0 });
        gsap.set(overlay, { opacity: 1, scale: OVERLAY_INITIAL_SCALE });
      } else {
        gsap
          .timeline()
          .to(blur, { opacity: 1, duration: 0.5 })
          .fromTo(
            overlay,
            { opacity: 0, scale: SCALE_OUT },
            { opacity: 1, scale: SCALE_IN, duration: 0.8 },
            "-=0.3"
          );
      }
    } else {
      gsap
        .timeline()
        .to(overlay, { opacity: 0, scale: SCALE_OUT, duration: 0.5 })
        .to(blur, { opacity: 0, duration: 0.4 }, "-=0.3");
    }
  }, [showOverlay, isKerala]);

  /* INDIA/KERALA SWITCH */
  useEffect(() => {
    if (!indiaContainerRef.current || !keralaContainerRef.current) return;

    if (isKerala) {
      gsap.to(indiaContainerRef.current, { opacity: 0, duration: 0.4 });
      gsap.to(keralaContainerRef.current, { opacity: 1, duration: 0.5 });
    } else {
      gsap.to(keralaContainerRef.current, { opacity: 0, duration: 0.4 });
      gsap.to(indiaContainerRef.current, { opacity: 1, duration: 0.5 });
    }
  }, [isKerala]);

  // Kerala sequence:
  // small image -> wait 4s -> outline -> color + zoom -> blur background.
  useEffect(() => {
    if (!showOverlay || !keralaSvgRef.current || !isKerala) return;

    const svg = keralaSvgRef.current;
    const drawPaths = svg.querySelectorAll(".cls-10");
    const fillPaths = svg.querySelectorAll(".fill-path");
    const overlay = overlayRef.current;
    const blur = blurRef.current;
    if (!overlay || !blur) return;

    gsap.killTweensOf([overlay, blur]);

    gsap.set(overlay, {
      opacity: 1,
      scale: OVERLAY_INITIAL_SCALE,
      x: OVERLAY_POSITION_X,
      y: OVERLAY_POSITION_Y,
      transformOrigin: "50% 50%",
    });
    gsap.set(blur, { opacity: 0 });
    gsap.set(fillPaths, { opacity: 0 });

    drawPaths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    });

    const tl = gsap.timeline();
    tl.to({}, { duration: OUTLINE_DELAY_SECONDS });
    tl.to(drawPaths, {
      strokeDashoffset: 0,
      duration: OUTLINE_DRAW_DURATION,
      ease: "power2.out",
    });
    tl.to(fillPaths, {
      opacity: 1,
      duration: FILL_REVEAL_DURATION,
      ease: "power2.out",
    });
    tl.to(overlay, {
      scale: OVERLAY_FINAL_SCALE,
      duration: ZOOM_DURATION,
      ease: "power3.out",
    });
    tl.to(
      blur,
      {
        opacity: 1,
        duration: BLUR_FADE_IN_DURATION,
        ease: "power2.out",
      },
      `>+${BLUR_DELAY_AFTER_ZOOM}`
    );

    keralaAnimRef.current = tl;
    return () => {
      tl.kill();
      keralaAnimRef.current = null;
    };
  }, [isKerala, showOverlay]);

  useEffect(() => {
    const container = keralaContainerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll("path, polygon, rect");

    const handleEnter = (e) => {
      const group = e.target.dataset.group;
      if (!group) return;

      elements.forEach((el) => {
        if (el.dataset.group === group) {
          el.classList.add("highlight");
        }
      });
    };

    const handleLeave = () => {
      elements.forEach((el) => el.classList.remove("highlight"));
    };

    elements.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, [overlayMapView]);

  return (
    <main ref={scrollRef} style={{ position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <CanvasWrapper>
          <Suspense fallback={null}>
            <GlobeScene />
          </Suspense>
          <Suspense fallback={null}>{view === "kerala" && <StateScene />}</Suspense>
        </CanvasWrapper>
      </div>

      <div
        ref={blurRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
          opacity: 0,
          pointerEvents: "none",
          backdropFilter: `blur(${BG_BLUR}px) saturate(${BG_SATURATION})`,
        }}
      />

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div ref={overlayRef} style={{ position: "relative" }}>
          <div ref={indiaContainerRef} style={{ position: "absolute" }}>
            {shouldRenderIndiaSvg && <IndiaSVG width={INDIA_WIDTH} height={INDIA_HEIGHT} />}
          </div>

          <div ref={keralaContainerRef} style={{ opacity: 0 }}>
            {shouldRenderKeralaSvg && (
              <KeralaSVG ref={keralaSvgRef} width={KERALA_WIDTH} height={KERALA_HEIGHT} />
            )}
          </div>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 40, right: 40, zIndex: 50 }}>
        {view === "india" && (
          <button
            onClick={() => setView("kerala")}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #1a6b3c, #2ecc71)",
              color: "#fff",
              border: "none",
              borderRadius: "30px",
              fontSize: "15px",
              fontWeight: "600",
              letterSpacing: "0.5px",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(46,204,113,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.06)";
              e.currentTarget.style.boxShadow = "0 6px 28px rgba(46,204,113,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(46,204,113,0.4)";
            }}
          >
            Explore Kerala
          </button>
        )}
        {view === "kerala" && (
          <button
            onClick={() => setView("india")}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #1a3a6b, #3a7bd5)",
              color: "#fff",
              border: "none",
              borderRadius: "30px",
              fontSize: "15px",
              fontWeight: "600",
              letterSpacing: "0.5px",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(58,123,213,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.06)";
              e.currentTarget.style.boxShadow = "0 6px 28px rgba(58,123,213,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(58,123,213,0.4)";
            }}
          >
            Back to India
          </button>
        )}
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>
        <section id="globe-section" style={{ height: "100vh" }} />
        <section id="india-section" style={{ height: "200vh" }} />
        <section id="kerala-section" style={{ height: "100vh" }} />
      </div>
    </main>
  );
}
