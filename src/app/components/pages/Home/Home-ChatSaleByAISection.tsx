"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Avatar, Image as NextUIImage } from "@nextui-org/react";
import { motion, type Variants, useMotionValue } from "framer-motion";
import { ShoppingCart, Heart, Scale, ArrowDown } from "lucide-react";

/* ---------- Frame ---------- */
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

// นุ่มขึ้น + ใช้ layout animation
const bubbleVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: easeOutCubic,
    },
  },
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
    <motion.div
      layout="position"
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 320, damping: 30, mass: 0.7 }}
      className="w-[180px] shrink-0 rounded-xl bg-white/5 p-2"
    >
      <div className="relative rounded-lg p-1.5">
        {/* ล็อกอัตราส่วนป้องกัน layout shift */}
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

/* ---------- Strip แนวนอน ---------- */
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

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      e.preventDefault();
      const next = Math.max(Math.min(x.get() - e.deltaX, 0), minX);
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
          layout="position"
          className="flex gap-2 will-change-transform"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: minX, right: 0 }}
          dragElastic={0.02}
          transition={{ type: "spring", stiffness: 300, damping: 35, mass: 0.9 }}
        >
          {products.map((p, i) => <ProductMiniCard key={i} p={p} />)}
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- การ์ด ---------- */
function ChartCard({ src, title }: { src: string; title?: string }) {
  return (
    <div className="p-2">
      <div className="w-full rounded-2xl bg-white/[0.03] p-2">
        {/* ล็อกกรอบภาพกัน shift */}
        <div className="flex items-center justify-center overflow-hidden rounded-xl bg-black/10 w-full max-w-[240px] max-h-[160px] mx-auto">
          <NextUIImage alt={title ?? "chart"} src={src} className="w-full h-full object-contain" loading="lazy" />
        </div>
        {title ? <div className="mt-2 text-center text-[10px] text-white/70">{title}</div> : null}
      </div>
    </div>
  );
}

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

/* ---------- Chat Timeline (Loop + Ultra-smooth) ---------- */
type TimelineItem =
  | { kind: "user"; key: string; text: string }
  | { kind: "assistant"; key: string; text: string }
  | { kind: "card"; key: string; idx: number; scenario: Scenario }
  | { kind: "tail"; key: string }
  | { kind: "divider"; key: string };

type InstancedItem = TimelineItem & { instanceId: number }; // key ที่ “เสถียร” ต่อชิ้น

