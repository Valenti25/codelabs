"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { Image } from "@nextui-org/react";
import ModelCanvas from "../../ModelsObject/ModelStar";
import content from "@/locales/en/home.json";
import Meteors from "../../ui/meteors";
import { SparklesCore } from "../../ui/SparklesCore";

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
        className="pointer-events-none h-9 w-9 flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px]"
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

interface HeroContentProps {
  title: string;
  subtitle: string;
  line1: string;
  line2: string;
}

const HeroContent: React.FC<HeroContentProps> = ({
  subtitle,
  line1,
  line2,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = async () => {
      try {
        video.muted = true; // ย้ำให้ชัวร์
        video.setAttribute("playsinline", "true"); // กัน Safari เปิด fullscreen เอง
        await video.play();
        video.playbackRate = 0.7; // ค่อยเซ็ตหลังจากเล่นสำเร็จ
      } catch (err) {
        console.log("Autoplay ถูกบล็อก:", err);
      }
    };

    // หน่วงนิดหน่อยเพื่อให้ DOM พร้อมก่อน
    const timer = setTimeout(tryPlay, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative z-10 mx-auto w-full lg:max-w-4xl px-4 py-16 lg:py-36">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="mb-6 flex lg:h-[100%] lg:w-[100%] items-center m-auto justify-center object-cover lg:min-w-3xl"
        src="/videos/AI_online-video.mp4"
      ></video>

      <h1 className="mb-3 text-lg leading-tight text-white lg:mt-10 lg:text-[40px]">
        {subtitle}
      </h1>

      <div className="mx-auto max-w-2xl space-y-2 text-xs text-neutral-400 lg:text-xl">
        <p>{line1}</p>
        <p>{line2}</p>
      </div>
    </div>
  );
};

export default function Hero(): React.ReactElement {
  const heroText = content.hero;

  return (
    <section className="relative flex flex-col items-center justify-center px-4 text-center">
      {/* พื้นหลังดาวเต็มหน้าจอ */}
      <div className="absolute inset-0 z-0">
        <SparklesCore
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={10}
          speed={0.5}
          className="h-full w-full"
          particleColor="#FFFFFF"
        />
      </div>

      {/* เอฟเฟกต์ดาวตก */}
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full">
        <Meteors number={15} className="opacity-70" />
      </div>

      {/* 3D Background */}
      <div className="pointer-events-none absolute inset-0 z-20 select-none">
        <ModelCanvas />
      </div>

      {/* เนื้อหาหลัก */}
      <div className="relative z-20">
        <HeroContent
          title={heroText.title}
          subtitle={heroText.subtitle}
          line1={heroText.line1}
          line2={heroText.line2}
        />
      </div>

      {/* Logo Marquee */}
      <div className="relative z-30 mx-auto w-[80%] lg:max-w-5xl lg:my-16">
        <GradientMask>
          <InfiniteMarquee speed={0.7}>
            <LogoGrid />
          </InfiniteMarquee>
        </GradientMask>
      </div>
    </section>
  );
}
