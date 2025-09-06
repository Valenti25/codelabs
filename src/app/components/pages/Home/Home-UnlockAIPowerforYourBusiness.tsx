"use client";

import React, { useRef, useState } from "react";
import { NextUIProvider, Input } from "@nextui-org/react";
import { motion } from "framer-motion";
import ModelRot from "../../ModelsObject/ModelRobot";

/* ---------- Capsule + Hover Light (ใช้แทน Pill เดิม) ---------- */
function HoverPill({
  children,
  className = "",
  rounded = "rounded-full",
  glowRadius = 200, // ปรับรัศมีแสงได้
}: {
  children: React.ReactNode;
  className?: string;
  rounded?: string;
  glowRadius?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={[
        "group relative overflow-hidden card-outer-bg card-outer-shadow p-[1px]",
        rounded,
        className,
      ].join(" ")}
    >
      {/* แสงตามเมาส์แบบเดียวกับการ์ดหน้า Landing */}
      <div
        className={[
          "pointer-events-none absolute inset-0 z-0 opacity-0",
          "transition-opacity duration-300 group-hover:opacity-100",
        ].join(" ")}
        style={{
          background: `radial-gradient(
            circle ${glowRadius}px at ${pos.x}px ${pos.y}px,
            rgba(255,255,255,0.14),
            transparent 55%
          )`,
        }}
      />
      <div className={["relative z-10 card-inner-bg card-inner-blur", rounded].join(" ")}>
        {children}
      </div>
    </div>
  );
}

