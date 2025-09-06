"use client";

import React, { useRef, useState } from "react";
import { NextUIProvider, Input } from "@nextui-org/react";
import { motion } from "framer-motion";

/** เม็ดแคปซูลกรอบ-เหมือนกรอบใหญ่ */
function Pill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card-outer-bg card-outer-shadow p-[1px] rounded-full ${className}`}>
      <div className="card-inner-bg card-inner-blur rounded-full">
        {children}
      </div>
    </div>
  );
}

/**
 * Hero with the same frame/hover-light as your CardComponent
 */
export default function Page() {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // (ยังใช้ได้ ถ้าต้องการกับส่วนอื่น ๆ)
  const pillFrame =
    "relative rounded-full border border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] before:content-[''] before:absolute before:inset-0 before:rounded-full before:pointer-events-none before:[background:radial-gradient(120%_200%_at_50%_-50%,rgba(255,255,255,0.06),transparent_60%)]";

  return (
    <NextUIProvider>
      <main className="w-full bg-black text-white flex items-center justify-center p-4 sm:p-8">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-6xl"
        >
          <div
            ref={frameRef}
            className="group card-outer-bg card-outer-shadow relative overflow-hidden rounded-[25px] p-[1px] transition-all"
            onMouseMove={onMove}
          >
            {/* mouse-follow light */}
            <div
              className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle 260px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.12), transparent 55%)`,
              }}
            />

            <div className="card-inner-bg card-inner-blur relative z-10 rounded-[24px] px-6 py-10 sm:px-10 sm:py-14">
              {/* Badge ใช้กรอบเดียวกับกรอบใหญ่ */}
              <div className="relative mb-6 flex justify-center">
                <Pill>
                  <span className="block px-3 py-1 text-xs font-medium text-white/80">
                    Codelabs AI
                  </span>
                </Pill>
              </div>

              {/* Heading */}
              <h1 className="relative text-center text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
                Unlock AI Power for Your Business
              </h1>

              {/* Subtext */}
              <p className="relative mx-auto mt-11 max-w-2xl text-center text-lg font-semibold text-[#676767]">
                Turn raw data into insights with AI search, chat, verification, and OCR
                all in one platform. Faster, smarter, and secure.
              </p>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget as HTMLFormElement;
                  const formData = new FormData(form);
                  const email = String(formData.get("email") || "");
                  alert(`Submitted: ${email}`);
                }}
                className="relative mx-auto mt-8 w-full max-w-xl"
              >
                {/* จะใช้ pillFrame เดิมครอบทั้งแถว input+button ก็ได้ */}
                <div className={`${pillFrame} flex items-center gap-2 p-1.5`}>
                  <Input
                    name="email"
                    type="email"
                    aria-label="Your Email"
                    placeholder="Your Email"
                    variant="flat"
                    radius="full"
                    size="lg"
                    classNames={{
                      input: "text-white placeholder:text-white/40",
                      inputWrapper:
                        "bg-transparent shadow-none border-0 data-[hover=true]:bg-transparent",
                    }}
                    className="w-full"
                    required
                  />

                  {/* ปุ่มใช้กรอบเดียวกับกรอบใหญ่ */}
                  <Pill className="shrink-0">
                    <button
                      type="submit"
                      className="relative z-10 px-6 py-2 text-sm font-medium"
                    >
                      Book a Demo
                    </button>
                  </Pill>
                </div>
              </form>
            </div>
          </div>
        </motion.section>
      </main>
    </NextUIProvider>
  );
}
