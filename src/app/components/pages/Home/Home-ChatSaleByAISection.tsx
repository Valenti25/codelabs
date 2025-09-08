"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Avatar, Image as NextUIImage } from "@nextui-org/react";
import {
  motion,
  type Variants,
  useMotionValue,
  useSpring,
  MotionConfig,
  useReducedMotion,
} from "framer-motion";
import { ShoppingCart, Heart, Scale, ArrowDown } from "lucide-react";

const CARD_W = 320;       
const CARD_MEDIA_H = 180;    
const CARD_PLACEHOLDER_H = 230; 

/* ---------- Frame ---------- */
const Frame = ({
  radius = 22,
  className = "",
  children,
  squareBR = false,
  style,
}: {
  radius?: number;
  className?: string;
  children: React.ReactNode;
  squareBR?: boolean;
  style?: React.CSSProperties;
}) => {
  const inner = Math.max(0, radius - 1);
  const outerStyle: React.CSSProperties = { borderRadius: radius, ...(style ?? {}) };
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

/* ---------- Motion presets ---------- */
const easeOutCubic = [0.33, 1, 0.68, 1] as const;
const SPRING_BUBBLE = { type: "spring", stiffness: 280, damping: 30, mass: 0.9 } as const;
const SPRING_LAYOUT = { type: "spring", stiffness: 220, damping: 26, mass: 1 } as const;
const SPRING_SCROLL = { stiffness: 180, damping: 24, mass: 0.9 } as const;

/* ---------- Variants ---------- */
const bubbleVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.985, filter: "blur(3px)" },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { ...SPRING_BUBBLE, ease: easeOutCubic },
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
    userMsgs: [{ id: "s1-u1", role: "user", text: "I'm looking for wireless earbuds — mostly for music while working." }],
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
      "Got it ✨ Here's a sample chart showing the overall business trend for this year. It's a simplified view to help you get the big picture at a glance.",
    product: { image: "/images/imgchat2.png", title: "Business Overview 2023" },
  },
  {
    userMsgs: [{ id: "s3-u1", role: "user", text: "Could you show me a simple business table for this year? I'd like to see a summary in rows and columns instead of a chart." }],
    assistantText:
      "Sure 📋 Here's a sample business summary table for this year. It's a compact view so you can quickly compare key metrics side by side.",
    product: { image: "", title: "Business Summary 2023" },
  },
  {
    userMsgs: [{ id: "s4-u1", role: "user", text: "I'm reviewing some business data and I'd like to see it in a simple chart. Could you show me a bar chart that summarizes this year's performance overall?" }],
    assistantText:
      "Got it 📊 Here's a sample bar chart that shows the overall revenue trend for 2025. This gives you a clear quarterly view so you can quickly spot the growth pattern.",
    product: { image: "/images/imgchat4.png", title: "Business Summary 2023" },
  },
  {
    userMsgs: [{ id: "s5-u1", role: "user", text: "I'd like to see how our revenue has been changing throughout the year. Could you provide me with a simple line chart that shows the quarterly trend?" }],
    assistantText:
      "Got it 🧾 Here's a line chart that illustrates the revenue pattern for 2025. This lets you track the ups and downs across each quarter at a glance.",
    product: { image: "/images/imgchat5.png", title: "Business Revenue Trend 2025" },
  },
];

