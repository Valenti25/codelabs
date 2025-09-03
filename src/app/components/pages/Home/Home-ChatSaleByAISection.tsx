"use client";

import React, { useEffect, useRef, useState } from "react";
import { Avatar, Image as NextUIImage } from "@nextui-org/react";
import {
  motion,
  useInView,
  useMotionValue,
  animate,
  type Variants,
  type PanInfo, // ← เพิ่มแบบ import type
} from "framer-motion";
import { ShoppingCart, Heart, Scale } from "lucide-react";

/* ---------- Frame (กรอบเดียวของทุกการ์ด) ---------- */
const Frame = ({
  radius = 22,
  className = "",
  children,
  squareBR = false,
}: {
  radius?: number;
  className?: string;
  children: React.ReactNode;
  squareBR?: boolean;
}) => {
  const inner = Math.max(0, radius - 1);
  const outerStyle: React.CSSProperties = { borderRadius: radius };
  const innerStyle: React.CSSProperties = { borderRadius: inner, overflow: "hidden" };
  if (squareBR) {
    outerStyle.borderBottomRightRadius = 0;
    innerStyle.borderBottomRightRadius = 0;
  }
  return (
    <div className={`card-outer-bg card-outer-shadow p-[1px] ${className}`} style={outerStyle}>
      <div className="card-inner-bg card-inner-blur" style={innerStyle}>{children}</div>
    </div>
  );
};

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

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-white/80"
          initial={{ opacity: 0.25, y: 0 }}
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ---------- Types & Data ---------- */
type Msg = { id: string; role: "user" | "assistant"; text: string };
type ProductInfo = {
  image: string;
  title: string;
  price?: number;
  originalPrice?: number;
  stock?: number;
  specs?: string[];
  category?: string;
};
type Scenario = {
  userMsgs: Msg[];
  assistantText: string;
  product: ProductInfo;
  products?: ProductInfo[];
};

const SCENARIOS: Scenario[] = [
  {
    userMsgs: [{ id: "s1-u1", role: "user", text: "I’m looking for wireless earbuds — mostly for music while working." }],
    assistantText: "Got it ✨ The AirPods Pro 2 are lightweight, with excellent noise cancelling and seamless pairing.",
    products: [
      { image: "/images/airpods-pro.png", title: "Pods Pro 2 (M2)", price: 8990, originalPrice: 11990, stock: 2, category: "Earbuds", specs: ["ANC", "Adaptive Transparency", "MagSafe Case"] },
      { image: "/images/airpods-pro.png", title: "Pods Lite", price: 4990, originalPrice: 5990, stock: 5, category: "Earbuds", specs: ["ENC Calls", "IPX4", "USB-C Fast Charge"] },
      { image: "/images/airpods-pro.png", title: "Pods Max Mini", price: 6990, originalPrice: 7990, stock: 3, category: "Earbuds", specs: ["Spatial Audio", "ANC", "Low Latency"] },
      { image: "/images/airpods-pro.png", title: "Pods Sport", price: 4590, stock: 8, category: "Earbuds", specs: ["Secure Fit", "Sweat-resistant", "Ambient Mode"] },
    ],
    product: { image: "/images/airpods-pro.png", title: "Pods Pro 2 (M2)" },
  },
  {
    userMsgs: [{ id: "s2-u1", role: "user", text: "Could you show me a simple business chart for this year? I just want a quick overview." }],
    assistantText:
      "Got it ✨ Here’s a sample chart showing the overall business trend for this year. It’s a simplified view to help you get the big picture at a glance.",
    product: { image: "/images/imgchat2.png", title: "Business Overview 2023" },
  },
  {
    userMsgs: [{ id: "s3-u1", role: "user", text: "Could you show me a simple business table for this year? I’d like to see a summary in rows and columns instead of a chart." }],
    assistantText:
      "Sure 📋 Here’s a sample business summary table for this year. It’s a compact view so you can quickly compare key metrics side by side.",
    product: { image: "", title: "Business Summary 2023" },
  },
  {
    userMsgs: [{ id: "s4-u1", role: "user", text: "I’m reviewing some business data and I’d like to see it in a simple chart. Could you show me a bar chart that summarizes this year’s performance overall?" }],
    assistantText:
      "Got it 📊 Here’s a sample bar chart that shows the overall revenue trend for 2025. This gives you a clear quarterly view so you can quickly spot the growth pattern.",
    product: { image: "/images/imgchat4.png", title: "Business Summary 2023" },
  },
  {
    userMsgs: [{ id: "s5-u1", role: "user", text: "I’d like to see how our revenue has been changing throughout the year. Could you provide me with a simple line chart that shows the quarterly trend?" }],
    assistantText:
      "Got it 🧾 Here’s a line chart that illustrates the revenue pattern for 2025. This lets you track the ups and downs across each quarter at a glance.",
    product: { image: "/images/imgchat5.png", title: "Business Revenue Trend 2025" },
  },
];

