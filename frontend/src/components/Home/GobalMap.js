
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


  const showOverlay =
    (view === "india" || view === "kerala") && indiaRevealReady;

  const isKerala = overlayMapView === "kerala";

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

    if (showOverlay) {
      gsap.timeline()
        .to(blur, { opacity: 1, duration: 0.5 })
        .fromTo(
          overlay,
          { opacity: 0, scale: SCALE_OUT },
          { opacity: 1, scale: SCALE_IN, duration: 0.8 },
          "-=0.3"
        );
    } else {
      gsap.timeline()
        .to(overlay, { opacity: 0, scale: SCALE_OUT, duration: 0.5 })
        .to(blur, { opacity: 0, duration: 0.4 }, "-=0.3");
    }
  }, [showOverlay]);

  /* INDIA ⇄ KERALA SWITCH */

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

  useEffect(() => {
    if (!keralaSvgRef.current || !isKerala) return;

    const svg = keralaSvgRef.current;
    const drawPaths = svg.querySelectorAll(".cls-10");
    const fillPaths = svg.querySelectorAll(".fill-path");

    // Hide colors first
    gsap.set(fillPaths, { opacity: 0 });

    drawPaths.forEach((path) => {
      const length = path.getTotalLength();

      // Prepare stroke animation
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    });

    const tl = gsap.timeline();

    // 1️⃣ Small smooth draw animation
    tl.to(drawPaths, {
      strokeDashoffset: 0,
      duration: 0.8,   // small animation
      ease: "power2.out",
    });

    // 2️⃣ Wait 2 seconds after drawing
    tl.to({}, { duration: 2 });

    // 3️⃣ Reveal colors
    tl.to(fillPaths, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    });

  }, [isKerala]);




  useEffect(() => {
    const container = keralaContainerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(
      "path, polygon, rect"
    );

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
      elements.forEach((el) =>
        el.classList.remove("highlight")
      );
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

      {/* 3D Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <CanvasWrapper>
          <Suspense fallback={null}>
            <GlobeScene />
          </Suspense>
          <Suspense fallback={null}>
            {view === "kerala" && <StateScene />}
          </Suspense>
        </CanvasWrapper>
      </div>

      {/* Blur Layer */}
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

      {/* Overlay */}
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

          {/* INDIA */}
          <div ref={indiaContainerRef} style={{ position: "absolute" }}>
            <IndiaSVG
              width={INDIA_WIDTH}
              height={INDIA_HEIGHT} />
          </div>

          {/* KERALA */}
          <div ref={keralaContainerRef} style={{ opacity: 0 }}>
            <KeralaSVG ref={keralaSvgRef} width={KERALA_WIDTH} height={KERALA_HEIGHT} />
          </div>

        </div>
      </div>

      {/* Buttons */}
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
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.06)";
              e.currentTarget.style.boxShadow = "0 6px 28px rgba(46,204,113,0.6)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(46,204,113,0.4)";
            }}
          >
            🌿 Explore Kerala
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
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.06)";
              e.currentTarget.style.boxShadow = "0 6px 28px rgba(58,123,213,0.6)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(58,123,213,0.4)";
            }}
          >
            ← Back to India
          </button>
        )}
      </div>

      {/* Scroll Sections */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <section id="globe-section" style={{ height: "100vh" }} />
        <section id="india-section" style={{ height: "200vh" }} />
        <section id="kerala-section" style={{ height: "100vh" }} />
      </div>
    </main>
  );
}