const currencyTHB = (n: number) =>
  n.toLocaleString("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

/* ---------- Avatar Rails ---------- */
const AVATAR_RAIL_W = "w-9 sm:w-10";
const RailAvatarRight = ({ src, name }: { src: string; name: string }) => (
  <div className={`${AVATAR_RAIL_W} justify-self-end hidden sm:block`}>
    <Avatar className="shadow-lg border rounded-full border-white/20 p-0.5 w-10 h-10" radius="lg" src={src} name={name} />
  </div>
);
const RailAvatarLeft = ({ src, name }: { src: string; name: string }) => (
  <div className={`${AVATAR_RAIL_W} hidden sm:block`}>
    <Avatar className="shadow-lg border rounded-full border-white/20 p-0.5 w-10 h-10" radius="lg" src={src} name={name} />
  </div>
);

/* ---------- Product mini card ---------- */
function ProductMiniCard({ p }: { p: ProductInfo }) {
  return (
    <motion.div
      layout="position"
      whileHover={{ y: -1, boxShadow: "0px 4px 16px rgba(0,0,0,0.12)" }}
      transition={{ layout: SPRING_LAYOUT }}
      className="w-[180px] shrink-0 rounded-xl bg-white/5 p-2"
    >
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

/* ---------- Strip ---------- */
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
    <div className="p-2" style={{ width: CARD_W }}>
      <div
        ref={wrapRef}
        className="relative rounded-2xl bg-white/[0.03] p-2 overflow-hidden"
        style={{ height: CARD_MEDIA_H + 40 }} 
      >
        <motion.div
          ref={trackRef}
          layout="position"
          className="flex gap-2 will-change-transform"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: minX, right: 0 }}
          dragElastic={0.02}
          transition={{ layout: SPRING_LAYOUT }}
        >
          {products.map((p, i) => <ProductMiniCard key={i} p={p} />)}
        </motion.div>
      </div>
    </div>
  );
}
function ChartCard({ src, title }: { src: string; title?: string }) {
  return (
    <motion.div
      layout="position"
      whileHover={{ y: -1, boxShadow: "0px 4px 16px rgba(0,0,0,0.12)" }}
      transition={{ layout: SPRING_LAYOUT }}
      className="p-2"
      style={{ width: CARD_W }}
    >
      <div className="w-full rounded-2xl bg-white/[0.03] p-2">
        <div
          className="flex items-center justify-center overflow-hidden rounded-xl bg-black/10 w-full mx-auto"
          style={{ height: CARD_MEDIA_H }}
        >
          <NextUIImage alt={title ?? "chart"} src={src} className="h-full w-full object-contain" loading="lazy" />
        </div>
        {title ? <div className="mt-2 text-center text-[10px] text-white/70">{title}</div> : null}
      </div>
    </motion.div>
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
    <motion.div
      layout="position"
      whileHover={{ y: -1, boxShadow: "0px 4px 16px rgba(0,0,0,0.12)" }}
      transition={{ layout: SPRING_LAYOUT }}
      className="p-2"
      style={{ width: CARD_W }}
    >
      <div className="w-full rounded-2xl bg-white/[0.03] p-2" style={{ minHeight: CARD_MEDIA_H + 40 }}>
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
    </motion.div>
  );
}

/* ---------- Typing Dots + Swap ---------- */
function TypingDots({ className = "", size = 6, gap = 6, duration = 7000 }: { className?: string; size?: number; gap?: number; duration?: number; }) {
  const style: React.CSSProperties = { "--dot": `${size}px`, "--gap": `${gap}px`, "--dur": `${duration}ms` } as React.CSSProperties;
  return (
    <span role="status" aria-label="Typing…" className={`inline-flex items-center ${className}`} style={style}>
      <span className="dot" /><span className="dot" /><span className="dot" />
      <style jsx>{`
        .dot{width:var(--dot);height:var(--dot);border-radius:9999px;background:currentColor;opacity:.6;display:inline-block;margin-right:var(--gap);animation:updown var(--dur) ease-in-out infinite}
        .dot:nth-child(2){animation-delay:calc(var(--dur)*.15)}
        .dot:nth-child(3){animation-delay:calc(var(--dur)*.30);margin-right:0}
        @keyframes updown{0%,100%{transform:translateY(0);opacity:.6}50%{transform:translateY(-28%);opacity:1}}
      `}</style>
    </span>
  );
}

function BubbleTextSwap({ text, delay = 7000, align = "left", colorClass = "text-white", }: { text: string; delay?: number; align?: "left" | "right"; colorClass?: string; }) {
  const [showText, setShowText] = useState(false);
  useEffect(() => { const t = window.setTimeout(() => setShowText(true), Math.max(120, delay)); return () => window.clearTimeout(t); }, [delay]);
  if (!showText) return <div className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}><TypingDots className="text-white/80" /></div>;
  return <span className={`${colorClass} ${align === "right" ? "text-right" : "text-left"}`}>{text}</span>;
}

