"use client";
import { Card, CardBody, Image } from "@nextui-org/react";
import { useState } from "react";
import content from "@/locales/en/home.json";

const data = {
  landing: {
    cards: [
      {
        alt: "money",
        defaultSrc: "/images/3dicons-money-iso-gradient.png",
        hoverSrc: "/images/money-iso-gradient.png",
      },
      {
        alt: "computer",
        defaultSrc: "/images/3dicons-computer-iso-gradient.png",
        hoverSrc: "/images/computer-iso-gradient.png",
      },
      {
        alt: "mobile",
        defaultSrc: "/images/3dicons-mobile-iso-gradient.png",
        hoverSrc: "/images/mobile-iso-gradient.png",
      },
    ],
  },
};

function HoverImage({
  defaultSrc,
  hoverSrc,
  alt,
}: {
  defaultSrc: string;
  hoverSrc: string;
  alt: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Image
      src={hovered ? hoverSrc : defaultSrc}
      alt={alt}
      className="h-[160px] w-[160px] lg:h-[170px] lg:w-[170px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered(!hovered)}
    />
  );
}

export default function LandingPage() {
  const landingContent = content.landing; 
  const imageData = data.landing.cards; 

  return (
    <section className="mx-auto max-w-[1270px] px-8 lg:px-4 py-16 text-white lg:py-24">
      {/* Landing Heading */}
      <div className="mb-12 text-center">
        <p className="mb-3 text-lg text-[#7E7E7E] lg:text-xl">
          {landingContent.heading.smallTitle}
        </p>
        <h2 className="text-xl lg:text-[40px]">
          {landingContent.heading.mainTitle}
        </h2>
        <div className="mx-auto mt-4 max-w-4xl lg:px-2 text-xs text-[#7E7E7E] lg:text-xl">
          <p>{landingContent.heading.description1}</p>
          <p>{landingContent.heading.description2}</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-8 lg:px-6 pt-8 lg:grid-cols-3 lg:pt-12">
        {landingContent.cards.map(({ title, description }, i) => (
          <div
            key={i}
            className="group card-outer-bg card-outer-shadow relative overflow-hidden rounded-[25px] p-[1px]"
          >
            <Card className="card-inner-bg card-inner-blur relative h-full rounded-[24px] border-0">
              <CardBody className="flex h-full flex-col justify-between p-6 text-center lg:p-8 lg:text-left">
                <div>
                  <div className="mb-3 lg:mb-6 flex justify-center">
                    <HoverImage
                      defaultSrc={imageData[i]?.defaultSrc || ""}
                      hoverSrc={imageData[i]?.hoverSrc || ""}
                      alt={imageData[i]?.alt || ""}
                    />
                  </div>
                  <h3 className="mb-3 text-lg lg:text-2xl">{title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-[#7E7E7E]">{description}</p>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
