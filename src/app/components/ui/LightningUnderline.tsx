// "@/app/components/ui/LightningUnderline.tsx"
"use client";
import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Dir = "left" | "right";

export default function LightningUnderline({
  dir,
  idleWidth = 48,
  movingWidth = 150,
}: {
  dir: Dir;
  idleWidth?: number;
  movingWidth?: number;
}) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const prevX = React.useRef<number | null>(null);

  const [moving, setMoving] = React.useState(false);
  const [liveDir, setLiveDir] = React.useState<Dir>(dir);

  // ===== physics bases (raw) =====
  const baseScaleX = useMotionValue(1);
  const baseScaleY = useMotionValue(1);

  // ===== springs =====
  const scaleX = useSpring(baseScaleX, { stiffness: 140, damping: 24, mass: 1.2 });
  const scaleY = useSpring(baseScaleY, { stiffness: 160, damping: 26, mass: 1.2 });

  const shear = useSpring(0, { stiffness: 220, damping: 20, mass: 0.9 });

  // NOTE: ใช้ target + spring เพื่อแทน setVelocity()
  const offsetXTarget = useMotionValue(0);
  const offsetX = useSpring(offsetXTarget, { stiffness: 180, damping: 16, mass: 0.9 });

  const ratio = Math.max(1, movingWidth / idleWidth);

  // ===== tuning constants =====
  const SPEED_NORM = 22;
  const STRETCH_GAIN = 0.55;
  const Y_SQUASH = 0.44;
  const SHEAR_GAIN = 8.5;
  const OFFSET_GAIN = 0.9;

  // ===== tracking movement =====
  React.useEffect(() => {
    if (!moving) return;

    let raf = 0;
    const tick = () => {
      const el = ref.current;
      if (el) {
        const x = el.getBoundingClientRect().left;
        const p = prevX.current;

        if (p !== null) {
          const dx = x - p;
          const sign = dx >= 0 ? 1 : -1;
          const speed = Math.min(1, Math.abs(dx) / SPEED_NORM);

          if (Math.abs(dx) > 0.25) setLiveDir(sign > 0 ? "right" : "left");

          const targetX = ratio * (1 + STRETCH_GAIN * speed);
          const squash = 1 + Y_SQUASH * (targetX / ratio - 1);

          baseScaleX.set(targetX);
          baseScaleY.set(1 / squash);

          shear.set(SHEAR_GAIN * speed * sign);

          // ==== แทนที่ setVelocity() ด้วย impulse to spring target ====
          const impulse = dx * OFFSET_GAIN;

          // กันกรณีมีแอนิเมชันค้าง (ไม่จำเป็นเสมอไป แต่ช่วยให้เสถียร)
          offsetX.stop?.();

          // เตะ target ออกไปหนึ่งเฟรม แล้วดึงกลับศูนย์
          offsetXTarget.set(impulse);
          requestAnimationFrame(() => {
            offsetXTarget.set(0);
          });
        }

        prevX.current = x;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [moving, ratio, baseScaleX, baseScaleY, shear, offsetX, offsetXTarget]);

  // ===== reset เมื่อหยุดเคลื่อน =====
  React.useLayoutEffect(() => {
    if (ref.current) prevX.current = ref.current.getBoundingClientRect().left ?? null;

    if (!moving) {
      baseScaleX.set(1);
      baseScaleY.set(1);
      shear.set(0);
      offsetXTarget.set(0);
    }
  }, [moving, baseScaleX, baseScaleY, shear, offsetXTarget]);

  const d: Dir = moving ? liveDir : dir;
  const origin = d === "right" ? "right" : "left";

  return (
    <motion.span
      ref={ref}
      layoutId="tab-underline"
      className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2"
      style={{ width: idleWidth, height: 22, willChange: "transform" }}
      transition={{ type: "spring", stiffness: 120, damping: 30, mass: 1.6, restDelta: 0.001, restSpeed: 0.001 }}
      onLayoutAnimationStart={() => setMoving(true)}
      onLayoutAnimationComplete={() => setMoving(false)}
    >
      {/* Static state - simple white line */}
      {!moving && (
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 rounded-full"
          style={{
            height: 2,
            background: "#ffffff",
            opacity: 0.8,
          }}
        />
      )}

      {/* Moving state - lightning bolt */}
      {moving && (
        <motion.div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 overflow-visible"
          style={{ transformOrigin: `${origin} center`, scaleX, scaleY, x: offsetX, skewX: shear, willChange: "transform" }}
        >
          {/* Main lightning beam */}
          <div
            className="absolute inset-0"
            style={{
              height: 3,
              background:
                "linear-gradient(90deg, #1e3a8a 0%, #1e40af 25%, #3b82f6 50%, #60a5fa 75%, #93c5fd 100%)",
              boxShadow:
                "0 0 8px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.5), 0 0 32px rgba(59, 130, 246, 0.3)",
              WebkitMaskImage:
                d === "right"
                  ? "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 5%, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,1) 100%)"
                  : "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.1) 95%, rgba(0,0,0,0) 100%)",
              maskImage:
                d === "right"
                  ? "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 5%, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,1) 100%)"
                  : "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.1) 95%, rgba(0,0,0,0) 100%)",
            }}
          />

          {/* Bright core */}
          <div
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
            style={{
              height: 1.2,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(147,197,253,0.9) 30%, rgba(255,255,255,1) 70%, rgba(147,197,253,0.8) 100%)",
              boxShadow: "0 0 4px rgba(255, 255, 255, 0.9)",
              WebkitMaskImage:
                d === "right"
                  ? "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,1) 100%)"
                  : "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
              maskImage:
                d === "right"
                  ? "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,1) 100%)"
                  : "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
            }}
          />

          {/* Electric crackling */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ mixBlendMode: "screen", opacity: 0.6 }}
          >
            <div
              className="absolute inset-0 animate-electric-pulse"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 30%, rgba(147,197,253,0.6) 50%, rgba(255,255,255,0.4) 70%, transparent 100%)",
                height: 4,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </div>

          {/* Moving sweep */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ mixBlendMode: "screen", opacity: 0.3 }}
          >
            <div className="absolute -inset-x-32 inset-y-[1px] animate-lightning-sweep bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
        </motion.div>
      )}

      <style jsx>{`
        @keyframes lightning-sweep {
          0%   { transform: translateX(-100%); opacity: 0; }
          20%  { opacity: 0.8; }
          80%  { opacity: 0.8; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        @keyframes electric-pulse {
          0%, 100% { opacity: 0.4; filter: blur(0px); }
          50% { opacity: 0.8; filter: blur(0.5px); }
        }

        .animate-lightning-sweep {
          animation: lightning-sweep 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
        }

        .animate-electric-pulse {
          animation: electric-pulse 0.15s ease-in-out infinite alternate;
        }
      `}</style>
    </motion.span>
  );
}