function BubbleSwap({ children, delay = 7000 }: { children: React.ReactNode; delay?: number; }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = window.setTimeout(() => setShow(true), Math.max(120, delay)); return () => window.clearTimeout(t); }, [delay]);
  if (!show) {
    return (
      <div className="grid place-items-center" style={{ width: CARD_W, height: CARD_PLACEHOLDER_H }}>
        <TypingDots className="text-white/80" />
      </div>
    );
  }
  return <>{children}</>;
}

type TimelineUser = { kind: "user"; key: string; text: string };
type TimelineAssistant = { kind: "assistant"; key: string; text: string };
type TimelineCard = { kind: "card"; key: string; idx: number; scenario: Scenario };
type TimelineTail = { kind: "tail"; key: string };
type TimelineDivider = { kind: "divider"; key: string };
type TimelineItem = TimelineUser | TimelineAssistant | TimelineCard | TimelineTail | TimelineDivider;

function useMasterTimeline() {
  return useMemo<TimelineItem[]>(() => {
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
}

const WINDOW = 28;
const BASE_DELAY = 2000;
const JITTER = 0.18;

function ScrollableChat() {
  const MASTER = useMasterTimeline();
  const L = MASTER.length;

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const y = useMotionValue(0);
  const ySmooth = useSpring(y, SPRING_SCROLL);
  const [minY, setMinY] = useState(0);
  const [autoFollow, setAutoFollow] = useState(true);

  const [seq, setSeq] = useState(1);
  const timerRef = useRef<number | null>(null);

  const items: Array<{ instKey: string; item: TimelineItem }> = useMemo(() => {
    const count = Math.min(seq, WINDOW);
    const out: Array<{ instKey: string; item: TimelineItem }> = [];
    for (let i = count; i >= 1; i--) {
      const globalIndex = seq - i;
      const cycle = Math.floor(globalIndex / L);
      const idxInMaster = globalIndex % L;
      const base = MASTER[idxInMaster];
      const instKey = `${base.key}#${cycle}`;
      out.push({ instKey, item: base });
    }
    return out;
  }, [seq, L, MASTER]);

  useEffect(() => {
    const schedule = () => {
      const jitter = 1 + (Math.random() * 2 - 1) * JITTER;
      const delay = BASE_DELAY * jitter;
      timerRef.current = window.setTimeout(() => {
        setSeq((s) => s + 1);
        schedule();
      }, delay) as unknown as number;
    };
    schedule();
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, []);

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

  useEffect(() => { if (autoFollow) y.set(minY); }, [items.length, minY, autoFollow, y]);

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

  const [showToLatest, setShowToLatest] = useState(false);
  useEffect(() => {
    const unsub = y.on("change", (val) => { setShowToLatest(Math.abs(val - minY) > 6); });
    return () => unsub();
  }, [y, minY]);

  const scrollToBottom = () => { setAutoFollow(true); y.set(minY); };

  // ----- Renderer -----
  const renderItem = (instKey: string, item: TimelineItem) => {
    if (item.kind === "user") {
      return (
        <motion.div key={instKey} layout="position" variants={bubbleVariants} initial="hidden" animate="visible" transition={{ layout: SPRING_LAYOUT }} className="relative grid grid-cols-[auto_1fr_auto] items-start gap-3" whileHover={{ y: -1, boxShadow: "0px 4px 16px rgba(0,0,0,0.12)" }}>
          <RailAvatarLeft src="/images/user.png" name="You" />
          <div className="max-w-[46rem] justify-self-start rounded-[22px] rounded-bl-none border border-white/12 bg-gradient-to-b from-white/8 to-white/4 px-5 py-3 text-[15px] leading-relaxed">
            <BubbleTextSwap key={instKey} text={item.text} delay={520} align="left" colorClass="text-white" />
          </div>
          <div className={AVATAR_RAIL_W} />
        </motion.div>
      );
    }

    if (item.kind === "assistant") {
      return (
        <motion.div key={instKey} layout="position" variants={bubbleVariants} initial="hidden" animate="visible" transition={{ layout: SPRING_LAYOUT }} className="relative grid grid-cols-[auto_1fr_auto] items-start gap-3" whileHover={{ y: -1, boxShadow: "0px 4px 16px rgba(0,0,0,0.12)" }}>
          <div className={AVATAR_RAIL_W} />
          <div className="max-w-[46rem] justify-self-end rounded-[22px] rounded-br-none border border-white/12 bg-gradient-to-b from-white/10 to-white/5 px-5 py-3 text-right text-[15px] leading-relaxed">
            <BubbleTextSwap key={instKey} text={item.text} delay={720} align="right" colorClass="text-white" />
          </div>
          <RailAvatarRight src="/images/starai.png" name="AI" />
        </motion.div>
      );
    }

    if (item.kind === "card") {
      const idx = item.idx;
      const sc = item.scenario;
      // เดิม: isFirst ขยายใหญ่ ตอนนี้ “ทุกการ์ดเท่ากันหมด”
      return (
        <motion.div key={instKey} layout="position" variants={bubbleVariants} initial="hidden" animate="visible" transition={{ layout: SPRING_LAYOUT }} className="relative grid grid-cols-[auto_1fr_auto] items-start gap-3" whileHover={{ y: -1, boxShadow: "0px 4px 16px rgba(0,0,0,0.12)" }}>
          <div className={AVATAR_RAIL_W} />
          <div className="justify-self-end">
            <Frame radius={22} squareBR style={{ width: CARD_W }}>
              {/* รูป/การ์ดทุกอันมีไข่ปลาก่อน และอยู่ในกรอบขนาดเดียวกัน */}
              <BubbleSwap delay={650}>
                {idx === 1 || idx === 3 || idx === 4 ? (
                  <ChartCard src={sc.product.image} title={sc.product.title} />
                ) : idx === 0 ? (
                  <FirstScenarioProductsStrip products={sc.products ?? [sc.product]} />
                ) : (
                  <SummaryTableCard title={sc.product.title} />
                )}
              </BubbleSwap>
            </Frame>
          </div>
          <RailAvatarRight src="/images/starai.png" name="AI" />
        </motion.div>
      );
    }

    if (item.kind === "tail") {
      return (
        <motion.div key={instKey} layout="position" variants={bubbleVariants} initial="hidden" animate="visible" transition={{ layout: SPRING_LAYOUT }} className="relative grid grid-cols-[auto_1fr_auto] items-start gap-3" whileHover={{ y: -1, boxShadow: "0px 4px 16px rgba(0,0,0,0.12)" }}>
          <RailAvatarLeft src="/images/user.png" name="You" />
          <div className="max-w-[40rem] justify-self-start rounded-[22px] rounded-bl-none border border-white/12 bg-gradient-to-b from-white/8 to-white/4 px-5 py-3 text-[15px]">
            <BubbleTextSwap key={instKey} text={`Awesome, thanks! That's exactly what I needed 🙌`} delay={520} align="left" colorClass="text-white" />
          </div>
          <div className={AVATAR_RAIL_W} />
        </motion.div>
      );
    }

    // divider
    return (
      <motion.div key={instKey} layout="position" className="my-6 flex items-center gap-3" transition={{ layout: SPRING_LAYOUT }}>
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
              layout
              className="pb-14 pt-2 space-y-6 will-change-transform"
              style={{ y: ySmooth }}
              drag="y"
              dragElastic={0}
              dragMomentum
              dragTransition={{ power: 0.15, timeConstant: 280 }}
              onDrag={(e, info) => {
                const cur = y.get();
                const next = Math.max(Math.min(cur + info.delta.y, 0), minY);
                y.set(next);
                if (info.delta.y > 2) setAutoFollow(false);
              }}
              transition={{ layout: SPRING_LAYOUT }}
            >
              {items.map(({ instKey, item }) => renderItem(instKey, item))}
            </motion.div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 z-10" />

          {showToLatest && (
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
  const prefersReducedMotion = useReducedMotion();
  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"} transition={SPRING_LAYOUT}>
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
    </MotionConfig>
  );
}
