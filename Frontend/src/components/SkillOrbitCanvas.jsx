import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {
  Sparkles,
  Zap,
  Orbit,
  Play,
  Pause,
  Sliders,
  ExternalLink,
  Flame,
  RotateCcw,
  Boxes,
  Type
} from 'lucide-react';
import { sound } from '../utils/audio';

// 8 Curated Skills grouped into 4 Domain Categories
const SKILLS = [
  {
    name: 'React 19',
    category: 'Frontend',
    speed: 0.0055,
    color: '#e89e4f',
    clusterId: 0,
    project: '[TODO: Project Name]'
  },
  {
    name: 'TypeScript',
    category: 'Frontend',
    speed: -0.0048,
    color: '#fbbf24',
    clusterId: 0,
    project: '[TODO: Project Name]'
  },
  {
    name: 'Three.js',
    category: '3D/Graphics',
    speed: 0.0042,
    color: '#38bdf8',
    clusterId: 1,
    project: '[TODO: Project Name]'
  },
  {
    name: 'WebGL 2.0',
    category: '3D/Graphics',
    speed: -0.0036,
    color: '#0ea5e9',
    clusterId: 1,
    project: '[TODO: Project Name]'
  },
  {
    name: 'GLSL Shaders',
    category: '3D/Graphics',
    speed: 0.005,
    color: '#22d3ee',
    clusterId: 1,
    project: '[TODO: Project Name]'
  },
  {
    name: 'AI Agents',
    category: 'AI',
    speed: -0.0032,
    color: '#10b981',
    clusterId: 2,
    project: '[TODO: Project Name]'
  },
  {
    name: 'Python 3',
    category: 'AI',
    speed: 0.0038,
    color: '#34d399',
    clusterId: 2,
    project: '[TODO: Project Name]'
  },
  {
    name: 'Node.js',
    category: 'Backend',
    speed: -0.0045,
    color: '#a855f7',
    clusterId: 3,
    project: '[TODO: Project Name]'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All', color: '#f59e0b' },
  { id: 'Frontend', label: 'Frontend', color: '#e89e4f' },
  { id: '3D/Graphics', label: '3D/Graphics', color: '#38bdf8' },
  { id: 'AI', label: 'AI', color: '#10b981' },
  { id: 'Backend', label: 'Backend', color: '#a855f7' }
];

// Offscreen font sampler to create high-density typography voxels
function sampleFontVoxels(text, containerWidth, containerHeight, isMobile) {
  const offscreen = document.createElement('canvas');
  offscreen.width = containerWidth;
  offscreen.height = containerHeight;
  const ctx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return {
      voxels: [],
      bounds: { halfWidth: 100, halfHeight: 50, centerX: containerWidth / 2, centerY: containerHeight / 2 }
    };
  }

  // Calculate bold font size based on text length and screen width
  let fontSize;
  if (text === '{ A }') {
    fontSize = Math.min(160, Math.floor(containerWidth * 0.22));
  } else if (text === 'A') {
    fontSize = Math.min(210, Math.floor(containerWidth * 0.28));
  } else {
    // 'ANURAG'
    fontSize = Math.min(132, Math.floor(containerWidth / 6.4));
  }
  if (isMobile) {
    fontSize = Math.max(38, Math.floor(fontSize * 0.72));
  }

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${fontSize}px "Syne", "Plus Jakarta Sans", "Montserrat", "Arial Black", sans-serif`;

  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  ctx.fillText(text, centerX, centerY);

  // High density step: 6px on desktop, 8px on mobile for performance
  const step = isMobile ? 8 : (containerWidth < 900 ? 7 : 6);
  const voxelSize = Math.max(3.2, step * 0.82);

  const imgData = ctx.getImageData(0, 0, containerWidth, containerHeight).data;

  let minX = containerWidth;
  let maxX = 0;
  let minY = containerHeight;
  let maxY = 0;
  const points = [];

  for (let y = 0; y < containerHeight; y += step) {
    for (let x = 0; x < containerWidth; x += step) {
      const idx = (y * containerWidth + x) * 4;
      if (imgData[idx + 3] > 110) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        points.push({ x, y });
      }
    }
  }

  if (points.length === 0) {
    minX = centerX - 100;
    maxX = centerX + 100;
    minY = centerY - 50;
    maxY = centerY + 50;
  }

  const bounds = {
    minX,
    maxX,
    minY,
    maxY,
    halfWidth: Math.max(40, (maxX - minX) / 2),
    halfHeight: Math.max(25, (maxY - minY) / 2),
    centerX,
    centerY
  };

  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);

  const voxels = points.map((pt, i) => {
    const relX = pt.x - centerX;
    const relY = pt.y - centerY;

    // Diagonal progression across the word for seamless cream-to-amber gradient
    const ratioX = (pt.x - minX) / spanX;
    const ratioY = (pt.y - minY) / spanY;
    const diagRatio = Math.min(1, Math.max(0, ratioX * 0.65 + ratioY * 0.35));

    // Slight height variation (tactile 3D sculptural surface)
    const baseZ = Math.sin(pt.x * 0.08) * Math.cos(pt.y * 0.08) * 3.8;

    // Map 4 logical clusters across the word
    let cluster = 0;
    if (ratioX > 0.72) cluster = 3;      // Backend
    else if (ratioX > 0.48) cluster = 2; // AI
    else if (ratioX > 0.24) cluster = 1; // 3D/Graphics
    else cluster = 0;                    // Frontend

    return {
      id: i,
      x: pt.x,
      y: pt.y,
      originX: relX,
      originY: -relY, // In Three.js, Y is positive upwards
      originZ: baseZ,
      diagRatio,
      cluster,
      size: voxelSize
    };
  });

  return { voxels, bounds, voxelSize };
}

export default function SkillOrbitCanvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Mode and Filtering state
  const [activeMode, setActiveMode] = useState('{ A }'); // '{ A }' | 'A' | 'ANURAG'
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showPhysics, setShowPhysics] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Physics settings
  const [gravity, setGravity] = useState(0.0);
  const [elasticity, setElasticity] = useState(0.08);

  // Live HUD telemetry
  const [voxelCount, setVoxelCount] = useState(0);
  const [fps, setFps] = useState(60);

  // Orbit node positions for SVG lines & HTML pills
  const [orbitNodes, setOrbitNodes] = useState([]);

  // Three.js internal references
  const threeRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    instancedMesh: null,
    pointLight: null,
    pointsMesh: null,
    isIntersecting: true
  });

  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    x3d: -1000,
    y3d: -1000,
    isHovering: false,
    isDown: false
  });

  const voxelsRef = useRef([]);
  const letterBoundsRef = useRef({ halfWidth: 100, halfHeight: 50, centerX: 450, centerY: 240 });
  const ripplesRef = useRef([]);
  const nodesRef = useRef([]);
  const dimsRef = useRef({ w: 900, h: 480 });
  const animFrameRef = useRef(null);
  const autoPlayTimerRef = useRef(null);

  // Mark first user interaction to fade the hint pill
  const handleFirstInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  }, [hasInteracted]);

  // Initial nodes configuration
  useEffect(() => {
    nodesRef.current = SKILLS.map((s, idx) => ({
      ...s,
      angle: (idx * (Math.PI * 2)) / SKILLS.length,
      x: 0,
      y: 0,
      anchorX: 0,
      anchorY: 0
    }));
  }, []);

  // Mode switcher with smooth morph
  const handleSelectMode = useCallback((mode) => {
    handleFirstInteraction();
    sound.playModeSwitch();
    setActiveMode(mode);
  }, [handleFirstInteraction]);

  // Auto-Play shape loop
  useEffect(() => {
    if (!isAutoPlay) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setActiveMode((prev) => {
        if (prev === '{ A }') return 'A';
        if (prev === 'A') return 'ANURAG';
        return '{ A }';
      });
      sound.playModeSwitch();
    }, 6500);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlay]);

  // Trigger Shockwave impulse effect
  const handleTriggerShockwave = useCallback(() => {
    handleFirstInteraction();
    sound.playClick();
    const w = dimsRef.current.w;
    ripplesRef.current.push({
      x: 0,
      y: 0,
      r: 0,
      maxR: Math.max(w * 0.6, 420),
      speed: 13,
      power: 1.25
    });
  }, [handleFirstInteraction]);

  // Trigger Vortex effect
  const handleTriggerVortex = useCallback(() => {
    handleFirstInteraction();
    sound.playModeSwitch();
    const list = voxelsRef.current;
    list.forEach((v) => {
      const ang = Math.atan2(v.y, v.x);
      const dist = Math.hypot(v.x, v.y);
      const swirlSpeed = 22 / (1 + dist * 0.007);
      v.vx += -Math.sin(ang) * swirlSpeed;
      v.vy += Math.cos(ang) * swirlSpeed;
      v.vz += (Math.random() - 0.5) * 16;
      v.glow = 0.9;
    });
  }, [handleFirstInteraction]);

  // Trigger Explode effect
  const handleTriggerExplode = useCallback(() => {
    handleFirstInteraction();
    sound.playClick();
    const list = voxelsRef.current;
    list.forEach((v) => {
      const ang = Math.random() * Math.PI * 2;
      const speed = 16 + Math.random() * 22;
      v.vx += Math.cos(ang) * speed;
      v.vy += Math.sin(ang) * speed;
      v.vz += (Math.random() - 0.5) * 45;
      v.glow = 1.0;
    });
  }, [handleFirstInteraction]);

  // Handle skill hover/focus
  const handleSkillHover = useCallback((skill) => {
    handleFirstInteraction();
    if (skill) {
      sound.playHover();
      setHoveredSkill(skill);
    } else {
      setHoveredSkill(null);
    }
  }, [handleFirstInteraction]);

  // Handle skill click (scroll to works card)
  const handleSkillClick = useCallback((skill) => {
    handleFirstInteraction();
    sound.playClick();
    const worksEl = document.getElementById('works');
    if (worksEl) {
      worksEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, [handleFirstInteraction]);

  // Initialize Three.js WebGL Scene & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = containerRef.current;
    let width = container ? container.clientWidth : 900;
    let height = width < 480 ? 380 : width < 768 ? 440 : 480;
    dimsRef.current = { w: width, h: height };

    const isMobile = width < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    threeRef.current.scene = scene;

    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      0.1,
      1000
    );
    camera.position.set(0, 0, 400);
    camera.lookAt(0, 0, 0);
    threeRef.current.camera = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height, false);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    threeRef.current.renderer = renderer;

    // 2. Lighting Setup (Soft cream directional + cool highlight point light)
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffedd5, 1.45);
    dirLight.position.set(-90, 180, 220);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 0.45);
    rimLight.position.set(100, -100, -100);
    scene.add(rimLight);

    // Cursor-reactive point light
    const pointLight = new THREE.PointLight(0x38bdf8, 3.2, 380);
    pointLight.position.set(-1000, -1000, 60);
    scene.add(pointLight);
    threeRef.current.pointLight = pointLight;

    // 3. Faint drifting particles background
    const particleCount = isMobile ? 40 : 85;
    const particleGeom = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleVel = [];

    for (let p = 0; p < particleCount; p++) {
      particlePos[p * 3] = (Math.random() - 0.5) * width;
      particlePos[p * 3 + 1] = (Math.random() - 0.5) * height;
      particlePos[p * 3 + 2] = (Math.random() - 0.5) * 120;
      particleVel.push({
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.2
      });
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 2.5,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending
    });
    const pointsMesh = new THREE.Points(particleGeom, particleMat);
    scene.add(pointsMesh);
    threeRef.current.pointsMesh = pointsMesh;

    // 4. InstancedMesh setup for Rounded Cube Voxels
    const MAX_INSTANCES = 2600;
    const sampleInit = sampleFontVoxels(activeMode, width, height, isMobile);
    const voxelSize = sampleInit.voxelSize;

    // Use RoundedBoxGeometry for tactile micro-cubes
    const boxGeom = new RoundedBoxGeometry(voxelSize, voxelSize, voxelSize * 1.15, 1, 0.75);
    const boxMat = new THREE.MeshStandardMaterial({
      roughness: 0.35,
      metalness: 0.12
    });

    const instancedMesh = new THREE.InstancedMesh(boxGeom, boxMat, MAX_INSTANCES);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedMesh);
    threeRef.current.instancedMesh = instancedMesh;

    // Initialize voxel list
    letterBoundsRef.current = sampleInit.bounds;
    const initialPoints = sampleInit.voxels;
    voxelsRef.current = initialPoints.map((pt) => ({
      ...pt,
      x: pt.originX + (Math.random() - 0.5) * 8,
      y: pt.originY + (Math.random() - 0.5) * 8,
      z: pt.originZ,
      vx: 0,
      vy: 0,
      vz: 0,
      glow: 0
    }));

    instancedMesh.count = voxelsRef.current.length;
    setVoxelCount(voxelsRef.current.length);

    // Color definitions for palette
    const creamColor = new THREE.Color(0xfcf8f2);
    const amberColor = new THREE.Color(0xf59e0b);
    const coolHighlightColor = new THREE.Color(0x38bdf8);
    const tmpColor = new THREE.Color();
    const dummy = new THREE.Object3D();

    // IntersectionObserver to pause rendering offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        threeRef.current.isIntersecting = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    if (container) observer.observe(container);

    // Resize Handler
    const handleResize = () => {
      if (!container || !canvas) return;
      const nw = container.clientWidth;
      const nh = nw < 480 ? 380 : nw < 768 ? 440 : 480;
      dimsRef.current = { w: nw, h: nh };

      camera.left = -nw / 2;
      camera.right = nw / 2;
      camera.top = nh / 2;
      camera.bottom = -nh / 2;
      camera.updateProjectionMatrix();

      renderer.setSize(nw, nh, false);

      // Re-sample font positions on resize
      const resampled = sampleFontVoxels(activeMode, nw, nh, nw < 768);
      letterBoundsRef.current = resampled.bounds;
      const targetPts = resampled.voxels;

      // Update existing voxels or resize
      const currentList = voxelsRef.current;
      const updatedList = targetPts.map((tp, idx) => {
        if (currentList[idx]) {
          const v = currentList[idx];
          v.originX = tp.originX;
          v.originY = tp.originY;
          v.originZ = tp.originZ;
          v.diagRatio = tp.diagRatio;
          v.cluster = tp.cluster;
          v.size = tp.size;
          return v;
        }
        return {
          ...tp,
          x: tp.originX,
          y: tp.originY,
          z: tp.originZ,
          vx: 0,
          vy: 0,
          vz: 0,
          glow: 0
        };
      });

      voxelsRef.current = updatedList;
      instancedMesh.count = updatedList.length;
      setVoxelCount(updatedList.length);
    };

    window.addEventListener('resize', handleResize);

    // Mouse & Touch interaction handlers
    const handleMouseMove = (e) => {
      handleFirstInteraction();
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      mouseRef.current.x = mx;
      mouseRef.current.y = my;
      mouseRef.current.x3d = mx - dimsRef.current.w / 2;
      mouseRef.current.y3d = -(my - dimsRef.current.h / 2);
      mouseRef.current.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      mouseRef.current.x3d = -1000;
      mouseRef.current.y3d = -1000;
    };

    const handleMouseDown = () => {
      handleFirstInteraction();
      mouseRef.current.isDown = true;
      const mx = mouseRef.current.x3d;
      const my = mouseRef.current.y3d;

      // Trigger impulse shockwave at click point
      ripplesRef.current.push({
        x: mx,
        y: my,
        r: 0,
        maxR: Math.max(dimsRef.current.w * 0.55, 360),
        speed: 12,
        power: 1.15
      });
      sound.playClick();
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    // Mobile touch handling (tap replaces hover)
    const handleTouchStart = (e) => {
      handleFirstInteraction();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const mx = touch.clientX - rect.left;
        const my = touch.clientY - rect.top;
        mouseRef.current.x = mx;
        mouseRef.current.y = my;
        mouseRef.current.x3d = mx - dimsRef.current.w / 2;
        mouseRef.current.y3d = -(my - dimsRef.current.h / 2);
        mouseRef.current.isHovering = true;
        mouseRef.current.isDown = true;

        ripplesRef.current.push({
          x: mouseRef.current.x3d,
          y: mouseRef.current.y3d,
          r: 0,
          maxR: 280,
          speed: 10,
          power: 1.0
        });
        sound.playClick();
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.isDown = false;
      mouseRef.current.isHovering = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    // FPS Telemetry Tracking
    let frameCount = 0;
    let lastFpsTime = performance.now();
    const clock = new THREE.Clock();

    // MAIN 60FPS THREE.JS ANIMATION & PHYSICS LOOP
    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);

      if (!threeRef.current.isIntersecting) {
        return; // Pause rendering offscreen
      }

      const elapsed = clock.getElapsedTime();
      const currentDims = dimsRef.current;
      const centerX = currentDims.w / 2;
      const centerY = currentDims.h / 2;

      // Track FPS
      frameCount++;
      const now = performance.now();
      if (now - lastFpsTime >= 500) {
        setFps(Math.round((frameCount * 1000) / (now - lastFpsTime)));
        frameCount = 0;
        lastFpsTime = now;
      }

      // 1. Drifting ambient particles
      if (!prefersReducedMotion) {
        const pPositions = particleGeom.attributes.position.array;
        for (let p = 0; p < particleCount; p++) {
          pPositions[p * 3] += particleVel[p].vx;
          pPositions[p * 3 + 1] += particleVel[p].vy;
          pPositions[p * 3 + 2] += particleVel[p].vz;

          if (Math.abs(pPositions[p * 3]) > currentDims.w / 2) particleVel[p].vx *= -1;
          if (Math.abs(pPositions[p * 3 + 1]) > currentDims.h / 2) particleVel[p].vy *= -1;
          if (Math.abs(pPositions[p * 3 + 2]) > 70) particleVel[p].vz *= -1;
        }
        particleGeom.attributes.position.needsUpdate = true;
      }

      // 2. Cursor light position
      if (mouseRef.current.isHovering) {
        pointLight.position.set(mouseRef.current.x3d, mouseRef.current.y3d, 65);
        pointLight.intensity = mouseRef.current.isDown ? 4.5 : 3.0;
      } else {
        pointLight.position.set(-1000, -1000, 65);
      }

      // 3. Update Active Shockwave Ripples
      const ripples = ripplesRef.current;
      for (let rIdx = ripples.length - 1; rIdx >= 0; rIdx--) {
        const rip = ripples[rIdx];
        rip.r += rip.speed;
        const progress = rip.r / rip.maxR;
        rip.power = Math.max(0, 1 - progress);
        if (rip.r >= rip.maxR) {
          ripples.splice(rIdx, 1);
        }
      }

      // 4. Update Orbit Nodes Positions with Elliptical Outer Ring & Collision Avoidance
      const bounds = letterBoundsRef.current;
      const orbitScale = Math.min(currentDims.w / 980, 1.05);

      // Sized outside the letter envelope to guarantee pills NEVER cover the voxels
      const Rx = Math.max(bounds.halfWidth + 72 * orbitScale, 155);
      const Ry = Math.max(bounds.halfHeight + 46 * orbitScale, 110);

      const nodes = nodesRef.current;

      // Base orbital motion
      nodes.forEach((node) => {
        const isHovered = hoveredSkill?.name === node.name;
        const speed = isHovered ? node.speed * 0.25 : node.speed;
        node.angle = (node.angle + speed + Math.PI * 2) % (Math.PI * 2);
      });

      // Inter-pill collision avoidance relaxation passes
      for (let iter = 0; iter < 4; iter++) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const n1 = nodes[i];
            const n2 = nodes[j];

            const x1 = centerX + Math.cos(n1.angle) * Rx;
            const y1 = centerY + Math.sin(n1.angle) * Ry;
            const x2 = centerX + Math.cos(n2.angle) * Rx;
            const y2 = centerY + Math.sin(n2.angle) * Ry;

            const dist = Math.hypot(x1 - x2, y1 - y2);
            const minAllowedDist = 92;

            if (dist < minAllowedDist && dist > 0.001) {
              let diff = n1.angle - n2.angle;
              while (diff < -Math.PI) diff += Math.PI * 2;
              while (diff > Math.PI) diff -= Math.PI * 2;

              const push = (minAllowedDist - dist) * 0.0014;
              if (diff >= 0) {
                n1.angle += push;
                n2.angle -= push;
              } else {
                n1.angle -= push;
                n2.angle += push;
              }
            }
          }
        }
      }

      // Final position calculation & strict voxel envelope avoidance
      const updatedNodes = nodes.map((node) => {
        let px = centerX + Math.cos(node.angle) * Rx;
        let py = centerY + Math.sin(node.angle) * Ry;

        // Hard forbidden boundary around letters
        const safeMarginW = bounds.halfWidth + 56;
        const safeMarginH = bounds.halfHeight + 24;

        const dx = px - centerX;
        const dy = py - centerY;

        if (Math.abs(dx) < safeMarginW && Math.abs(dy) < safeMarginH) {
          const signY = dy >= 0 ? 1 : -1;
          py = centerY + signY * (safeMarginH + 4);
        }

        // Anchor on letter: find nearest voxel edge for dashed connector line
        const anchorX = centerX + Math.sign(dx) * Math.min(Math.abs(dx), bounds.halfWidth);
        const anchorY = centerY + Math.sign(dy) * Math.min(Math.abs(dy), bounds.halfHeight);

        return {
          ...node,
          x: px,
          y: py,
          anchorX,
          anchorY
        };
      });

      setOrbitNodes(updatedNodes);

      // 5. Physics and Rendering for Voxel Typography
      const voxels = voxelsRef.current;
      const vLen = voxels.length;
      const mouse = mouseRef.current;
      const mouseRadius = mouse.isDown ? 140 : 100;

      for (let i = 0; i < vLen; i++) {
        const v = voxels[i];

        // Idle breathing wave
        const waveZ = prefersReducedMotion
          ? 0
          : Math.sin(elapsed * 1.8 + v.originX * 0.02 + v.originY * 0.025) * 3.4;
        const waveY = prefersReducedMotion
          ? 0
          : Math.cos(elapsed * 1.4 + v.originX * 0.018) * 1.2;

        const targetX = v.originX;
        const targetY = v.originY + waveY;
        const targetZ = v.originZ + waveZ;

        // Mouse repulsion in 3D
        if (mouse.isHovering) {
          const mdx = v.x - mouse.x3d;
          const mdy = v.y - mouse.y3d;
          const mDist = Math.hypot(mdx, mdy);

          if (mDist < mouseRadius && mDist > 0.01) {
            const force = (1 - mDist / mouseRadius) * (mouse.isDown ? 18 : 9.5);
            const ang = Math.atan2(mdy, mdx);
            v.vx += Math.cos(ang) * force;
            v.vy += Math.sin(ang) * force;
            v.vz += force * 0.7;
            v.glow = Math.max(v.glow, (1 - mDist / mouseRadius) * 1.6);
          }
        }

        // Shockwave ripples interaction
        for (let r = 0; r < ripples.length; r++) {
          const rip = ripples[r];
          const rdx = v.x - rip.x;
          const rdy = v.y - rip.y;
          const rDist = Math.hypot(rdx, rdy);
          const diff = Math.abs(rDist - rip.r);

          if (diff < 28) {
            const impulse = (1 - diff / 28) * rip.power * 13;
            const ang = Math.atan2(rdy, rdx);
            v.vx += Math.cos(ang) * impulse;
            v.vy += Math.sin(ang) * impulse;
            v.vz += impulse * 0.95;
            v.glow = 1.0;
          }
        }

        // Spring physics pulling back to origin with elasticity & gravity sliders
        v.vx += (targetX - v.x) * elasticity;
        v.vy += (targetY - v.y) * elasticity - gravity * 0.45;
        v.vz += (targetZ - v.z) * elasticity;

        v.vx *= 0.84;
        v.vy *= 0.84;
        v.vz *= 0.84;

        v.x += v.vx;
        v.y += v.vy;
        v.z += v.vz;

        v.glow *= 0.91;

        // Update Three.js instance matrix
        dummy.position.set(v.x, v.y, v.z);
        dummy.rotation.set(v.vy * 0.03, -v.vx * 0.03, 0);
        dummy.scale.set(v.size, v.size, v.size);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);

        // Voxel Color: Cream-to-Amber site gradient with cool accent highlights
        tmpColor.copy(creamColor).lerp(amberColor, v.diagRatio);

        // Hovered Skill Cluster Dimming / Highlighting
        if (hoveredSkill) {
          if (v.cluster === hoveredSkill.clusterId) {
            // Highlighted cluster: blend with cool highlight
            tmpColor.copy(coolHighlightColor).lerp(tmpColor, 0.25);
          } else {
            // Dimmed other voxels
            tmpColor.multiplyScalar(0.24);
          }
        } else if (activeCategory !== 'all') {
          // Legend filter highlight
          const targetCluster =
            activeCategory === 'Frontend' ? 0 :
            activeCategory === '3D/Graphics' ? 1 :
            activeCategory === 'AI' ? 2 : 3;

          if (v.cluster === targetCluster) {
            tmpColor.copy(coolHighlightColor).lerp(tmpColor, 0.4);
          } else {
            tmpColor.multiplyScalar(0.32);
          }
        }

        // Proximity / Shockwave cool glow boost
        if (v.glow > 0.05) {
          tmpColor.lerp(coolHighlightColor, Math.min(1, v.glow * 0.75));
        }

        instancedMesh.setColorAt(i, tmpColor);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

      // Render the scene
      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      if (container) observer.unobserve(container);
      renderer.dispose();
      boxGeom.dispose();
      boxMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
    };
  }, [activeMode, activeCategory, hoveredSkill, elasticity, gravity, handleFirstInteraction]);

  // Smooth Morphing when activeMode changes
  useEffect(() => {
    const mesh = threeRef.current.instancedMesh;
    if (!mesh) return;

    const currentDims = dimsRef.current;
    const isMobile = currentDims.w < 768;
    const sample = sampleFontVoxels(activeMode, currentDims.w, currentDims.h, isMobile);
    letterBoundsRef.current = sample.bounds;
    const targetPoints = sample.voxels;

    const currentVoxels = voxelsRef.current;
    const newVoxels = [];

    for (let i = 0; i < targetPoints.length; i++) {
      const tp = targetPoints[i];
      if (currentVoxels[i]) {
        const cv = currentVoxels[i];
        cv.originX = tp.originX;
        cv.originY = tp.originY;
        cv.originZ = tp.originZ;
        cv.diagRatio = tp.diagRatio;
        cv.cluster = tp.cluster;
        cv.size = tp.size;
        // Impart physical morphing impulse
        cv.vx += (Math.random() - 0.5) * 6;
        cv.vy += (Math.random() - 0.5) * 6;
        cv.vz += (Math.random() - 0.5) * 12;
        cv.glow = 0.8;
        newVoxels.push(cv);
      } else {
        // New voxel emerging from nearby center
        newVoxels.push({
          ...tp,
          x: tp.originX + (Math.random() - 0.5) * 30,
          y: tp.originY + (Math.random() - 0.5) * 30,
          z: tp.originZ + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          vz: (Math.random() - 0.5) * 14,
          glow: 0.9
        });
      }
    }

    voxelsRef.current = newVoxels;
    mesh.count = newVoxels.length;
    setVoxelCount(newVoxels.length);
  }, [activeMode]);

  return (
    <div ref={containerRef} className="skill-orbit-section">
      {/* Decorative ambient flare */}
      <div className="skill-orbit-ambient-flare" />

      {/* Header bar */}
      <div className="skill-orbit-header">
        <div className="skill-orbit-title-block">
          <div className="skill-orbit-eyebrow">
            <span className="skill-orbit-eyebrow-dot" />
            <span>// CYBER VOXEL MATRIX • QUANTUM ORBIT</span>
          </div>

          <h3 className="skill-orbit-title">
            Interactive Skill Physics & Digital Monogram
          </h3>

          <div className="skill-orbit-desc-row">
            <span>
              Real-time WebGL voxel simulation with dynamic spring physics and orbital skill topology.
            </span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleFirstInteraction();
              }}
              className="skill-orbit-source-link"
              title="View source code repository"
            >
              <span>View source [TODO: URL]</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Unified Controls Toolbar */}
        <div className="skill-orbit-controls">
          <div className="skill-orbit-toolbar" role="toolbar" aria-label="Simulation Controls">
            {/* Shape Selectors */}
            {[
              { id: '{ A }', label: '{ A } Monogram', icon: <Boxes size={13} /> },
              { id: 'A', label: 'A Solo', icon: <Type size={13} /> },
              { id: 'ANURAG', label: 'ANURAG', icon: <Sparkles size={13} /> }
            ].map((shape) => {
              const active = activeMode === shape.id;
              return (
                <button
                  key={shape.id}
                  onClick={() => handleSelectMode(shape.id)}
                  className={`skill-toolbar-btn ${active ? 'active' : ''}`}
                  aria-pressed={active}
                >
                  {shape.icon}
                  <span>{shape.label}</span>
                </button>
              );
            })}

            <div className="skill-toolbar-divider" />

            {/* Effect Triggers */}
            <button
              onClick={handleTriggerShockwave}
              className="skill-toolbar-btn"
              title="Trigger Shockwave Ripple"
            >
              <Zap size={13} />
              <span>Shockwave</span>
            </button>

            <button
              onClick={handleTriggerVortex}
              className="skill-toolbar-btn"
              title="Trigger Gravitational Vortex"
            >
              <Orbit size={13} />
              <span>Vortex</span>
            </button>

            <button
              onClick={handleTriggerExplode}
              className="skill-toolbar-btn"
              title="Trigger Elastic 3D Dispersal"
            >
              <Flame size={13} />
              <span>Explode</span>
            </button>

            <div className="skill-toolbar-divider" />

            {/* Auto-Play Toggle */}
            <button
              onClick={() => {
                handleFirstInteraction();
                sound.playClick();
                setIsAutoPlay((prev) => !prev);
              }}
              className={`skill-toolbar-btn ${isAutoPlay ? 'active' : ''}`}
              title="Toggle Auto-Play shape morph loop"
              aria-pressed={isAutoPlay}
            >
              {isAutoPlay ? <Pause size={13} /> : <Play size={13} />}
              <span>Auto</span>
            </button>

            {/* Physics Slider Drawer Toggle */}
            <button
              onClick={() => {
                handleFirstInteraction();
                sound.playClick();
                setShowPhysics((prev) => !prev);
              }}
              className={`skill-toolbar-btn ${showPhysics ? 'active' : ''}`}
              title="Toggle physics parameter sliders"
              aria-expanded={showPhysics}
            >
              <Sliders size={13} />
              <span>Physics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Physics Control Drawer */}
      {showPhysics && (
        <div className="skill-physics-drawer">
          <div className="physics-control-item">
            <label htmlFor="gravity-slider">
              <span>Gravity:</span>
              <strong>{gravity.toFixed(2)}</strong>
            </label>
            <input
              id="gravity-slider"
              type="range"
              min="0.0"
              max="1.5"
              step="0.05"
              value={gravity}
              onChange={(e) => setGravity(parseFloat(e.target.value))}
              className="physics-slider"
            />
          </div>

          <div className="physics-control-item">
            <label htmlFor="elasticity-slider">
              <span>Elasticity:</span>
              <strong>{elasticity.toFixed(2)}</strong>
            </label>
            <input
              id="elasticity-slider"
              type="range"
              min="0.02"
              max="0.20"
              step="0.01"
              value={elasticity}
              onChange={(e) => setElasticity(parseFloat(e.target.value))}
              className="physics-slider"
            />
          </div>

          <button
            onClick={() => {
              setGravity(0.0);
              setElasticity(0.08);
              sound.playClick();
            }}
            className="physics-reset-btn"
          >
            Reset Defaults
          </button>
        </div>
      )}

      {/* Sub-bar: Color-coded Skill Category Legend Filters */}
      <div className="skill-orbit-subbar">
        <div className="skill-legend-group">
          <span className="skill-legend-label">Filter:</span>
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  handleFirstInteraction();
                  sound.playClick();
                  setActiveCategory(cat.id);
                }}
                className={`skill-legend-pill ${active ? 'active' : ''}`}
                style={{ '--pill-color': cat.color }}
                aria-pressed={active}
              >
                {cat.id !== 'all' && (
                  <span className="legend-color-dot" style={{ background: cat.color }} />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D WebGL Canvas Wrapper */}
      <div className="skill-orbit-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="skill-orbit-canvas"
          role="img"
          aria-label="Interactive 3D typography of ANURAG rendered with dynamic physics voxels surrounded by orbital skills"
        />

        {/* Accessible screen-reader alternative */}
        <div className="sr-only">
          Interactive skill constellation showcasing core engineering competencies: React 19, TypeScript,
          Three.js, WebGL 2.0, GLSL Shaders, AI Agents, Python 3, and Node.js. Use keyboard to tab through skill pills.
        </div>

        {/* Subtle Vignette Overlay */}
        <div className="skill-vignette-overlay" />

        {/* Thin Animated Dashed Connector Lines SVG Layer */}
        <svg
          className="skill-orbit-svg-layer"
          viewBox={`0 0 ${dimsRef.current.w} ${dimsRef.current.h}`}
        >
          {orbitNodes.map((node) => {
            const isHovered = hoveredSkill?.name === node.name;
            const isFiltered = activeCategory !== 'all' && node.category !== activeCategory;
            if (isFiltered) return null;

            return (
              <g key={node.name}>
                <line
                  x1={node.x}
                  y1={node.y}
                  x2={node.anchorX}
                  y2={node.anchorY}
                  stroke={isHovered ? node.color : 'rgba(245, 158, 11, 0.22)'}
                  strokeWidth={isHovered ? 1.6 : 0.9}
                  className="orbit-dashed-line"
                />
                <circle
                  cx={node.anchorX}
                  cy={node.anchorY}
                  r={isHovered ? 3.8 : 2.2}
                  fill={isHovered ? node.color : '#f59e0b'}
                  className="orbit-anchor-dot"
                />
              </g>
            );
          })}
        </svg>

        {/* HTML Skill Pills Layer (Keyboard focusable with ARIA & Collision-free Orbit) */}
        <div className="skill-orbit-pills-layer">
          {orbitNodes.map((node) => {
            const isHovered = hoveredSkill?.name === node.name;
            const isFiltered = activeCategory !== 'all' && node.category !== activeCategory;

            return (
              <div
                key={node.name}
                className={`skill-pill-node ${isFiltered ? 'dimmed' : ''}`}
                style={{
                  transform: `translate(${node.x}px, ${node.y}px) translate(-50%, -50%)`
                }}
              >
                <button
                  className={`skill-pill-btn ${isHovered ? 'focused' : ''}`}
                  style={{
                    '--skill-color': node.color,
                    '--skill-glow': `${node.color}55`
                  }}
                  tabIndex={0}
                  aria-label={`Skill: ${node.name}. Category: ${node.category}. Used in projects. Press Enter to view.`}
                  onMouseEnter={() => handleSkillHover(node)}
                  onMouseLeave={() => handleSkillHover(null)}
                  onFocus={() => handleSkillHover(node)}
                  onBlur={() => handleSkillHover(null)}
                  onClick={() => handleSkillClick(node)}
                >
                  <span className="skill-pill-dot" style={{ background: node.color }} />
                  <span>{node.name}</span>
                </button>

                {/* Skill Tooltip linking to Work Card */}
                {isHovered && (
                  <div
                    className="skill-orbit-tooltip"
                    role="tooltip"
                    style={{ '--skill-color': node.color }}
                  >
                    <span className="skill-tooltip-tag">{node.category}</span>
                    <span>
                      Used in:{' '}
                      <a
                        href="#works"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSkillClick(node);
                        }}
                        className="skill-tooltip-link"
                      >
                        {node.project} ↗
                      </a>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Monospace Telemetry HUD in Bottom Corner */}
        <div className="skill-orbit-hud">
          <span className="skill-hud-indicator" />
          <span>VOXELS: {voxelCount.toLocaleString()}</span>
          <span className="skill-hud-sep">|</span>
          <span>FPS: {fps}</span>
        </div>
      </div>

      {/* High-Contrast Interaction Hint Pill Under Canvas */}
      <div className="skill-hint-pill-wrap">
        <div
          className={`skill-hint-pill ${hasInteracted ? 'hint-hidden' : ''}`}
          aria-hidden="true"
        >
          <Sparkles size={13} style={{ color: '#f59e0b' }} />
          <span>
            Drag cursor to disperse voxels • Click for shockwave • Hover skill pills to inspect projects
          </span>
        </div>
      </div>
    </div>
  );
}
