"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const Herosection = () => {
  const contentRef = useRef(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const items = content.querySelectorAll("[data-hero-item]");
    gsap.fromTo(
      items,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: "power2.out" }
    );
  }, []);

  const goToIndiaSection = () => {
    const indiaSection = document.getElementById("india-section");
    if (!indiaSection) {
      window.location.href = "/Exploremap";
      return;
    }

    window.dispatchEvent(new CustomEvent("hero:explore-map"));
    indiaSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleExploreClick = (event) => {
    event.preventDefault();
    const content = contentRef.current;
    if (!content) {
      goToIndiaSection();
      return;
    }

    const items = content.querySelectorAll("[data-hero-item]");
    gsap.to(items, {
      opacity: 0,
      y: -16,
      duration: 0.28,
      stagger: 0.04,
      ease: "power2.inOut",
      onComplete: goToIndiaSection,
    });
  };

  return (
    <section
      id="hero-section"
      className="position-relative vh-100 w-100 overflow-hidden d-flex align-items-center justify-content-center px-4"
      style={{ minHeight: "700px", zIndex: 20 }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background:
            "radial-gradient(80% 70% at 50% 52%, rgba(9, 27, 62, 0.18) 0%, rgba(1, 8, 24, 0.48) 52%, rgba(2, 8, 18, 0.78) 100%)",
        }}
      />

      <div ref={contentRef} className="position-relative z-3 container text-center">
        <div
          data-hero-item
          className="d-inline-flex align-items-center justify-content-center gap-2 mb-4"
        >
          <div style={{ width: "16px", height: "2px", backgroundColor: "rgba(255,255,255,0.8)" }} />
          <span
            className="text-uppercase fw-semibold"
            style={{ fontSize: "12px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.86)" }}
          >
            DIGITAL SOIL ATLAS
          </span>
        </div>

        <h1
          data-hero-item
          className="text-white fw-bold mb-4"
          style={{
            fontSize: "clamp(2.7rem, 8vw, 7rem)",
            lineHeight: 0.96,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            textShadow: "0 20px 48px rgba(1, 6, 20, 0.62)",
          }}
        >
          State Soil Museum
        </h1>

        <p
          data-hero-item
          className="mx-auto mb-5"
          style={{
            maxWidth: "780px",
            color: "rgba(240,245,255,0.9)",
            fontSize: "clamp(1.1rem, 1.7vw, 2rem)",
            lineHeight: 1.45,
            fontWeight: 500,
            textShadow: "0 10px 30px rgba(1, 6, 20, 0.55)",
          }}
        >
          Explore Kerala&apos;s soil profiles, horizons, and geochemical layers through an
          interactive globe and map.
        </p>

        <div data-hero-item className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <button
            type="button"
            onClick={handleExploreClick}
            className="btn text-uppercase fw-bold explore-map-btn"
            style={{
              padding: "1.5rem 2.5rem",
              fontSize: "0.85rem",
              letterSpacing: "0.15em",
            }}
          >
            <span>Explore Map</span>
          </button>
        </div>

        <div
          data-hero-item
          style={{ marginTop: "56px", color: "rgba(229,239,255,0.7)", fontSize: "1.9rem" }}
        >
          &bull; Scroll
        </div>
      </div>
    </section>
  );
};

export default Herosection;
