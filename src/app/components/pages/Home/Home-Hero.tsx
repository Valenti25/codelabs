"use client";

import React, {
  useState,
  useEffect,
  useRef,
  memo,
  useCallback,
  type ReactElement,
} from "react";
import { Input, Image as NextUIImage } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Plus, Send } from "lucide-react";

import ModelCanvas from "../../ModelsObject/ModelStar";
import content from "@/locales/en/home.json";
import Meteors from "../../ui/meteors";
import { SparklesCore } from "../../ui/SparklesCore";
import { toast } from "sonner";
import Star from "../../ui/star";
import Image from "next/image";
/** ================== Types & Data ================== */
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
  {
    src: "/images/chatgpt-logo.png",
    hoverSrc: "/images/chatgpt-hover.png",
    alt: "ChatGPT",
  },
  {
    src: "/images/gemini-logo.png",
    hoverSrc: "/images/gemini-hover.png",
    alt: "Google Gemini",
  },
  {
    src: "/images/poe-logo.png",
    hoverSrc: "/images/poe-hover.png",
    alt: "Poe",
  },
  {
    src: "/images/apple-intelligent-logo.png",
    hoverSrc: "/images/apple_intelligence-hover.png",
    alt: "Apple Intelligence",
  },
  {
    src: "/images/mistral-ai-logo.png",
    hoverSrc: "/images/mistral-hover.png",
    alt: "Mistral AI",
  },
  {
    src: "/images/qwen-logo.png",
    hoverSrc: "/images/qwen-hover.png",
    alt: "Qwen",
  },
  {
    src: "/images/union-logo.png",
    hoverSrc: "/images/grok-hover.png",
    alt: "Union",
  },
  {
    src: "/images/deepseek-logo.png",
    hoverSrc: "/images/deepseek-hover.png",
    alt: "DeepSeek",
  },
  {
    src: "/images/claude-logo.png",
    hoverSrc: "/images/claude-hover.png",
    alt: "Claude",
  },
  {
    src: "/images/perplexity-logo.png",
    hoverSrc: "/images/perplexity-hover.png",
    alt: "Perplexity",
  },
  {
    src: "/images/microsoft-copilot-logo.png",
    hoverSrc: "/images/copilot-hover.png",
    alt: "Microsoft Copilot",
  },
];

const DUPLICATE_COUNT = 2;
const DEFAULT_SPEED = 0.4;

/** ================== Marquee ================== */
const InfiniteMarquee = memo(function InfiniteMarquee({
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
        {Array.from({ length: DUPLICATE_COUNT }, (_, i) => (
          <React.Fragment key={i}>{children}</React.Fragment>
        ))}
      </div>

      <style jsx global>{`
        @keyframes hero-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-track {
          width: max-content;
          will-change: transform;
          animation-name: hero-marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          overflow: visible;
          padding-block: 6px;
          gap: 1rem;
        }
        .logo-item {
          position: relative;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
});

/** ================== Logo Item ================== */
const LogoItem: React.FC<Logo> = ({ src, hoverSrc, alt }) => {
  const [hovered, setHovered] = useState(false);

  // Preload hover image
  useEffect(() => {
    if (!hoverSrc) return;
    const img = new globalThis.Image();
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
      <NextUIImage
        src={displaySrc}
        alt={alt}
        className="pointer-events-auto h-9 w-9 flex-shrink-0 object-contain transition-transform duration-150 will-change-transform lg:h-[50px] lg:w-[50px]"
        loading="lazy"
        radius="none"
      />
    </motion.div>
  );
};

const LogoGrid = memo(function LogoGrid() {
  return (
    <div className="mt-8 flex items-center justify-center gap-4 pr-4 lg:gap-12 lg:pr-12">
      {LOGO_DATA.map((logo, index) => (
        <LogoItem key={`${logo.alt}-${index}`} {...logo} />
      ))}
    </div>
  );
});

/** ================== Mask ================== */
const GradientMask: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
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

/** ================== GlowFrame (เอากรอบจาก Landing มาใช้กับฟอร์ม) ================== */
function GlowFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setMousePos({ x: 0, y: 0 });
      }}
      className={[
        "group card-outer-bg card-outer-shadow relative overflow-hidden p-[1px] transition-all duration-300",
        "rounded-full",
        className,
      ].join(" ")}
    >
      {/* แสงตามเมาส์ */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.15), transparent 50%)`,
          mixBlendMode: "screen",
        }}
        aria-hidden
      />
      <div className="card-inner-bg card-inner-blur relative z-10 rounded-full">
        {children}
      </div>
    </div>
  );
}

