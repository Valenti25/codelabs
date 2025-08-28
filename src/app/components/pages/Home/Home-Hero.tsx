"use client";

import React, { useState, useEffect } from "react";
import { Image } from "@nextui-org/react";
import { motion } from "framer-motion";

import ModelCanvas from "../../ModelsObject/ModelStar";
import content from "@/locales/en/home.json";
import Meteors from "../../ui/meteors";
import { SparklesCore } from "../../ui/SparklesCore";
import { Canvas, ShaderParams } from "../../Canvas/glass";
import { parseLogoImage } from "../../Canvas/parse-logo-image";

import { toast } from "sonner";

interface Logo {
  src: string;
  hoverSrc?: string; 
  alt: string;
}

interface InfiniteMarqueeProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

const LOGO_DATA: Logo[] = [
  { src: "/images/chatgpt-logo.png", hoverSrc: "/images/chatgpt-hover.png", alt: "ChatGPT" },
  { src: "/images/gemini-logo.png", hoverSrc: "/images/gemini-hover.png", alt: "Google Gemini" },
  { src: "/images/poe-logo.png", hoverSrc: "/images/poe-hover.png", alt: "Poe" },
  { src: "/images/apple-intelligent-logo.png", hoverSrc: "/images/apple_intelligence-hover.png", alt: "Apple Intelligence" },
  { src: "/images/mistral-ai-logo.png", hoverSrc: "/images/mistral-hover.png", alt: "Mistral AI" },
  { src: "/images/qwen-logo.png", hoverSrc: "/images/qwen-hover.png", alt: "Qwen" },
  { src: "/images/union-logo.png", hoverSrc: "/images/grok-hover.png", alt: "Union" },
  { src: "/images/deepseek-logo.png", hoverSrc: "/images/deepseek-hover.png", alt: "DeepSeek" },
  { src: "/images/claude-logo.png", hoverSrc: "/images/claude-hover.png", alt: "Claude" },
  { src: "/images/perplexity-logo.png", hoverSrc: "/images/perplexity-hover.png", alt: "Perplexity" },
  { src: "/images/microsoft-copilot-logo.png", hoverSrc: "/images/copilot-hover.png", alt: "Microsoft Copilot" },
];

const DUPLICATE_COUNT = 2;
const DEFAULT_SPEED = 0.4;

function InfiniteMarquee({
  children,
  speed = DEFAULT_SPEED,
  className = "",
}: InfiniteMarqueeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-visible ${className}`} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="marquee-track flex"
        style={{
          animationDuration: `${30 / speed}s`,
          animationPlayState: isHovered ? "paused" : "running",
        }}
      >
        {Array.from({ length: DUPLICATE_COUNT }, (_, index) => (
          <React.Fragment key={index}>{children}</React.Fragment>
        ))}
      </div>

      <style jsx global>{`
        @keyframes hero-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          width: max-content;
          will-change: transform;
          animation-name: hero-marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          overflow: visible;        /* ปล่อยให้ขยายเกินได้ */
          padding-block: 6px;       /* กันโดนขอบบน/ล่างเวลา scale */
          gap: 1rem;                /* กันชนกันนิดหน่อย */
        }
        .logo-item { position: relative; } /* สำหรับ z-index ตอน hover */

        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}

const LogoItem: React.FC<Logo> = ({ src, hoverSrc, alt }) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hoverSrc) return;
    const img = new window.Image();
    img.src = hoverSrc;
  }, [hoverSrc]);

  const displaySrc = hovered && hoverSrc ? hoverSrc : src;

  return (
    <motion.div
      className="logo-item select-none"
      whileHover={{ scale: 1.25 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      aria-label={alt}
      role="img"
    >
      <Image
        src={displaySrc}
        alt={alt}
        className="pointer-events-auto h-9 w-9 flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px] transition-transform duration-150 will-change-transform"
        loading="lazy"
        radius="none"
      />
    </motion.div>
  );
};

const LogoGrid: React.FC = () => (
  <div className="mt-8 flex items-center justify-center gap-4 pr-4 lg:gap-12 lg:pr-12">
    {LOGO_DATA.map((logo, index) => (
      <LogoItem key={`${logo.alt}-${index}`} {...logo} />
    ))}
  </div>
);

/* ---------------------- GradientMask ---------------------- */
const GradientMask: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="overflow-visible"
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

/* ---------------------- HeroContent ---------------------- */
interface HeroContentProps {
  subtitle: string;
  line1: string;
  line2: string;
}

const HeroContent: React.FC<HeroContentProps> = ({ subtitle, line1, line2 }) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [imageData, setImageData] = useState<ImageData | null>(null);

  useEffect(() => {
    const imagePath = "/images/AI_Innovation.webp";
    let cancelled = false;

    const processImage = async () => {
      try {
        setIsProcessing(true);
        const response = await fetch(imagePath);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();
        const file = new File([blob], "AI_Innovation.webp", { type: "image/webp" });
        const { imageData: processedImageData } = await parseLogoImage(file);
        if (!cancelled) setImageData(processedImageData);
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Failed to process logo image for shader.");
      } finally {
        if (!cancelled) setIsProcessing(false);
      }
    };

    processImage();
    return () => {
      cancelled = true;
    };
  }, []);

  const params: ShaderParams = {
    patternScale: 4.5,
    refraction: 0.025,
    edge: 0.35,
    patternBlur: 0.003,
    liquid: 0.07,
    speed: 0.25,
  };

  return (
    <div className="relative z-10 mx-auto w-full px-4 sm:px-8 lg:px-28 py-20 lg:py-52 mt-16">
      <div className="flex w-full m-auto items-center justify-center">
        <div className="w-full max-w-5xl mx-auto mb-32 lg:h-[70vh] absolute">
          <div className="lg:w-[80vh] lg:h-full">
            {isProcessing ? (
              <div className="text-white text-center">Processing Image...</div>
            ) : (
              imageData && <Canvas imageData={imageData} params={params} />
            )}
          </div>
        </div>
      </div>

      <h1 className="mb-3 text-lg leading-tight text-white lg:mt-6 lg:text-[36px]">
        {subtitle}
      </h1>

      <div className="mx-auto max-w-6xl text-xs text-neutral-400 lg:text-lg">
        <p>{line1}</p>
        <p>{line2}</p>
      </div>
    </div>
  );
};

/* ---------------------- Hero ---------------------- */
export default function Hero(): React.ReactElement {
  const heroText = content.hero;
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsModelLoaded(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center px-4 text-center">
      <div className="absolute inset-0 z-0">
        <SparklesCore
          background="transparent"
          minSize={0.2}
          maxSize={0.6}
          particleDensity={1}
          speed={0.15}
          className="h-full w-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full">
        <Meteors number={1} className="opacity-40" />
      </div>

      {isModelLoaded && (
        <div className="pointer-events-none absolute inset-0 z-20 select-none">
          <ModelCanvas />
        </div>
      )}

      <div className="relative z-20 ">
        <HeroContent
          subtitle={heroText.subtitle}
          line1={heroText.line1}
          line2={heroText.line2}
        />
      </div>

      <div className="relative z-30 mx-auto w-[80%] lg:mb-28 lg:max-w-5xl">
        <GradientMask>
          <InfiniteMarquee speed={0.7}>
            <LogoGrid />
          </InfiniteMarquee>
        </GradientMask>
      </div>
    </section>
  );
}
