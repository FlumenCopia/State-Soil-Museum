"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import GridTrailEffect from "@/components/effects/GridTrailEffect";

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

    const heroSection = document.getElementById("hero-section");
    if (!heroSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      },
      { threshold: 0.45 }
    );

    observer.observe(heroSection);
    return () => observer.disconnect();
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

      <GridTrailEffect />

      <div
        ref={contentRef}
        className="position-relative z-3  text-center"
        style={{ marginTop: "clamp(50px, 20vh, 100px)" }}
      >
        <div
          data-hero-item
          className="d-flex align-items-center justify-content-center gap-3 mb-4 mx-auto"
          style={{ width: "fit-content" }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "clamp(28px, 3.6vw, 44px)",
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.8)",
            }}
          />
          <span
            className="text-uppercase"
            style={{
              fontSize: "clamp(0.85rem, 1vw, 1.1rem)",
              letterSpacing: "0.24em",
              color: "rgba(240, 247, 255, 0.92)",
            }}
          >
            DIGITAL SOIL ATLAS
          </span>
          <span
            aria-hidden="true"
            style={{
              width: "clamp(28px, 3.6vw, 44px)",
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.8)",
            }}
          />
        </div>

        <h1
          data-hero-item
          className="text-white mb-4"
          style={{
            fontSize: "clamp(3rem, 7.2vw, 5.6rem)",
            lineHeight: 0.96,
            letterSpacing: "0.03em",
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
            maxWidth: "700px",
            color: "rgba(240,245,255,0.9)",
            fontSize: "clamp(1.2rem, 1.8vw, 1.3rem)",
            lineHeight: 1.45,
            fontWeight: 200,
            textShadow: "0 10px 30px rgba(1, 6, 20, 0.55)",
                          letterSpacing: "0.1em",

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

      </div>
    </section>
  );
};

export default Herosection;
