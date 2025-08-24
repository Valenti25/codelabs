"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/react";
import Image from "next/image";

// ข้อมูลสำหรับแสดงบนการ์ด
const data = [
  {
    category: "Partner",
    title: "Codelabs AI Partners with Industry Leaders to Accelerate AI Innovation",
    image: "/images/codelabs-logo.png",
  },
  {
    category: "Case studies",
    title: "Customer Case Study: Transforming Businesses with Codelabs AI Solutions",
    image: "/images/codelabs-logo.png",
  },
  {
    category: "Blog",
    title: "Codelabs AI Research Team Unveils Next-Gen AI Performance Benchmarks",
    image: "/images/codelabs-logo.png",
  },
  {
    category: "Partner",
    title: "Codelabs AI Partners with Industry Leaders to Accelerate AI Innovation",
    image: "/images/codelabs-logo.png",
  },
  {
    category: "Partner",
    title: "Codelabs AI Partners with Industry Leaders to Accelerate AI Innovation",
    image: "/images/codelabs-logo.png",
  },
];

export default function ChatsalebyAI() {
  const [width, setWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null); // Ref สำหรับกรอบแสดงผล (Viewport)
  const motionRef = useRef<HTMLDivElement>(null);   // Ref สำหรับเนื้อหาที่เลื่อนได้

  useEffect(() => {
    // คำนวณขอบเขตการลากหลังจาก Component ถูกสร้างขึ้นแล้ว
    // เพื่อให้ได้ขนาดที่แท้จริงของ Element
    if (carouselRef.current && motionRef.current) {
      const carouselWidth = carouselRef.current.offsetWidth;
      const motionWidth = motionRef.current.scrollWidth;
      setWidth(carouselWidth - motionWidth);
    }
  }, []);

  return (
    <section className=" text-white flex flex-col items-center m-auto py-20 max-w-7xl">
      {/* ส่วนหัวข้อ */}
      <div className="text-center mb-14 px-4">
        <p className="mb-3 text-lg text-[#7E7E7E]">AI-Driven Success Stories</p>
        <h2 className="text-xl lg:text-[40px]">Case Studies & Resources</h2>
      </div>

      {/* กรอบแสดงผลของ Carousel */}
      <motion.div
        ref={carouselRef}
        className="w-full overflow-hidden  cursor-grab px-8"
      >
        {/* เนื้อหา Carousel ที่สามารถลากได้ */}
        <motion.div
          ref={motionRef}
          className="flex gap-8 " // เพิ่มระยะห่างระหว่างการ์ด
          drag="x"
          dragConstraints={{ right: 0, left: width }}
          dragElastic={0.1}
          whileTap={{ cursor: "grabbing" }}
        >
          {data.map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0  max-w-[370px]"
            >
              <Card
                isHoverable
                className="bg-black rounded-3xl shadow-lg overflow-hidden"
              >
                <CardBody className="p-0">
                  {/* ส่วนรูปภาพ */}
                  <div className="relative bg-[#0B0B0B] w-full h-65">
                    <Image
                      fill
                      src={item.image}
                      alt={item.title}
                      className="object-contain pointer-events-none p-10"
                    />
                  </div>
                  {/* ส่วนข้อความ */}
                  <div className="p-6">
                    <p className="text-sm gradient-text mb-2">
                      {item.category}
                    </p>
                    <p className="text-sm">
                      {item.title}
                    </p>
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