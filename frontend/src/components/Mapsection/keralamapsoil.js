"use client";

export default function keralamapsoil() {
  return (
    <div className="main-wrapper">
      <div className="sidebar1">
        <div className="logo">🌍 Soil Analysis</div>

<div className="classification">
  <p className="title">CLASSIFICATION</p>

  <div className="item"><span className="dot redSandy"></span> Red Sandy Soils</div>
  <div className="item"><span className="dot redLoamy"></span> Red Loamy Soils</div>
  <div className="item"><span className="dot redYellow"></span> Red and Yellow Soils</div>
  <div className="item"><span className="dot laterite"></span> Laterite Soils</div>
  <div className="item"><span className="dot subMountain"></span> Sub Mountain Soils</div>
  <div className="item"><span className="dot desert"></span> Desert Soils</div>
  <div className="item"><span className="dot greyBrown"></span> Grey and Brown Soils</div>
  <div className="item"><span className="dot sandyLoam"></span> Sandy Loam</div>
  <div className="item"><span className="dot black"></span> Black Soils</div>
  <div className="item"><span className="dot mixed"></span> Mixed Red and Black Soils</div>
  <div className="item"><span className="dot mountain"></span> Mountain Soils</div>
  <div className="item"><span className="dot alluvial"></span> Alluvial Soils</div>
  <div className="item"><span className="dot terai"></span> Terai Soils</div>
  <div className="item"><span className="dot skeletal"></span> Skeletal Soils</div>
  <div className="item"><span className="dot glacier"></span> Glaciers</div>
</div>

      </div>





      <style jsx>{`
        .main-wrapper {
          height: 100vh;
          background: radial-gradient(circle at top left, #1f4d4d, #0e2f2f);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          font-family: Arial, sans-serif;
        }

        /* ================= MAP ================= */
        .map-container {
          width: auto;
          height: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .map-img {
          width: 750px;
          transition: 0.4s ease;
          filter: drop-shadow(0px 25px 20px rgba(0, 0, 0, 0.6));
        }

        .map-img:hover {
          transform: scale(1.05);
        }

        /* ================= SIDEBAR (RIGHT SIDE FIXED) ================= */
 .sidebar1 {
          position: absolute;
          left: 40px;
          top: 50%;
          transform: translateY(-50%);
          width: 260px;
          padding: 25px;
          border-radius: 25px;

          /* GLASS EFFECT */
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);

          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);

          color: white;
        }

      /* RIGHT SIDEBAR POSITION */
.sidebar {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
}

/* CARD DESIGN */
.soil-card {
  width: 320px;
  padding: 25px;
  border-radius: 25px;

  background: linear-gradient(145deg, #0f2d40, #081a29);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);

  color: #e6f2ff;
}

/* HEADING */
.heading {
  font-size: 20px;
  margin-bottom: 20px;
}

.heading span {
  background: linear-gradient(90deg, #2bd4a5, #4fc3f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* TOP SECTION */
.top-section {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

/* PH BOX */
.ph-box {
  background: rgba(255,255,255,0.05);
  padding: 15px;
  border-radius: 15px;
  font-size: 12px;
  width: 130px;
}

.label {
  opacity: 0.6;
  margin-bottom: 5px;
}

.ph {
  color: #2bd4a5;
  margin-bottom: 10px;
}

/* TEXTURE BARS */
.texture-bars {
  display: flex;
  gap: 4px;
  margin: 6px 0;
}

.bar {
  width: 15px;
  height: 8px;
  background: #9ccc65;
  border-radius: 3px;
}

.texture-text {
  font-size: 11px;
  opacity: 0.8;
}

/* IMAGE */
.soil-img {
  width: 140px;
  height: 120px;
  object-fit: cover;
  border-radius: 15px;
}

/* DESCRIPTION */
.description {
  font-size: 13px;
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 15px;
}

/* CROPS */
.crops {
  font-size: 14px;
}

.crops span {
  color: #ffcc66;
  font-weight: bold;
}


        .logo {
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 25px;
        }

        .classification .title {
          font-size: 12px;
          opacity: 0.6;
          margin-bottom: 15px;
          letter-spacing: 1px;
        }

        .item {
          display: flex;
          align-items: center;
          margin: 12px 0;
          font-size: 14px;
          cursor: pointer;
          transition: 0.3s;
        }

        .item:hover {
          transform: translateX(6px);
          opacity: 0.85;
        }

        .dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          margin-right: 10px;
        }
.redSandy { background: #d94c1a; }
.redLoamy { background: #f4b400; }
.redYellow { background: #f6d365; }
.laterite { background: #d95d39; }
.subMountain { background: #e0c44c; }
.desert { background: #f2e2b6; }
.greyBrown { background: #b8a99a; }
.sandyLoam { background: #c68c53; }
.black { background: #3a3a3a; }
.mixed { background: #ff8c42; }
.mountain { background: #cfd8dc; }
.alluvial { background: #2e7d32; }
.terai { background: #9ccc65; }
.skeletal { background: #a5d6d3; }
.glacier { background: #e0f2f1; }


      `}</style>
    </div>
  );
}
