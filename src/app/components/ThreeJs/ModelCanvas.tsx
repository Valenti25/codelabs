"use client";
import React from "react";

export default function ModelCanvas() {
  return (
    <div className="relative flex h-[40vh] min-h-[700px] w-full gap-4">
      <iframe
        src="https://my.spline.design/ai-lz6Ve8ljqhaLHpomo6bufQIn/"
        frameBorder="0"
        width="50%"
        height="100%"
        className="mt-56 rounded-lg"
        style={{ border: "none" }}
        title="Model 1"
        loading="eager" // โหลดทันที
      />
      <iframe
        src="https://my.spline.design/ai-lz6Ve8ljqhaLHpomo6bufQIn/"
        frameBorder="0"
        width="50%"
        height="100%"
        style={{ border: "none" }}
        title="Model 2"
        loading="eager" // โหลดแบบหน่วง
      />
    </div>
  );
}
