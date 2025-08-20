"use client";
import React, { Suspense, useRef, useState, useEffect } from "react";

export default function ModelCanvas() {
  const Spline = React.lazy(() => import("@splinetool/react-spline"));
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      });
    });

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative h-[30vh] w-full lg:overflow-hidden lg:min-h-[700px]"
    >
      <div className="absolute top-[50%] -left-10 h-4/5 w-1/2 lg:overflow-hidden lg:top-[20%] lg:-left-10">
        {isInView && (
          <Suspense fallback={null}>
            <Spline scene="https://prod.spline.design/Y9JlqDhMrA5yPC4o/scene.splinecode" />
          </Suspense>
        )}
      </div>

      <div className="absolute -top-[20%] right-0 pl-8 h-4/5 w-1/2 lg:overflow-hidden lg:-top-[10%] lg:right-0 lg:pl-96">
        {isInView && (
          <Suspense fallback={null}>
            <Spline scene="https://prod.spline.design/Y9JlqDhMrA5yPC4o/scene.splinecode" />
          </Suspense>
        )}
      </div>
    </div>
  );
}
