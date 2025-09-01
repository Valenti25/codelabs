"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardBody,
  Image as NextUIImage,
  Input,
  ScrollShadow,
} from "@nextui-org/react";
import { Search, CheckCircle2 } from "lucide-react";
import Image from "next/image";

/** ---------- Types ---------- */
type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: "ASUS" | "Lenovo" | "Dell" | "Apple" | "HP";
};
type Feature = { title: string; desc: string };
type BrandOption = { brand: "ASUS" | "Lenovo" | "Dell"; query: string };

/** ---------- Static UI texts ---------- */
const UI = {
  resultsForPrefix: "ผลลัพธ์สำหรับ",
  datasetLabel: "ชุดข้อมูล",
  productHeader: "สินค้า",
  noResults: (q: string) => `ไม่พบสินค้าที่ตรงกับ “${q}”`,
};

/** ---------- “3 หน้าเท็กซ์” ที่จะวนไปเรื่อย ๆ ---------- */
type TextPage = { noun: string; query: string };
const TEXT_PAGES: TextPage[] = [
  { noun: "โน้ตบุ๊ก", query: "asus zenbook" },
  { noun: "โน้ตบุ๊ก", query: "macbook pro" },
  { noun: "โน้ตบุ๊ก", query: "hp pavilion" },
];

