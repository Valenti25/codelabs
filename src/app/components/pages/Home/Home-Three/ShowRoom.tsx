"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import Modelscard from "../../../ModelsObject/Modelscard";


type ShowRoomProps = {
  url?: string;
  autoRotate?: boolean;
  height?: number;
  scale?: number;
};

export default function ShowRoom({
  url = "/models/id_card.glb",
  height = 420,
  scale = 1,
}: ShowRoomProps) {
  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: 16,
        overflow: "hidden",
        background: "rgba(0,0,0,0.05)",
      }}
    >
      <Canvas camera={{ position: [2.2, 1.4, 2.6], fov: 45 }} shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} castShadow />
        <Suspense fallback={null}>
          <Modelscard url={url} scale={scale} />
          <Environment preset="city" />
          <ContactShadows
            position={[0, -0.5, 0]}
            opacity={0.35}
            scale={10}
            blur={2.5}
          />
        </Suspense>
        <OrbitControls enableDamping makeDefault />
      </Canvas>
    </div>
  );
}