/** ================== Hero Content ================== */
interface HeroContentProps {
  subtitle: string;
  line1: string;
  line2: string;
}

const HeroContent = memo(function HeroContentBase({
  subtitle,
  line1,
  line2,
}: HeroContentProps) {
  return (
    <div className="relative z-10 mx-auto mt-16 w-full px-4 md:py-20 lg:px-28">
      <section className="grid place-items-center px-6">
        <h1 className="max-w-5xl min-w-6xl text-center text-xl font-semibold text-white md:text-4xl lg:text-6xl">
          <span className="block">
            <span className="gradient-text-animated2">AI Innovation</span>
            at the core.
          </span>

          <span className="block lg:mt-4">
            Turning
            <span className="gradient-text-animated2">Data → Insight</span>,
            instantly.
          </span>
        </h1>
      </section>

      <h1 className="mb-3 pt-3 text-sm leading-tight text-white md:pt-6 md:text-2xl lg:mt-6 lg:text-4xl">
        {subtitle}
      </h1>

      <div className="mx-auto text-xs font-semibold text-[#676767] md:text-lg">
        <p>{line1}</p>
        <p>{line2}</p>
      </div>
    </div>
  );
});

/** ================== Hero ================== */
const SparklesCoreMemo = memo(SparklesCore);
const MeteorsMemo = memo(Meteors);
const ModelCanvasMemo = memo(ModelCanvas);

export default function Hero(): ReactElement {
  const heroText = content.hero;
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [inputText, SetInputText] = useState<string>("");

  useEffect(() => {
    const t = setTimeout(() => setIsModelLoaded(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`You asked: ${inputText}`);
    SetInputText(inputText);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center px-4 text-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <SparklesCoreMemo
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
        <MeteorsMemo number={1} className="opacity-40" />
      </div>

      {isModelLoaded && (
        <div className="pointer-events-none absolute inset-0 z-20 select-none">
          <ModelCanvasMemo />
        </div>
      )}

      <div className="relative z-20">
        <HeroContent
          subtitle={heroText.subtitle}
          line1={heroText.line1}
          line2={heroText.line2}
        />
      </div>

      <form
        onSubmit={onSubmit}
        className="pointer-events-auto relative z-40 mx-auto mt-8 mb-10 w-full md:mt-3 md:max-w-lg md:min-w-xl lg:max-w-xl lg:min-w-2xl"
      >
        <GlowFrame className="rounded-full">
          <Input
            value={inputText}
            onChange={(e) => SetInputText(e.target.value)}
            radius="full"
            variant="flat"
            placeholder="Ask me anything"
            aria-label="Ask me anything"
            autoComplete="off"
            spellCheck={false}
            classNames={{
              base: "w-full",
              inputWrapper:
                "rounded-full shadow-none border-none bg-transparent" +
                "h-11 lg:h-14 md:h-12 h-9 px-2 md:px-3" +
                "data-[hover=true]:bg-transparent group-hover:bg-transparent",
              input: "text-sm md:text-base text-white",
              innerWrapper: "gap-2",
            }}
            startContent={
              <div className="mx-auto mr-1 ml-2 flex items-center justify-between gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full">
                  <Star />
                </span>
                <span className="mr-2 ml-4 h-5 w-px bg-white/10" />
              </div>
            }
            endContent={
              <div
                aria-label="Send"
                className="mr-5 gap-3 flex h-8 w-8 items-center justify-center rounded-full"
              >
                <Image alt="" src="/svg/plus.svg" width={22} height={22} />
                <Image
                  alt=""
                  src="/svg/Microphone.svg"
                  width={22}
                  height={22}
                />
              </div>
            }
          />
        </GlowFrame>
      </form>

      {/* Logos */}
      <div className="relative z-30 md:pt-20 mx-auto md:w-[60%] lg:mb-20 lg:w-[80%] lg:max-w-5xl">
        <GradientMask>
          <InfiniteMarquee speed={0.7}>
            <LogoGrid />
          </InfiniteMarquee>
        </GradientMask>
      </div>
    </section>
  );
}
