"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { Image } from "@nextui-org/react";
import ModelCanvas from "./ThreeJs/ModelCanvas";

interface Logo {
  src: string;
  alt: string;
}

interface InfiniteMarqueeProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

const LOGO_DATA: Logo[] = [
  { src: "/IconLogo/chatgpt-logo.png", alt: "ChatGPT" },
  { src: "/IconLogo/gemini-logo.png", alt: "Google Gemini" },
  { src: "/IconLogo/poe-logo.png", alt: "Poe" },
  { src: "/IconLogo/apple-intelligent-logo.png", alt: "Apple Intelligence" },
  { src: "/IconLogo/mistral-ai-logo.png", alt: "Mistral AI" },
  { src: "/IconLogo/qwen-logo.png", alt: "Qwen" },
  { src: "/IconLogo/union-logo.png", alt: "Union" },
  { src: "/IconLogo/deepseek-logo.png", alt: "DeepSeek" },
  { src: "/IconLogo/claude-logo.png", alt: "Claude" },
  { src: "/IconLogo/perplexity-logo.png", alt: "Perplexity" },
  { src: "/IconLogo/microsoft-copilot-logo.png", alt: "Microsoft Copilot" },
];

const DUPLICATE_COUNT = 3;
const DEFAULT_SPEED = 1.5;

function InfiniteMarquee({
  children,
  speed = DEFAULT_SPEED,
  className = "",
}: InfiniteMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef<number>(0);

  const animate = useCallback((): void => {
    const content = contentRef.current;
    if (!content) return;
    const singleContentWidth = content.scrollWidth / DUPLICATE_COUNT;
    positionRef.current -= speed;
    if (Math.abs(positionRef.current) >= singleContentWidth) {
      positionRef.current = 0;
    }
    content.style.transform = `translateX(${positionRef.current}px)`;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed]);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [animate]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={contentRef} className="flex" style={{ width: "max-content" }}>
        {Array.from({ length: DUPLICATE_COUNT }, (_, index) => (
          <React.Fragment key={index}>{children}</React.Fragment>
        ))}
      </div>
    </div>
  );
}

const LogoGrid: React.FC = () => (
  <div className="mt-8 flex items-center justify-center gap-4 pr-4 lg:gap-12 lg:pr-12">
    {LOGO_DATA.map((logo, index) => (
      <Image
        key={`${logo.alt}-${index}`}
        src={logo.src}
        alt={logo.alt}
        className="h-9 w-9 flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px]"
        loading="lazy"
      />
    ))}
  </div>
);

const GradientMask: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      maskImage:
        "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      WebkitMaskImage:
        "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
    }}
  >
    {children}
  </div>
);

const HeroContent: React.FC = () => (
  <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-14 lg:py-40">
    <h2 className="gradient-text gradient-text-animated text-5xl font-bold tracking-tight lg:text-8xl">
      AI Innovation
    </h2>

    <h1 className="mt-4 mb-3 text-xl leading-tight text-white lg:mt-10 lg:text-[40px]">
      From Raw Data to Real-World Impact
    </h1>

    <div className="mx-auto max-w-2xl space-y-2 text-sm text-neutral-400 lg:text-xl">
      <p>Next-Gen AI, from First Byte to Final Launch</p>
      <p>End-to-End AI: From Data to Deployment, Done Right</p>
    </div>
  </div>
);

export default function Hero(): JSX.Element {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 text-center">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <ModelCanvas />
      </div>

      {/* Hero Content */}
      <HeroContent />

      {/* Logo Marquee */}
      <div className="relative z-10 mx-auto w-full max-w-5xl lg:my-16">
        <GradientMask>
          <InfiniteMarquee speed={DEFAULT_SPEED}>
            <LogoGrid />
          </InfiniteMarquee>
        </GradientMask>
      </div>
    </section>
  );
}
