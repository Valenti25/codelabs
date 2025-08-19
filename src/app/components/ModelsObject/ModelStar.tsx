"use client";
// import React, { useRef, useEffect } from 'react';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// // This is the React component that you will export
// export default function ModelCanvas() {
//   // useRef will hold a reference to the div where we mount our scene
//   const mountRef = useRef<HTMLDivElement>(null);

//   // useEffect will run once after the component mounts
//   useEffect(() => {
//     // Make sure we have a mount point
//     if (!mountRef.current) return;

//     // 1. Scene Setup
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
//     camera.position.z = 5; // Move camera back to see the model

//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     mountRef.current.appendChild(renderer.domElement);

//     // Add controls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;

//     // Add lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     directionalLight.position.set(5, 5, 5);
//     scene.add(directionalLight);

//     // 2. Custom Material Logic (Your original code)
//     function makeGradientTexture(stops: { pos: number; color: string }[]) {
//       const w = 256, h = 1;
//       const c = document.createElement('canvas'); c.width = w; c.height = h;
//       const g = c.getContext('2d')!;
//       const gr = g.createLinearGradient(0, 0, w, 0);
//       for (const s of stops) gr.addColorStop(s.pos, s.color);
//       g.fillStyle = gr; g.fillRect(0, 0, w, h);
//       const tex = new THREE.CanvasTexture(c);
//       tex.wrapS = THREE.ClampToEdgeWrapping;
//       tex.wrapT = THREE.ClampToEdgeWrapping;
//       return tex;
//     }

//     const gradientTex = makeGradientTexture([
//       { pos: 0.00, color: '#6f29ff' },
//       { pos: 0.50, color: '#ff6ad9' },
//       { pos: 1.00, color: '#6feaff' }
//     ]);

//     const mat = new THREE.MeshPhysicalMaterial({
//       color: 0xffffff,
//       metalness: 1.0,
//       roughness: 0.2,
//       iridescence: 1.0,
//       iridescenceIOR: 1.3,
//       iridescenceThicknessRange: [120, 400],
//     });

//     mat.onBeforeCompile = (shader) => {
//       shader.uniforms.uGradient = { value: gradientTex };
//       shader.fragmentShader = shader.fragmentShader
//         .replace(
//           '#include <common>',
//           `
//           #include <common>
//           uniform sampler2D uGradient;
//           `
//         )
//         .replace(
//           '#include <output_fragment>',
//           `
//           vec3 V = normalize( vViewPosition.xyz );
//           float facing = abs(dot( geometryNormal, V ));
//           float t = pow(1.0 - facing, 1.5);
//           vec3 grad = texture2D(uGradient, vec2(t, 0.5)).rgb;
//           vec3 colored = outgoingLight * grad;
//           gl_FragColor = vec4( colored, diffuseColor.a );
//           `
//         );
//     };

//     // 3. Model Loading
//     const loader = new GLTFLoader();
//     loader.load(
//         './models/star.glb', // IMPORTANT: Place 'model.glb' in your 'public' folder
//         (gltf) => {
//             gltf.scene.traverse((child) => {
//                 if ((child as THREE.Mesh).isMesh) {
//                     (child as THREE.Mesh).material = mat;
//                 }
//             });
//             scene.add(gltf.scene);
//         },
//         undefined, // onProgress callback (optional)
//         (error) => {
//             console.error('An error happened while loading the model:', error);
//         }
//     );

//     // 4. Animation Loop
//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update(); // Update controls
//       renderer.render(scene, camera);
//     };
//     animate();

//     // 5. Handle Resize
//     const handleResize = () => {
//         if (mountRef.current) {
//             const width = mountRef.current.clientWidth;
//             const height = mountRef.current.clientHeight;
//             camera.aspect = width / height;
//             camera.updateProjectionMatrix();
//             renderer.setSize(width, height);
//         }
//     };
//     window.addEventListener('resize', handleResize);

//     // 6. Cleanup function
//     return () => {
//         window.removeEventListener('resize', handleResize);
//         mountRef.current?.removeChild(renderer.domElement);
//         // Dispose of Three.js objects to free up memory
//         scene.clear();
//         renderer.dispose();
//     };
//   }, []); // The empty dependency array ensures this runs only once

//   // Return the div that Three.js will render into
//   return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
// }

import React from "react";

export default function ModelCanvas() {
  return (
    <div className="relative w-full h-[40vh] lg:min-h-[700px] overflow-hidden">
      {/* iframe แรก - ตำแหน่งซ้าย */}
      <iframe
        src="https://my.spline.design/ai-lz6Ve8ljqhaLHpomo6bufQIn/"
        frameBorder="0"
        className="absolute -left-[10%] top-[20%] lg:left-0 w-1/2 h-4/5 rounded-lg"
        style={{ border: "none" }}
        title="Model 1"
      />
      {/* iframe ที่สอง - ตำแหน่งขวา offset ขึ้น */}
      <iframe
        src="https://my.spline.design/ai-lz6Ve8ljqhaLHpomo6bufQIn/"
        frameBorder="0"
        className="absolute right-0 bottom-32 lg:mb-24 w-1/2 h-4/5 rounded-lg"
        style={{ border: "none" }}
        title="Model 2"
      />
    </div>
  );
}