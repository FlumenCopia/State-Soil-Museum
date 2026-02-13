import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import Herosection from "@/components/Herosection";
import Stats from "@/components/Home/Stats";
import Portals from "@/components/Home/Portals";
import Footer from "@/components/Footer";
import GobalMap from "@/components/Home/GobalMap";

export default function Home() {
  return (
    <div >
  {/* <Navbar /> */}
<Herosection />
{/* <Stats /> */}
<Portals />
<GobalMap />
<Footer />
    </div>
  );
}
