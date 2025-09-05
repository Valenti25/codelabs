"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Avatar, Image as NextUIImage } from "@nextui-org/react";
import {
  motion,
  type Variants,
  useMotionValue,
  animate,
} from "framer-motion";
import { ShoppingCart, Heart, Scale, ArrowDown } from "lucide-react";

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
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: easeOutCubic } },
};

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

/* ---------- Strip สินค้า: ใช้ motion.drag แนวนอน ไม่มี scrollbar ---------- */
function FirstScenarioProductsStrip({ products }: { products: ProductInfo[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const [minX, setMinX] = useState(0);

  useLayoutEffect(() => {
    const calc = () => {
      const track = trackRef.current;
      const wrap = wrapRef.current;
      if (!track || !wrap) return;
      const trackW = track.scrollWidth;
      const wrapW = wrap.clientWidth;
      setMinX(Math.min(0, wrapW - trackW - 8));
      // clamp ค่า x ให้ยังอยู่ในช่วงหลัง reflow
      const cur = x.get();
      if (cur < wrapW - trackW - 8) x.set(wrapW - trackW - 8);
      if (cur > 0) x.set(0);
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [x]);

  // ล้อเมาส์แนวนอน (ปกติ)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      e.preventDefault();
      const speed = 1; // = ความเร็วธรรมชาติ
      const next = Math.max(Math.min(x.get() - e.deltaX * speed, 0), minX);
      x.set(next);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [x, minX]);

  return (
    <div className="p-2">
      <div ref={wrapRef} className="relative rounded-2xl bg-white/[0.03] p-2 overflow-hidden">
        <motion.div
          ref={trackRef}
          className="flex gap-2 will-change-transform"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: minX, right: 0 }}
          dragElastic={0.02}
          dragTransition={{
            power: 0.25,
            timeConstant: 140,
            modifyTarget: (t) => Math.max(Math.min(t, 0), minX),
          }}
        >
          {products.map((p, i) => <ProductMiniCard key={i} p={p} />)}
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- การ์ดกราฟ ---------- */
function ChartCard({ src, title }: { src: string; title?: string }) {
  return (
    <div className="p-2">
      <div className="w-full rounded-2xl bg-white/[0.03] p-2">
        <div className="flex items-center justify-center overflow-hidden rounded-xl bg-black/10">
          <NextUIImage
            alt={title ?? "chart"}
            src={src}
            className="w-full max-w-[240px] max-h-[160px] object-contain"
            loading="lazy"
          />
        </div>
        {title ? <div className="mt-2 text-center text-[10px] text-white/70">{title}</div> : null}
      </div>
    </div>
  );
}

/* ---------- การ์ดตาราง ---------- */
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

function ScrollableChat() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const y = useMotionValue(0);
  const [minY, setMinY] = useState(0);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const blocks = SCENARIOS.map((sc, idx) => {
    const isFirst = idx === 0;
    const isSecond = idx === 1;
    const isThird = idx === 2;
    const isFourth = idx === 3;
    const isFifth = idx === 4;

    return (
      <div key={`block-${idx}`} className="space-y-4 ">
        {/* user bubbles */}
        {sc.userMsgs.map((m) => (
          <motion.div
            key={m.id}
            variants={bubbleVariants}
            initial="hidden"
            animate="visible"
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

        {/* assistant bubble */}
        <motion.div
          variants={bubbleVariants}
          initial="hidden"
          animate="visible"
          className="relative  mr-2 flex w-full justify-end"
        >
          <div className="mr-8 w-full max-w-[46rem] rounded-[22px] rounded-br-none border border-white/12 bg-gradient-to-b from-white/10 to-white/5 px-5 py-3 text-right text-[15px] leading-relaxed text-white">
            {sc.assistantText}
          </div>

        </motion.div>

        {/* content card */}
        <motion.div
          variants={bubbleVariants}
          initial="hidden"
          animate="visible"
          className="relative flex w-full justify-end"
        >
          <Frame radius={22} squareBR className={`w-full ${idx === 0 ? "max-w-[560px]" : "max-w-[260px]"}`}>
            {isFirst ? (
              <FirstScenarioProductsStrip products={sc.products ?? [sc.product]} />
            ) : isSecond ? (
              <ChartCard src={sc.product.image} title={sc.product.title} />
            ) : isThird ? (
              <SummaryTableCard title={sc.product.title} />
            ) : isFourth ? (
              <ChartCard src={sc.product.image} title={sc.product.title} />
            ) : isFifth ? (
              <ChartCard src={sc.product.image} title={sc.product.title} />
            ) : null}
          </Frame>
        </motion.div>

        {/* small thank-you tail */}
        <motion.div
          variants={bubbleVariants}
          initial="hidden"
          animate="visible"
          className="relative flex w-full justify-start"
        >
          <div className="mt-1 mr-3 hidden sm:block">
            <Avatar className="shadow-lg" radius="lg" size="sm" src="/images/user.png" name="You" />
          </div>
          <div className="max-w-[40rem] rounded-[22px] rounded-bl-none border border-white/12 bg-gradient-to-b from-white/8 to-white/4 px-5 py-3 text-[15px] text-white">
            Awesome, thanks! That’s exactly what I needed 🙌
          </div>
        </motion.div>

        {idx < SCENARIOS.length - 1 && (
          <div className="my-6 flex items-center gap-3">
            <div className="h-px w-full bg-white/10" />
            <span className="text-[10px] uppercase tracking-widest text-white/40">Next</span>
            <div className="h-px w-full bg-white/10" />
          </div>
        )}
      </div>
    );
  });

  // คำนวณ bounds
  useLayoutEffect(() => {
    const calc = () => {
      const vp = viewportRef.current;
      const ct = contentRef.current;
      if (!vp || !ct) return;
      const viewportH = vp.clientHeight;
      const contentH = ct.scrollHeight;
      const min = Math.min(0, viewportH - contentH);
      setMinY(min);

      // clamp y เข้าช่วงเมื่อ reflow
      const cur = y.get();
      if (cur < min) y.set(min);
      if (cur > 0) y.set(0);
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [y]);

  // แสดงปุ่มไปล่างสุดเมื่อยังไม่ถึงล่างสุด
  useEffect(() => {
    const unsub = y.on("change", (val) => {
      setShowScrollToBottom(Math.abs(val - minY) > 6);
    });
    return () => unsub();
  }, [y, minY]);

  // รองรับล้อเมาส์: ความเร็ว “ปกติ”
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const speed = 1; // 1 = พฤติกรรม native โดยรวม
      const target = Math.max(Math.min(y.get() - e.deltaY * speed, 0), minY);
      y.set(target);
    };

    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [y, minY]);

  const scrollToBottom = () => {
    // ใช้ inertia ให้ความรู้สึกเหมือน native fling
    animate(y, minY, {
      type: "inertia",
      velocity: -1200, // ให้พุ่งลงเร็วเล็กน้อย
      min: minY,
      max: 0,
      power: 0.8,
      timeConstant: 220,
      bounceStiffness: 700,
      bounceDamping: 50,
      modifyTarget: (t) => Math.max(Math.min(t, 0), minY),
    });
  };

  return (
    <Frame radius={28} className="relative mx-auto w-full max-w-6xl">
      {/* พื้นหลังแสงนุ่ม ๆ */}
      <section className="overflow-hidden bg-[radial-gradient(1200px_600px_at_50%_-200px,rgba(63,63,70,0.18),transparent_60%)] from-zinc-950 to-black px-5 py-10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] md:px-10">
        <div className="relative">
          {/* Top fade mask */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 z-10" />

          {/* Viewport สูงคงที่ + ไม่มี scrollbar */}
          <div
            ref={viewportRef}
            className="relative max-h-[560px] overflow-hidden pr-1 md:pr-2"
          >
            {/* Content ขยับด้วย motion.y */}
            <motion.div
              ref={contentRef}
              className="pb-14 pt-2 space-y-6 will-change-transform"
              style={{ y }}
              drag="y"
              dragElastic={0}
              onDrag={(e, info) => {
                const next = Math.max(Math.min(y.get() + info.delta.y, 0), minY);
                y.set(next);
              }}
              onDragEnd={(e, info) => {
                animate(y, 0, {
                  type: "inertia",
                  velocity: info.velocity.y,
                  min: minY,
                  max: 0,
                  power: 0.8,
                  timeConstant: 220,
                  bounceStiffness: 700,
                  bounceDamping: 50,
                  modifyTarget: (t) => Math.max(Math.min(t, 0), minY),
                });
              }}
            >
              {blocks}
            </motion.div>
          </div>

          {/* Bottom fade mask */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 z-10" />

          {/* ปุ่มเลื่อนไปล่างสุด */}
          {showScrollToBottom && (
            <button
              onClick={scrollToBottom}
              className="group absolute bottom-4 right-4 z-20 rounded-full bg-white/10 px-3 py-2 backdrop-blur transition hover:bg-white/20"
              aria-label="Scroll to latest"
            >
              <span className="flex items-center gap-2 text-xs text-white/80">
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                ไปข้อความล่าสุด
              </span>
            </button>
          )}
        </div>
      </section>
    </Frame>
  );
}

/* ---------- Page ---------- */
export default function Page() {
  return (
    <main className="px-0  mt-40 md:px-0">
      <div className="w-full ">
        <div className="mb-8  text-center">
          <p className="mb-3 text-sm text-[#676767] lg:text-xl">The Future of Smart Sales</p>
          <h2 className="text-xl text-white lg:text-[40px]">Chat sale by AI</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/50">
            เลื่อนอ่านแชทได้ตามปกติ ส่วนที่เกินจะถูกซ่อนในกรอบ — ดูการแนะนำสินค้า/กราฟ/ตารางได้ต่อเนื่อง
          </p>
        </div>
        <ScrollableChat />
        <div className="mx-auto mt-10 flex max-w-sm items-center justify-center text-center font-semibold">
          <p className="text-[#676767]">
            An AI-powered sales assistant that chats, qualifies, recommends, and helps close deals — 24/7.
          </p>
        </div>
      </div>
    </main>
  );
}
