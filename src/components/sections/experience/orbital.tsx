"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ORBITS = [
  { radius: 1.55, speed: 0.55, incline: 0.3, phase: 0 },
  { radius: 2.1, speed: 0.38, incline: -0.55, phase: Math.PI / 3 },
  { radius: 2.6, speed: 0.28, incline: 0.65, phase: (2 * Math.PI) / 3 },
  { radius: 1.9, speed: 0.46, incline: -0.2, phase: Math.PI },
  { radius: 3.0, speed: 0.22, incline: 0.45, phase: (4 * Math.PI) / 3 },
  { radius: 2.35, speed: 0.34, incline: -0.7, phase: (5 * Math.PI) / 3 },
] as const;

const ORBIT_SEGMENTS = 128;

function makeOrbitRing(radius: number, incline: number): THREE.BufferGeometry {
  const pts: number[] = [];
  for (let i = 0; i <= ORBIT_SEGMENTS; i++) {
    const θ = (i / ORBIT_SEGMENTS) * Math.PI * 2;
    pts.push(
      Math.cos(θ) * radius,
      Math.sin(θ) * radius * Math.sin(incline),
      Math.sin(θ) * radius * Math.cos(incline),
    );
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return geo;
}

function getOrbitPos(o: (typeof ORBITS)[number], t: number): THREE.Vector3 {
  const θ = t * o.speed + o.phase;
  return new THREE.Vector3(
    Math.cos(θ) * o.radius,
    Math.sin(θ) * o.radius * Math.sin(o.incline),
    Math.sin(θ) * o.radius * Math.cos(o.incline),
  );
}

function resolveColor(cssVar: string): THREE.Color {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();

  const tmp = document.createElement("div");

  tmp.style.color = raw.startsWith("oklch(") ? raw : `oklch(${raw})`;
  document.body.appendChild(tmp);
  const resolved = getComputedStyle(tmp).color;
  document.body.removeChild(tmp);

  const m = resolved.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return new THREE.Color(0xffffff);
  return new THREE.Color(
    parseInt(m[0]) / 255,
    parseInt(m[1]) / 255,
    parseInt(m[2]) / 255,
  );
}

export function OrbitalScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 2, 9);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    const nucleusMat = new THREE.MeshStandardMaterial({
      roughness: 0.15,
      metalness: 0.7,
    });
    const glowMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.07,
      side: THREE.BackSide,
    });
    const ringMat = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0.1,
    });
    const satMat = new THREE.MeshStandardMaterial({
      roughness: 0.3,
      metalness: 0.5,
    });
    const haloMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
    });
    const connMat = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0.2,
    });
    const particleMat = new THREE.PointsMaterial({
      size: 0.038,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
    });

    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 48, 48),
      nucleusMat,
    );
    group.add(nucleus);
    group.add(new THREE.Mesh(new THREE.SphereGeometry(0.82, 32, 32), glowMat));

    ORBITS.forEach((o) =>
      group.add(new THREE.Line(makeOrbitRing(o.radius, o.incline), ringMat)),
    );

    const satellites = ORBITS.map(() => {
      const sat = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 16, 16),
        satMat,
      );
      sat.add(new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), haloMat));
      group.add(sat);
      return sat;
    });

    const linePosArr = new Float32Array(ORBITS.length * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePosArr, 3));
    group.add(new THREE.LineSegments(lineGeo, connMat));

    const N = 200;
    const pPos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 3.8 + Math.random() * 3.5;
      const θ = Math.random() * Math.PI * 2;
      const φ = Math.acos(2 * Math.random() - 1);
      pPos[i * 3] = r * Math.sin(φ) * Math.cos(θ);
      pPos[i * 3 + 1] = r * Math.sin(φ) * Math.sin(θ);
      pPos[i * 3 + 2] = r * Math.cos(φ);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    group.add(new THREE.Points(pGeo, particleMat));

    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const ptLight = new THREE.PointLight(undefined, 3.5, 14);
    ptLight.position.set(0, 0, 0);
    scene.add(ptLight);
    const rim = new THREE.DirectionalLight(0xffffff, 0.6);
    rim.position.set(5, 5, 5);
    scene.add(rim);

    const updateColors = () => {
      const accent = resolveColor("--accent");
      const foreground = resolveColor("--foreground");

      nucleusMat.color.copy(accent);
      nucleusMat.emissive.copy(accent);
      glowMat.color.copy(accent);
      ringMat.color.copy(foreground);
      satMat.color.copy(foreground);
      satMat.emissive.copy(accent);
      haloMat.color.copy(accent);
      connMat.color.copy(accent);
      particleMat.color.copy(foreground);
      ptLight.color.copy(accent);

      [
        nucleusMat,
        glowMat,
        ringMat,
        satMat,
        haloMat,
        connMat,
        particleMat,
      ].forEach((m) => (m.needsUpdate = true));
    };
    updateColors();

    const mo = new MutationObserver(updateColors);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener("mousemove", onMouseMove);

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

    let rafId: number;
    let t = 0;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      t += 0.008;

      nucleus.scale.setScalar(1 + Math.sin(t * 2.1) * 0.04);
      nucleusMat.emissiveIntensity = 0.28 + Math.sin(t * 2.1) * 0.14;

      satellites.forEach((sat, i) => {
        const pos = getOrbitPos(ORBITS[i], t);
        sat.position.copy(pos);
        const b = i * 6;
        linePosArr[b] = 0;
        linePosArr[b + 1] = 0;
        linePosArr[b + 2] = 0;
        linePosArr[b + 3] = pos.x;
        linePosArr[b + 4] = pos.y;
        linePosArr[b + 5] = pos.z;
      });
      lineGeo.attributes.position.needsUpdate = true;

      group.rotation.x += (-mouse.y * 0.18 - group.rotation.x) * 0.04;
      group.rotation.y += (mouse.x * 0.3 - group.rotation.y) * 0.04;
      group.rotation.y += 0.0018;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      mo.disconnect();
      mount.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