const currencyTHB = (n: number) =>
  n.toLocaleString("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

/* ---------- Product mini card ---------- */
function ProductMiniCard({ p }: { p: ProductInfo }) {
  return (
    <motion.div whileHover={{ y: -1 }} className="w-[180px] shrink-0 rounded-xl bg-white/5 p-2">
      <div className="relative rounded-lg p-1.5">
        {p.category && (
          <span className="absolute left-2 top-2 rounded-full px-1.5 py-0.5 text-[9px] text-white/80">
            {p.category}
          </span>
        )}
        <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-black/10">
          <NextUIImage alt={p.title} src={p.image} className="h-full w-full object-contain" />
        </div>
      </div>

      <div className="mt-2 space-y-1 text-[11px] leading-snug">
        <div className="line-clamp-2 text-[12px] font-medium text-zinc-100">{p.title}</div>
        {p.specs?.length ? (
          <ul className="list-disc space-y-0.5 pl-4 text-[10px] text-white/70">
            {p.specs.slice(0, 2).map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        ) : null}
        {p.stock !== undefined && <div className="text-[10px] text-white/60">มีในสต็อก: {p.stock}</div>}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button className="grid h-7 w-7 place-items-center rounded-lg bg-white/5"><ShoppingCart className="h-3.5 w-3.5 text-white/85" /></button>
          <button className="grid h-7 w-7 place-items-center rounded-lg bg-white/5"><Heart className="h-3.5 w-3.5 text-white/85" /></button>
          <button className="grid h-7 w-7 place-items-center rounded-lg bg-white/5"><Scale className="h-3.5 w-3.5 text-white/85" /></button>
        </div>
        <div className="text-right">
          {typeof p.originalPrice === "number" && <div className="text-[10px] text-white/45 line-through">{currencyTHB(p.originalPrice)}</div>}
          {typeof p.price === "number" && <div className="text-[14px] font-semibold gradient-text-animated">{currencyTHB(p.price)}</div>}
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Strip สินค้า (drag + snap) ---------- */
function FirstScenarioProductsStrip({ products }: { products: ProductInfo[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const CARD = 180, GAP = 8, STEP = CARD + GAP;

  const [limits, setLimits] = useState({ left: 0, right: 0 });
  const [maxIndex, setMaxIndex] = useState(0);

  useEffect(() => {
    const measure = () => {
      const vw = viewportRef.current?.clientWidth ?? 0;
      const contentW = products.length * STEP - GAP;
      const left = Math.min(0, vw - contentW);
      setLimits({ left, right: 0 });

      const visible = Math.max(1, Math.floor(vw / STEP));
      setMaxIndex(Math.max(0, products.length - visible));

      const current = x.get();
      if (current < left) x.set(left);
      if (current > 0) x.set(0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [products.length, STEP, x]);

 const handleDragEnd = (_evt: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
  const current = x.get();
  const projected = current + info.velocity.x * 0.25;
  const rawIndex = Math.round(-projected / STEP);
  const clamped = Math.min(Math.max(rawIndex, 0), maxIndex);
  animate(x, -clamped * STEP, { type: "spring", stiffness: 320, damping: 32 });
};

  return (
    <div className="p-2">
      <div ref={viewportRef} className="relative overflow-hidden rounded-2xl bg-white/[0.03] p-2">
        <motion.div
          className="flex gap-2"
          style={{ x, cursor: "grab" }}
          drag="x"
          dragElastic={0.06}
          dragConstraints={limits}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: "grabbing" }}
        >
          {products.map((p, i) => <ProductMiniCard key={i} p={p} />)}
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- การ์ดกราฟ (ย่อให้ไม่ล้น/พอดีกับ 260px) ---------- */
function ChartCard({ src, title }: { src: string; title?: string }) {
  return (
    <div className="p-2">
      <div className="w-full rounded-2xl bg-white/[0.03] p-2">
        <div className="flex items-center justify-center overflow-hidden rounded-xl bg-black/10">
          <NextUIImage
            alt={title ?? "chart"}
            src={src}
            className="w-full max-w-[240px] max-h-[150px] md:max-h-[160px] object-contain"
          />
        </div>
        {title ? <div className="mt-2 text-center text-[10px] text-white/70">{title}</div> : null}
      </div>
    </div>
  );
}

/* ---------- การ์ดตาราง (ขนาดคงที่กับกราฟ) ---------- */
function SummaryTableCard({ title }: { title?: string }) {
  const rows = [
    { q: "Q1", rev: "$120", growth: "+12%" },
    { q: "Q2", rev: "$135", growth: "+19%" },
    { q: "Q3", rev: "$150", growth: "+8%" },
    { q: "Q4", rev: "$170", growth: "+13%" },
  ];
  return (
    <div className="p-2">
      <div className="w-full rounded-2xl bg-white/[0.03] p-2">
        {title ? <div className="mb-2 text-center text-[10px] font-medium text-white/80">{title}</div> : null}
        <div className="overflow-hidden rounded-lg">
          <table className="w-full min-w-0 text-left text-[10px] text-white/80">
            <thead className="bg-white/[0.06]">
              <tr>
                <th className="px-2 py-1.5">Quarter</th>
                <th className="px-2 py-1.5">Revenue</th>
                <th className="px-2 py-1.5">Growth%</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="odd:bg-white/[0.03]">
                  <td className="px-2 py-1.5">{r.q}</td>
                  <td className="px-2 py-1.5">{r.rev}</td>
                  <td className="px-2 py-1.5">{r.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------- Demo ---------- */
function EarbudsChatDemo() {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(triggerRef, { amount: 0.3, once: false, margin: "-10% 0px -10% 0px" });

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const scenario = SCENARIOS[scenarioIdx];

  const [revealedUserCount, setRevealedUserCount] = useState(0);
  const [assistantVisible, setAssistantVisible] = useState(false);
  const [productVisible, setProductVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [thanksVisible, setThanksVisible] = useState(false);

  const runIdRef = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const myRun = ++runIdRef.current;

    setRevealedUserCount(0);
    setAssistantVisible(false);
    setProductVisible(false);
    setImgLoaded(false);
    setThanksVisible(false);

    const sleep = (ms: number) =>
      new Promise<void>((res) => setTimeout(() => (runIdRef.current === myRun ? res() : void 0), ms));

    const USER_BUBBLE_GAP = 650;
    const ASSISTANT_DELAY = 150;
    const HOLD_AFTER_ASSISTANT = 650;
    const HOLD_BEFORE_THANKS = 360;
    const HOLD_END = 4200;

    (async () => {
      for (let i = 0; i < scenario.userMsgs.length; i++) {
        if (runIdRef.current !== myRun) return;
        setRevealedUserCount(i + 1);
        await sleep(USER_BUBBLE_GAP);
      }

      await sleep(ASSISTANT_DELAY);
      if (runIdRef.current !== myRun) return;
      setAssistantVisible(true);

      await sleep(HOLD_AFTER_ASSISTANT);
      if (runIdRef.current !== myRun) return;
      setProductVisible(true);

      await sleep(HOLD_BEFORE_THANKS);
      if (runIdRef.current !== myRun) return;
      setThanksVisible(true);

      await sleep(HOLD_END);
      if (runIdRef.current !== myRun) return;
      setScenarioIdx((idx) => (idx + 1) % SCENARIOS.length);
    })();

    return () => { runIdRef.current++; };
  }, [scenarioIdx, inView, scenario]);

  useEffect(() => { if (!inView) runIdRef.current++; }, [inView]);

  const isFirst  = scenarioIdx === 0;
  const isSecond = scenarioIdx === 1;
  const isThird  = scenarioIdx === 2;
  const isFourth = scenarioIdx === 3;
  const isFifth  = scenarioIdx === 4;

  // ทำให้ขนาด consistent: แชท 1 = 560px, ที่เหลือ = 260px
  const frameWidthClass = isFirst ? "max-w-[560px]" : "max-w-[260px]";

  return (
    <Frame radius={28} className="relative mx-auto w-full max-w-6xl">
      <section className="overflow-hidden bg-[radial-gradient(1200px_600px_at_50%_-200px,rgba(63,63,70,0.18),transparent_60%)] from-zinc-950 to-black px-5 py-10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] md:px-10">
        <div className="min-h-[470px] w-full md:min-h-[540px]">
          <div className="w-full space-y-6">
            <div ref={triggerRef} className="h-1 w-full" />

            {/* User bubbles */}
            {scenario.userMsgs.slice(0, revealedUserCount).map((m, idx) => (
              <motion.div
                key={m.id}
                variants={bubbleVariants}
                initial="hidden"
                animate="visible"
                custom={idx}
                className="relative flex justify-start"
              >
                <div className="mt-1 mr-3 hidden sm:block">
                  <Avatar className="shadow-lg border rounded-full border-white/20 p-0.5" radius="lg" size="sm" src="/images/user.png" name="You" />
                </div>
                <div className="max-w-[46rem] rounded-[22px] rounded-bl-none border border-white/12 bg-gradient-to-b from-white/8 to-white/4 px-5 py-3 text-[15px] leading-relaxed text-white">
                  {m.text}
                </div>
              </motion.div>
            ))}

            {/* Assistant bubble */}
            {revealedUserCount === scenario.userMsgs.length && assistantVisible && (
              <motion.div
                variants={bubbleVariants}
                initial="hidden"
                animate="visible"
                custom={2}
                className="relative mr-2 flex w-full justify-end"
              >
                <div className="mr-8 w-full max-w-[46rem] rounded-[22px] rounded-br-none border border-white/12 bg-gradient-to-b from-white/10 to-white/5 px-5 py-3 text-right text-[15px] leading-relaxed text-white">
                  {scenario.assistantText}
                </div>

                <div className="absolute top-1/2 -right-10 hidden -translate-y-1/2 pr-5 md:block">
                  <Frame radius={28}>
                    <button aria-label="Action" className="flex h-10 w-10 items-center justify-center">
                      <Avatar className="shadow-lg" radius="lg" size="sm" src="/images/starai.png" name="AI" />
                    </button>
                  </Frame>
                </div>
              </motion.div>
            )}

            {/* Product / Chart / Table area */}
            {(assistantVisible || productVisible) && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: easeOutCubic }}
                className="relative flex w-full justify-end"
              >
                {!productVisible && (
                  <Frame radius={22} squareBR className={`w-full ${frameWidthClass}`}>
                    <div className="flex items-center justify-center gap-2 px-6 py-8">
                      <ThinkingDots />
                      <span className="text-xs text-white/70">กำลังพิม</span>
                    </div>
                  </Frame>
                )}

                {productVisible && (
                  <Frame radius={22} squareBR className={`w-full ${frameWidthClass}`}>
                    {isFirst ? (
                      <FirstScenarioProductsStrip products={scenario.products ?? [scenario.product]} />
                    ) : isSecond ? (
                      <ChartCard src={scenario.product.image} title={scenario.product.title} />
                    ) : isThird ? (
                      <SummaryTableCard title={scenario.product.title} />
                    ) : isFourth ? (
                      <ChartCard src={scenario.product.image} title={scenario.product.title} />
                    ) : isFifth ? (
                      <ChartCard src={scenario.product.image} title={scenario.product.title} />
                    ) : null}
                  </Frame>
                )}
              </motion.div>
            )}

            {/* Final ack */}
            {thanksVisible && (
              <motion.div
                variants={bubbleVariants}
                initial="hidden"
                animate="visible"
                custom={3}
                className="relative flex w-full justify-start"
              >
                <div className="mt-1 mr-3 hidden sm:block">
                  <Avatar className="shadow-lg" radius="lg" size="sm" src="/images/user.png" name="You" />
                </div>
                <div className="max-w-[40rem] rounded-[22px] rounded-bl-none border border-white/12 bg-gradient-to-b from-white/8 to-white/4 px-5 py-3 text-[15px] text-white">
                  Awesome, thanks! That’s exactly what I needed 🙌
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </Frame>
  );
}

/* ---------- Page ---------- */
export default function Page() {
  return (
    <main className="px-0 mt-40 md:px-0">
      <div className="w-full">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm text-[#676767] lg:text-xl">The Future of Smart Sales</p>
          <h2 className="text-xl text-white lg:text-[40px]">Chat sale by AI</h2>
        </div>
        <EarbudsChatDemo />
        <div className="mx-auto mt-10 flex max-w-sm items-center justify-center text-center font-semibold">
          <p className="text-[#676767]">
            An AI-powered sales assistant that chats, qualifies, recommends, and helps close deals — 24/7.
          </p>
        </div>
      </div>
    </main>
  );
}
