"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

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
  if (!m || m.length < 3) return new THREE.Color(0xffffff);
  return new THREE.Color(
    parseInt(m[0]) / 255,
    parseInt(m[1]) / 255,
    parseInt(m[2]) / 255,
  );
}

const RING_COUNT = 5;

export function SignalScene() {
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
    camera.position.set(0, 0, 9);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    const nucleusMat = new THREE.MeshStandardMaterial({
      roughness: 0.15,
      metalness: 0.7,
    });
    const glowMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const ringMats = Array.from(
      { length: RING_COUNT },
      () => new THREE.LineBasicMaterial({ transparent: true }),
    );
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
    });
    const nodeMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.6,
    });
    const connMat = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0.15,
    });

    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 48, 48),
      nucleusMat,
    );
    group.add(nucleus);
    group.add(new THREE.Mesh(new THREE.SphereGeometry(0.65, 32, 32), glowMat));

    const rings = ringMats.map((mat, i) => {
      const pts: number[] = [];
      const SEGS = 128;
      for (let j = 0; j <= SEGS; j++) {
        const θ = (j / SEGS) * Math.PI * 2;
        pts.push(Math.cos(θ), Math.sin(θ), 0);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      const ring = new THREE.Line(geo, mat);
      ring.userData.phase = (i / RING_COUNT) * Math.PI * 2;
      group.add(ring);
      return ring;
    });

    const NODE_COUNT = 8;
    const nodePositions = Array.from({ length: NODE_COUNT }, (_, i) => {
      const angle = (i / NODE_COUNT) * Math.PI * 2;
      const r = 2.5 + Math.sin(i * 1.3) * 0.8;
      return new THREE.Vector3(
        Math.cos(angle) * r,
        Math.sin(angle) * r * 0.6,
        Math.sin(i * 0.9) * 0.5,
      );
    });
    const nodes = nodePositions.map((pos) => {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 12, 12),
        nodeMat.clone(),
      );
      node.position.copy(pos);
      group.add(node);
      return node;
    });

    const connLines = nodes.map(() => {
      const posArr = new Float32Array(6);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
      const line = new THREE.LineSegments(geo, connMat.clone());
      group.add(line);
      return { line, posArr, geo };
    });

    const N = 150;
    const pPos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 4 + Math.random() * 3;
      const θ = Math.random() * Math.PI * 2;
      const φ = Math.acos(2 * Math.random() - 1);
      pPos[i * 3] = r * Math.sin(φ) * Math.cos(θ);
      pPos[i * 3 + 1] = r * Math.sin(φ) * Math.sin(θ);
      pPos[i * 3 + 2] = r * Math.cos(φ);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    group.add(new THREE.Points(pGeo, particleMat));

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const ptLight = new THREE.PointLight(undefined, 3, 12);
    ptLight.position.set(0, 0, 0);
    scene.add(ptLight);

    const updateColors = () => {
      const accent = resolveCssColor("--accent");
      const foreground = resolveCssColor("--foreground");

      nucleusMat.color.copy(accent);
      nucleusMat.emissive.copy(accent);
      glowMat.color.copy(accent);
      particleMat.color.copy(foreground);
      ptLight.color.copy(accent);
      nodes.forEach((n) => {
        (n.material as THREE.MeshBasicMaterial).color.copy(accent);
        (n.material as THREE.MeshBasicMaterial).needsUpdate = true;
      });
      connLines.forEach(({ line }) => {
        (line.material as THREE.LineBasicMaterial).color.copy(accent);
        (line.material as THREE.LineBasicMaterial).needsUpdate = true;
      });
      ringMats.forEach((m) => {
        m.color.copy(accent);
        m.needsUpdate = true;
      });
      [nucleusMat, glowMat, particleMat].forEach((m) => (m.needsUpdate = true));
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

      nucleus.scale.setScalar(1 + Math.sin(t * 2.2) * 0.05);
      nucleusMat.emissiveIntensity = 0.3 + Math.sin(t * 2.2) * 0.15;

      rings.forEach((ring) => {
        const phase = ring.userData.phase as number;
        const progress = (t * 0.4 + phase / (Math.PI * 2)) % 1;
        const scale = 0.5 + progress * 4.5;
        ring.scale.setScalar(scale);
        const mat = ring.material as THREE.LineBasicMaterial;
        mat.opacity = Math.max(0, (1 - progress) * 0.35);
        mat.needsUpdate = true;
      });

      nodes.forEach((node, i) => {
        const base = nodePositions[i];
        node.position.x = base.x + Math.sin(t * 0.5 + i * 0.8) * 0.12;
        node.position.y = base.y + Math.cos(t * 0.4 + i * 1.1) * 0.1;
      });

      connLines.forEach(({ posArr, geo }, i) => {
        const pos = nodes[i].position;
        posArr[0] = 0;
        posArr[1] = 0;
        posArr[2] = 0;
        posArr[3] = pos.x;
        posArr[4] = pos.y;
        posArr[5] = pos.z;
        geo.attributes.position.needsUpdate = true;
      });

      group.rotation.x += (-mouse.y * 0.12 - group.rotation.x) * 0.04;
      group.rotation.y += (mouse.x * 0.2 - group.rotation.y) * 0.04;
      group.rotation.y += 0.001;

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