function ScrollableChat() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const y = useMotionValue(0);
  const [minY, setMinY] = useState(0);
  const [autoFollow, setAutoFollow] = useState(true);

  // ลิสต์หลัก (ไม่เปลี่ยน) + state แสดงผลแบบ “instance”
  const MASTER: TimelineItem[] = useMemo(() => {
    const arr: TimelineItem[] = [];
    SCENARIOS.forEach((sc, idx) => {
      sc.userMsgs.forEach((m) => arr.push({ kind: "user", key: m.id, text: m.text }));
      arr.push({ kind: "assistant", key: `s${idx + 1}-a`, text: sc.assistantText });
      arr.push({ kind: "card", key: `s${idx + 1}-c`, idx, scenario: sc });
      arr.push({ kind: "tail", key: `s${idx + 1}-t` });
      if (idx < SCENARIOS.length - 1) arr.push({ kind: "divider", key: `s${idx + 1}-d` });
    });
    return arr;
  }, []);

  const [items, setItems] = useState<InstancedItem[]>([]);
  const nextIdxRef = useRef(0);
  const nextInstanceRef = useRef(1);
  const timerRef = useRef<number | null>(null);

  const BASE_DELAY = 900;
  const VARIANCE = 0.18; // ลด jitter ให้พอดีมือโปร

  const scheduleNext = () => {
    const jitter = 1 + (Math.random() * 2 - 1) * VARIANCE; // 0.82x - 1.18x
    const delay = BASE_DELAY * jitter;
    timerRef.current = window.setTimeout(() => {
      const base = MASTER[nextIdxRef.current];
      const instance: InstancedItem = { ...base, instanceId: nextInstanceRef.current++ };
      setItems((prev) => [...prev, instance]);
      nextIdxRef.current = (nextIdxRef.current + 1) % MASTER.length; // loop
      scheduleNext();
    }, delay) as unknown as number;
  };

  // เริ่มลูปเติมแบบเนียน ๆ
  useEffect(() => {
    if (!items.length) {
      const first: InstancedItem = { ...MASTER[0], instanceId: nextInstanceRef.current++ };
      setItems([first]);
      nextIdxRef.current = 1 % MASTER.length;
      scheduleNext();
    }
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // คำนวณ bounds ทุกครั้งที่ layout เปลี่ยน
  useLayoutEffect(() => {
    const calc = () => {
      const vp = viewportRef.current;
      const ct = contentRef.current;
      if (!vp || !ct) return;
      const viewportH = vp.clientHeight;
      const contentH = ct.scrollHeight;
      const min = Math.min(0, viewportH - contentH);
      setMinY(min);

      const cur = y.get();
      if (cur < min) y.set(min);
      if (cur > 0) y.set(0);
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [y, items.length]);

  // ออโต้สโครลแบบ “lerp” ลื่นมาก ไม่มีเด้งแรง
  useEffect(() => {
    if (!autoFollow) return;
    let raf = 0;
    const smoothFollow = () => {
      const current = y.get();
      const target = minY;
      // alpha 0.18 = ไล่ช้าแต่นุ่ม (ปรับได้ 0.12–0.25)
      const alpha = 0.18;
      const next = current + (target - current) * alpha;
      y.set(Math.abs(next - target) < 0.2 ? target : next);
      if (next !== target) raf = requestAnimationFrame(smoothFollow);
    };
    raf = requestAnimationFrame(smoothFollow);
    return () => cancelAnimationFrame(raf);
  }, [items.length, minY, y, autoFollow]);

  // เลื่อนด้วยเมาส์: ใกล้ native + ลบ momentum แข็ง ๆ ออก
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const next = Math.max(Math.min(y.get() - e.deltaY, 0), minY);
      y.set(next);
      if (e.deltaY < -2) setAutoFollow(false);
    };

    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [y, minY]);

  const scrollToBottom = () => {
    setAutoFollow(true);
    // “ติดพื้น” อย่างนุ่มนวลด้วย lerp รอบถัดไป
  };

  const renderItem = (item: InstancedItem) => {
    const stableKey = `${item.key}#${item.instanceId}`; // คีย์เสถียร—ไม่มี Math.random
    if (item.kind === "user") {
      return (
        <motion.div
          key={stableKey}
          layout="position"
          variants={bubbleVariants}
          initial="hidden"
          animate="visible"
          transition={{ layout: { type: "spring", stiffness: 240, damping: 28, mass: 0.9 } }}
          className="relative flex justify-start"
        >
          <div className="mt-1 mr-3 hidden sm:block">
            <Avatar className="shadow-lg border rounded-full border-white/20 p-0.5" radius="lg" size="sm" src="/images/user.png" name="You" />
          </div>
          <div className="max-w-[46rem] rounded-[22px] rounded-bl-none border border-white/12 bg-gradient-to-b from-white/8 to-white/4 px-5 py-3 text-[15px] leading-relaxed text-white">
            {item.text}
          </div>
        </motion.div>
      );
    }
    if (item.kind === "assistant") {
      return (
        <motion.div
          key={stableKey}
          layout="position"
          variants={bubbleVariants}
          initial="hidden"
          animate="visible"
          transition={{ layout: { type: "spring", stiffness: 240, damping: 28, mass: 0.9 } }}
          className="relative mr-2 flex w-full justify-end"
        >
          <div className="mr-8 w-full max-w-[46rem] rounded-[22px] rounded-br-none border border-white/12 bg-gradient-to-b from-white/10 to-white/5 px-5 py-3 text-right text-[15px] leading-relaxed text-white">
            {item.text}
          </div>
        </motion.div>
      );
    }
    if (item.kind === "card") {
      const idx = item.idx;
      const sc = item.scenario;
      const isFirst = idx === 0;
      const isSecond = idx === 1;
      const isThird = idx === 2;
      const isFourth = idx === 3;
      const isFifth = idx === 4;

      return (
        <motion.div
          key={stableKey}
          layout="position"
          variants={bubbleVariants}
          initial="hidden"
          animate="visible"
          transition={{ layout: { type: "spring", stiffness: 240, damping: 28, mass: 0.9 } }}
          className="relative flex w-full justify-end"
        >
          <Frame radius={22} squareBR className={`w-full ${isFirst ? "max-w-[560px]" : "max-w-[260px]"}`}>
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
      );
    }
    if (item.kind === "tail") {
      return (
        <motion.div
          key={stableKey}
          layout="position"
          variants={bubbleVariants}
          initial="hidden"
          animate="visible"
          transition={{ layout: { type: "spring", stiffness: 240, damping: 28, mass: 0.9 } }}
          className="relative flex w-full justify-start"
        >
          <div className="mt-1 mr-3 hidden sm:block">
            <Avatar className="shadow-lg" radius="lg" size="sm" src="/images/user.png" name="You" />
          </div>
          <div className="max-w-[40rem] rounded-[22px] rounded-bl-none border border-white/12 bg-gradient-to-b from-white/8 to-white/4 px-5 py-3 text-[15px] text-white">
            Awesome, thanks! That’s exactly what I needed 🙌
          </div>
        </motion.div>
      );
    }
    // divider
    return (
      <motion.div
        key={stableKey}
        layout="position"
        className="my-6 flex items-center gap-3"
        transition={{ layout: { type: "spring", stiffness: 240, damping: 28, mass: 0.9 } }}
      >
        <div className="h-px w-full bg-white/10" />
        <span className="text-[10px] uppercase tracking-widest text-white/40">Next</span>
        <div className="h-px w-full bg-white/10" />
      </motion.div>
    );
  };

  return (
    <Frame radius={28} className="relative mx-auto w-full max-w-6xl">
      <section className="overflow-hidden bg-[radial-gradient(1200px_600px_at_50%_-200px,rgba(63,63,70,0.18),transparent_60%)] from-zinc-950 to-black px-5 py-10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] md:px-10">
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 z-10" />
          <div ref={viewportRef} className="relative max-h-[560px] overflow-hidden pr-1 md:pr-2">
            <motion.div
              ref={contentRef}
              layout // เปิด FLIP ทั้งคอลัมน์
              className="pb-14 pt-2 space-y-6 will-change-transform"
              style={{ y }}
              drag="y"
              dragElastic={0}
              onDrag={(e, info) => {
                const cur = y.get();
                const next = Math.max(Math.min(cur + info.delta.y, 0), minY);
                y.set(next);
                if (info.delta.y > 2) setAutoFollow(false);
              }}
              onDragEnd={() => {
                // ปล่อยเฉย ๆ ให้ lerp จบแทน spring กระชาก
              }}
              transition={{ layout: { type: "spring", stiffness: 220, damping: 26, mass: 1 } }}
            >
              {items.map(renderItem)}
            </motion.div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 z-10" />

          {/* ปุ่มกลับไปล่างสุด */}
          {Math.abs(y.get() - minY) > 6 && (
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
    <main className="px-0 mt-40 md:px-0">
      <div className="w-full ">
        <div className="mb-8 text-center">
          <p className="mb-3 font-semibold text-lg text-[#676767] lg:text-xl">The Future of Smart Sales</p>
          <h2 className="text-xl text-white lg:text-[40px]">Chat sale by AI</h2>
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
