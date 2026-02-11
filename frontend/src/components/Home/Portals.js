
"use client";

const PORTALS = [
  {
    icon: "fa-tractor",
    title: "AGRICULTURE",
    description:
      "Access crop suitability maps, nutrient guides, and localized recommendation systems.",
    features: ["FERTILIZER CALCULATOR", "SUITABILITY INDEX", "FIELD ADVISORIES"],
    link: "ENTER PORTAL",
  },
  {
    icon: "fa-graduation-cap",
    title: "ACADEMIC",
    description:
      "Interactive modeling, virtual tours, and foundational resources on pedology.",
    features: ["VIRTUAL MICROSCOPE", "SOIL HORIZONS", "STUDY GUIDES"],
    link: "START LEARNING",
  },
  {
    icon: "fa-microscope",
    title: "SCIENTIFIC",
    description:
      "High-resolution GIS datasets and analytical reports for pedological research.",
    features: ["GIS SHAPEFILES", "CHEMICAL ARCHIVE", "RAW DATASETS"],
    link: "DATA ACCESS",
  },
];

export default function Portals() {
  return (
        <>

    <section className="py-5 bg-white">
      <div className="container py-5">
        {/* Heading */}
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-uppercase mb-3">
            Specialized Portals
          </h2>
          <div className="mx-auto mb-4" style={{ width: 60, height: 2, background: "#000" }} />
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: 520 }}>
            Scientific tools and curated data designed for the academic and
            agricultural sectors.
          </p>
        </div>

        {/* Cards */}
        <div className="row g-4">
          {PORTALS.map((portal, i) => (
            <div className="col-md-4" key={i}>
              <div className="h-100 p-4 bg-light border-0 shadow-sm portal-card">
                <div className="d-flex align-items-center justify-content-center bg-white shadow-sm mb-4"
                     style={{ width: 48, height: 48 }}>
                  <i className={`fa-solid ${portal.icon} fs-5 text-dark`} />
                </div>

                <h5 className="fw-bold text-uppercase mb-3">
                  {portal.title}
                </h5>

                <p className="text-muted small mb-4">
                  {portal.description}
                </p>

                <ul className="list-unstyled mb-4">
                  {portal.features.map((f, j) => (
                    <li
                      key={j}
                      className="d-flex align-items-center mb-2 fw-bold"
                      style={{ fontSize: 10, letterSpacing: 2 }}
                    >
                      <span
                        className="me-3"
                        style={{
                          width: 8,
                          height: 8,
                          background: "#000",
                          display: "inline-block",
                        }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <button className="btn btn-link p-0 fw-bold text-uppercase text-decoration-none portal-link">
                  {portal.link}
                  <i className="fa-solid fa-arrow-right-long ms-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hover styles */}
 
    </section>

    
           <style jsx>{`
        .portal-card {
          transition: all 0.3s ease;
        }
        .portal-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.15);
        }
        .portal-link:hover {
          color: #0d6efd;
        }
        .portal-link i {
          transition: transform 0.3s ease;
        }
        .portal-link:hover i {
          transform: translateX(6px);
        }
      `}</style>
    </>
  );
}
