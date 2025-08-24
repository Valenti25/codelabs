"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
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

const DUPLICATE_COUNT = 2;
const DEFAULT_SPEED = 0.4; // ลด speed จาก 0.5 เพื่อลดภาระ GPU

function InfiniteMarquee({
  children,
  speed = DEFAULT_SPEED,
  className = "",
}: InfiniteMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.3 } // เพิ่ม threshold เพื่อเริ่มอนิเมชันช้าลง
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div
        className="flex"
        style={{
          width: "max-content",
          animation: isInView ? `marquee ${30 / speed}s linear infinite` : "none",
          willChange: "transform",
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
      <Image
        key={`${logo.alt}-${index}`}
        src={logo.src}
        alt={logo.alt}
        className="pointer-events-none h-9 w-9 flex-shrink-0 object-contain lg:h-[50px] lg:w-[50px]" // คงขนาดเดิม
        loading="lazy"
      />
    ))}
  </div>
);

const GradientMask: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.3 } // เพิ่ม threshold เพื่อเริ่มโหลดช้าลง
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isInView) return;

    const tryPlay = async () => {
      try {
        video.muted = true;
        video.setAttribute("playsinline", "true");
        await video.play();
        video.playbackRate = 0.5; // ลดจาก 0.6
      } catch (err) {
        console.log("Autoplay iOS blocked:", err);
      }
    };

    const timer = setTimeout(tryPlay, 700); // เพิ่ม delay จาก 500ms เป็น 700ms
    return () => clearTimeout(timer);
  }, [isInView]);

  return (
    <div
      ref={sectionRef}
      className="relative z-0 mx-auto w-full px-4 py-24 lg:max-w-4xl lg:py-40"
    >
      {isInView && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/images/video-poster.jpg"
          className="h-auto z-10 w-full"
        >
          <source src="/videos/ai-real-1.mp4" type="video/mp4" />
        </video>
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
            // หน่วงการโหลด ModelCanvas เป็น 1500ms
            setTimeout(() => setIsModelLoaded(true), 1500);
          } else {
            setIsModelLoaded(false); // หยุดโหลด ModelCanvas เมื่อออกจาก viewport
          }
        });
      },
      { threshold: 0.3 } // เพิ่ม threshold
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
              minSize={0.2} // ลดจาก 0.3
              maxSize={0.6} // ลดจาก 0.8
              particleDensity={1} // คงไว้
              speed={0.15} // ลดจาก 0.2
              className="h-full w-full"
              particleColor="#FFFFFF"
            />
          </div>

          <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full">
            <Meteors number={1} className="opacity-40" /> {/* ลด opacity จาก 0.5 */}
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
          title={heroText.title}
          subtitle={heroText.subtitle}
          line1={heroText.line1}
          line2={heroText.line2}
        />
      </div>

      <div className="relative z-30 mx-auto w-[80%] lg:my-12 lg:max-w-5xl">
        <GradientMask>
          <InfiniteMarquee speed={0.7}>
            <LogoGrid />
          </InfiniteMarquee>
        </GradientMask>
      </div>
    </section>
  );
}