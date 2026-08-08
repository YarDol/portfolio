"use client";

import { useEffect, RefObject } from "react";
import * as THREE from "three";
import { NODE_COUNT, BOUNDS, PALETTE_DARK, PALETTE_LIGHT, CONNECTION_DIST } from "../config/neural-graph";
import type { NodeData } from "../model/types";

export const useNeuralGraph = (canvasRef: RefObject<HTMLCanvasElement | null>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 14;

    const isDark = () => document.documentElement.classList.contains("dark");

    const nodeGeo = new THREE.IcosahedronGeometry(0.08, 0);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: isDark() ? 0xffffff : 0x111111,
      transparent: true,
      opacity: isDark() ? 0.75 : 0.65,
      wireframe: true,
    });
    const instancedMesh = new THREE.InstancedMesh(nodeGeo, nodeMat, NODE_COUNT);
    instancedMesh.frustumCulled = false;
    scene.add(instancedMesh);

    const getPalette = () =>
      (isDark() ? PALETTE_DARK : PALETTE_LIGHT).map(c => new THREE.Color(c));

    const nodes: NodeData[] = Array.from({ length: NODE_COUNT }, (_, i) => {
      const palette = getPalette();
      const color = palette[Math.floor(Math.random() * palette.length)];
      instancedMesh.setColorAt(i, color);
      return {
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * BOUNDS * 2,
          (Math.random() - 0.5) * BOUNDS * 2,
          (Math.random() - 0.5) * BOUNDS,
        ),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.002,
        ),
        color,
        scale: 0.4 + Math.random() * 0.8,
      };
    });
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

    const MAX_PAIRS = (NODE_COUNT * (NODE_COUNT - 1)) / 2;
    const linePosArr = new Float32Array(MAX_PAIRS * 2 * 3);
    const lineColArr = new Float32Array(MAX_PAIRS * 2 * 3);

    const lineGeo = new THREE.BufferGeometry();
    const linePosAttr = new THREE.BufferAttribute(linePosArr, 3);
    const lineColAttr = new THREE.BufferAttribute(lineColArr, 3);

    lineGeo.setAttribute("position", linePosAttr);
    lineGeo.setAttribute("color", lineColAttr);

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: isDark() ? 0.32 : 0.22,
    });
    const lineSegs = new THREE.LineSegments(lineGeo, lineMat);
    lineSegs.frustumCulled = false;
    scene.add(lineSegs);

    // Recolour nodes + lines when theme toggles
    const applyTheme = () => {
      const dark = isDark();
      nodeMat.color.set(dark ? 0xffffff : 0x111111);
      nodeMat.opacity = dark ? 0.75 : 0.65;
      lineMat.opacity = dark ? 0.32 : 0.22;
      const palette = getPalette();
      nodes.forEach((n, i) => {
        n.color = palette[Math.floor(Math.random() * palette.length)];
        instancedMesh.setColorAt(i, n.color);
      });
      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
    };

    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mouseWorld = new THREE.Vector3(9999, 9999, 0);
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseWorld.set(nx * BOUNDS * 1.4, ny * BOUNDS * 1.4, 0);
    };
    canvas.addEventListener("mousemove", onMouseMove);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const dummy = new THREE.Object3D();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      for (let i = 0; i < NODE_COUNT; i++) {
        const n = nodes[i];
        n.pos.add(n.vel);

        if (Math.abs(n.pos.x) > BOUNDS) n.vel.x *= -1;
        if (Math.abs(n.pos.y) > BOUNDS) n.vel.y *= -1;
        if (Math.abs(n.pos.z) > BOUNDS * 0.5) n.vel.z *= -1;

        const dx = n.pos.x - mouseWorld.x;
        const dy = n.pos.y - mouseWorld.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 5 && d2 > 0) {
          const d = Math.sqrt(d2);
          const f = 0.014 / (d + 0.01);
          n.pos.x += (dx / d) * f;
          n.pos.y += (dy / d) * f;
        }

        dummy.position.copy(n.pos);
        dummy.scale.setScalar(n.scale);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;

      let v = 0;
      let cIdx = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = nodes[i].pos.x - nodes[j].pos.x;
          const dy = nodes[i].pos.y - nodes[j].pos.y;
          const dz = nodes[i].pos.z - nodes[j].pos.z;
          if (dx * dx + dy * dy + dz * dz < CONNECTION_DIST * CONNECTION_DIST) {
            linePosArr[v++] = nodes[i].pos.x;
            linePosArr[v++] = nodes[i].pos.y;
            linePosArr[v++] = nodes[i].pos.z;
            linePosArr[v++] = nodes[j].pos.x;
            linePosArr[v++] = nodes[j].pos.y;
            linePosArr[v++] = nodes[j].pos.z;
            
            lineColArr[cIdx++] = nodes[i].color.r;
            lineColArr[cIdx++] = nodes[i].color.g;
            lineColArr[cIdx++] = nodes[i].color.b;
            lineColArr[cIdx++] = nodes[j].color.r;
            lineColArr[cIdx++] = nodes[j].color.g;
            lineColArr[cIdx++] = nodes[j].color.b;
          }
        }
      }
      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;
      lineGeo.setDrawRange(0, v / 3);

      const t = Date.now() * 0.00018;
      camera.position.x = Math.sin(t) * 1.8;
      camera.position.y = Math.cos(t * 0.65) * 1.0;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", onMouseMove);
      ro.disconnect();
      themeObserver.disconnect();
      renderer.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
    };
  }, [canvasRef]);
};
