import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import bustTextureUrl from '../assets/anurag_3d_bust_transparent.png';
import depthTextureUrl from '../assets/anurag_depth.png';

export default function Hero3DCanvas({ scrollProgress = 0, onModeChange }) {
  const containerRef = useRef(null);
  const [activeMode, setActiveMode] = useState('sculpture'); // 'sculpture' | 'particles' | 'scan'
  const [isLoaded, setIsLoaded] = useState(false);
  const [flareActive, setFlareActive] = useState(true);

  // Store refs to animate
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const bustMeshRef = useRef(null);
  const pointsMeshRef = useRef(null);
  const uniformsRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const animFrameRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Load Textures
    const textureLoader = new THREE.TextureLoader();
    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount >= 2) setIsLoaded(true);
    };

    const colorTexture = textureLoader.load(bustTextureUrl, checkLoaded);
    colorTexture.generateMipmaps = true;
    colorTexture.minFilter = THREE.LinearMipmapLinearFilter;

    const depthTexture = textureLoader.load(depthTextureUrl, checkLoaded);
    depthTexture.minFilter = THREE.LinearFilter;

    // 3. Shaders & Uniforms
    const uniforms = {
      uColorTexture: { value: colorTexture },
      uDepthTexture: { value: depthTexture },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uDisplacement: { value: 0.65 },
      uTime: { value: 0 },
      uScanPos: { value: 0.4 },
      uScanActive: { value: flareActive ? 1.0 : 0.0 },
      uMode: { value: 0.0 }, // 0: sculpture, 1: scan lines
      uDispersion: { value: 0.0 },
      uLightIntensity: { value: 1.0 }
    };
    uniformsRef.current = uniforms;

    // Vertex Shader for 3D Bust Mesh
    const vertexShader = `
      uniform sampler2D uDepthTexture;
      uniform vec2 uMouse;
      uniform float uDisplacement;
      uniform float uTime;
      uniform float uDispersion;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDepth;

      void main() {
        vUv = uv;
        vec4 depthData = texture2D(uDepthTexture, uv);
        float d = depthData.r;
        vDepth = d;

        // Base 3D Position with relief displacement
        vec3 pos = position;
        pos.z += d * uDisplacement;

        // Dispersion lift-off when scrolling / mode switch
        if (uDispersion > 0.001) {
          float wave = sin(uv.y * 12.0 + uTime * 2.0) * 0.1;
          pos.z += uDispersion * (1.2 + wave);
          pos.y += uDispersion * (0.8 + d * 0.5);
          pos.x += sin(uv.y * 20.0 + uTime) * uDispersion * 0.2;
        }

        // 3D Parallax Tilt based on Mouse
        float tiltX = uMouse.y * 0.35;
        float tiltY = uMouse.x * 0.45;
        
        // Apply smooth rotation matrices in vertex space
        mat3 rotY = mat3(
          cos(tiltY), 0.0, sin(tiltY),
          0.0,        1.0, 0.0,
          -sin(tiltY), 0.0, cos(tiltY)
        );
        mat3 rotX = mat3(
          1.0, 0.0,         0.0,
          0.0, cos(tiltX), -sin(tiltX),
          0.0, sin(tiltX),  cos(tiltX)
        );

        pos = rotY * rotX * pos;
        vPosition = pos;
        vNormal = normalMatrix * normalize(normal + vec3(0.0, 0.0, d * 0.6));

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    // Fragment Shader for 3D Bust Mesh
    const fragmentShader = `
      uniform sampler2D uColorTexture;
      uniform sampler2D uDepthTexture;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uScanPos;
      uniform float uScanActive;
      uniform float uMode; // 0.0 = regular, 1.0 = topographic contour
      uniform float uDispersion;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDepth;

      void main() {
        vec4 color = texture2D(uColorTexture, vUv);
        
        // Alpha cutoff for clean transparent edges
        if (color.a < 0.05) discard;

        // Dynamic 3D lighting simulation
        vec3 lightPos = vec3(uMouse.x * 2.2 + 0.5, -uMouse.y * 2.2 + 1.0, 3.5);
        vec3 lightDir = normalize(lightPos - vPosition);
        float diff = max(dot(vNormal, lightDir), 0.0);
        
        // Ambient rim light (subtle warm studio golden back-edge)
        float rim = 1.0 - max(dot(normalize(-vPosition), vNormal), 0.0);
        rim = pow(clamp(rim, 0.0, 1.0), 3.0);
        vec3 rimColor = vec3(0.92, 0.65, 0.32) * rim * 0.4;

        // Golden scan flare localized STRICTLY to ear / jawline edge (matching video)
        float scanDist = abs(vUv.y - uScanPos);
        float scanGlow = smoothstep(0.08, 0.0, scanDist) * uScanActive;
        // Ear/jaw accentuation on the side
        float earRegion = smoothstep(0.60, 0.72, vUv.x) * smoothstep(0.90, 0.76, vUv.x)
                        * smoothstep(0.30, 0.42, vUv.y) * smoothstep(0.62, 0.48, vUv.y);
        vec3 flare = vec3(1.0, 0.72, 0.28) * (scanGlow * earRegion * 3.2);

        // Topographic contour lines effect (Mode: scan)
        vec3 outColor = color.rgb;
        if (uMode > 0.5) {
          float contours = fract((vDepth * 28.0) + (uTime * 0.4));
          float line = smoothstep(0.82, 0.96, contours);
          outColor = mix(outColor * 0.35, vec3(0.98, 0.76, 0.42), line * 0.95);
        } else {
          // Clean natural studio lighting preserving Anurag's face, hair, and glasses
          outColor = outColor * (0.92 + diff * 0.16) + rimColor + flare;
        }

        // Dissolve alpha when dispersed
        float alpha = color.a * (1.0 - uDispersion * 0.85);

        gl_FragColor = vec4(outColor, alpha);
      }
    `;

    // 4. Create 3D Sculpture Plane Mesh
    const planeGeo = new THREE.PlaneGeometry(2.35, 2.35, 140, 140);
    const planeMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: true
    });
    const bustMesh = new THREE.Mesh(planeGeo, planeMat);
    bustMesh.position.set(0, -0.05, 0);
    scene.add(bustMesh);
    bustMeshRef.current = bustMesh;

    // 5. Create 3D Particle Cloud for Disintegration Mode
    const particleCount = 18000;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleOriginals = new Float32Array(particleCount * 3);
    const particleUvs = new Float32Array(particleCount * 2);
    const particleRandoms = new Float32Array(particleCount * 3);

    let pIdx = 0;
    const gridRes = Math.round(Math.sqrt(particleCount));
    for (let i = 0; i < gridRes; i++) {
      for (let j = 0; j < gridRes; j++) {
        if (pIdx >= particleCount) break;
        const u = i / gridRes;
        const v = j / gridRes;

        // Distribute within bust area
        const x = (u - 0.5) * 2.35;
        const y = (v - 0.5) * 2.35 - 0.05;
        const z = 0.0;

        particlePositions[pIdx * 3] = x;
        particlePositions[pIdx * 3 + 1] = y;
        particlePositions[pIdx * 3 + 2] = z;

        particleOriginals[pIdx * 3] = x;
        particleOriginals[pIdx * 3 + 1] = y;
        particleOriginals[pIdx * 3 + 2] = z;

        particleUvs[pIdx * 2] = u;
        particleUvs[pIdx * 2 + 1] = v;

        particleRandoms[pIdx * 3] = (Math.random() - 0.5) * 2;
        particleRandoms[pIdx * 3 + 1] = Math.random() * 2;
        particleRandoms[pIdx * 3 + 2] = (Math.random() - 0.5) * 2;

        pIdx++;
      }
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('aOriginal', new THREE.BufferAttribute(particleOriginals, 3));
    particleGeo.setAttribute('aUv', new THREE.BufferAttribute(particleUvs, 2));
    particleGeo.setAttribute('aRandom', new THREE.BufferAttribute(particleRandoms, 3));

    const particleVertexShader = `
      uniform sampler2D uColorTexture;
      uniform sampler2D uDepthTexture;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uDispersion;
      uniform float uDisplacement;

      attribute vec3 aOriginal;
      attribute vec2 aUv;
      attribute vec3 aRandom;

      varying vec4 vColor;
      varying float vAlpha;

      void main() {
        vec4 col = texture2D(uColorTexture, aUv);
        vec4 dep = texture2D(uDepthTexture, aUv);
        float d = dep.r;

        if (col.a < 0.1 || d < 0.02) {
          gl_Position = vec4(9999.0, 9999.0, 9999.0, 1.0);
          return;
        }

        vec3 pos = aOriginal;
        pos.z += d * uDisplacement;

        // Disintegration physics: flow upwards like golden embers / strands
        if (uDispersion > 0.01) {
          float flow = uDispersion;
          pos.y += flow * (1.2 + aRandom.y * 1.5) + sin(uTime * 3.0 + aRandom.x * 6.0) * 0.15;
          pos.x += sin(pos.y * 3.0 + uTime * 2.0) * flow * 0.4 + aRandom.x * flow * 0.5;
          pos.z += flow * (0.8 + aRandom.z * 1.2);
        }

        // Parallax rotation
        float tiltX = uMouse.y * 0.35;
        float tiltY = uMouse.x * 0.45;
        mat3 rotY = mat3(
          cos(tiltY), 0.0, sin(tiltY),
          0.0,        1.0, 0.0,
          -sin(tiltY), 0.0, cos(tiltY)
        );
        mat3 rotX = mat3(
          1.0, 0.0,         0.0,
          0.0, cos(tiltX), -sin(tiltX),
          0.0, sin(tiltX),  cos(tiltX)
        );
        pos = rotY * rotX * pos;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Particle size with depth attenuation
        float pSize = mix(2.8, 5.2, uDispersion);
        gl_PointSize = (pSize / -mvPosition.z) * (18.0 / 10.0);

        vColor = col;
        vAlpha = col.a * mix(0.7, 0.95, uDispersion);
      }
    `;

    const particleFragmentShader = `
      varying vec4 vColor;
      varying float vAlpha;

      void main() {
        // Soft round circular particle
        vec2 coord = gl_PointCoord - vec2(0.5);
        if (length(coord) > 0.5) discard;
        
        // Golden accent glow on particles
        vec3 particleCol = mix(vColor.rgb, vec3(1.0, 0.82, 0.45), 0.25);
        gl_FragColor = vec4(particleCol, vAlpha);
      }
    `;

    const particleMat = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const pointsMesh = new THREE.Points(particleGeo, particleMat);
    pointsMesh.visible = false;
    scene.add(pointsMesh);
    pointsMeshRef.current = pointsMesh;

    // 6. Mouse Listener
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Resize Listener
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    const animate = () => {
      const elapsedTime = clockRef.current.getElapsedTime();
      animFrameRef.current = requestAnimationFrame(animate);

      // Smooth mouse lerp (damping)
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.06;
      m.y += (m.targetY - m.y) * 0.06;

      if (uniformsRef.current) {
        uniformsRef.current.uMouse.value.set(m.x, m.y);
        uniformsRef.current.uTime.value = elapsedTime;
        
        // Scan flare sweeps gently up and down along jawline/ear
        const sweep = 0.35 + Math.sin(elapsedTime * 1.5) * 0.22;
        uniformsRef.current.uScanPos.value = sweep;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  // Sync scroll & active mode with uniforms
  useEffect(() => {
    if (!uniformsRef.current) return;
    const dispersionAmount = activeMode === 'particles' ? 1.0 : Math.min(scrollProgress * 1.5, 1.2);
    uniformsRef.current.uDispersion.value = dispersionAmount;
    uniformsRef.current.uMode.value = activeMode === 'scan' ? 1.0 : 0.0;

    if (bustMeshRef.current && pointsMeshRef.current) {
      if (activeMode === 'particles' || dispersionAmount > 0.15) {
        pointsMeshRef.current.visible = true;
      } else {
        pointsMeshRef.current.visible = false;
      }
      bustMeshRef.current.visible = activeMode !== 'particles' || dispersionAmount < 0.9;
    }
  }, [scrollProgress, activeMode]);

  // Handle mode switches
  const handleSelectMode = (mode) => {
    setActiveMode(mode);
    if (onModeChange) onModeChange(mode);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          position: 'relative',
          zIndex: 2
        }}
      />

      {/* Floating 3D Control Pill at Bottom of Canvas */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.6rem',
          background: 'rgba(22, 21, 19, 0.82)',
          backdropFilter: 'blur(16px)',
          borderRadius: '9999px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)'
        }}
      >
        <button
          onClick={() => handleSelectMode('sculpture')}
          style={{
            padding: '0.4rem 0.9rem',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeMode === 'sculpture' ? '#e28a36' : 'transparent',
            color: activeMode === 'sculpture' ? '#171614' : 'rgba(255, 255, 255, 0.75)'
          }}
        >
          3D Sculpture
        </button>

        <button
          onClick={() => handleSelectMode('particles')}
          style={{
            padding: '0.4rem 0.9rem',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeMode === 'particles' ? '#e28a36' : 'transparent',
            color: activeMode === 'particles' ? '#171614' : 'rgba(255, 255, 255, 0.75)'
          }}
        >
          Particle Dispersion
        </button>

        <button
          onClick={() => handleSelectMode('scan')}
          style={{
            padding: '0.4rem 0.9rem',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeMode === 'scan' ? '#e28a36' : 'transparent',
            color: activeMode === 'scan' ? '#171614' : 'rgba(255, 255, 255, 0.75)'
          }}
        >
          Contour Slices
        </button>

        <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.15)', margin: '0 0.2rem' }} />

        {/* Flare toggle */}
        <button
          onClick={() => {
            setFlareActive(!flareActive);
            if (uniformsRef.current) {
              uniformsRef.current.uScanActive.value = !flareActive ? 1.0 : 0.0;
            }
          }}
          title="Toggle Golden Laser Flare"
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            border: 'none',
            background: flareActive ? 'rgba(226, 138, 54, 0.25)' : 'rgba(255, 255, 255, 0.08)',
            color: flareActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '0.75rem'
          }}
        >
          ✦
        </button>
      </div>

      {/* Subtle indicator hint */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontFamily: 'Space Grotesk, monospace',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          pointerEvents: 'none',
          letterSpacing: '0.05em'
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#22c55e',
            display: 'inline-block',
            boxShadow: '0 0 6px #22c55e'
          }}
        />
        <span>INTERACTIVE 3D TRACKING</span>
      </div>
    </div>
  );
}
