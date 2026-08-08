"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const STAR_COUNT = 2600;
const BRIGHT_STAR_COUNT = 22;

function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function createStarGeometry(
  count: number,
  seed: number,
  minRadius: number,
  maxRadius: number,
): THREE.BufferGeometry {
  const rand = seededRng(seed);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = minRadius + rand() * (maxRadius - minRadius);
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geo;
}

function createCoronaTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.18,
    size / 2,
    size / 2,
    size / 2,
  );
  grad.addColorStop(0, "rgba(255, 230, 120, 0.55)");
  grad.addColorStop(0.3, "rgba(255, 180, 60,  0.22)");
  grad.addColorStop(0.6, "rgba(255, 130, 30,  0.07)");
  grad.addColorStop(1, "rgba(255, 100,  0,  0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

export function SkyScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;

    async function init() {
      const el = mount!;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 300);
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);

      const sceneGroup = new THREE.Group();
      scene.add(sceneGroup);

      // ── Moon ─────────────────────────────────────────────────────────
      const loader = new THREE.TextureLoader();
      const [colorTex, normalTex, sunTex] = await Promise.all([
        loader.loadAsync("/textures/moon-color.jpg"),
        loader.loadAsync("/textures/moon-normal.jpg"),
        loader.loadAsync("/textures/sun-color.png"),
      ]);

      if (disposed) {
        colorTex.dispose();
        normalTex.dispose();
        sunTex.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === el) {
          el.removeChild(renderer.domElement);
        }
        return;
      }

      colorTex.colorSpace = THREE.SRGBColorSpace;
      sunTex.colorSpace = THREE.SRGBColorSpace;
      sunTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

      const moonGeo = new THREE.SphereGeometry(2.2, 128, 128);
      moonGeo.computeTangents();
      const moonMat = new THREE.MeshStandardMaterial({
        map: colorTex,
        normalMap: normalTex,
        normalScale: new THREE.Vector2(4.5, 4.5),
        roughness: 1.0,
        metalness: 0.0,
      });
      const moon = new THREE.Mesh(moonGeo, moonMat);
      moon.position.set(3.1, 1.5, -0.5);
      sceneGroup.add(moon);

      // ── Sun ──────────────────────────────────────────────────────────
      const sunGeo = new THREE.SphereGeometry(2.2, 128, 128);
      // Black diffuse so lighting adds nothing; emissive drives all colour at HDR intensity
      const sunMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissiveMap: sunTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 2.8,
        roughness: 1,
        metalness: 0,
      });
      const sun = new THREE.Mesh(sunGeo, sunMat);
      sun.position.copy(moon.position);
      sun.visible = false;
      sceneGroup.add(sun);

      const coronaTex = createCoronaTexture();
      const coronaSpriteMat = new THREE.SpriteMaterial({
        map: coronaTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const corona = new THREE.Sprite(coronaSpriteMat);
      corona.position.copy(moon.position);
      corona.scale.set(9, 9, 1);
      corona.visible = false;
      sceneGroup.add(corona);

      // ── Lighting ─────────────────────────────────────────────────────
      const sunLight = new THREE.DirectionalLight(0xfff4dc, 3.2);
      sunLight.position.set(-4, 7, 10);
      scene.add(sunLight);

      const ambientLight = new THREE.AmbientLight(0x080d20, 0.1);
      scene.add(ambientLight);

      // ── Stars ────────────────────────────────────────────────────────
      const starGeo = createStarGeometry(STAR_COUNT, 13, 38, 93);
      const starMat = new THREE.PointsMaterial({
        size: 0.13,
        transparent: true,
        opacity: 0.82,
        sizeAttenuation: true,
        color: 0xe8eeff,
      });
      const stars = new THREE.Points(starGeo, starMat);
      sceneGroup.add(stars);

      const brightGeo = createStarGeometry(BRIGHT_STAR_COUNT, 77, 42, 80);
      const brightMat = new THREE.PointsMaterial({
        size: 0.42,
        transparent: true,
        opacity: 0.92,
        sizeAttenuation: true,
        color: 0xfff4e0,
      });
      const brightStars = new THREE.Points(brightGeo, brightMat);
      sceneGroup.add(brightStars);

      // ── Theme sync ───────────────────────────────────────────────────
      const syncTheme = () => {
        const dark = document.documentElement.classList.contains("dark");

        renderer.setClearColor(dark ? 0x0a0a0a : 0xfafafa, 1);

        moon.visible = dark;
        sun.visible = !dark;
        corona.visible = !dark;

        starMat.color.set(dark ? 0xe8eeff : 0x1a1a2e);
        starMat.opacity = dark ? 0.82 : 0.22;
        starMat.needsUpdate = true;

        brightMat.color.set(dark ? 0xfff4e0 : 0x0a0a1a);
        brightMat.opacity = dark ? 0.92 : 0.18;
        brightMat.needsUpdate = true;

        ambientLight.color.set(dark ? 0x080d20 : 0xfff8e8);
        ambientLight.intensity = dark ? 0.1 : 0.6;

        sunLight.intensity = dark ? 3.2 : 1.8;
      };
      syncTheme();
      const themeObserver = new MutationObserver(syncTheme);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      // ── Mouse parallax ───────────────────────────────────────────────
      const mouse = { x: 0, y: 0 };
      const onMouseMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove);

      // ── Resize ───────────────────────────────────────────────────────
      const onResize = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(el);
      onResize();

      // ── Animation loop ───────────────────────────────────────────────
      let rafId: number;
      let t = 0;
      const moonBaseY = moon.position.y;

      const tick = () => {
        rafId = requestAnimationFrame(tick);
        t += 0.006;

        const dark = document.documentElement.classList.contains("dark");

        // Moon gentle bob + slow rotation
        moon.position.y = moonBaseY + Math.sin(t * 0.28) * 0.055;
        moon.rotation.y += 0.0003;

        sun.position.y = moonBaseY + Math.sin(t * 0.22) * 0.04;
        sun.rotation.y += 0.0002;
        corona.position.y = sun.position.y;

        if (!dark) {
          const pulse = 1 + Math.sin(t * 1.1) * 0.04;
          corona.scale.set(9 * pulse, 9 * pulse, 1);
        }

        if (dark) {
          brightMat.opacity = 0.88 + Math.sin(t * 1.7) * 0.1;
          brightMat.needsUpdate = true;
        }

        stars.rotation.y += 0.00009;
        stars.rotation.x += 0.000038;

        sceneGroup.rotation.x +=
          (-mouse.y * 0.048 - sceneGroup.rotation.x) * 0.028;
        sceneGroup.rotation.y +=
          (mouse.x * 0.048 - sceneGroup.rotation.y) * 0.028;

        renderer.render(scene, camera);
      };
      tick();

      // ── Cleanup ──────────────────────────────────────────────────────
      cleanupRef.current = () => {
        cancelAnimationFrame(rafId);
        resizeObserver.disconnect();
        themeObserver.disconnect();
        window.removeEventListener("mousemove", onMouseMove);
        colorTex.dispose();
        normalTex.dispose();
        moonGeo.dispose();
        moonMat.dispose();
        sunTex.dispose();
        sunGeo.dispose();
        sunMat.dispose();
        coronaTex.dispose();
        coronaSpriteMat.dispose();
        starGeo.dispose();
        starMat.dispose();
        brightGeo.dispose();
        brightMat.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === el) {
          el.removeChild(renderer.domElement);
        }
      };
    }

    init();

    return () => {
      disposed = true;
      cleanupRef.current?.();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
