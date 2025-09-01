"use client";

import React, { useEffect, useState } from "react";
import { NextUIProvider, Card, CardBody, Chip } from "@nextui-org/react";
import { CheckCircle2 } from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useMotionValueEvent,
} from "framer-motion";

/* ---------- Left text ---------- */
function FeatureItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <CheckCircle2 className="mt-1 size-5 text-white/80" />
      <div>
        <p className="text-lg">{title}</p>
        <p className="font-semibold text-[#676767] text-sm">{desc}</p>
      </div>
    </div>
  );
}

/* ---------- Phone with scan area ---------- */
type ScanPhoneProps = {
  caption?: string;
  imgSrc: string;
  imgAlt: string;
  durationMs?: number;
  /** ความสูงของรูปเป็น % ของกรอบสแกน (0-100) — แยกตั้งค่าต่อเครื่องได้ */
  imgPct?: number;
};

function ScanPhone({
  caption,
  imgSrc,
  imgAlt,
  durationMs = 2600,
  imgPct = 65, // ดีฟอลต์ 65% ของกรอบสแกน
}: ScanPhoneProps) {
  const progress = useMotionValue(0);

  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: durationMs / 1000,
      ease: [0.42, 0, 0.2, 1],
      repeat: Infinity,
      repeatType: "reverse",
    });
    return () => controls.stop();
  }, [durationMs, progress]);

  const fillHeight = useTransform(progress, (v) => `${v * 100}%`);
  const washOpacity = useTransform(progress, [0, 1], [0.9, 0.18]);
  const barWidth = useTransform(progress, (v) => `${v * 100}%`);
  const [percent, setPercent] = useState(0);
  useMotionValueEvent(progress, "change", (v) =>
    setPercent(Math.round(v * 100)),
  );

  return (
    <Card className="relative h-[460px] w-[240px] overflow-hidden rounded-[34px] border-4 border-white/10 bg-neutral-900/60 shadow-xl">
      <CardBody className="relative h-full p-4 pt-16">
        {/* notch */}
        <div className="absolute top-2 left-1/2 h-1.5 w-20 -translate-x-1/2 rounded-full bg-white/15" />

        {/* scan area */}
        <div className="relative mt-8 h-[230px] overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          {/* glow */}
          <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
          {/* grid */}
          <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* corners */}
          <span className="pointer-events-none absolute top-3 left-3 h-5 w-5 rounded-tl-lg border-t-2 border-l-2 border-white/95" />
          <span className="pointer-events-none absolute top-3 right-3 h-5 w-5 rounded-tr-lg border-t-2 border-r-2 border-white/95" />
          <span className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 rounded-bl-lg border-b-2 border-l-2 border-white/95" />
          <span className="pointer-events-none absolute right-3 bottom-3 h-5 w-5 rounded-br-lg border-r-2 border-b-2 border-white/95" />

          {/* your image (ขนาดแยกต่อเครื่องด้วย imgPct) */}
          <div className="relative z-[1] flex h-full items-center justify-center">
            <img
              src={imgSrc}
              alt={imgAlt}
              style={{ height: `${imgPct}%` }} // ← คุมขนาดต่อเครื่อง
              className="w-auto object-contain opacity-90 select-none"
              draggable={false}
            />
          </div>

          {/* overlay fill */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 left-0 z-[2] bg-[linear-gradient(to_bottom,rgba(255,255,255,.9)_0%,rgba(255,255,255,.35)_45%,rgba(255,255,255,.06)_100%)]"
            style={{ height: fillHeight, opacity: washOpacity }}
          />
        </div>

        {/* percent + progress */}
        <div className="mt-4">
          <p className="mb-1 text-xs text-white/70">{percent}% Verification</p>
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#6aa6ff,#b26dff,#ff6ad5)]"
              style={{ width: barWidth }}
            />
          </div>
        </div>

        {caption && (
          <Chip
            size="sm"
            variant="bordered"
            className="absolute top-10 right-3 max-w-[70%] truncate"
          >
            {caption}
          </Chip>
        )}
      </CardBody>
    </Card>
  );
}

/* ---------- Page ---------- */
export default function Page() {
  return (
    <NextUIProvider>
      <main className="overflow-x-hidden bg-black text-white">
        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto text-center my-16">
            <p className="text-lg text-white/60">
              Instant, secure identity check
            </p>
            <h1 className="mt-2 text-xl lg:text-[40px]">AI Face Recognition</h1>
          </div>
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-16">
            <div>
              <div className="mt-8 sm:mt-10">
                <h2 className="text-2xl font-semibold">
                  Secure access in one glance
                </h2>
                <p className="mt-2 max-w-xl font-semibold text-[#676767]">
                  An AI-powered identity system that verifies, secures and
                  grants access — instantly.
                </p>

                <div className="mt-8 space-y-5">
                  <FeatureItem
                    title="Liveness Detection"
                    desc="Prevents spoofing by detecting real faces vs. photos or videos."
                  />
                  <FeatureItem
                    title="Fast Verification"
                    desc="Instant recognition within milliseconds for smooth user experience."
                  />
                  <FeatureItem
                    title="Adaptive Accuracy"
                    desc="Improves over time with AI learning; adapts to lighting and angles."
                  />
                </div>
              </div>
            </div>

            {/* Right: two phones — ปรับขนาดรูปแยกกันได้ */}
            <div className="flex flex-col items-center gap-6 md:justify-end lg:flex-row">
              <ScanPhone
                imgSrc="/images/Group.png"
                imgAlt="face"
                imgPct={60}
                durationMs={2600}
              />
              <ScanPhone
                imgSrc="/images/idcard.png"
                imgAlt="id card"
                imgPct={40}
                durationMs={2600}
              />
            </div>
          </div>
        </section>
      </main>
    </NextUIProvider>
  );
}
