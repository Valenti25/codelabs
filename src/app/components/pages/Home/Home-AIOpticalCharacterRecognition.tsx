// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { NextUIProvider, Card, CardBody } from "@nextui-org/react";
// import { CheckCircle2 } from "lucide-react";
// import {
//   motion,
//   useInView,
//   useMotionValue,
//   useTransform,
//   useAnimation,
//   animate,
// } from "framer-motion";

// const SCAN_MS = 2400; // ระยะเวลาสแกนต่อรอบ

// export default function Page() {
//   const sectionRef = useRef<HTMLDivElement | null>(null);
//   const inView = useInView(sectionRef, { amount: 0.35, once: true }); // เริ่มเมื่อเห็น ~35% ของบล็อก (เริ่มครั้งเดียว แต่อนิเมชันวนเอง)

//   // progress = 0..1 ต่อหนึ่งรอบการสแกน (ควบคุมเฉพาะแถบสแกน)
//   const progress = useMotionValue(0);
//   const [done, setDone] = useState(false);

//   // แปลง progress -> ความสูง/ความทึบของแถบสแกน
//   const sweepH = useTransform(progress, [0, 1], ["0%", "100%"]);
//   const sweepOpacity = useTransform(progress, [0, 1], [0.92, 0.22]);

//   // Controls สำหรับเปิดเผยย่อหน้าหลังสแกนเสร็จ
//   const p1Ctrl = useAnimation();
//   const p2Ctrl = useAnimation();

//   // ออร์เคสตร้า: reset → scan → reveal p1 → reveal p2 → hold → loop
//   useEffect(() => {
//     if (!inView) return;
//     let cancelled = false;

//     const resetText = async () => {
//       await Promise.all([
//         p1Ctrl.start({ opacity: 0, y: 12, transition: { duration: 0 } }),
//         p2Ctrl.start({ opacity: 0, y: 12, transition: { duration: 0 } }),
//       ]);
//     };

//     const run = async () => {
//       while (!cancelled) {
//         // Reset stage
//         setDone(false);
//         progress.set(0);
//         await resetText();

//         // Scan stage
//         const scan = animate(progress, 1, {
//           duration: SCAN_MS / 1000,
//           ease: [0.42, 0, 0.2, 1],
//         });
//         await scan.finished;
//         if (cancelled) break;

//         // Mark complete
//         setDone(true);

//         // Reveal text stage (ทีละย่อหน้าแบบสมูท)
//         await p1Ctrl.start({
//           opacity: 1,
//           y: 0,
//           transition: { duration: 0.45, ease: [0.33, 1, 0.68, 1] },
//         });
//         if (cancelled) break;
//         await p2Ctrl.start({
//           opacity: 1,
//           y: 0,
//           transition: { duration: 0.45, ease: [0.33, 1, 0.68, 1] },
//         });
//         if (cancelled) break;

//         // Hold complete state สักครู่แล้ววนใหม่
//         await new Promise((r) => setTimeout(r, 650));
//       }
//     };

//     run();
//     return () => {
//       cancelled = true;
//     };
//   }, [inView, progress, p1Ctrl, p2Ctrl]);

//   return (
//     <NextUIProvider>
//       <main className="bg-black text-white">
//         {/* ===== Hero Heading ===== */}
//         <section
//           ref={sectionRef}
//           className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20"
//         >
//           <div className="text-center">
//             <p className="text-sm text-white/60 sm:text-base">
//               Read, extract, and understand text instantly
//             </p>
//             <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
//               AI Optical Character Recognition
//             </h1>
//           </div>

//           {/* ===== Two Columns ===== */}
//           <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
//             {/* ------- Left: Demo Card (สแกนวนลูป) ------- */}
//             <Card className="rounded-[28px] border border-white/10 bg-white/[0.03] shadow-xl">
//               <CardBody className="p-5 md:p-8">
//                 <div className="relative grid gap-5 md:grid-cols-[1.1fr_1.6fr]">
//                   {/* viewer + scan */}
//                   <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4">
//                     <div className="mx-auto mb-4 h-2 w-28 rounded-full bg-white/15" />
//                     <div className="relative overflow-hidden rounded-xl border border-white/10">
//                       {/* grid bg */}
//                       <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:22px_22px]" />
//                       {/* document icon */}
//                       <div className="relative grid h-56 place-items-center md:h-64">
//                         <svg
//                           width="92"
//                           height="120"
//                           viewBox="0 0 92 120"
//                           fill="none"
//                           className="opacity-90"
//                         >
//                           <rect
//                             x="10"
//                             y="8"
//                             width="72"
//                             height="104"
//                             rx="12"
//                             stroke="white"
//                             strokeOpacity="0.85"
//                             strokeWidth="3"
//                           />
//                           <path
//                             d="M26 40h40M26 56h40M26 72h28"
//                             stroke="white"
//                             strokeOpacity="0.75"
//                             strokeWidth="4"
//                             strokeLinecap="round"
//                           />
//                         </svg>
//                       </div>

