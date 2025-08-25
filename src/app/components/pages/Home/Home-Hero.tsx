"use client";

import React, { useRef, useState, useEffect } from "react";
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
  alt: string;
}

interface InfiniteMarqueeProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

const LOGO_DATA: Logo[] = [
    { src: "/images/chatgpt-logo.png", alt: "ChatGPT" },
    { src: "/images/gemini-logo.png", alt: "Google Gemini" },
    { src: "/images/poe-logo.png", alt: "Poe" },
    { src: "/images/apple-intelligent-logo.png", alt: "Apple Intelligence" },
    { src: "/images/mistral-ai-logo.png", alt: "Mistral AI" },
    { src: "/images/qwen-logo.png", alt: "Qwen" },
    { src: "/images/union-logo.png", alt: "Union" },
    { src: "/images/deepseek-logo.png", alt: "DeepSeek" },
    { src: "/images/claude-logo.png", alt: "Claude" },
    { src: "/images/perplexity-logo.png", alt: "Perplexity" },
    { src: "/images/microsoft-copilot-logo.png", alt: "Microsoft Copilot" },
];

const DUPLICATE_COUNT = 2;
const DEFAULT_SPEED = 0.4;

function InfiniteMarquee({
  children,
  speed = DEFAULT_SPEED,
  className = "",
}: InfiniteMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const animationProps = isInView
    ? {
        animationName: 'marquee',
        animationDuration: `${30 / speed}s`,
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        animationPlayState: isHovered ? "paused" : "running",
      }
    : {};

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex"
        style={{
          width: "max-content",
          willChange: "transform",
          ...animationProps,
        }}
      >
        {Array.from({ length: DUPLICATE_COUNT }, (_, index) => (
          <React.Fragment key={index}>{children}</React.Fragment>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

const LogoGrid: React.FC = () => (
  <div className="mt-8 flex items-center justify-center gap-4 pr-4 lg:gap-12 lg:pr-12">
    {LOGO_DATA.map((logo, index) => (
      <motion.div
        key={`${logo.alt}-${index}`}
        whileHover={{ scale: 1.25 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Image
          src={logo.src}
          alt={logo.alt}
          className="pointer-events-none h-9 w-9 flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px]"
          loading="lazy"
        />
      </motion.div>
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

interface HeroContentProps {
  subtitle: string;
  line1: string;
  line2: string;
}

const HeroContent: React.FC<HeroContentProps> = ({
  subtitle,
  line1,
  line2,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [imageData, setImageData] = useState<ImageData | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView) {
      const imagePath = "/images/AI_Innovation.webp";
      setIsProcessing(true);

      const processImage = async () => {
        try {
          const response = await fetch(imagePath);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
          }
          const blob = await response.blob();
          const file = new File([blob], "AI_Innovation.webp", { type: "image/webp" });
          const { imageData: processedImageData } = await parseLogoImage(file);
          setImageData(processedImageData);
        } catch (error) {
          console.error("Error processing image:", error);
          toast.error("Failed to process logo image for shader.");
        } finally {
          setIsProcessing(false);
        }
      };

      processImage();
    }
  }, [isInView]);

  const params: ShaderParams = {
    patternScale: 4.5,
    refraction: 0.025,
    edge: 0.35,
    patternBlur: 0.003,
    liquid: 0.07,
    speed: 0.35,
  };
  return (
    <div
      ref={sectionRef}
      className="relative z-[-1] mx-auto w-full px-28 py-24 mt-28 lg:py-52"
    >
      {isInView && (
        <div className=" flex w-full m-auto items-center justify-center">
          <div className="w-full max-w-5xl mx-auto mb-32 h-[70vh] absolute">
            <div className="w-[80vh] h-full">
              {isProcessing ? (
                <div className="text-white text-center">Processing Image...</div>
              ) : (
                imageData && <Canvas imageData={imageData} params={params} />
              )}
            </div>
          </div>
        </div>
      )}

      <h1 className="mb-3 text-lg leading-tight text-white lg:mt-6 lg:text-[36px]">
        {subtitle}
      </h1>

      <div className="mx-auto max-w-2xl text-xs text-neutral-400 lg:text-lg">
        <p>{line1}</p>
        <p>{line2}</p>
      </div>
    </div>
  );
};

export default function Hero(): React.ReactElement {
  const heroText = content.hero;
  const [isInView, setIsInView] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
          if (entry.isIntersecting) {
            setTimeout(() => setIsModelLoaded(true), 1500);
          } else {
            setIsModelLoaded(false);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center px-4 text-center"
    >
      {isInView && (
        <>
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
        </>
      )}
      {isModelLoaded && (
        <div className="pointer-events-none absolute inset-0 z-20 select-none">
          <ModelCanvas />
        </div>
      )}
      <div className="relative z-20">
        <HeroContent
          subtitle={heroText.subtitle}
          line1={heroText.line1}
          line2={heroText.line2}
        />
      </div>
      <div className="relative z-30 mx-auto w-[80%] mb-28 lg:max-w-5xl">
        <GradientMask>
          <InfiniteMarquee speed={0.7}>
            <LogoGrid />
          </InfiniteMarquee>
        </GradientMask>
      </div>
    </section>
  );
}