"use client";
import Spline from '@splinetool/react-spline';
import React from "react";

export default function ModelBrain() {
  return (
    <div className="h-full w-full lg:min-h-[500px] lg:aspect-[1/1]">
      <Spline
        scene="https://prod.spline.design/umb2qBe9qjOcNX3n/scene.splinecode"
      />
    </div>
  );
}
