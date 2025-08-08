"use client";
import ModelCanvas from "./ThreeJs/ModelCanvas";
import { Image } from "@nextui-org/react";

const logos = [
  { src: "/IconLogo/chatgpt-logo.png", alt: "chatgpt-logo" },
  { src: "/IconLogo/gemini-logo.png", alt: "gemini-logo" },
  { src: "/IconLogo/poe-logo.png", alt: "poe-logo" },
  { src: "/IconLogo/apple-intelligent-logo.png", alt: "apple-intelligent-logo" },
  { src: "/IconLogo/mistral-ai-logo.png", alt: "mistral-ai-logo" },
  { src: "/IconLogo/qwen-logo.png", alt: "qwen-logo" },
  { src: "/IconLogo/union-logo.png", alt: "union-logo" },
  { src: "/IconLogo/deepseek-logo.png", alt: "deepseek-logo" },
  { src: "/IconLogo/claude-logo.png", alt: "claude-logo" },
  { src: "/IconLogo/perplexity-logo.png", alt: "perplexity-logo" },
  { src: "/IconLogo/microsoft-copilot-logo.png", alt: "microsoft-copilot-logo" },
];

export default function Hero() {
  const scrollingKeyframes = `
    @keyframes scroll {
      to {
        transform: translateX(calc(-100% - 3rem));
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
        
        {/* Gradient Text */}
        <h2 className="gradient-text gradient-text-animated text-5xl font-bold tracking-tight lg:text-8xl">
          AI Innovation
        </h2>
        
        <h1 className="mb-3 mt-10 text-xl text-white lg:text-[40px]">
          From Raw Data to Real-World Impact
        </h1>
        <div className="text-sm text-[#7E7E7E] space-y-2 lg:text-xl">
          <p>Next-Gen AI, from First Byte to Final Launch</p>
          <p>End-to-End AI: From Data to Deployment, Done Right</p>
        </div>
      </div>

      {/* Logo strip */}
      <div
        className="group mx-auto flex w-full max-w-5xl justify-center overflow-hidden lg:my-16"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div className="flex mt-8 w-max animate-[scroll_15s_linear_infinite] group-hover:paused lg:animate-[scroll_15s_linear_infinite]">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              aria-hidden={i === 1}
              className="flex min-w-full shrink-0 items-center justify-center gap-4 px-2 lg:gap-12"
            >
              {logos.map((logo) => (
                <Image
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-9 w-9 flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px]"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
