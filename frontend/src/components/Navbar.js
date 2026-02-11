"use client";

// import { Search } from "lucide-react";

const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-md fixed-top text-white"
      style={{
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="container-xl px-4">
        {/* LEFT BRAND */}
        <div className="d-flex align-items-center gap-2">
          <div className="bg-warning p-1">
            <svg
              className="text-white"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
            </svg>
          </div>

          <div className="lh-1">
            <h1
              className="m-0 fw-bold"
              style={{ fontSize: "12px", letterSpacing: "-0.02em" }}
            >
              SOIL MUSEUM
            </h1>
            <p
              className="m-0 text-uppercase opacity-75"
              style={{ fontSize: "8px", letterSpacing: "0.2em" }}
            >
              State of Kerala
            </p>
          </div>
        </div>

        {/* TOGGLER */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#soilNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* CENTER LINKS */}
        <div
          className="collapse navbar-collapse justify-content-center"
          id="soilNavbar"
        >
          <ul
            className="navbar-nav gap-4 text-uppercase fw-semibold"
            style={{ fontSize: "11px", letterSpacing: "0.15em" }}
          >
            <li className="nav-item">
              <a className="nav-link text-white hover-orange" href="#">
                Interactive Map
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white hover-orange" href="#">
                Portals
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white hover-orange" href="#">
                Visual Archives
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white hover-orange" href="#">
                About
              </a>
            </li>
          </ul>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="d-flex align-items-center gap-4">
          <button className="btn btn-link text-white p-0 hover-orange">
            {/* <Search size={16} /> */}
          </button>

          <button
            className="btn btn-light text-uppercase fw-bold"
            style={{
              fontSize: "10px",
              letterSpacing: "0.15em",
              padding: "8px 20px",
            }}
          >
            Portal Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
