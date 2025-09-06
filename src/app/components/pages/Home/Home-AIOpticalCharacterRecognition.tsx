"use client";

import React, { useEffect, useRef, useState } from "react";
import { NextUIProvider, Image as NextUIImage } from "@nextui-org/react";
import { CheckCircle2 } from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  useAnimation,
  animate,
} from "framer-motion";

/* ---------------- HoverFrame: กรอบมีไลท์ตามเมาส์ ---------------- */
function HoverFrame({
  children,
  radius = 25,
  className = "",
}: {
  children: React.ReactNode;
  radius?: number;
  className?: string;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const frameRef = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={frameRef}
      onMouseMove={onMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      className={`group card-outer-bg card-outer-shadow relative overflow-hidden p-[1px] transition-all duration-300 ${className}`}
      style={{ borderRadius: radius }}
    >
      {/* แสงตามเมาส์ */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(
            circle 180px at ${mousePos.x}px ${mousePos.y}px,
            rgba(255,255,255,0.15),
            transparent 50%
          )`,
        }}
      />
      {/* เนื้อใน */}
      <div
        className="card-inner-bg card-inner-blur relative z-10"
        style={{ borderRadius: radius - 1 }}
      >
        {children}
      </div>
    </div>
  );
}

/* === Speed === */
const SCAN_MS = 1400;

export default function Page() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { amount: 0.35, once: true });

  // progress = 0..1 ต่อหนึ่งรอบการสแกน
  const progress = useMotionValue(0);
  const [done, setDone] = useState(false);

  // แปลง progress -> ความสูง/ความทึบของแถบสแกน
  const sweepH = useTransform(progress, [0, 1], ["0%", "100%"]);
  const sweepOpacity = useTransform(progress, [0, 1], [0.92, 0.22]);

  // Controls สำหรับคอนเทนต์ด้านขวา
  const p1Ctrl = useAnimation();
  const p2Ctrl = useAnimation();

  useEffect(() => {
    if (!inView) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let scanAnim: ReturnType<typeof animate> | null = null;

    const resetText = () => {
      p1Ctrl.set({ opacity: 0, y: 12 });
      p2Ctrl.set({ opacity: 0, y: 12 });
      progress.set(0);
      setDone(false);
    };

    const cycle = async () => {
      if (cancelled) return;

      resetText();

      scanAnim = animate(progress, 1, {
        duration: SCAN_MS / 1000,
        ease: [0.42, 0, 0.2, 1],
      });
      await scanAnim.finished;
      if (cancelled) return;

      setDone(true);
      await p1Ctrl.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] },
      });
      if (cancelled) return;
      await p2Ctrl.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] },
      });
      if (cancelled) return;

      timeoutId = setTimeout(() => {
        cycle();
      }, 550);
    };

    cycle();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (scanAnim) scanAnim.stop();
    };
  }, [inView, p1Ctrl, p2Ctrl, progress]);

  const IMG_SRC = "/images/optical.png";
  const THUMBS = [
    { src: "/svg/copy.svg", alt: "Doc A" },
    { src: "/svg/share.svg", alt: "Doc B" },
    { src: "/svg/announce.svg", alt: "Doc C" },
  ];

  return (
    <NextUIProvider>
      <main className="text-white">
        {/* ===== Hero ===== */}
        <section
          ref={sectionRef}
          className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16"
        >
          <div className="text-center">
            <p className="text-lg text-[#676767]">
              Read, extract, and understand text instantly
            </p>
            <h1 className="mt-2 text-xl lg:text-[40px]">
              AI Optical Character Recognition
            </h1>
          </div>

          {/* ===== Two Columns ===== */}
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_0.9fr] lg:items-start">
            <HoverFrame className="rounded-[28px]">
              <div className="p-4 md:p-6">
                <div className="relative grid gap-4 md:grid-cols-[1.15fr_1fr]">
                  {/* viewer + scan */}
                  <div className="relative overflow-hidden rounded-2xl p-3 md:p-4">
                    <div className="relative overflow-hidden rounded-xl border border-white/10">
                      {/* grid bg */}
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:22px_22px]" />
                      <span className="pointer-events-none absolute top-3 left-3 h-4 w-4 rounded-tl-lg border-t-2 border-l-2 border-white/94" />
                      <span className="pointer-events-none absolute top-3 right-3 h-4 w-4 rounded-tr-lg border-t-2 border-r-2 border-white/94" />
                      <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 rounded-bl-lg border-b-2 border-l-2 border-white/94" />
                      <span className="pointer-events-none absolute right-3 bottom-3 h-4 w-4 rounded-br-lg border-r-2 border-b-2 border-white/95" />

                      {/* ===== Image center ===== */}
                      <div className="relative grid h-[280px] place-items-center">
                        <NextUIImage
                          src={IMG_SRC}
                          alt="Sample document for OCR"
                          radius="sm"
                          className="relative z-[1] max-h-[240px] w-auto object-contain"
                          shadow="sm"
                        />
                      </div>

                      {/* ===== Scan sweep + tail (intense) ===== */}
                      <motion.div
                        className="pointer-events-none absolute top-0 right-0 left-0 z-[2]"
                        style={{ height: sweepH, opacity: sweepOpacity }}
                        aria-hidden
                      >
                        {/* ตัวเนื้อแถบสแกน */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to bottom, rgba(60,145,134,1) 0%, rgba(60,145,134,.48) 45%, rgba(60,145,134,.12) 100%)",
                          }}
                        />
                        {/* หางหนา (เวอร์ชันเข้ม) */}
                        <div className="pointer-events-none absolute -bottom-1 left-0 right-0 h-12 mix-blend-screen">
                          {/* กล้อนเรืองแสงหนา */}
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "radial-gradient(120% 200% at 50% 100%, rgba(138,255,239,1) 0%, rgba(138,255,239,.75) 34%, rgba(138,255,239,.38) 60%, transparent 78%)",
                              filter: "blur(4px)", // คม/เข้มขึ้น
                            }}
                          />
                          {/* แกนแสง core */}
                          <div
                            className="absolute left-6 right-6 bottom-[10px] h-[6px] rounded-full opacity-90"
                            style={{
                              background:
                                "linear-gradient(to right, transparent, rgba(180,255,247,.95), transparent)",
                            }}
                          />
                          {/* เส้นไฮไลต์คม ๆ ตรงขอบปลาย */}
                          <div className="absolute left-3 right-3 bottom-2 h-[3px] rounded-full bg-white/95" />
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* ข้อความสรุป */}
                  <div className="rounded-2xl p-4">
                    <motion.p
                      className="text-[12px] leading-relaxed text-white md:text-[13px]"
                      initial={{ opacity: 0, y: 12 }}
                      animate={p1Ctrl}
                    >
                      In the fiscal year 2025, the company experienced steady
                      and sustainable growth across all major product
                      categories. Notebooks remained the cornerstone of overall
                      revenue, supported by consistent demand from education and
                      enterprise customers.
                    </motion.p>
                    <motion.p
                      className="mt-3 text-[12px] leading-relaxed text-white md:text-[13px]"
                      initial={{ opacity: 0, y: 12 }}
                      animate={p2Ctrl}
                    >
                      Tablets showed remarkable improvement, largely driven by
                      e-learning platforms and the growing adoption of hybrid
                      work. Smartwatches gained traction among health-conscious
                      users, valued for real-time monitoring features.
                    </motion.p>

                    <div className="mt-4 flex items-center gap-10">
                      {THUMBS.map((it) => (
                        <NextUIImage
                          key={it.src}
                          src={it.src}
                          alt={it.alt}
                          width={20}
                          height={20}
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </HoverFrame>

            {/* ------- Right: Copy & Bullets ------- */}
            <div className="lg:pt-1">
              <h2 className="text-lg font-semibold">
                Instant Document Understanding
              </h2>
              <p className="mt-2 max-w-xl text-xs text-[#676767] font-semibold">
                An AI-powered system that quickly transforms scanned files into
                usable, structured data.
              </p>

              <ul className="mt-5 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full ">
                    <CheckCircle2 className="h-4 w-4 opacity-80" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">High Precision</div>
                    <p className="text-xs mt-1 text-[#676767] font-semibold">
                      Delivers accurate extraction even from low-quality images
                      or complex layouts.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full ">
                    <CheckCircle2 className="h-4 w-4 opacity-80" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">
                      Multi-Language Ready
                    </div>
                    <p className="text-xs mt-1 text-[#676767] font-semibold">
                      Supports various languages and scripts for global
                      usability.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full ">
                    <CheckCircle2 className="h-4 w-4 opacity-80" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">Actionable Output</div>
                    <p className="text-xs mt-1 font-semibold text-[#676767]">
                      Converts raw text into editable, searchable,
                      analytics-ready content.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </NextUIProvider>
  );
}
