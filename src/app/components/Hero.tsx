"use client";
import { Image } from "@nextui-org/react";
import { useState, useEffect } from "react";
import ModelCanvas from "./ThreeJs/ModelCanvas";

export default function Hero() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  const scrollingKeyframes = `
    @keyframes scroll {
      to {
        transform: translateX(calc(-100% - 1rem));
      }
    }
  `;

  return (
    <section className="flex flex-col items-center justify-center px-4 text-center">
      <style>{scrollingKeyframes}</style>

      <div className="absolute inset-0 z-0 m-auto">
        <ModelCanvas />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-14 lg:py-40">
        <div className="m-auto flex items-center justify-center">
          <Image
            src="/IconLogo/ai-innovation.png"
            alt="Codelabs AI Logo"
            className="h-auto w-full max-w-[240px] lg:max-w-[522px]"
          />
        </div>
        <h1 className="mb-3 mt-10 text-xl text-white lg:text-[40px]">
          From Raw Data to Real-World Impact
        </h1>
        <div className="text-sm text-[#7E7E7E] space-y-2 lg:text-xl">
          <p>Next-Gen AI, from First Byte to Final Launch</p>
          <p>End-to-End AI: From Data to Deployment, Done Right</p>
        </div>
      </div>

      {isLargeScreen ? (
        // pc
        <div className="flex w-full justify-center lg:my-16">
          <div className="flex max-w-full justify-center gap-4 overflow-x-auto px-4 lg:gap-16">
            <Image
              src="/IconLogo/chatgpt-logo.png"
              alt="chatgpt-logo"
              className="flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px]"
            />
            <Image
              src="/IconLogo/gemini-logo.png"
              alt="gemini-logo"
              className="flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px]"
            />
            <Image 
              src="/IconLogo/poe-logo.png" 
              alt="poe-logo" 
              className="flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px]"
            />
            <Image 
              src="/IconLogo/apple-intelligent-logo.png" 
              alt="apple-intelligent-logo" 
              className="flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px]"
            />
            <Image 
              src="/IconLogo/mistral-ai-logo.png" 
              alt="mistral-ai-logo" 
              className="flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px]"
            />
            <Image 
              src="/IconLogo/qwen-logo.png" 
              alt="qwen-logo" 
              className="flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px]"
            />
            <Image 
              src="/IconLogo/union-logo.png" 
              alt="union-logo" 
              className="flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px]"
            />
            <Image 
              src="/IconLogo/deepseek-logo.png" 
              alt="deepseek-logo" 
              className="flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px]"
            />
            <Image 
              src="/IconLogo/claude-logo.png" 
              alt="claude-logo" 
              className="flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px]"
            />
            <Image 
              src="/IconLogo/perplexity-logo.png" 
              alt="perplexity-logo" 
              className="flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px]"
            />
            <Image 
              src="/IconLogo/microsoft-copilot-logo.png" 
              alt="microsoft-copilot-logo" 
              className="flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px]"
            />
          </div>
        </div>
      ) : (
        // phone
        <div
          className="group flex w-full justify-center overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0, black 10%, black 90%, transparent 100%)",
          }}
        >
          <div className="flex mt-8 w-max animate-[scroll_30s_linear_infinite] group-hover:paused">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                aria-hidden={i === 1}
                className="flex min-w-full shrink-0 justify-around gap-4 px-2"
              >
                <Image src="/IconLogo/chatgpt-logo.png" alt="chatgpt-logo" className="h-9 w-9 flex-shrink-0 object-contain" />
                <Image src="/IconLogo/gemini-logo.png" alt="gemini-logo" className="h-9 w-9 flex-shrink-0 object-contain" />
                <Image src="/IconLogo/poe-logo.png" alt="poe-logo" className="h-9 w-9 flex-shrink-0 object-contain" />
                <Image src="/IconLogo/apple-intelligent-logo.png" alt="apple-intelligent-logo" className="h-9 w-9 flex-shrink-0 object-contain" />
                <Image src="/IconLogo/mistral-ai-logo.png" alt="mistral-ai-logo" className="h-9 w-9 flex-shrink-0 object-contain" />
                <Image src="/IconLogo/qwen-logo.png" alt="qwen-logo" className="h-9 w-9 flex-shrink-0 object-contain" />
                <Image src="/IconLogo/union-logo.png" alt="union-logo" className="h-9 w-9 flex-shrink-0 object-contain" />
                <Image src="/IconLogo/deepseek-logo.png" alt="deepseek-logo" className="h-9 w-9 flex-shrink-0 object-contain" />
                <Image src="/IconLogo/claude-logo.png" alt="claude-logo" className="h-9 w-9 flex-shrink-0 object-contain" />
                <Image src="/IconLogo/perplexity-logo.png" alt="perplexity-logo" className="h-9 w-9 flex-shrink-0 object-contain" />
                <Image src="/IconLogo/microsoft-copilot-logo.png" alt="microsoft-copilot-logo" className="h-9 w-9 flex-shrink-0 object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}