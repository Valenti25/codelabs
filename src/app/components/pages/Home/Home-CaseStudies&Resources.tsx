"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, animate, type PanInfo } from "framer-motion";
import { Card, CardBody } from "@nextui-org/react";
import Image from "next/image";

/* ------------------ Data ------------------ */
const data = [
  { category: "Partner", title: "Codelabs AI Partners with Industry Leaders to Accelerate AI Innovation", image: "/images/codelabs-logo.png" },
  { category: "Case studies", title: "Customer Case Study: Transforming Businesses with Codelabs AI Solutions", image: "/images/codelabs-logo.png" },
  { category: "Blog", title: "Codelabs AI Research Team Unveils Next-Gen AI Performance Benchmarks", image: "/images/codelabs-logo.png" },
  { category: "Partner", title: "Codelabs AI Partners with Industry Leaders to Accelerate AI Innovation", image: "/images/codelabs-logo.png" },
  { category: "Partner", title: "Codelabs AI Partners with Industry Leaders to Accelerate AI Innovation", image: "/images/codelabs-logo.png" },
];

/* ------------------ Utils ------------------ */
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
export default function ChatsalebyAI() {
  const viewportRef = useRef<HTMLDivElement>(null); 
  const trackRef = useRef<HTMLDivElement>(null);    
  const x = useMotionValue(0);                      

  const [bounds, setBounds] = useState<{ left: number; right: number }>({ left: 0, right: 0 });
  const [cardStep, setCardStep] = useState(0); 

  const recalc = () => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const viewportWidth = viewport.offsetWidth;
    const trackWidth = track.scrollWidth; 
    const maxLeft = viewportWidth - trackWidth; 
    setBounds({ left: maxLeft, right: 0 });

    const firstCard = track.querySelector<HTMLElement>("[data-card]");
    if (firstCard) {
      const cardRect = firstCard.getBoundingClientRect();
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap || "0");
      setCardStep(cardRect.width + gap);
    }

    const current = x.get();
    if (current < maxLeft) x.set(maxLeft);
    if (current > 0) x.set(0);
  };

  useEffect(() => {
    recalc();
    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(recalc)
      : null;

    if (viewportRef.current && ro) ro.observe(viewportRef.current);
    if (trackRef.current && ro) ro.observe(trackRef.current);

    const t = setTimeout(recalc, 300);

    const onResize = () => recalc();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const snapOnDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!cardStep || cardStep <= 0) return;

    const currentX = x.get();
    const projected = currentX + info.velocity.x * 0.2;

    let index = Math.round(Math.abs(projected) / cardStep);
    const maxIndex = Math.max(0, Math.floor(Math.abs(bounds.left) / cardStep));
    index = clamp(index, 0, maxIndex);

    const target = clamp(-index * cardStep, bounds.left, 0);

    // Animate แบบสปริง ลื่น ๆ
    animate(x, target, { type: "spring", stiffness: 600, damping: 60 });
  };

  return (
    <section className="text-white flex flex-col items-center m-auto py-20 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-14 px-4">
        <p className="mb-3 text-lg text-[#676767]">AI-Driven Success Stories</p>
        <h2 className="text-xl lg:text-[40px]">Case Studies & Resources</h2>
      </div>

      <motion.div
        ref={viewportRef}
        className="w-full overflow-hidden md:px-8 select-none"
        style={{ touchAction: "pan-y" }}
      >
        <motion.div
          ref={trackRef}
          className="flex gap-8 cursor-grab active:cursor-grabbing"
          style={{
            x,
            touchAction: "pan-x",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
          drag="x"
          dragConstraints={bounds}        
          dragElastic={0.08}             
          dragMomentum={true}              
          dragTransition={{ power: 0.4 }}  
          onDragEnd={snapOnDragEnd}
        >
          {data.map((item, idx) => (
            <div
              key={idx}
              data-card
              className="flex-shrink-0 md:max-w-[370px] max-w-xs w-full"
            >
              <Card
                isHoverable
                className="bg-black rounded-3xl shadow-lg overflow-hidden"
              >
                <CardBody className="p-0">
                  {/* Image */}
                  <div className="relative bg-[#0B0B0B] w-full h-[260px]">
                    <Image
                      fill
                      src={item.image}
                      alt={item.title}
                      className="object-contain pointer-events-none p-10"
                      onLoad={() => {
                        recalc();
                      }}
                      priority={idx < 2}
                    />
                  </div>
                  {/* Text */}
                  <div className="p-6">
                    <p className="text-sm gradient-text-animated mb-2">
                      {item.category}
                    </p>
                    <p className="text-sm">{item.title}</p>
                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
