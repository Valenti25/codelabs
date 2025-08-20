'use client'
import Navbar from "./components/pages/Home/Home-Navbar";
import Hero from "./components/pages/Home/Home-Hero";
import dynamic from 'next/dynamic';

const LandingPage = dynamic(
  () => import('./components/pages/Home/Home-Landing').then((mod) => mod.default),
  { ssr: false }
);

const PoweringSearchengineSection = dynamic(
  () => import('./components/pages/Home/Home-PoweringSearchengine').then((mod) => mod.default),
  { ssr: false }
);

const ChatSaleByAISection = dynamic(
  () => import('./components/pages/Home/ChatSaleByAISection').then((mod) => mod.default),
  { ssr: false }
);

const ChatsalebyAI = dynamic(
  () => import('./components/pages/Home/Home-ChatsalebyAI').then((mod) => mod.default),
  { ssr: false }
);


export default function Home() {
  return (
    <>
      <div className="overflow-hidden">
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