/** ---------- Products (เหมือนเดิม) ---------- */
const PRODUCTS_SET_1: Product[] = [
  { id: "p-asus-zenbook-14", name: "Notebook ASUS ZenBook 14", price: 32900, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop", brand: "ASUS" },
  { id: "p-lenovo-x1", name: "Lenovo ThinkPad X1 Carbon", price: 48900, image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop", brand: "Lenovo" },
  { id: "p-dell-xps-13", name: "Dell XPS 13", price: 42500, image: "https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?q=80&w=1200&auto=format&fit=crop", brand: "Dell" },
  { id: "p-apple-air-m2", name: "MacBook Air M2", price: 39900, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop", brand: "Apple" },
  { id: "p-hp-spectre-x360", name: "HP Spectre x360", price: 45500, image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1200&auto=format&fit=crop", brand: "HP" },
];

const PRODUCTS_SET_2: Product[] = [
  { id: "p-asus-rog-g14", name: "ASUS ROG Zephyrus G14", price: 56900, image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop", brand: "ASUS" },
  { id: "p-lenovo-yoga-7", name: "Lenovo Yoga Slim 7", price: 38900, image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop", brand: "Lenovo" },
  { id: "p-dell-inspiron-14", name: "Dell Inspiron 14", price: 29900, image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop", brand: "Dell" },
  { id: "p-apple-pro-14", name: "MacBook Pro 14 (M3)", price: 69900, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format&fit=crop", brand: "Apple" },
  { id: "p-hp-envy-13", name: "HP Envy 13", price: 31900, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop", brand: "HP" },
];

const PRODUCTS_SET_3: Product[] = [
  { id: "p-asus-vivobook-s15", name: "ASUS Vivobook S15", price: 27900, image: "https://images.unsplash.com/photo-1525498128493-380d1990a112?q=80&w=1200&auto=format&fit=crop", brand: "ASUS" },
  { id: "p-lenovo-ideapad-5", name: "Lenovo IdeaPad 5", price: 24900, image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop", brand: "Lenovo" },
  { id: "p-dell-latitude-7440", name: "Dell Latitude 7440", price: 45900, image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop", brand: "Dell" },
  { id: "p-apple-air-m3", name: "MacBook Air M3", price: 42900, image: "https://images.unsplash.com/photo-1559163179-4f6b3620c18b?q=80&w=1200&auto=format&fit=crop", brand: "Apple" },
  { id: "p-hp-pavilion-15", name: "HP Pavilion 15", price: 23900, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop", brand: "HP" },
];

const PRODUCT_SETS: Product[][] = [PRODUCTS_SET_1, PRODUCTS_SET_2, PRODUCTS_SET_3];

const BRAND_BASE: BrandOption[] = [
  { brand: "ASUS", query: "asus" },
  { brand: "Lenovo", query: "lenovo" },
  { brand: "Dell", query: "dell" },
];

const FEATURES: Feature[] = [
  { title: "Understands natural language", desc: "Search with questions, commands, or full sentences" },
  { title: "Semantic Search", desc: "Results by meaning, not just keywords" },
  { title: "Personalized Results", desc: "Tailored to each user's needs" },
  { title: "Multi-modal Search", desc: "Text, images, voice, and video" },
  { title: "Real-time & Accurate", desc: "Fast, precise, and scalable for massive data" },
  { title: "Secure & Private", desc: "Protecting user data with compliance standards" },
];

const currencyTHB = (n: number) =>
  n.toLocaleString("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

function deriveNoun(raw: string): string {
  const q = raw.toLowerCase().trim();
  if (!q) return "สินค้า";
  if (/นาฬ|watch|smartwatch/.test(q)) return "นาฬิกา";
  if (/คอม/.test(q)) return "คอม";
  if (/(notebook|laptop|macbook|zenbook|xps|thinkpad|pavilion|inspiron|vivobook|asus|lenovo|dell|hp|apple)/.test(q))
    return "โน้ตบุ๊ก";
  if (/tablet|แท็บเล็ต|ipad/.test(q)) return "แท็บเล็ต";
  if (/phone|มือถือ|โทรศัพท์|iphone|android|galaxy|smartphone/.test(q)) return "โทรศัพท์";
  if (/หูฟัง|headphone|earbud|airpod/.test(q)) return "หูฟัง";
  return "สินค้า";
}

export default function SearchEngineAI() {
  const [setIndex] = useState<number>(1);
  const activeProducts = PRODUCT_SETS[setIndex];

  const [pageIndex, setPageIndex] = useState<number>(0);
  const [demoRunning, setDemoRunning] = useState<boolean>(true);
  const [text, setText] = useState<string>("");

  const typingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eraseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filtered = useMemo(() => {
    const q = text.trim().toLowerCase();
    if (!q) return [];
    return activeProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
    );
  }, [text, activeProducts]);

  const currentNoun = useMemo(
    () => (text.trim() ? deriveNoun(text) : TEXT_PAGES[pageIndex].noun),
    [text, pageIndex]
  );

  const showDropdown = text.trim().length > 0;

  useEffect(() => {
    if (!demoRunning) return;

    const target = TEXT_PAGES[pageIndex].query;
    let i = 0;

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    if (eraseTimerRef.current) clearInterval(eraseTimerRef.current);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      i += 1;
      setText(target.slice(0, i));
      if (i >= target.length) {
        clearInterval(typingTimerRef.current!);
        pauseTimerRef.current = setTimeout(() => {
          eraseTimerRef.current = setInterval(() => {
            setText((prev) => {
              if (prev.length <= 0) {
                clearInterval(eraseTimerRef.current!);
                setPageIndex((p) => (p + 1) % TEXT_PAGES.length);
                return "";
              }
              return prev.slice(0, -1);
            });
          }, 70);
        }, 1800);
      }
    }, 120);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      if (eraseTimerRef.current) clearInterval(eraseTimerRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [pageIndex, demoRunning]);

  return (
    <section className="w-full text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16 md:grid md:grid-cols-12 md:gap-12 md:py-24">
        <div className="md:col-span-4 md:order-2">
          <h2 className="text-xl tracking-tight text-white sm:text-3xl lg:text-[40px]">Search engine AI</h2>
          <p className="mt-4 max-w-sm text-sm text-[#676767]">
            An AI-powered sales assistant that chats, qualifies, recommends and helps close deals —{" "}
            <span className="tabular-nums">24/7</span>.
          </p>

          <ul className="mt-6 space-y-4">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex items-start gap-3 min-h-[40px]">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-white/5">
                  <CheckCircle2 className="h-4 w-4 opacity-80" />
                </span>
                <div>
                  <div className="text-sm text-white/90">{f.title}</div>
                  <div className="text-xs text-[#676767]">{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-8 md:order-1">
          <div className="relative">
            <div className="card-outer-bg card-outer-shadow relative overflow-hidden rounded-full p-[1px]">
              <div className="card-inner-bg card-inner-blur rounded-full">
                <Input
                  value={text}
                  onValueChange={(v) => {
                    setText(v);
                    if (v !== "") setDemoRunning(false);
                  }}
                  size="lg"
                  radius="full"
                  variant="flat"
                  classNames={{
                    base: "w-full",
                    input: "text-base md:text-lg placeholder:text-white/40 !text-white caret-violet-400",
                    innerWrapper: "gap-2",
                    inputWrapper:
                      "h-14 md:h-16 bg-transparent rounded-full shadow-none border-0 !outline-none ring-0 focus:outline-none focus:ring-0",
                  }}
                  startContent={
                    <div className="ml-4 flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full">
                        <Image src="/images/starai.png" alt="AI" width={20} height={20} />
                      </div>
                      <span className="h-5 w-px bg-white/12" />
                    </div>
                  }
                  endContent={
                    <div className="mr-1 flex h-9 w-9 items-center justify-center rounded-full">
                      <Search className="mr-4 h-6 w-6 opacity-70" />
                    </div>
                  }
                  placeholder={`ค้นหา${currentNoun !== "สินค้า" ? " " + currentNoun : ""}…`}
                  aria-label="Search products"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>

            <div
              className={`absolute inset-x-0 top-[calc(100%+12px)] z-50
                transition-[opacity,transform] duration-150 ease-out
                ${
                  showDropdown
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-[0.98] pointer-events-none"
                }`}
            >
              <div className="card-outer-bg card-outer-shadow relative overflow-hidden rounded-[25px] p-[1px]">
                <div className="card-inner-bg card-inner-blur relative rounded-[24px]">
                  <div className="px-4 pt-4 text-sm text-white/70">
                    {UI.resultsForPrefix}: <span className="font-semibold">{text}</span>
                    <span className="ml-2 text-white/30">· {UI.datasetLabel} {pageIndex + 1}/{TEXT_PAGES.length}</span>
                  </div>

                  <div className="grid gap-6 px-4 pt-2 pb-4 md:grid-cols-5">
                    <div className="md:order-1 md:col-span-2 min-w-[240px]">
                      <ul className="space-y-1">
                        {BRAND_BASE.map((b) => (
                          <li key={b.query}>
                            <button
                              onClick={() => {
                                const next = `${currentNoun !== "สินค้า" ? currentNoun + " " : ""}${b.query}`;
                                setText(next.trim());
                                setDemoRunning(false);
                              }}
                              className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white min-h-[40px]"
                            >
                              <span className="inline-flex items-center gap-2">
                                <Search className="h-4 w-4 opacity-70" />
                                {`${currentNoun} ${b.brand}`}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-5 text-xs tracking-wider text-white/40 uppercase">
                        {UI.productHeader}
                      </div>
                    </div>

                    <div className="md:order-2 md:col-span-5">
                      {filtered.length === 0 ? (
                        <div className="flex h-[220px] w-full items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-sm text-white/70">
                          {UI.noResults(text)}
                        </div>
                      ) : (
                        <ScrollShadow
                          orientation="horizontal"
                          className="w-full overflow-x-auto min-h-[200px]"
                          hideScrollBar
                        >
                          <div className="flex min-w-full gap-4 pr-2">
                            {filtered.map((p) => (
                              <ProductCard key={p.id} product={p} />
                            ))}
                          </div>
                        </ScrollShadow>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card-outer-bg card-outer-shadow w-[224px] min-w-[224px] max-w-[224px] shrink-0 rounded-[25px] p-[1px]">
      <div className="card-inner-bg card-inner-blur rounded-[24px]">
        <Card isHoverable shadow="sm" className="rounded-[24px] border-0 bg-transparent shadow-none">
          <CardBody className="p-0">
            <div className="p-4 pt-4">
              <div className="card-outer-bg card-outer-shadow relative overflow-hidden rounded-[18px] p-[1px]">
                <div className="card-inner-bg card-inner-blur rounded-[17px]">
                  <NextUIImage
                    removeWrapper
                    alt={product.name}
                    src={product.image}
                    className="h-[120px] w-full rounded-[17px] object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="px-4 pt-1 pb-4 space-y-1 min-h-[64px]">
              <div className="line-clamp-2 text-xs text-white/80">{product.name}</div>
              <div className="text-[11px] font-semibold text-white/90">{currencyTHB(product.price)}</div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
