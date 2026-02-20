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
const OVERLAY_INITIAL_SCALE = 0.52;
const OVERLAY_FINAL_SCALE = 1.1;
const OVERLAY_POSITION_X_BEFORE = -18;
const OVERLAY_POSITION_Y_BEFORE = 130;
const OVERLAY_POSITION_X_AFTER = 0;
const OVERLAY_POSITION_Y_AFTER = 0;
const OVERLAY_ROTATION_BEFORE = -10;
const OVERLAY_ROTATION_AFTER = 0;
const OUTLINE_DELAY_SECONDS = 0.30;
const OUTLINE_DRAW_DURATION = 2.05;
const FILL_REVEAL_DURATION = 0.8;
const ZOOM_DURATION = 1.05;
const BLUR_FADE_IN_DURATION = 0.45;
const BLUR_DELAY_AFTER_ZOOM = 0.06;

const INDIA_WIDTH = "min(82vw, 770px)";
const INDIA_HEIGHT = "87vh";

const KERALA_WIDTH_BEFORE = "min(68vw, 700px)";
const KERALA_HEIGHT_BEFORE = "82vh";

const KERALA_WIDTH_AFTER = "min(92vw, 920px)";
const KERALA_HEIGHT_AFTER = "88vh";

const BG_BLUR = 52;
const BG_SATURATION = 0.72;
const KERALA_COLOR_CLASS_PATTERN = /^cls-(11|[1-9])$/;
const KERALA_COLOR_DETAILS = Object.freeze({
  "cls-1": {
    label: "Red Sandy Soils",
    color: "#878787",
    details: "Well-drained coarse-textured soil seen in selected Kerala regions.",
    image: "/images/hill.jpg",
  },
  "cls-2": {
    label: "Red Loamy Soils",
    color: "#f805de",
    details: "Balanced loamy red soil with moderate moisture-holding capacity.",
    image: "/images/hill.jpg",
  },
  "cls-3": {
    label: "Red and Yellow Soils",
    color: "#acfbfe",
    details: "Mixed red-yellow profile typically requiring organic enrichment.",
    image: "/images/hill.jpg",
  },
  "cls-4": {
    label: "Laterite Soils",
    color: "#3335b4",
    details: "Leached lateritic soil common in high-rainfall and upland belts.",
    image: "/images/hill.jpg",
  },
  "cls-5": {
    label: "Sub Mountain Soils",
    color: "#06b49f",
    details: "Hill-foot and slope soils with variable depth and gravel content.",
    image: "/images/hill.jpg",
  },
  "cls-6": {
    label: "Desert Soils",
    color: "#0f9700",
    details: "Light-textured low-organic soils represented by this mapped class.",
    image: "/images/hill.jpg",
  },
  "cls-7": {
    label: "Grey and Brown Soils",
    color: "#d0ffcb",
    details: "Fine to medium-textured soils with moderate nutrient status.",
    image: "/images/hill.jpg",
  },
  "cls-8": {
    label: "Sandy Loam",
    color: "#fff60b",
    details: "Freely draining sandy-loam profile suitable for multiple crops.",
    image: "/images/hill.jpg",
  },
  "cls-9": {
    label: "Black Soils",
    color: "#fcc8b0",
    details: "Clay-rich darker soils with higher moisture retention.",
    image: "/images/hill.jpg",
  },
  "cls-10": {
    label: "Mixed Red and Black Soils",
    color: "#000",
    details: "Transition zones containing mixed red and black soil traits.",
    image: "/images/hill.jpg",
  },
  "cls-11": {
    label: "Mountain Soils",
    color: "#ca0233",
    details: "Highland soils influenced by slope, rainfall, and forest cover.",
    image: "/images/hill.jpg",
  },
});
const KERALA_CLASS_ORDER = Object.keys(KERALA_COLOR_DETAILS);

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
  const colorElementsRef = useRef([]);
  const activeColorClassRef = useRef(null);
  const hoverColorClassRef = useRef(null);
  const [activeColorClass, setActiveColorClass] = useState(null);
  const [hoverColorClass, setHoverColorClass] = useState(null);
  const [keralaZoomComplete, setKeralaZoomComplete] = useState(false);

  const showOverlay = (view === "india" || view === "kerala") && indiaRevealReady;
  const isKerala = overlayMapView === "kerala";
  const shouldRenderIndiaSvg = showOverlay && !isKerala;
  const shouldRenderKeralaSvg = showOverlay && isKerala;
  const keralaSvgWidth = keralaZoomComplete ? KERALA_WIDTH_AFTER : KERALA_WIDTH_BEFORE;
  const keralaSvgHeight = keralaZoomComplete ? KERALA_HEIGHT_AFTER : KERALA_HEIGHT_BEFORE;
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
      scrub: 1.2,
      invalidateOnRefresh: true,
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
      gsap.to(indiaContainerRef.current, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut",
        overwrite: "auto",
      });
      gsap.to(keralaContainerRef.current, {
        opacity: 1,
        duration: 0.55,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    } else {
      gsap.to(keralaContainerRef.current, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut",
        overwrite: "auto",
      });
      gsap.to(indiaContainerRef.current, {
        opacity: 1,
        duration: 0.55,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    }
  }, [isKerala]);

  // Kerala sequence:
  // small image -> wait 4s -> outline -> color + zoom -> blur background.
  useEffect(() => {
    if (!showOverlay || !keralaSvgRef.current || !isKerala) return;
    setKeralaZoomComplete(false);

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
    tl.eventCallback("onComplete", () => setKeralaZoomComplete(true));

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
    colorElementsRef.current = colorElements;

    const paintHighlights = () => {
      const hoverClass = hoverColorClassRef.current;
      const clickedClass = activeColorClassRef.current;
      colorElementsRef.current.forEach((el) => {
        el.classList.remove("highlight");
        el.classList.remove("selected-highlight");
      });

      if (clickedClass) {
        colorElementsRef.current.forEach((el) => {
          if (el.classList.contains(clickedClass)) {
            el.classList.add("selected-highlight");
          }
        });
      }

      if (hoverClass) {
        colorElementsRef.current.forEach((el) => {
          if (el.classList.contains(hoverClass)) {
            el.classList.add("highlight");
          }
        });
      }
    };

    const handleEnter = (e) => {
      const colorClass = getColorClass(e.currentTarget);
      if (!colorClass) return;
      hoverColorClassRef.current = colorClass;
      setHoverColorClass(colorClass);
      paintHighlights();
    };

    const handleLeave = () => {
      hoverColorClassRef.current = null;
      setHoverColorClass(null);
      paintHighlights();
    };

    const handleClick = (e) => {
      const colorClass = getColorClass(e.currentTarget);
      if (!colorClass) return;
      activeColorClassRef.current = colorClass;
      setActiveColorClass(colorClass);
      paintHighlights();
    };

    colorElements.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
      el.addEventListener("click", handleClick);
    });
    paintHighlights();

    return () => {
      colorElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
        el.removeEventListener("click", handleClick);
      });
      colorElementsRef.current = [];
    };
  }, [isKerala, showOverlay]);

  useEffect(() => {
    const selectedClass = activeColorClassRef.current;
    const hoveredClass = hoverColorClassRef.current;
    colorElementsRef.current.forEach((el) => {
      el.classList.remove("highlight");
      el.classList.remove("selected-highlight");
      if (selectedClass && el.classList.contains(selectedClass)) {
        el.classList.add("selected-highlight");
      }
      if (hoveredClass && el.classList.contains(hoveredClass)) {
        el.classList.add("highlight");
      }
    });
  }, [activeColorClass, hoverColorClass]);

  useEffect(() => {
    if (isKerala) return;
    setActiveColorClass(null);
    setHoverColorClass(null);
    activeColorClassRef.current = null;
    hoverColorClassRef.current = null;
    setKeralaZoomComplete(false);
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
        <div ref={overlayRef} style={{ position: "relative", willChange: "transform, opacity" }}>
          <div ref={indiaContainerRef} style={{ position: "absolute" }}>
            {shouldRenderIndiaSvg && <IndiaSVG width={INDIA_WIDTH} height={INDIA_HEIGHT} />}
          </div>

          <div ref={keralaContainerRef} style={{ opacity: 0 }}>
            {shouldRenderKeralaSvg && (
              <KeralaSVG ref={keralaSvgRef} width={keralaSvgWidth} height={keralaSvgHeight} />
            )}
          </div>
        </div>
      </div>

      {isKerala && showOverlay && (
        <>
          <aside
            style={{
              position: "fixed",
              top: "50%",
              left: 24,
              transform: "translateY(-50%)",
              zIndex: 60,
              width: "min(280px, 26vw)",
              minWidth: 220,
              background: "rgba(8, 14, 26, 0.82)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 14,
              padding: "14px 12px",
              color: "#f8fafc",
              backdropFilter: "blur(6px)",
              boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 10 }}>Kerala Soil Types</div>
            <div style={{ display: "grid", gap: 6 }}>
              {KERALA_CLASS_ORDER.map((className) => {
                const item = KERALA_COLOR_DETAILS[className];
                const isSelected = selectedColorClass === className;
                return (
                  <button
                    key={className}
                    type="button"
                    onClick={() => {
                      activeColorClassRef.current = className;
                      hoverColorClassRef.current = null;
                      setHoverColorClass(null);
                      setActiveColorClass(className);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      textAlign: "left",
                      padding: "7px 8px",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.14)",
                      background: isSelected ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.05)",
                      color: "#f8fafc",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    <span
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: 999,
                        background: item.color,
                        border: "1px solid rgba(255,255,255,0.6)",
                        flex: "0 0 auto",
                      }}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <aside
            style={{
              position: "fixed",
              top: "50%",
              right: 24,
              transform: "translateY(-50%)",
              zIndex: 60,
              width: "min(340px, 32vw)",
              minWidth: 240,
              background: "linear-gradient(145deg, #0f2d40, #081a29)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 16,
              padding: "14px",
              color: "#f8fafc",
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.82, marginBottom: 8 }}>Kerala Soil Data</div>
            {selectedColorDetails ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
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
                <img
                  src={selectedColorDetails.image}
                  alt={selectedColorDetails.label}
                  style={{
                    width: "100%",
                    height: 135,
                    borderRadius: 10,
                    objectFit: "cover",
                    marginBottom: 10,
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                />
                <div style={{ fontSize: 13, lineHeight: 1.45, opacity: 0.95 }}>
                  {selectedColorDetails.details}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 13, lineHeight: 1.45, opacity: 0.85 }}>
                Select a soil type from the left list or hover/click a Kerala section.
              </div>
            )}
          </aside>
        </>
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

