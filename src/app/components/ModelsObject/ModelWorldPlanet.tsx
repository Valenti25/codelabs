"use client";
import React, { useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

function ModelInstance({ position = [0, 0, 0] }) {
  const meshRef = useRef<THREE.Object3D>(null);
  const gltf = useLoader(GLTFLoader, "/models/world_planet.glb");

  return (
    <primitive
      object={gltf.scene}
      ref={meshRef}
      position={position}
      scale={[1, 1, 1]}
    />
  );
}

export default function ModelBrain() {
  return (
    <>
      <div className="aspect-[1/1] h-full min-h-[300px] w-full">
        <Canvas
          className="h-full w-full"
          camera={{ position: [0, 0, 10], fov: 25 }}
        >
          <ModelInstance position={[0, 0.5, -6]} />
          <Environment preset="city" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>
    </>
  );
}
