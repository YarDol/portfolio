import { useEffect } from "react";
import * as THREE from "three";
import { ANNS, getMoonScreen, LINE_DUR, STAGGER } from "../moon-annotations/constants";

export function useSunLines(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  textRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);

    const scene = new THREE.Scene();
    let W = canvas.clientWidth || 1;
    let H = canvas.clientHeight || 1;

    const camera = new THREE.OrthographicCamera(
      -W / 2,
      W / 2,
      H / 2,
      -H / 2,
      0,
      1,
    );
    camera.position.z = 1;

    const positions = new Float32Array(ANNS.length * 12);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );

    const material = new THREE.LineBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0,
    });
    const lineSegs = new THREE.LineSegments(geometry, material);
    scene.add(lineSegs);

    function computeLines(elapsed: number) {
      const ms = getMoonScreen(W, H);

      const mx = ms.x * W - W / 2;
      const my = H / 2 - ms.y * H;
      const mr = ms.r * H;

      ANNS.forEach((ann, i) => {
        const delay = ann.d * STAGGER;
        const tVal = Math.max(0, (elapsed - delay) / LINE_DUR);
        const p1 = Math.min(tVal / 0.6, 1);
        const p2 = Math.max(0, Math.min((tVal - 0.5) / 0.5, 1));

        const ex = (ms.x + ann.dx) * W - W / 2;
        const ey = H / 2 - (ms.y + ann.dy) * H;

        const lx = ex - mx;
        const ly = ey - my;
        const len = Math.sqrt(lx * lx + ly * ly) || 1;
        const sx = mx + (lx / len) * mr;
        const sy = my + (ly / len) * mr;

        const cx = sx + (ex - sx) * p1;
        const cy = sy + (ey - sy) * p1;

        const base = i * 12;
        positions[base + 0] = sx;
        positions[base + 1] = sy;
        positions[base + 2] = 0;
        positions[base + 3] = cx;
        positions[base + 4] = cy;
        positions[base + 5] = 0;

        positions[base + 6] = ex;
        positions[base + 7] = ey;
        positions[base + 8] = 0;
        positions[base + 9] = ex + ann.uw * ann.dir * p2;
        positions[base + 10] = ey;
        positions[base + 11] = 0;
      });

      geometry.attributes.position.needsUpdate = true;
    }

    function positionLabels() {
      const ms = getMoonScreen(W, H);
      ANNS.forEach((ann, i) => {
        const el = textRefs.current?.[i];
        if (!el) return;

        const ex = (ms.x + ann.dx) * W;
        const ey = (ms.y + ann.dy) * H;

        el.style.top = `${ey}px`;

        if (ann.dir === 1) {
          el.style.left = `${ex}px`;
          el.style.textAlign = "left";
          el.style.removeProperty("width");
        } else {
          el.style.left = `${ex - ann.uw}px`;
          el.style.width = `${ann.uw}px`;
          el.style.textAlign = "right";
        }
      });
    }

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
      positionLabels();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let startTime: number | null = null;
    let rafId: number;
    let disposed = false;

    const tick = (now: number) => {
      if (disposed) return;
      rafId = requestAnimationFrame(tick);
      if (!startTime) startTime = now;
      const elapsed = (now - startTime) / 1000;

      material.opacity = Math.min(elapsed / 0.6, 0.45);
      material.needsUpdate = true;

      computeLines(elapsed);

      ANNS.forEach((ann, i) => {
        const el = textRefs.current?.[i];
        if (!el) return;
        const textStart = ann.d * STAGGER + LINE_DUR * 0.75;
        const textTVal = Math.max(0, Math.min((elapsed - textStart) / 0.45, 1));
        el.style.opacity = textTVal.toString();
      });

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [canvasRef, textRefs]);
}
