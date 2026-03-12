import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import InteractionSound from "@/components/InteractionSound";
import HeroBackgroundMusic from "@/components/HeroBackgroundMusic";
import StartupLoader from "@/components/StartupLoader";

export const metadata = {
  title: "State Soil Museum",
  description: "State Soil Museum",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
            <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
/>

      <body>

        <StartupLoader />
        <InteractionSound />
        <HeroBackgroundMusic />
        {children}
      </body>
    </html>
  );
}
