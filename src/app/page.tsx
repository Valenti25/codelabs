import Navbar from './components/Navbar'
import Hero from "./components/Hero";
import LandingPage from "./components/LandingPage"
import PoweringSearchengineSection  from "./components/PoweringSearchengineSection"
import ChatSaleByAISection from "./components/ChatSaleByAISection";
// import WhyChooseUs from "./components/WhyChooseUs";
// import AIHeroSection from "./components/AIHeroSection";

export default function Home() {
  return (
    <>
      <Navbar/>
      <Hero />
      <LandingPage />
      <PoweringSearchengineSection />
      <ChatSaleByAISection />
      {/* <WhyChooseUs /> */}
      {/* <AIHeroSection /> */}
    </>
  );
}