/* ---------- กล่องข้อความ (contentEditable) ---------- */
function CEMessage({
  name = "message",
  placeholder = "Your Message",
  className = "",
  maxLength = 4000,
  singleLine = false,
}: {
  name?: string;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  singleLine?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState("");

  const sync = () => {
    const txt = (ref.current?.innerText ?? "").replace(/\r\n?/g, "\n");
    setValue(txt.slice(0, maxLength));
  };

  const onInput = () => {
    if (!ref.current) return;
    const txt = ref.current.innerText ?? "";
    if (txt.length > maxLength) {
      const cut = txt.slice(0, maxLength);
      ref.current.innerText = cut;
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    sync();
  };

  const onPaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (singleLine && e.key === "Enter") {
      e.preventDefault();
      return;
    }
    if (!singleLine && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sync();
      const form = e.currentTarget.closest("form") as HTMLFormElement | null;
      if (form) form.requestSubmit();
    }
  };

  const base =
    "w-full bg-transparent outline-none text-white break-words " +
    "before:pointer-events-none before:absolute before:left-4 before:text-white/35 before:select-none " +
    "rounded-[999px]";
  const asSingle =
    "h-[52px] md:h-[56px] px-4 flex items-center overflow-hidden whitespace-nowrap " +
    "before:top-1/2 before:-translate-y-1/2 empty:before:content-[attr(data-placeholder)] focus:before:content-['']";
  const asMulti =
    "px-4 py-3 h-28 md:h-32 overflow-y-auto whitespace-pre-wrap " +
    "before:top-3 empty:before:content-[attr(data-placeholder)] focus:before:content-['']";

  return (
    <div className={`relative ${className}`}>
      <div
        ref={ref}
        role="textbox"
        aria-multiline={!singleLine}
        contentEditable
        spellCheck={true}
        inputMode="text"
        onInput={onInput}
        onPaste={onPaste}
        onKeyDown={onKeyDown}
        data-placeholder={placeholder}
        className={[base, singleLine ? asSingle : asMulti].join(" ")}
      />
      <input type="hidden" name={name} value={value} />
    </div>
  );
}

/* ---------- หน้าเต็ม ---------- */
export default function Page() {
  // เบอร์โทร: ยอมให้เฉพาะตัวเลข
  const [phone, setPhone] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) {
      alert("Please fill in your name, email, and message.");
      return;
    }
    console.log(Object.fromEntries(data.entries()));
    alert("Message sent!");
  };

  return (
    <NextUIProvider>
      <main className="w-full bg-black text-white flex items-center justify-center px-4 sm:px-8 py-10 sm:py-16">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-6xl"
        >
          {/* Heading + 3D */}
          <div className="max-w-3xl pointer-events-none flex items-center justify-center mx-auto">
            <ModelRot />
          </div>
          <h1 className="text-center text-[36px] sm:text-[48px] md:text-[56px] leading-none font-extrabold tracking-[0.02em] uppercase">
            GET IN TOUCH
          </h1>
          <p className="mt-3 text-center text-sm sm:text-base text-white/70">
            Empower your business with Codelabs AI. Let’s transform the way you work.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {/* Name */}
              <HoverPill rounded="rounded-full">
                <Input
                  name="name"
                  aria-label="Your Name"
                  placeholder="Your Name"
                  variant="flat"
                  radius="full"
                  size="lg"
                  className="w-full"
                  classNames={{
                    input: "text-white placeholder:text-white/35 text-[16px]",
                    inputWrapper:
                      "bg-transparent shadow-none border-0 data-[hover=true]:bg-transparent",
                  }}
                  required
                />
              </HoverPill>

              {/* Phone (numbers only) */}
              <HoverPill rounded="rounded-full">
                <Input
                  name="phone"
                  aria-label="Phone Number"
                  placeholder="Phone Number"
                  variant="flat"
                  radius="full"
                  size="lg"
                  className="w-full"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={20}
                  value={phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    setPhone(digits);
                  }}
                  onKeyDown={(e) => {
                    const allow = [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                      "Home",
                      "End",
                    ];
                    if (!/[0-9]/.test(e.key) && !allow.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const text = e.clipboardData.getData("text/plain");
                    const digits = text.replace(/\D/g, "");
                    setPhone((prev) => (prev + digits).slice(0, 20));
                  }}
                  classNames={{
                    input: "text-white placeholder:text-white/35 text-[16px]",
                    inputWrapper:
                      "bg-transparent shadow-none border-0 data-[hover=true]:bg-transparent",
                  }}
                />
              </HoverPill>

              {/* Email */}
              <HoverPill rounded="rounded-full">
                <Input
                  name="email"
                  type="email"
                  aria-label="Email Address"
                  placeholder="Email Address"
                  variant="flat"
                  radius="full"
                  size="lg"
                  className="w-full"
                  classNames={{
                    input: "text-white placeholder:text-white/35 text-[16px]",
                    inputWrapper:
                      "bg-transparent shadow-none border-0 data-[hover=true]:bg-transparent",
                  }}
                  required
                />
              </HoverPill>

              {/* Subject */}
              <HoverPill rounded="rounded-full">
                <Input
                  name="subject"
                  aria-label="Subject"
                  placeholder="Subject"
                  variant="flat"
                  radius="full"
                  size="lg"
                  className="w-full"
                  classNames={{
                    input: "text-white placeholder:text-white/35 text-[16px]",
                    inputWrapper:
                      "bg-transparent shadow-none border-0 data-[hover=true]:bg-transparent",
                  }}
                />
              </HoverPill>

              {/* Message (single line, สูงเท่าช่องอื่น) */}
              <HoverPill className="md:col-span-2" rounded="rounded-full">
                <CEMessage name="message" placeholder="Your Message" singleLine />
              </HoverPill>
            </div>

            {/* ปุ่ม Send */}
            <div className="mt-8 flex justify-center">
              <HoverPill className="px-[2px] py-[2px]" rounded="rounded-full" glowRadius={140}>
                <button
                  type="submit"
                  className="relative z-10 px-10 py-3 text-sm font-medium"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.0))",
                    borderRadius: 999,
                  }}
                >
                  Send
                </button>
              </HoverPill>
            </div>
          </form>
        </motion.section>
      </main>
    </NextUIProvider>
  );
}
