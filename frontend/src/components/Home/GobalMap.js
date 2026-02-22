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
const SCALE_OUT = 0.95;

// Overlay controls (position + animation timings)
const OVERLAY_INITIAL_SCALE = 0.52;
const OVERLAY_FINAL_SCALE = 1.1;
const OVERLAY_POSITION_X_BEFORE = -18;
const OVERLAY_POSITION_Y_BEFORE = 130;
const OVERLAY_POSITION_X_AFTER = 0;
const OVERLAY_POSITION_Y_AFTER = 0;
const OVERLAY_ROTATION_BEFORE = -10;
const OVERLAY_ROTATION_AFTER = 0;

// India-specific before/after positioning controls.
const INDIA_OVERLAY_POSITION_X_BEFORE = 0;
const INDIA_OVERLAY_POSITION_Y_BEFORE = 0;
const INDIA_OVERLAY_POSITION_X_AFTER = 0;
const INDIA_OVERLAY_POSITION_Y_AFTER = 0;
const INDIA_OVERLAY_ROTATION_BEFORE = 0;
const INDIA_OVERLAY_ROTATION_AFTER = 0;
const OUTLINE_DELAY_SECONDS = 0.30;
const OUTLINE_DRAW_DURATION = 2.05;
const FILL_REVEAL_DURATION = 0.8;
const ZOOM_DURATION = 1.05;
const BLUR_FADE_IN_DURATION = 0.45;
const BLUR_DELAY_AFTER_ZOOM = 0.06;

const INDIA_WIDTH = "min(82vw, 300px)";
const INDIA_HEIGHT = "57vh";

const KERALA_WIDTH_BEFORE = "min(68vw, 700px)";
const KERALA_HEIGHT_BEFORE = "82vh";

const KERALA_WIDTH_AFTER = "min(92vw, 920px)";
const KERALA_HEIGHT_AFTER = "88vh";

const MAP_BACKDROP_BACKGROUND_KERALA = `
  radial-gradient(120% 95% at 50% 46%, rgba(34, 98, 198, 0.34) 0%, rgba(12, 32, 68, 0.78) 46%, rgba(4, 12, 28, 0.96) 100%),
  radial-gradient(52% 42% at 16% 19%, rgba(92, 170, 255, 0.26) 0%, rgba(92, 170, 255, 0) 72%),
  radial-gradient(44% 36% at 85% 24%, rgba(148, 198, 255, 0.16) 0%, rgba(148, 198, 255, 0) 74%),
  repeating-linear-gradient(118deg, rgba(92, 162, 255, 0.11) 0 1px, transparent 1px 130px),
  repeating-linear-gradient(28deg, rgba(74, 126, 220, 0.1) 0 1px, transparent 1px 130px),
  url('/images/bg.png')
`;
const MAP_BACKDROP_BACKGROUND_INDIA = `
  radial-gradient(120% 95% at 50% 46%, rgba(34, 98, 198, 0.34) 0%, rgba(12, 32, 68, 0.78) 46%, rgba(4, 12, 28, 0.96) 100%),
  radial-gradient(52% 42% at 16% 19%, rgba(92, 170, 255, 0.26) 0%, rgba(92, 170, 255, 0) 72%),
  radial-gradient(44% 36% at 85% 24%, rgba(148, 198, 255, 0.16) 0%, rgba(148, 198, 255, 0) 74%),
  repeating-linear-gradient(118deg, rgba(92, 162, 255, 0.11) 0 1px, transparent 1px 130px),
  repeating-linear-gradient(28deg, rgba(74, 126, 220, 0.1) 0 1px, transparent 1px 130px),
  url('/images/bg2.png')
`;
const MAP_BACKDROP_BOX_SHADOW =
  "inset 0 0 140px rgba(0, 0, 0, 0.72), inset 0 0 240px rgba(2, 8, 24, 0.92)";
const MAP_BACKDROP_SIZE_KERALA =
  "cover, cover, cover, auto, auto, cover";
const MAP_BACKDROP_SIZE_INDIA = "cover, cover, cover, auto, auto, cover";
const MAP_BACKDROP_POSITION_KERALA =
  "center center, left top, right top, center center, center center, 78% 54%";
