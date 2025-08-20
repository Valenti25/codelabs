"use client";
import Spline from '@splinetool/react-spline';
import React from "react";

export default function ModelBrain() {
  return (
    <div className="w-full h-full lg:min-h-[500px] aspect-[1/1]">
      <Spline
        scene="https://prod.spline.design/umb2qBe9qjOcNX3n/scene.splinecode"
      />
    </div>
  );
}