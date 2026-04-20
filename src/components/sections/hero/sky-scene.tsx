"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createStarGeometry } from "./sky-utils";

const STAR_COUNT = 2600;
const BRIGHT_STAR_COUNT = 22;

export function SkyScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;

    async function init() {
     
      const el = mount!;

 
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);


      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 300);
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);

      const sceneGroup = new THREE.Group();
      scene.add(sceneGroup);

  
      const loader = new THREE.TextureLoader();
      const [colorTex, normalTex] = await Promise.all([
        loader.loadAsync("/textures/moon-color.jpg"),
        loader.loadAsync("/textures/moon-normal.jpg"),
      ]);

      if (disposed) {
        colorTex.dispose();
        normalTex.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === el) {
          el.removeChild(renderer.domElement);
        }
        return;
      }

      colorTex.colorSpace = THREE.SRGBColorSpace;

      
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

 
      const sunLight = new THREE.DirectionalLight(0xfff4dc, 3.2);
      sunLight.position.set(-4, 7, 10);
      scene.add(sunLight);

      scene.add(new THREE.AmbientLight(0x080d20, 0.1));

    
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

   
      const syncTheme = () => {
        const dark = document.documentElement.classList.contains("dark");
        renderer.setClearColor(dark ? 0x0a0a0a : 0xfafafa, 1);
        starMat.color.set(dark ? 0xe8eeff : 0x1a1a2e);
        starMat.opacity = dark ? 0.82 : 0.22;
        starMat.needsUpdate = true;
        brightMat.color.set(dark ? 0xfff4e0 : 0x0a0a1a);
        brightMat.opacity = dark ? 0.92 : 0.18;
        brightMat.needsUpdate = true;
      };
      syncTheme();
      const themeObserver = new MutationObserver(syncTheme);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });


      const mouse = { x: 0, y: 0 };
      const onMouseMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove);

    
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

    
      let rafId: number;
      let t = 0;
      const moonBaseY = moon.position.y;

      const tick = () => {
        rafId = requestAnimationFrame(tick);
        t += 0.006;


        moon.position.y = moonBaseY + Math.sin(t * 0.28) * 0.055;
  
        moon.rotation.y += 0.0003;


        if (document.documentElement.classList.contains("dark")) {
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

     
      cleanupRef.current = () => {
        cancelAnimationFrame(rafId);
        resizeObserver.disconnect();
        themeObserver.disconnect();
        window.removeEventListener("mousemove", onMouseMove);
        colorTex.dispose();
        normalTex.dispose();
        moonGeo.dispose();
        moonMat.dispose();
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
