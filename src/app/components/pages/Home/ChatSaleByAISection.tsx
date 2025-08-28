"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Card,
  CardBody,
  Image as NextUIImage,
} from "@nextui-org/react";
import { motion, useInView, type Variants } from "framer-motion";

/** ---------- Reusable Frame ---------- */
const Frame = ({
  radius = 22,
  className = "",
  children,
}: {
  radius?: number;
  className?: string;
  children: React.ReactNode;
}) => {
  const inner = Math.max(0, radius - 1);
  return (
    <div
      className={`card-outer-bg card-outer-shadow p-[1px] ${className}`}
      style={{ borderRadius: radius }}
    >
      <div
        className="card-inner-bg card-inner-blur"
        style={{ borderRadius: inner, overflow: "hidden" }}
      >
        {children}
      </div>
    </div>
  );
};

/** ---------- Motion / Variants ---------- */
const easeOutCubic = [0.33, 1, 0.68, 1] as const;

const bubbleVariants: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(2px)" },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.15 * i, duration: 0.5, ease: easeOutCubic },
  }),
};

/** ---------- Tiny component: AI thinking dots ---------- */
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-white/80"
          initial={{ opacity: 0.25, y: 0 }}
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/** ---------- Component ---------- */
function EarbudsChatDemo() {
  // sentinel for inView
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(triggerRef, {
    amount: 0.2,
    once: true,
    margin: "-10% 0px -10% 0px",
  });

  // ❌ ลบ assistantThinking ออก ไม่ต้องใช้แล้ว
  const [productVisible, setProductVisible] = useState(false);
  const [thanksVisible, setThanksVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  type Msg = { id: string; role: "user" | "assistant"; text: string };
  const userMsgs: Msg[] = useMemo(
    () => [
      {
        id: "m1",
        role: "user",
        text: "I’m looking for wireless earbuds — mostly for listening to music while working.",
      },
      {
        id: "m2",
        role: "user",
        text: "I’d like something comfortable for long hours.",
      },
    ],
    []
  );

  const assistantMsg: Msg = useMemo(
    () => ({
      id: "m3",
      role: "assistant",
      text: "Got it ✨ The AirPods Pro 2 are lightweight, with excellent noise cancelling and seamless pairing.",
    }),
    []
  );

  // ✅ เมื่อเลื่อนถึง ให้โชว์ข้อความผู้ช่วยทันที และดีเลย์เฉพาะการ์ดสินค้า
  useEffect(() => {
    if (!inView) return;

    const tProduct = setTimeout(() => {
      setImgLoaded(false);
      setProductVisible(true);
    }, 1000); // ปรับเวลาได้ตามต้องการ

    return () => clearTimeout(tProduct);
  }, [inView]);

  useEffect(() => {
    if (!productVisible) return;
    const tThanks = setTimeout(() => setThanksVisible(true), 150);
    return () => clearTimeout(tThanks);
  }, [productVisible]);

  return (
    <Frame radius={28} className="relative mx-auto w-full max-w-6xl">
      <section className="overflow-hidden bg-[radial-gradient(1200px_600px_at_50%_-200px,rgba(63,63,70,0.18),transparent_60%)] from-zinc-950 to-black px-5 py-10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] md:px-10">
        <div className="min-h-[460px] w-full md:min-h-[520px]">
          <div className="w-full space-y-6">
            {/* User messages (left) */}
            {userMsgs.map((m, idx) => (
              <motion.div
                key={m.id}
                variants={bubbleVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={idx}
                className="relative flex justify-start"
              >
                <div className="mt-1 mr-3 hidden sm:block">
                  <Avatar
                    className="shadow-lg"
                    radius="lg"
                    size="sm"
                    src="/images/user.png"
                    name="You"
                  />
                </div>
                <div className="max-w-[46rem] rounded-[22px] border border-white/12 bg-gradient-to-b from-white/8 to-white/4 px-5 py-3 text-[15px] leading-relaxed text-white">
                  {m.text}
                </div>
              </motion.div>
            ))}

            {/* Sentinel */}
            <div ref={triggerRef} className="h-1 w-full" />

            {/* Assistant (right) — แสดงข้อความทันที ไม่ต้องรอ */}
            <motion.div
              variants={bubbleVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={2}
              className="relative mr-2 flex w-full justify-end"
            >
              <div className="mr-8 max-w-[46rem] rounded-[22px] border border-white/12 bg-gradient-to-b from-white/10 to-white/5 px-5 py-3 text-right text-[15px] leading-relaxed text-white">
                {assistantMsg.text}
              </div>
              <div className="absolute top-1/2 -right-10 hidden -translate-y-1/2 pr-5 md:block">
                <Frame radius={28}>
                  <button
                    aria-label="Action"
                    className="flex h-10 w-10 items-center justify-center"
                  >
                    <Avatar
                      className="shadow-lg"
                      radius="lg"
                      size="sm"
                      src="/images/starai.png"
                      name="AI"
                    />
                  </button>
                </Frame>
              </div>
            </motion.div>

            {/* Product area */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: easeOutCubic }}
              className="relative flex w-full justify-end"
            >
              {!productVisible && (
                <Frame radius={22} className="w-[260px]">
                  <div className="flex items-center justify-center gap-2 px-6 py-12">
                    <ThinkingDots />
                    <span className="text-xs text-white/70">
                      กำลังค้นหาสินค้าที่เหมาะกับคุณ…
                    </span>
                  </div>
                </Frame>
              )}

              {productVisible && (
                <Frame radius={22} className="w-[260px]">
                  <Card className="border-0 bg-transparent p-3">
                    <CardBody className="items-center gap-3 p-4">
                        {!imgLoaded && (
                          <div className="flex h-[160px] w-full items-center justify-center gap-2">
                            <ThinkingDots />
                            <span className="text-xs text-white/70">
                              กำลังโหลดรูป…
                            </span>
                          </div>
                        )}
                        <NextUIImage
                          alt="AirPods Pro 2"
                          src="/images/airpods-pro.png"
                          className={`h-[160px] w-full object-cover ${
                            imgLoaded ? "block" : "hidden"
                          }`}
                          onLoad={() => setImgLoaded(true)}
                        />
                      <div className="mt-2 text-center">
                        <div className="text-sm text-zinc-200">Pods Pro 2 (M2)</div>
                        <div className="text-xs text-zinc-400">8,990</div>
                      </div>
                    </CardBody>
                  </Card>
                </Frame>
              )}
            </motion.div>

            {/* Final user acknowledgement (left) */}
            <motion.div
              variants={bubbleVariants}
              initial="hidden"
              animate={thanksVisible ? "visible" : "hidden"}
              custom={3}
              className="relative flex w-full justify-start"
            >
              <div className="mt-1 mr-3 hidden sm:block">
                <Avatar
                  className="shadow-lg"
                  radius="lg"
                  size="sm"
                  src="/images/user.png"
                  name="You"
                />
              </div>
              <div className="max-w-[40rem] rounded-[22px] border border-white/12 bg-gradient-to-b from-white/8 to-white/4 px-5 py-3 text-[15px] text-white">
                Awesome, thanks! That’s exactly what I needed 🙌
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Frame>
  );
}

/** ---------- Page wrapper ---------- */
export default function Page() {
  return (
    <main className="min-h-[80vh] px-0 py-10 md:px-0">
      <div className="w-full">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm text-[#676767] lg:text-xl">
            The Future of Smart Sales
          </p>
          <h2 className="text-xl text-white lg:text-[40px]">Chat sale by AI</h2>
        </div>
        <EarbudsChatDemo />
        <div className="mx-auto mt-10 flex max-w-sm items-center justify-center text-center font-semibold">
          <p className="text-[#676767]">
            An AI-powered sales assistant that chats, qualifies, recommends, and
            helps close deals — 24/7.
          </p>
        </div>
      </div>
    </main>
  );
}
