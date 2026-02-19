"use client";

import { Suspense, useEffect, useRef, useState } from "react";
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
const OVERLAY_POSITION_X_BEFORE = -20;
const OVERLAY_POSITION_Y_BEFORE = 140;
const OVERLAY_POSITION_X_AFTER = 0;
const OVERLAY_POSITION_Y_AFTER = 0;
const OVERLAY_ROTATION_BEFORE = -12;
const OVERLAY_ROTATION_AFTER = 0;
const OUTLINE_DELAY_SECONDS = 0.30;
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
const KERALA_COLOR_CLASS_PATTERN = /^cls-(11|[1-9])$/;
const KERALA_COLOR_DETAILS = Object.freeze({
  "cls-1": { label: "Class 1", color: "#878787", details: "Kerala zone using color class 1." },
  "cls-2": { label: "Class 2", color: "#f805de", details: "Kerala zone using color class 2." },
  "cls-3": { label: "Class 3", color: "#acfbfe", details: "Kerala zone using color class 3." },
  "cls-4": { label: "Class 4", color: "#3335b4", details: "Kerala zone using color class 4." },
  "cls-5": { label: "Class 5", color: "#06b49f", details: "Kerala zone using color class 5." },
  "cls-6": { label: "Class 6", color: "#0f9700", details: "Kerala zone using color class 6." },
  "cls-7": { label: "Class 7", color: "#d0ffcb", details: "Kerala zone using color class 7." },
  "cls-8": { label: "Class 8", color: "#fff60b", details: "Kerala zone using color class 8." },
  "cls-9": { label: "Class 9", color: "#fcc8b0", details: "Kerala zone using color class 9." },
  "cls-10": { label: "Class 10", color: "#000", details: "Kerala zone using color class 10." },
  "cls-11": { label: "Classmkdne 11", color: "#ca0233", details: "Kerala zone using color class 11." },
});

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
  const [activeColorClass, setActiveColorClass] = useState(null);
  const [hoverColorClass, setHoverColorClass] = useState(null);

  const showOverlay = (view === "india" || view === "kerala") && indiaRevealReady;
  const isKerala = overlayMapView === "kerala";
  const shouldRenderIndiaSvg = showOverlay && !isKerala;
  const shouldRenderKeralaSvg = showOverlay && isKerala;
  const selectedColorClass = hoverColorClass || activeColorClass;
  const selectedColorDetails = selectedColorClass
    ? KERALA_COLOR_DETAILS[selectedColorClass]
    : null;

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
      x: OVERLAY_POSITION_X_BEFORE,
      y: OVERLAY_POSITION_Y_BEFORE,
      rotation: isKerala ? OVERLAY_ROTATION_BEFORE : OVERLAY_ROTATION_AFTER,
      transformOrigin: isKerala ? "50% 50%" : "50% 50%",
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
        .to(overlay, {
          opacity: 0,
          scale: SCALE_OUT,
          x: OVERLAY_POSITION_X_BEFORE,
          y: OVERLAY_POSITION_Y_BEFORE,
          rotation: isKerala ? OVERLAY_ROTATION_BEFORE : OVERLAY_ROTATION_AFTER,
          duration: 0.5,
        })
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
      x: OVERLAY_POSITION_X_BEFORE,
      y: OVERLAY_POSITION_Y_BEFORE,
      rotation: OVERLAY_ROTATION_BEFORE,
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
      x: OVERLAY_POSITION_X_AFTER,
      y: OVERLAY_POSITION_Y_AFTER,
      rotation: OVERLAY_ROTATION_AFTER,
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
    if (!container || !showOverlay || !isKerala) return;

    const elements = Array.from(container.querySelectorAll("path, polygon, rect"));
    const getColorClass = (el) =>
      Array.from(el.classList).find((name) => KERALA_COLOR_CLASS_PATTERN.test(name)) ?? null;
    const colorElements = elements.filter((el) => getColorClass(el));

    const paintHighlights = (hoverClass, clickedClass) => {
      colorElements.forEach((el) => {
        el.classList.remove("highlight");
        el.classList.remove("selected-highlight");
      });

      if (clickedClass) {
        colorElements.forEach((el) => {
          if (el.classList.contains(clickedClass)) {
            el.classList.add("selected-highlight");
          }
        });
      }

      if (hoverClass) {
        colorElements.forEach((el) => {
          if (el.classList.contains(hoverClass)) {
            el.classList.add("highlight");
          }
        });
      }
    };

    const handleEnter = (e) => {
      const colorClass = getColorClass(e.currentTarget);
      if (!colorClass) return;
      setHoverColorClass(colorClass);
      paintHighlights(colorClass, activeColorClass);
    };

    const handleLeave = () => {
      setHoverColorClass(null);
      paintHighlights(null, activeColorClass);
    };

    const handleClick = (e) => {
      const colorClass = getColorClass(e.currentTarget);
      if (!colorClass) return;
      setActiveColorClass(colorClass);
      paintHighlights(hoverColorClass, colorClass);
    };

    colorElements.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
      el.addEventListener("click", handleClick);
    });

    paintHighlights(hoverColorClass, activeColorClass);

    return () => {
      colorElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
        el.removeEventListener("click", handleClick);
      });
    };
  }, [isKerala, showOverlay, activeColorClass, hoverColorClass]);

  useEffect(() => {
    if (isKerala) return;
    setActiveColorClass(null);
    setHoverColorClass(null);
  }, [isKerala]);

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

      {isKerala && showOverlay && (
        <aside
          style={{
            position: "fixed",
            top: "50%",
            right: 24,
            transform: "translateY(-50%)",
            zIndex: 60,
            width: "min(320px, 32vw)",
            minWidth: 220,
            background: "rgba(8, 14, 26, 0.8)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 14,
            padding: "14px 14px 12px",
            color: "#f8fafc",
            backdropFilter: "blur(6px)",
            boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
            Kerala Section Details
          </div>
          {selectedColorDetails ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    background: selectedColorDetails.color,
                    border: "1px solid rgba(255,255,255,0.55)",
                    display: "inline-block",
                  }}
                />
                <strong style={{ fontSize: 14 }}>{selectedColorDetails.label}</strong>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.45, opacity: 0.95 }}>
                {selectedColorDetails.details}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, lineHeight: 1.45, opacity: 0.85 }}>
              Hover or click a colored Kerala section to see details.
            </div>
          )}
        </aside>
      )}

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
