"use client";
import { Card, CardBody, Image } from "@nextui-org/react";
import { ReactNode, useState } from "react";

export default function LandingPage() {
  const CardComponent = ({ children }: { children: ReactNode }) => (
    <div
      className="group relative h-full overflow-hidden rounded-[25px] p-[1px]"
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.18) 50%, rgba(255, 255, 255, 0.08) 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 3px rgba(0,0,0,0.3)",
      }}
    >
      <Card
        className="relative h-full rounded-[24px] border-0"
        style={{
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          backgroundImage: "radial-gradient(60% 80% at 65% 45%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 60%, rgba(255, 255, 255, 0) 100%)",
        }}
      >
        {children}
      </Card>
    </div>
  );

  const HoverImage = ({
    defaultSrc,
    hoverSrc,
    alt,
  }: {
    defaultSrc: string;
    hoverSrc: string;
    alt: string;
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <Image
        src={isHovered ? hoverSrc : defaultSrc}
        alt={alt}
        className="w-[170px] h-[170px] transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsHovered(!isHovered)}
      />
    );
  };

  return (
    <section className="mx-auto flex w-full max-w-[1270px] flex-col items-center justify-center px-4 py-16 text-white lg:py-24">
      {/* Heading */}
      <div className="mb-12 text-center">
        <p className="mb-3 text-lg text-[#666666] md:text-xl">Apply AI</p>
        <h1 className="text-3xl md:text-4xl lg:text-[40px]">
          AI Services & Strengths
        </h1>
        <div className="mx-auto mt-4 max-w-4xl space-y-2 px-2 text-sm text-[#666666] md:text-xl lg:text-xl">
          <p>We build AI solutions powered by your real-world data</p>
          <p>
            — customized models that reflect actual business behavior, not just
            off-the-shelf algorithms.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid w-full grid-cols-1 gap-8 px-6 pt-8 lg:grid-cols-3 lg:pt-12">
        <CardComponent>
          <CardBody className="flex h-full flex-col justify-between p-6 text-center lg:p-8 lg:text-left">
            <div>
              <div className="mb-6 flex justify-center">
                <HoverImage
                  defaultSrc="/IconLogo/3dicons-money-iso-gradient.png"
                  hoverSrc="/IconLogo/money-iso-gradient.png"
                  alt="money"
                />
              </div>
              <h2 className="mb-3 text-xl lg:text-2xl">
                AI for Modern Businesses
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-[#7E7E7E]">
              Deliver fast, accurate, and human-like customer interactions —
              powered by AI trained on your business context.
            </p>
          </CardBody>
        </CardComponent>

        <CardComponent>
          <CardBody className="flex h-full flex-col justify-between p-6 text-center lg:p-8 lg:text-left">
            <div>
              <div className="mb-6 flex justify-center">
                <HoverImage
                  defaultSrc="/IconLogo/3dicons-computer-iso-gradient.png"
                  hoverSrc="/IconLogo/computer-iso-gradient.png"
                  alt="computer"
                />
              </div>
              <h2 className="mb-3 text-xl lg:text-2xl">AI for Data Dashboard</h2>
            </div>
            <p className="text-sm leading-relaxed text-[#7E7E7E]">
              Turn raw data into meaningful insights — faster, clearer, and more
              predictive than ever before.
            </p>
          </CardBody>
        </CardComponent>

        <CardComponent>
          <CardBody className="flex h-full flex-col justify-between p-6 text-center lg:p-8 lg:text-left">
            <div>
              <div className="mb-6 flex justify-center">
                <HoverImage
                  defaultSrc="/IconLogo/3dicons-mobile-iso-gradient.png"
                  hoverSrc="/IconLogo/mobile-iso-gradient.png"
                  alt="mobile"
                />
              </div>
              <h2 className="mb-3 text-xl lg:text-2xl">AI for SME online</h2>
            </div>
            <p className="text-sm leading-relaxed text-[#7E7E7E]">
              Affordable, ready-to-use AI tools that help SMEs grow faster, sell
              smarter, and save time — no tech team needed.
            </p>
          </CardBody>
        </CardComponent>
      </div>
    </section>
  );
}