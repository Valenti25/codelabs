"use client";
import React from "react";

export default function ModelCanvas() {
  return (
    <div className="relative flex h-[40vh] min-h-[700px] w-full gap-4">
      <iframe
        src="https://my.spline.design/ai-lz6Ve8ljqhaLHpomo6bufQIn/"
        frameBorder="0"
        width="50%"
        height="80%"
        className="mt-32 rounded-lg"
        style={{ border: "none" }}
        title="Model 1"
      />
      <iframe
        src="https://my.spline.design/ai-lz6Ve8ljqhaLHpomo6bufQIn/"
        frameBorder="0"
        width="50%"
        height="80%"
        className="-mt-28 rounded-lg"
        style={{ border: "none" }}
        title="Model 2"
      />
    </div>
  );
}
