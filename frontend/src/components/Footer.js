export default function Footer() {
  return (
    <footer id="footer" className="pt-5 pb-4 bg-black text-white border-top border-secondary">
      <div className="container py-5">
        <div className="row g-5 mb-5">

          {/* Brand */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="d-flex align-items-center mb-4">
              <div
                className="border border-white d-flex align-items-center justify-content-center me-3"
                style={{ width: 40, height: 40 }}
              >
                <i className="fa-solid fa-mountain text-white"></i>
              </div>
              <div>
                <h6 className="fw-bold text-uppercase mb-0" style={{ letterSpacing: 2 }}>
                  Soil Museum
                </h6>
                <small className="text-secondary fw-bold text-uppercase">
                  Kerala State Portal
                </small>
              </div>
            </div>

            <p className="text-secondary text-uppercase fw-semibold small" style={{ letterSpacing: 1.5 }}>
              Digital preservation of Kerala's pedological heritage and scientific research archives.
            </p>
          </div>

          {/* Navigation */}
          <div className="col-6 col-lg-3">
            <h6 className="fw-bold text-uppercase mb-4" style={{ letterSpacing: 3 }}>
              Navigation
            </h6>
            <ul className="list-unstyled">
              <li className="mb-3">
                <a href="#" className="footer-link">Interactive Maps</a>
              </li>
              <li className="mb-3">
                <a href="#" className="footer-link">Soil Gallery</a>
              </li>
              <li>
                <a href="#" className="footer-link">Virtual Tours</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-6 col-lg-3">
            <h6 className="fw-bold text-uppercase mb-4" style={{ letterSpacing: 3 }}>
              Legal
            </h6>
            <ul className="list-unstyled">
              <li className="mb-3">
                <a href="#" className="footer-link">Privacy Policy</a>
              </li>
              <li className="mb-3">
                <a href="#" className="footer-link">Terms of Use</a>
              </li>
              <li>
                <a href="#" className="footer-link">Data Licensing</a>
              </li>
            </ul>
          </div>

          {/* Journal */}
          <div className="col-12 col-lg-3">
            <h6 className="fw-bold text-uppercase mb-4" style={{ letterSpacing: 3 }}>
              Journal
            </h6>
            <p className="text-secondary text-uppercase fw-bold small mb-3" style={{ letterSpacing: 2 }}>
              Subscribe to academic updates.
            </p>

            <div className="d-flex align-items-center border-bottom border-secondary pb-2">
              <input
                type="email"
                className="form-control bg-transparent border-0 text-white p-0 small fw-bold"
                placeholder="EMAIL ADDRESS"
              />
              <button className="btn btn-link text-white p-0 ms-2">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-4 border-top border-secondary">
          <p className="text-secondary text-uppercase fw-bold small mb-3 mb-md-0" style={{ letterSpacing: 3 }}>
            © 2024 State Soil Museum, Kerala. Department of Soil Survey.
          </p>

          <div className="d-flex gap-4">
            <span className="text-secondary text-uppercase fw-bold small" style={{ letterSpacing: 3 }}>
              Government of Kerala
            </span>
            <span className="text-secondary text-uppercase fw-bold small" style={{ letterSpacing: 3 }}>
              Digital India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
