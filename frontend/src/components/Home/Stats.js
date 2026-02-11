"use client";

const Stats = () => (
  <section className="bg-black text-white py-5 px-3">
    <div className="container-xl">
      <div className="row g-4 text-center text-md-start">
        {[
          { label: "Districts Mapped", value: "14+" },
          { label: "Soil Samples", value: "2,500+" },
          { label: "Soil Series", value: "128" },
          { label: "Arable Accuracy", value: "85%" },
        ].map((stat, idx) => (
          <div key={idx} className="col-6 col-md-3 d-flex flex-column">
            <span
              className="fw-black mb-1"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)" }}
            >
              {stat.value}
            </span>
            <span
              className="text-uppercase fw-bold text-secondary"
              style={{
                fontSize: "10px",
                letterSpacing: "0.15em",
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