//                       {/* green scan sweep — วนลูปเรื่อย ๆ */}
//                       <motion.div
//                         className="pointer-events-none absolute left-0 right-0 top-0 z-[2] bg-[linear-gradient(to_bottom,rgba(60,145,134,.95)_0%,rgba(60,145,134,.40)_45%,rgba(60,145,134,.10)_100%)]"
//                         style={{ height: sweepH, opacity: sweepOpacity }}
//                         aria-hidden
//                       />
//                     </div>

//                     {/* toolbar */}
//                     <div className="mt-3 flex items-center justify-between text-xs text-white/50">
//                       <div className="flex gap-3">
//                         <span className="inline-block h-2 w-2 rounded-full bg-white/40" />
//                         <span className="inline-block h-2 w-2 rounded-full bg-white/40" />
//                         <span className="inline-block h-2 w-2 rounded-full bg-white/40" />
//                       </div>
//                       <div className="flex gap-4">
//                         <span className="h-2 w-10 rounded bg-white/20" />
//                         <span className="h-2 w-8 rounded bg-white/20" />
//                       </div>
//                     </div>
//                   </div>

//                   {/* ข้อความสรุปที่ "ค่อย ๆ ขึ้น" หลังสแกนเสร็จ */}
//                   <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
//                     <motion.p
//                       className="text-[13px] leading-relaxed text-white/80"
//                       initial={{ opacity: 0, y: 12 }}
//                       animate={p1Ctrl}
//                     >
//                       In the fiscal year 2025, the company experienced steady and
//                       sustainable growth across all major product categories.
//                       Notebooks remained the cornerstone of overall revenue,
//                       supported by consistent demand from education and
//                       enterprise customers.
//                     </motion.p>
//                     <motion.p
//                       className="mt-3 text-[13px] leading-relaxed text-white/70"
//                       initial={{ opacity: 0, y: 12 }}
//                       animate={p2Ctrl}
//                     >
//                       Tablets showed remarkable improvement, largely driven by
//                       e-learning platforms and the growing adoption of hybrid work.
//                       Smartwatches gained traction among health-conscious users,
//                       valued for real-time monitoring features.
//                     </motion.p>

//                     {/* สถานะเล็ก ๆ ด้านล่าง — จะขึ้น Complete แป๊บเดียวปลายรอบ แล้วกลับเป็น Scanning */}
//                     <div className="mt-4 flex items-center gap-2 text-xs">
//                       {!done ? (
//                         <>
//                           <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400/80" />
//                           <span className="text-white/70">Scanning…</span>
//                         </>
//                       ) : (
//                         <>
//                           <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
//                           <span className="text-white/70">Scan complete</span>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </CardBody>
//             </Card>

//             {/* ------- Right: Copy & Bullets ------- */}
//             <div>
//               <h2 className="text-2xl font-semibold sm:text-3xl">
//                 Instant Document Understanding
//               </h2>
//               <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
//                 An AI-powered system that quickly transforms scanned files into usable,
//                 structured data.
//               </p>

//               <ul className="mt-6 space-y-5">
//                 <li className="flex items-start gap-3">
//                   <CheckCircle2 className="mt-0.5 h-5 w-5 text-white/90" />
//                   <div>
//                     <div className="text-sm font-medium">High Precision</div>
//                     <p className="text-sm text-white/60">
//                       Delivers accurate extraction even from low-quality images or complex layouts.
//                     </p>
//                   </div>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle2 className="mt-0.5 h-5 w-5 text-white/90" />
//                   <div>
//                     <div className="text-sm font-medium">Multi-Language Ready</div>
//                     <p className="text-sm text-white/60">
//                       Supports various languages and scripts for global usability.
//                     </p>
//                   </div>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <CheckCircle2 className="mt-0.5 h-5 w-5 text-white/90" />
//                   <div>
//                     <div className="text-sm font-medium">Actionable Output</div>
//                     <p className="text-sm text-white/60">
//                       Converts raw text into editable, searchable, analytics-ready content.
//                     </p>
//                   </div>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </section>
//       </main>
//     </NextUIProvider>
//   );
// }