const MAP_BACKDROP_POSITION_INDIA =
  "center center, left top, right top, center center, center center, center center";
const MAP_BACKDROP_REPEAT_KERALA =
  "no-repeat, no-repeat, no-repeat, repeat, repeat, no-repeat";
const MAP_BACKDROP_REPEAT_INDIA =
  "no-repeat, no-repeat, no-repeat, repeat, repeat, no-repeat";
const INDIA_COLOR_CLASS_PATTERN = /^IndiaSVG-\d+$/;
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
  const indiaSvgRef = useRef(null);

  const indiaContainerRef = useRef(null);
  const keralaContainerRef = useRef(null);
  const keralaAnimRef = useRef(null);
  const indiaAnimRef = useRef(null);
  const colorElementsRef = useRef([]);
  const indiaColorElementsRef = useRef([]);
  const activeColorClassRef = useRef(null);
  const hoverColorClassRef = useRef(null);
  const activeIndiaClassRef = useRef(null);
  const hoverIndiaClassRef = useRef(null);
  const [activeColorClass, setActiveColorClass] = useState(null);
  const [hoverColorClass, setHoverColorClass] = useState(null);
  const [activeIndiaClass, setActiveIndiaClass] = useState(null);
  const [hoverIndiaClass, setHoverIndiaClass] = useState(null);
  const [keralaZoomComplete, setKeralaZoomComplete] = useState(false);
  const [isSoilImageZoomed, setIsSoilImageZoomed] = useState(false);

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
  const activeBackdropBackground = isKerala
    ? MAP_BACKDROP_BACKGROUND_KERALA
    : MAP_BACKDROP_BACKGROUND_INDIA;
  const activeBackdropSize = isKerala ? MAP_BACKDROP_SIZE_KERALA : MAP_BACKDROP_SIZE_INDIA;
  const activeBackdropPosition = isKerala
    ? MAP_BACKDROP_POSITION_KERALA
    : MAP_BACKDROP_POSITION_INDIA;
  const activeBackdropRepeat = isKerala ? MAP_BACKDROP_REPEAT_KERALA : MAP_BACKDROP_REPEAT_INDIA;

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
    if (indiaAnimRef.current) {
      indiaAnimRef.current.kill();
      indiaAnimRef.current = null;
    }
    if (keralaAnimRef.current) {
      keralaAnimRef.current.kill();
      keralaAnimRef.current = null;
    }

    gsap.set(overlay, {
      x: isKerala ? OVERLAY_POSITION_X_BEFORE : INDIA_OVERLAY_POSITION_X_BEFORE,
      y: isKerala ? OVERLAY_POSITION_Y_BEFORE : INDIA_OVERLAY_POSITION_Y_BEFORE,
      rotation: isKerala ? OVERLAY_ROTATION_BEFORE : INDIA_OVERLAY_ROTATION_BEFORE,
      transformOrigin: "50% 50%",
    });

    if (!showOverlay) {
      gsap
        .timeline()
        .to(overlay, {
          opacity: 0,
          scale: SCALE_OUT,
          x: isKerala ? OVERLAY_POSITION_X_BEFORE : INDIA_OVERLAY_POSITION_X_BEFORE,
          y: isKerala ? OVERLAY_POSITION_Y_BEFORE : INDIA_OVERLAY_POSITION_Y_BEFORE,
          rotation: isKerala ? OVERLAY_ROTATION_BEFORE : INDIA_OVERLAY_ROTATION_BEFORE,
          duration: 0.5,
        })
        .to(blur, { opacity: 0, duration: 0.4 }, "-=0.3");
      return;
    }

    gsap.set(overlay, { opacity: 1 });
    if (isKerala) {
      gsap.set(blur, { opacity: 0 });
      gsap.set(overlay, { scale: OVERLAY_INITIAL_SCALE });
    } else {
      gsap.set(blur, { opacity: 0 });
    }
  }, [showOverlay, isKerala]);

  // India sequence:
  // small image -> outline draw -> fill reveal -> zoom to full -> blur background.
  useEffect(() => {
    if (!showOverlay || !indiaSvgRef.current || isKerala) return;

    const svg = indiaSvgRef.current;
    const drawPaths = svg.querySelectorAll(".IndiaSVG-draw-path");
    const fillPaths = svg.querySelectorAll(".IndiaSVG-fill-path");
    const overlay = overlayRef.current;
    const blur = blurRef.current;
    if (!overlay || !blur) return;

    gsap.killTweensOf([overlay, blur]);

    gsap.set(overlay, {
      opacity: 1,
      scale: OVERLAY_INITIAL_SCALE,
      x: INDIA_OVERLAY_POSITION_X_BEFORE,
      y: INDIA_OVERLAY_POSITION_Y_BEFORE,
      rotation: INDIA_OVERLAY_ROTATION_BEFORE,
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
      x: INDIA_OVERLAY_POSITION_X_AFTER,
      y: INDIA_OVERLAY_POSITION_Y_AFTER,
      rotation: INDIA_OVERLAY_ROTATION_AFTER,
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

    indiaAnimRef.current = tl;
    return () => {
      tl.kill();
      indiaAnimRef.current = null;
    };
  }, [isKerala, showOverlay]);

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
      const hasFocusedSection = Boolean(hoverClass || clickedClass);

      container.classList.toggle("kerala-has-focus", hasFocusedSection);
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

    const handleContainerClick = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const clickedColorClass = getColorClass(target);
      if (clickedColorClass) return;

      activeColorClassRef.current = null;
      hoverColorClassRef.current = null;
      setActiveColorClass(null);
      setHoverColorClass(null);
      paintHighlights();
    };

    colorElements.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
      el.addEventListener("click", handleClick);
    });
    container.addEventListener("click", handleContainerClick);
    paintHighlights();

    return () => {
      container.classList.remove("kerala-has-focus");
      container.removeEventListener("click", handleContainerClick);
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
    const container = keralaContainerRef.current;
    if (container) {
      container.classList.toggle("kerala-has-focus", Boolean(selectedClass || hoveredClass));
    }

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
    const container = indiaContainerRef.current;
    if (!container || !showOverlay || isKerala) return;

    const elements = Array.from(container.querySelectorAll("path, polygon, rect"));
    const getColorClass = (el) =>
      Array.from(el.classList).find((name) => INDIA_COLOR_CLASS_PATTERN.test(name)) ?? null;
    const colorElements = elements.filter((el) => getColorClass(el));
    indiaColorElementsRef.current = colorElements;

    const paintHighlights = () => {
      const hoverClass = hoverIndiaClassRef.current;
      const clickedClass = activeIndiaClassRef.current;
      const hasFocusedSection = Boolean(hoverClass || clickedClass);

      container.classList.toggle("india-has-focus", hasFocusedSection);
      indiaColorElementsRef.current.forEach((el) => {
        el.classList.remove("highlight");
        el.classList.remove("selected-highlight");
      });

      if (clickedClass) {
        indiaColorElementsRef.current.forEach((el) => {
          if (el.classList.contains(clickedClass)) {
            el.classList.add("selected-highlight");
          }
        });
      }

      if (hoverClass) {
        indiaColorElementsRef.current.forEach((el) => {
          if (el.classList.contains(hoverClass)) {
            el.classList.add("highlight");
          }
        });
      }
    };

    const handleEnter = (e) => {
      const colorClass = getColorClass(e.currentTarget);
      if (!colorClass) return;
      hoverIndiaClassRef.current = colorClass;
      setHoverIndiaClass(colorClass);
      paintHighlights();
    };

    const handleLeave = () => {
      hoverIndiaClassRef.current = null;
      setHoverIndiaClass(null);
      paintHighlights();
    };

    const handleClick = (e) => {
      const colorClass = getColorClass(e.currentTarget);
      if (!colorClass) return;
      activeIndiaClassRef.current = colorClass;
      setActiveIndiaClass(colorClass);
      paintHighlights();
    };

    const handleContainerClick = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const clickedColorClass = getColorClass(target);
      if (clickedColorClass) return;

      activeIndiaClassRef.current = null;
      hoverIndiaClassRef.current = null;
      setActiveIndiaClass(null);
      setHoverIndiaClass(null);
      paintHighlights();
    };

    const handleDocumentPointerDown = (e) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (container.contains(target)) return;

      activeIndiaClassRef.current = null;
      hoverIndiaClassRef.current = null;
      setActiveIndiaClass(null);
      setHoverIndiaClass(null);
      paintHighlights();
    };

    colorElements.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
      el.addEventListener("click", handleClick);
    });
    container.addEventListener("click", handleContainerClick);
    document.addEventListener("pointerdown", handleDocumentPointerDown);
    paintHighlights();

    return () => {
      container.classList.remove("india-has-focus");
      container.removeEventListener("click", handleContainerClick);
      document.removeEventListener("pointerdown", handleDocumentPointerDown);
      colorElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
        el.removeEventListener("click", handleClick);
      });
      indiaColorElementsRef.current = [];
    };
  }, [isKerala, showOverlay]);

  useEffect(() => {
    const selectedClass = activeIndiaClassRef.current;
    const hoveredClass = hoverIndiaClassRef.current;
    const container = indiaContainerRef.current;
    if (container) {
      container.classList.toggle("india-has-focus", Boolean(selectedClass || hoveredClass));
    }

    indiaColorElementsRef.current.forEach((el) => {
      el.classList.remove("highlight");
      el.classList.remove("selected-highlight");
      if (selectedClass && el.classList.contains(selectedClass)) {
        el.classList.add("selected-highlight");
      }
      if (hoveredClass && el.classList.contains(hoveredClass)) {
        el.classList.add("highlight");
      }
    });
  }, [activeIndiaClass, hoverIndiaClass]);

  useEffect(() => {
    setIsSoilImageZoomed(false);
  }, [selectedColorClass]);

  useEffect(() => {
    if (isKerala) return;
    setActiveColorClass(null);
    setHoverColorClass(null);
    activeColorClassRef.current = null;
    hoverColorClassRef.current = null;
    setKeralaZoomComplete(false);
    setIsSoilImageZoomed(false);
  }, [isKerala]);

  useEffect(() => {
    if (!isKerala) return;
    setActiveIndiaClass(null);
    setHoverIndiaClass(null);
    activeIndiaClassRef.current = null;
    hoverIndiaClassRef.current = null;
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
          background: activeBackdropBackground,
          backgroundSize: activeBackdropSize,
          backgroundPosition: activeBackdropPosition,
          backgroundRepeat: activeBackdropRepeat,
          boxShadow: MAP_BACKDROP_BOX_SHADOW,
          mixBlendMode: "normal",
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
        <div
          ref={overlayRef}
          style={{
            position: "relative",
            display: "grid",
            placeItems: "center",
            willChange: "transform, opacity",
          }}
        >
          <div ref={indiaContainerRef} style={{ gridArea: "1 / 1" }}>
            {shouldRenderIndiaSvg && (
              <IndiaSVG ref={indiaSvgRef} width={INDIA_WIDTH} height={INDIA_HEIGHT} />
            )}
          </div>

          <div ref={keralaContainerRef} style={{ gridArea: "1 / 1", opacity: 0 }}>
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
              background:
                "radial-gradient(140% 110% at 100% 0%, rgba(49, 136, 255, 0.22), rgba(49, 136, 255, 0) 55%), linear-gradient(155deg, rgba(8, 24, 56, 0.9), rgba(4, 14, 38, 0.84) 55%, rgba(7, 30, 72, 0.86) 100%)",
              border: "1px solid rgba(88, 168, 255, 0.45)",
              borderRadius: 18,
              padding: "16px 14px",
              color: "#eaf3ff",
              backdropFilter: "blur(14px) saturate(122%)",
              WebkitBackdropFilter: "blur(14px) saturate(122%)",
              boxShadow:
                "0 0 0 1px rgba(124, 194, 255, 0.24), 0 0 35px rgba(49, 142, 255, 0.32), 0 20px 50px rgba(2, 8, 26, 0.68), inset 0 0 40px rgba(38, 118, 255, 0.18), inset 0 1px 0 rgba(196, 228, 255, 0.32)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                letterSpacing: "0.35px",
                color: "rgba(226, 241, 255, 0.95)",
                marginBottom: 12,
              }}
            >
              Kerala Soil Types
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {KERALA_CLASS_ORDER.map((className) => {
                const item = KERALA_COLOR_DETAILS[className];
                const isSelected = selectedColorClass === className;
                return (
                  <button
                    className={`holo-border soil-type-btn${isSelected ? " soil-type-btn-active" : ""}`}
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
                      gap: 10,
                      width: "100%",
                      textAlign: "left",
                      padding: "9px 10px",
                      borderRadius: 11,
                      border: "none",
                      background: isSelected
                        ? "linear-gradient(135deg, rgba(37, 152, 255, 0.24), rgba(41, 255, 212, 0.2))"
                        : "linear-gradient(135deg, rgba(25, 62, 118, 0.54), rgba(12, 34, 72, 0.42))",
                      color: "#eaf3ff",
                      cursor: "pointer",
                      fontSize: 12.5,
                      boxShadow: isSelected
                        ? "0 0 20px rgba(56, 202, 255, 0.34), inset 0 0 22px rgba(90, 255, 219, 0.22)"
                        : "inset 0 0 18px rgba(50, 119, 224, 0.16)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 999,
                        background: item.color,
                        border: "1px solid rgba(210, 236, 255, 0.72)",
                        flex: "0 0 auto",
                        boxShadow: "0 0 8px rgba(255,255,255,0.26)",
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
              background:
                "radial-gradient(140% 110% at 100% 0%, rgba(49, 136, 255, 0.22), rgba(49, 136, 255, 0) 55%), linear-gradient(155deg, rgba(8, 24, 56, 0.9), rgba(4, 14, 38, 0.84) 55%, rgba(7, 30, 72, 0.86) 100%)",
              border: "1px solid rgba(88, 168, 255, 0.45)",
              borderRadius: 18,
              padding: "16px",
              color: "#eaf3ff",
              backdropFilter: "blur(14px) saturate(122%)",
              WebkitBackdropFilter: "blur(14px) saturate(122%)",
              boxShadow:
                "0 0 0 1px rgba(124, 194, 255, 0.24), 0 0 35px rgba(49, 142, 255, 0.32), 0 20px 50px rgba(2, 8, 26, 0.68), inset 0 0 40px rgba(38, 118, 255, 0.18), inset 0 1px 0 rgba(196, 228, 255, 0.32)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                letterSpacing: "0.35px",
                color: "rgba(226, 241, 255, 0.95)",
                marginBottom: 10,
              }}
            >
              Kerala Soil Data
            </div>
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
                <div
                  style={{
                    width: "100%",
                    height: 135,
                    borderRadius: 12,
                    overflow: "hidden",
                    marginBottom: 10,
                    border: "1px solid rgba(95, 176, 255, 0.4)",
                    boxShadow: "inset 0 0 22px rgba(73, 153, 255, 0.2)",
                  }}
                >
                  <img
                    src={selectedColorDetails.image}
                    alt={selectedColorDetails.label}
                    onClick={() => setIsSoilImageZoomed((prev) => !prev)}
                    title={isSoilImageZoomed ? "Click to reset image zoom" : "Click to zoom image"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: isSoilImageZoomed ? "scale(6)" : "scale(1)",
                      transformOrigin: "center center",
                      transition: "transform 0.25s ease",
                      cursor: isSoilImageZoomed ? "zoom-out" : "zoom-in",
                    }}
                  />
                </div>
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
            className="holo-border holo-action-btn map-pill-btn"
            onClick={() => setView("kerala")}
          >
            Explore Kerala
          </button>
        )}
        {view === "kerala" && (
          <button
            className="holo-border holo-action-btn map-pill-btn"
            onClick={() => setView("india")}
          >
            Back to India
          </button>
        )}
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>
        <section id="globe-section" style={{ height: "100vh" }} />
        <section id="india-section" style={{ height: "100vh" }} />
        <section id="kerala-section" style={{ height: "100vh" }} />
      </div>
    </main>
  );
}

