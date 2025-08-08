"use client";
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls, Environment } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import * as THREE from "three";

function ModelInstance({
  position = [0, 0, 0],
  scale = [1, 1, 1],
}: {
  position?: [number, number, number];
  scale?: [number, number, number];
  rotationSpeed?: number;
}) {
  const gltf = useLoader(GLTFLoader, "/models/star.glb");
  const meshRef = useRef<THREE.Object3D>(null);
  const clonedScene = clone(gltf.scene);

  return (
    <primitive
      ref={meshRef}
      object={clonedScene}
      position={position}
      scale={scale}
    />
  );
}

type StarConfig = {
  position: [number, number, number]; 
  scale: [number, number, number];   
};

export default function ModelCanvas() {
  const [stars, setStars] = useState<StarConfig[]>([
    // ค่าเริ่มต้นสำหรับจอใหญ่
    { position: [5.5, 0, 0], scale: [3.5, 3.5, 3.5] },
    { position: [-5, -2, 0], scale: [3.5, 3.5, 3.5] },
  ]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        setStars([
          { position: [2, 2, 0], scale: [1.5, 1.5, 1.5] },
          { position: [-1.8, 1, 0], scale: [1.5, 1.5, 1.5] },
        ]);
      } else {
        setStars([
          { position: [5.5, 0, 0], scale: [3.5, 3.5, 3.5] },
          { position: [-5, -2, 0], scale: [3.5, 3.5, 3.5] },
        ]);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative h-[40vh] min-h-[700px] w-full">
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, 10], fov: 45 }}
      >
        {stars.map((starProps, index) => (
          <ModelInstance
            key={index}
            {...starProps}
            rotationSpeed={0.3}
          />
        ))}

        <Environment preset="city" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}