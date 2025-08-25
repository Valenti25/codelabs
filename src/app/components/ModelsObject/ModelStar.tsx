import React, { Suspense, useRef, useState, useEffect } from "react";

export default function ModelCanvas() {
  const Spline = React.lazy(() => import("@splinetool/react-spline"));
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    import("@splinetool/react-spline");
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative h-[25vh] w-full lg:min-h-[600px] lg:overflow-hidden"
    >
      <div className="absolute top-[90%] z-50 -left-10 h-4/5 w-1/2 lg:top-[30%] lg:-left-24">
        {isInView && (
          <Suspense>
            <Spline scene="https://prod.spline.design/dIHvXSNd1BJQN7MA/scene.splinecode" />
          </Suspense>
        )}
      </div>
      <div className="absolute -top-[20%] right-0 pl-8 h-4/5 w-1/2 lg:-top-[5%] lg:right-0 lg:pl-52">
        {isInView && (
          <Suspense>
            <Spline scene="https://prod.spline.design/dIHvXSNd1BJQN7MA/scene.splinecode" />
          </Suspense>
        )}
      </div>
    </div>
  );
}