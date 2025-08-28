"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Image as NextUIImage,
  Input,
  ScrollShadow,
} from "@nextui-org/react";
import { Search } from "lucide-react";
import Image from "next/image";

/** ---------- Types ---------- */
type Product = {
  id: string;
  name: string;
  price: number; // THB
  image: string;
  brand: "ASUS" | "Lenovo" | "Dell" | "Apple" | "HP";
};

type Suggestion = { label: string; query: string };

/** ---------- Mock Data ---------- */
const PRODUCTS: Product[] = [
  {
    id: "p-asus-zenbook-14",
    name: "Notebook ASUS ZenBook 14",
    price: 32900,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    brand: "ASUS",
  },
  {
    id: "p-lenovo-x1",
    name: "Lenovo ThinkPad X1 Carbon",
    price: 48900,
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
    brand: "Lenovo",
  },
  {
    id: "p-dell-xps-13",
    name: "Dell XPS 13",
    price: 42500,
    image:
      "https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?q=80&w=1200&auto=format&fit=crop",
    brand: "Dell",
  },
  {
    id: "p-apple-air-m2",
    name: "MacBook Air M2",
    price: 39900,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    brand: "Apple",
  },
  {
    id: "p-hp-spectre-x360",
    name: "HP Spectre x360",
    price: 45500,
    image:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1200&auto=format&fit=crop",
    brand: "HP",
  },
];

const BRAND_SUGGESTIONS: Suggestion[] = [
  { label: "Notebook ASUS", query: "asus" },
  { label: "Notebook Lenovo", query: "lenovo" },
  { label: "Notebook Dell", query: "dell" },
];

/** ---------- Helpers ---------- */
const currencyTHB = (n: number) =>
  n.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  });

/** ---------- UI ---------- */
export default function SearchEngineAI() {
  const [text, setText] = useState<string>("");

  // live filter
  const filtered = useMemo(() => {
    const q = text.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
    );
  }, [text]);

  const showDropdown = text.trim().length > 0;

  return (
    <section className="w-full text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16 md:grid md:grid-cols-12 md:gap-12 md:py-24">
        {/* Left column */}
        <div className="md:col-span-4">
          <h2 className="text-xl tracking-tight text-white sm:text-3xl lg:text-[40px]">
            Search engine AI
          </h2>
          <p className="mt-4 max-w-sm text-sm text-[#676767]">
            An AI-powered sales assistant that chats, qualifies, recommends and
            helps close deals — <span className="tabular-nums">24/7</span>.
          </p>
        </div>

        {/* Right column */}
        <div className="md:col-span-8">
          {/* ====== Search Input with CARD FRAME (no glow) ====== */}
          <div className="relative">
            <div className="card-outer-bg card-outer-shadow relative overflow-hidden rounded-full p-[1px]">
              <div className="card-inner-bg card-inner-blur rounded-full">
                <Input
                  value={text}
                  onValueChange={setText}
                  size="lg"
                  radius="full"
                  variant="flat"
                  classNames={{
                    base: "w-full",
                    input:
                      "text-base md:text-lg placeholder:text-white/40 !text-white caret-violet-400",
                    innerWrapper: "gap-2",
                    inputWrapper:
                      "h-12 md:h-14 bg-transparent rounded-full shadow-none border-0 !outline-none ring-0 focus:outline-none focus:ring-0",
                  }}
                  startContent={
                    <div className="flex items-center gap-3">
                      {/* วงกลมเดิม + รูปขนาด 14px ด้านใน */}
                      <div className="flex h-6 w-6 items-center justify-center rounded-full ">
                        <Image
                          src="/images/starai.png" 
                          alt="AI"
                          width={20}
                          height={20}
                        />
                      </div>
                      <span className="h-5 w-px bg-white/12" />
                    </div>
                  }
                  endContent={
                    <div className="mr-1 flex h-9 w-9 items-center justify-center rounded-full">
                      <Search className="mr-4 h-6 w-6 opacity-70" />
                    </div>
                  }
                  placeholder="Type to search products…"
                  aria-label="Search products"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* ====== DROPDOWN with CARD FRAME (no glow) ====== */}
            {showDropdown && (
              <div className="mt-3">
                <div className="card-outer-bg card-outer-shadow relative overflow-hidden rounded-[25px] p-[1px]">
                  <div className="card-inner-bg card-inner-blur relative rounded-[24px]">
                    {/* Header */}
                    <div className="px-4 pt-4 text-sm text-white/70">
                      Results for: <span className="font-semibold">{text}</span>
                    </div>

                    {/* Content */}
                    <div className="grid gap-6 px-4 pt-2 pb-4 md:grid-cols-5">
                      {/* Suggestions (top) */}
                      <div className="md:order-1 md:col-span-2">
                        <ul className="space-y-1">
                          {BRAND_SUGGESTIONS.map((s) => (
                            <li key={s.query}>
                              <button
                                onClick={() => setText(s.query)}
                                className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                              >
                                <span className="inline-flex items-center gap-2">
                                  <Search className="h-4 w-4 opacity-70" />
                                  {s.label}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-5 text-xs tracking-wider text-white/40 uppercase">
                          Product
                        </div>
                      </div>

                      {/* Products (full width on md+, pushed to bottom) */}
                      <div className="md:order-2 md:col-span-5">
                        {filtered.length === 0 ? (
                          <div className="flex h-[160px] w-full items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-sm text-white/70">
                            ไม่พบสินค้าที่ตรงกับ “{text}”
                          </div>
                        ) : (
                          <ScrollShadow
                            orientation="horizontal"
                            className="w-full overflow-x-auto"
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
            )}
            {/* /dropdown */}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card-outer-bg card-outer-shadow w-[220px] shrink-0 rounded-[25px] p-[1px]">
      <div className="card-inner-bg card-inner-blur rounded-[24px]">
        <Card
          isHoverable
          shadow="sm"
          className="rounded-[24px] border-0 bg-transparent shadow-none"
        >
          <CardBody className="p-0">
            <div className="p-4 pt-4">
              <div className="card-outer-bg card-outer-shadow relative overflow-hidden rounded-[18px] p-[1px]">
                <div className="card-inner-bg card-inner-blur rounded-[17px]">
                  <NextUIImage
                    removeWrapper
                    alt={product.name}
                    src={product.image}
                    className="h-[110px] w-full rounded-[17px] object-cover"
                  />
                </div>
              </div>
            </div>

            {/* ข้อความ */}
            <div className="space-y-1 px-4 pt-1 pb-4">
              <div className="line-clamp-2 text-xs text-white/80">
                {product.name}
              </div>
              <div className="text-[11px] font-semibold text-white/90">
                {currencyTHB(product.price)}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
