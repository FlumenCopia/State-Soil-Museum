"use client";

// import { ArrowUpRight } from "lucide-react";

const Herosection = () => (
  <section
    className="position-relative vh-100 w-100 overflow-hidden d-flex flex-column justify-content-end px-4"
style={{
  minHeight: "700px",
  paddingBottom: "5rem",
  background: "radial-gradient(circle at top left, #131f1d)"
}}

  >
    {/* Background overlay image */}
    <div
      className="position-absolute top-0 start-0 w-100 h-100"
      style={{
        backgroundImage:
          "url('/images/t3.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        mixBlendMode: "overlay",
        opacity: 0.9,
      }}
    />

    {/* Secondary background image */}
    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center opacity-50 pointer-events-none">
      <img
        src="https://images.unsplash.com/photo-1581093196277-9f608fade195?q=80&w=1200&auto=format&fit=crop"
        alt=""
        className="w-100 h-100 object-fit-cover"
        style={{ filter: "grayscale(100%)" }}
      />
    </div>

    {/* Content */}
    <div className="position-relative z-3 container">
      <div className="d-flex align-items-center gap-2 mb-4">
        <div style={{ width: "12px", height: "4px", backgroundColor: "white" }} />
        <span
          className="text-uppercase fw-bold"
          style={{
            fontSize: "10px",
            letterSpacing: "0.2em",
            color: "white ",
          }}
        >
          Scientific Museum Exhibit
        </span>
      </div>

      <h2
        className="text-white fw-black mb-3"
        style={{
          fontSize: "clamp(3rem, 8vw, 6.5rem)",
          lineHeight: 0.9,
          letterSpacing: "-0.05em",
      textTransform: "uppercase",

        }}
      >
State 
         <br />
       Soil Museum{" "}
        <span
          style={{
            color: "#2ca38b",
            fontFamily: "serif",
            fontStyle: "italic",
          }}
        >
          
        </span>
      </h2>

      <p
        className="text-secondary mb-5"
        style={{
          maxWidth: "420px",
          fontSize: "0.875rem",
          lineHeight: 1.7,
          fontWeight: 500,
        }}
      >
        India's first comprehensive digital soil repository. A sophisticated
        archive of Kerala's geological composition through authentic,
        high-definition analysis of deep earth horizons.
      </p>

      <div className="d-flex flex-column flex-sm-row gap-3">
        {/* <button
          className="btn text-white d-flex align-items-center justify-content-center gap-2 text-uppercase fw-bold"
          style={{
            backgroundColor: "#2ca38b",
            padding: "1rem 2rem",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
          }}
        >
          <span>Explore Map</span>
    
        </button> */}
        <a
          href="/Exploremap"
          className="btn text-uppercase fw-bold explore-map-btn"
          style={{
            padding: "1.5rem 2.5rem",
            fontSize: "0.85rem",
            letterSpacing: "0.15em",
          }}
        >
          <span>Explore Map</span>
        </a>

      </div>
    </div>


  </section>
);

export default Herosection;
