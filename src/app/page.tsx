"use client";
import Navbar from "./components/Navbar/AppNavbar";
import Hero from "./components/pages/Home/Home-Hero";
import dynamic from "next/dynamic";
import LightRays from "./components/ui/LightRays";

const LandingPage = dynamic(
  () =>
    import("./components/pages/Home/Home-Landing").then((mod) => mod.default),
  { ssr: false },
);

const PoweringSearchengineSection = dynamic(
  () =>
    import("./components/pages/Home/Home-PoweringSearchengine").then(
      (mod) => mod.default,
    ),
  { ssr: false },
);

const ChatSaleByAISection = dynamic(
  () =>
    import("./components/pages/Home/ChatSaleByAISection").then(
      (mod) => mod.default,
    ),
  { ssr: false },
);

const ChatsalebyAI = dynamic(
  () =>
    import("./components/pages/Home/Home-ChatsalebyAI").then(
      (mod) => mod.default,
    ),
  { ssr: false },
);

export default function Home() {
  return (
    <>
      <div className="overflow-hidden">
        <div style={{ width: "100%", height: "800px", position: "absolute" }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays z-[-1]"
          />
        </div>
        <Navbar />
        <Hero />
        <LandingPage />
        <PoweringSearchengineSection />
        <ChatSaleByAISection />
        <ChatsalebyAI />
      </div>
    </>
  );
}
