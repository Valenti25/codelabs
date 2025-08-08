"use client";
import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

let isSpeaking = false;

function speak(text: string) {
  const synth = window.speechSynthesis;

  if (isSpeaking || synth.speaking) return;

  isSpeaking = true;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.pitch = 1;
  utterance.rate = 1;

  utterance.onend = () => {
    isSpeaking = false;
  };

  synth.speak(utterance);
}

function ModelInstance({ position = [0, 0, 0] }) {
  const meshRef = useRef<THREE.Object3D>(null);
  const gltf = useLoader(GLTFLoader, "/models/ai_orb.glb");

  // เก็บตำแหน่ง y เริ่มต้นไว้
  const initialY = position[1];

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const floatHeight = 0.3; // ระยะลอยขึ้นลง
      const floatSpeed = 1; // ความเร็วลอย

      meshRef.current.position.y =
        initialY + Math.sin(clock.getElapsedTime() * floatSpeed) * floatHeight;
    }
  });

  const handleClick = () => {
    speak("how can i have you");
  };

  return (
    <primitive
      object={gltf.scene}
      ref={meshRef}
      position={position}
      scale={[1, 1, 1]}
      onClick={handleClick}
    />
  );
}

export default function ModelAi_Orb() {
  return (
    <div className="h-[10vh] min-h-[350px] w-full">
      <Canvas
        className="h-full w-[1200px]"
        camera={{ position: [0, 0, 10], fov: 25 }}
      >
        <ModelInstance position={[0, -1.5, 0]} />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
