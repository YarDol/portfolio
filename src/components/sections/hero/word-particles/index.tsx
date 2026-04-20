"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { BURST_COUNT, PARTICLE_COLORS, MIN_MS_BETWEEN_BURSTS } from "./constants";
import { makeDotTexture } from "./dot-texture";
import type { Burst } from "./types";

export function WordParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    let W = canvas.clientWidth || 1;
    let H = canvas.clientHeight || 1;

    const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 0, 1);
    camera.position.z = 1;

    const dotTex = makeDotTexture();
    const bursts: Burst[] = [];
    let lastBurstAt = 0;

    const spawnBurst = (clientX: number, clientY: number) => {
      const now = performance.now();
      if (now - lastBurstAt < MIN_MS_BETWEEN_BURSTS) return;
      lastBurstAt = now;

      const rect = canvas.getBoundingClientRect();
      const wx = (clientX - rect.left) - W / 2;
      const wy = H / 2 - (clientY - rect.top);

      const positions = new Float32Array(BURST_COUNT * 3);
      const velocities = new Float32Array(BURST_COUNT * 3);

      for (let i = 0; i < BURST_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = i < BURST_COUNT * 0.4
          ? 20 + Math.random() * 60
          : 80 + Math.random() * 180;
        positions[i * 3]     = wx;
        positions[i * 3 + 1] = wy;
        positions[i * 3 + 2] = 0;
        velocities[i * 3]     = Math.cos(angle) * speed;
        velocities[i * 3 + 1] = Math.sin(angle) * speed;
        velocities[i * 3 + 2] = 0;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions.slice(), 3));

      const colorHex = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      const material = new THREE.PointsMaterial({
        map: dotTex,
        size: 10 + Math.random() * 8,
        transparent: true,
        opacity: 1,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        color: new THREE.Color(colorHex),
        sizeAttenuation: false,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      bursts.push({ positions, velocities, geometry, material, points, age: 0, duration: 0.55 + Math.random() * 0.35 });
    };

    const onWordHover = (e: Event) => {
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
      spawnBurst(x, y);
    };
    window.addEventListener("word-hover", onWordHover);

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      if (!W || !H) return;
      renderer.setSize(W, H, false);
      camera.left = -W / 2;
      camera.right = W / 2;
      camera.top = H / 2;
      camera.bottom = -H / 2;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let lastTime = performance.now();
    let rafId: number;
    let disposed = false;

    const tick = () => {
      if (disposed) return;
      rafId = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      for (let b = bursts.length - 1; b >= 0; b--) {
        const burst = bursts[b];
        burst.age += dt;
        const t = burst.age / burst.duration;

        if (t >= 1) {
          scene.remove(burst.points);
          burst.geometry.dispose();
          burst.material.dispose();
          bursts.splice(b, 1);
          continue;
        }

        burst.material.opacity = 1 - t * t;
        const pos = burst.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < BURST_COUNT; i++) {
          pos[i * 3]     += burst.velocities[i * 3]     * dt;
          pos[i * 3 + 1] += burst.velocities[i * 3 + 1] * dt;
        }
        burst.geometry.attributes.position.needsUpdate = true;
      }

      if (bursts.length > 0) {
        renderer.render(scene, camera);
      }
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("word-hover", onWordHover);
      dotTex.dispose();
      for (const b of bursts) {
        scene.remove(b.points);
        b.geometry.dispose();
        b.material.dispose();
      }
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20 w-full h-full"
    />
  );
}
