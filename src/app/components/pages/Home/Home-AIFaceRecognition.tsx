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
import Image from "next/image";

type ScanPhoneProps = {
  caption?: string;
  imgSrc: string;
  imgAlt: string;
  durationMs?: number;
  imgPct?: number; 
};

function ScanPhone({
  caption,
  imgSrc,
  imgAlt,
  durationMs = 2600,
  imgPct = 65,
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
    <Card className="relative mx-auto shrink-0 h-[460px] w-[250px] overflow-hidden rounded-[34px] border-4 border-white/10 bg-neutral-900/60 shadow-xl">
      <CardBody className="relative h-full p-4 pt-16">
        {/* notch */}
        <div className="absolute left-1/2 top-2 h-1.5 w-20 -translate-x-1/2 rounded-full bg-white/15" />

        {/* scan area */}
        <div className="relative mt-8 h-[230px] overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px]" />
          <span className="pointer-events-none absolute top-3 left-3 h-5 w-5 rounded-tl-lg border-l-2 border-t-2 border-white/95" />
          <span className="pointer-events-none absolute top-3 right-3 h-5 w-5 rounded-tr-lg border-r-2 border-t-2 border-white/95" />
          <span className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 rounded-bl-lg border-b-2 border-l-2 border-white/95" />
          <span className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 rounded-br-lg border-b-2 border-r-2 border-white/95" />

          <div className="relative z-[1] flex h-full items-center justify-center">
            <Image
              src={imgSrc}
              alt={imgAlt}
              width={250}
              height={250}
              style={{ height: `${imgPct}%` }}
              className="select-none w-auto object-contain opacity-90"
              draggable={false}
            />
          </div>

          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-0 z-[2] bg-[linear-gradient(to_bottom,rgba(60,145,134,.9)_0%,rgba(60,145,134,.35)_45%,rgba(60,145,134,.06)_100%)]"
            style={{ height: fillHeight, opacity: washOpacity }}
          />
        </div>

        <div className="mt-4">
          <p className="mb-1 text-xs text-white/70">{percent}% Verification</p>
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(70deg,#6aa6ff,#b26dff,#ff6ad5)]"
              style={{ width: barWidth }}
            />
          </div>
        </div>

        {caption && (
          <Chip
            size="sm"
            variant="bordered"
            className="absolute right-3 top-10 max-w-[70%] truncate"
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
        {/* ขยายความกว้างรวม + จัดกึ่งกลาง */}
        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto my-16 text-center">
            <p className="text-lg text-[#676767]">Instant, secure identity check</p>
            <h1 className="mt-2 text-xl lg:text-[40px]">AI Face Recognition</h1>
          </div>

          {/* จัดกึ่งกลางคอลัมน์ในกริด */}
          <div className="mx-auto lg:flex max-w-full lg:justify-center lg:items-center gap-12 md:flex-row">
            {/* Left */}
            <div className="w-full max-w-md md:justify-self-end">
              <div className="mt-8 sm:mt-10">
                <h2 className="text-xl font-semibold">Secure access in one glance</h2>
                <p className="mt-2 max-w-sm text-sm font-semibold text-[#676767]">
                  An AI-powered identity system that verifies, secures and grants access — instantly.
                </p>

                <div className="mt-8 max-w-xs">
                  <ul className="space-y-6">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-white/80" aria-hidden="true" strokeWidth={2} />
                      <div>
                        <div className="text-sm font-semibold leading-snug text-white">Liveness Detection</div>
                        <p className="mt-1 text-xs leading-relaxed text-white/60">
                          prevents spoofing by detecting real faces vs. photos or videos
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-white/80" aria-hidden="true" strokeWidth={2} />
                      <div>
                        <div className="text-sm font-semibold leading-snug text-white">Fast Verification</div>
                        <p className="mt-1 text-xs leading-relaxed text-white/60">
                          instant recognition within milliseconds for smooth user experience
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-white/80" aria-hidden="true" strokeWidth={2} />
                      <div>
                        <div className="text-sm font-semibold leading-snug text-white">Adaptive Accuracy</div>
                        <p className="mt-1 text-xs leading-relaxed text-white/60">
                          improves over time with AI learning, adapting to different lighting and angles
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: phones — จัดกึ่งกลาง และไม่บีบ */}
            <div
              className="
                mx-auto flex max-w-7xl
                flex-wrap items-center justify-center gap-8
                lg:flex-nowrap lg:justify-center
                overflow-x-auto lg:overflow-visible pb-2
              "
            >
              <ScanPhone imgSrc="/images/Group.png"  imgAlt="face"   imgPct={60} durationMs={2600} />
              <ScanPhone imgSrc="/images/idcard.png" imgAlt="id card" imgPct={40} durationMs={2600} />
            </div>
          </div>
        </section>
      </main>
    </NextUIProvider>
  );
}
