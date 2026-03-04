"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function resolveCssColor(cssVar: string): THREE.Color {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();
  const tmp = document.createElement("div");
  tmp.style.color = raw.startsWith("oklch(") ? raw : `oklch(${raw})`;
  document.body.appendChild(tmp);
  const resolved = getComputedStyle(tmp).color;
  document.body.removeChild(tmp);
  const m = resolved.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return new THREE.Color(0x888888);
  return new THREE.Color(
    parseInt(m[0]) / 255,
    parseInt(m[1]) / 255,
    parseInt(m[2]) / 255,
  );
}

export function ProjectCanvas({ seed }: { seed: number }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 50);
    camera.position.z = 5;

    const group = new THREE.Group();
    scene.add(group);

    const rand = rng(seed * 997);
    const N = 40;
    const verts: THREE.Vector3[] = [];
    const posArr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const v = new THREE.Vector3(
        (rand() - 0.5) * 7,
        (rand() - 0.5) * 4,
        (rand() - 0.5) * 5,
      );
      verts.push(v);
      posArr[i * 3] = v.x;
      posArr[i * 3 + 1] = v.y;
      posArr[i * 3 + 2] = v.z;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(posArr.slice(), 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.13,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    group.add(new THREE.Points(pGeo, pMat));

    const THRESHOLD = 2.6;
    const lineVerts: number[] = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        if (verts[i].distanceTo(verts[j]) < THRESHOLD) {
          lineVerts.push(
            verts[i].x,
            verts[i].y,
            verts[i].z,
            verts[j].x,
            verts[j].y,
            verts[j].z,
          );
        }
      }
    }
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(lineVerts, 3),
    );
    const lMat = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0.13,
    });
    group.add(new THREE.LineSegments(lGeo, lMat));

    const updateColors = () => {
      pMat.color.copy(resolveCssColor("--accent"));
      lMat.color.copy(resolveCssColor("--foreground"));
      pMat.needsUpdate = true;
      lMat.needsUpdate = true;
    };
    updateColors();
    const mo = new MutationObserver(updateColors);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    let isVisible = false;
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(mount);

    let rafId: number;
    let t = 0;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!isVisible) return;
      t += 0.004;
      group.rotation.y = t * 0.45 + seed * 1.1;
      group.rotation.x = Math.sin(t * 0.6 + seed) * 0.22;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [seed]);

  return <div ref={mountRef} className="w-full h-full" />;
}
