import Navbar from './components/pages/Home/Home-Navbar';
import Hero from "./components/pages/Home/Home-Hero";
import LandingPage from "./components/pages/Home/Home-Landing";
import PoweringSearchengineSection  from "./components/pages/Home/Home-PoweringSearchengine";
import ChatSaleByAISection from "./components/pages/Home/ChatSaleByAISection";
import ChatsalebyAI from "./components/pages/Home/Home-ChatsalebyAI";
// import AIHeroSection from "./components/AIHeroSection";

export default function Home() {
  return (
    <>
      <Navbar/>
      <Hero />
      <LandingPage />
      <PoweringSearchengineSection />
      <ChatSaleByAISection />
      <ChatsalebyAI />
      {/* <AIHeroSection /> */}
    </>
  );
}
