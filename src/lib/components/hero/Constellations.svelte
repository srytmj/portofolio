<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { T, useTask, useThrelte } from '@threlte/core';
  import {
    buildConstellations,
    buildBackgroundStars
  } from '$lib/three/constellationData.js';
  import {
    MAX_CONST,
    linesVertexShader,
    linesFragmentShader,
    starsVertexShader,
    starsFragmentShader
  } from '$lib/three/shaders/constellations.glsl.js';

  /**
   * @type {{
   *   tier: 'full' | 'lite',
   *   dpr?: number,
   *   shrink?: number,
   *   paused?: boolean,
   *   reducedMotion?: boolean,
   *   onQuality?: () => void,
   *   onDowngrade?: (t: 'static') => void,
   *   onActive?: (name: string | null) => void
   * }}
   */
  let {
    tier,
    dpr = 1,
    shrink = 1,
    paused = false,
    reducedMotion = false,
    onQuality,
    onDowngrade,
    onActive
  } = $props();

  const ctx = useThrelte();
  const full = tier === 'full';
  const R = 100;

  // Enable constellation labels and coordinates whenever reduced-motion is not requested
  const labelsOn = !reducedMotion;
  const SIGNATURE_ID = 'Cap'; // Capricornus

  const { constellations, linesGeometry, starsGeometry } = buildConstellations(R);
  const bgGeometry = buildBackgroundStars(full ? 16000 : 7000, R * 0.985);
  const rankOrder = [...constellations].sort((a, b) => a.rank - b.rank).map((c) => c.index);

  const signatureIdx = full
    ? (constellations.find((c) => c.id === SIGNATURE_ID)?.index ?? -1)
    : -1;

  // Shared reveal state — one array feeds both materials.
  const progress = new Float32Array(MAX_CONST);
  const uOpacity = { value: 1 };
  const uTime = { value: 0 };
  const uPixelRatio = { value: dpr };
  const uReducedMotion = { value: reducedMotion ? 1 : 0 };
  const uSignatureGlow = { value: 0 };

  const linesMat = new THREE.ShaderMaterial({
    vertexShader: linesVertexShader,
    fragmentShader: linesFragmentShader,
    uniforms: { uProgress: { value: progress }, uOpacity },
    transparent: true,
    depthWrite: false
  });

  const starsMat = new THREE.ShaderMaterial({
    vertexShader: starsVertexShader,
    fragmentShader: starsFragmentShader,
    uniforms: {
      uProgress: { value: progress },
      uOpacity,
      uTime,
      uPixelRatio,
      uReducedMotion,
      uSignature: { value: signatureIdx },
      uSignatureGlow,
      uSize: { value: full ? 1 : 0.9 }
    },
    transparent: true,
    depthWrite: false
  });

  const sky = new THREE.Group();
  sky.rotation.set(0.15, 2.0, 0);
  sky.add(new THREE.LineSegments(linesGeometry, linesMat));
  sky.add(new THREE.Points(bgGeometry, starsMat));
  sky.add(new THREE.Points(starsGeometry, starsMat));

  const centroids = constellations.map((c) => c.centroid.clone());

  // dev helper: ?find=Cap (id or name) centres the sky on that figure, holds it
  // still and reveals it — for checking figure shapes.
  let findIdx = -1;
  if (typeof location !== 'undefined') {
    const q = new URLSearchParams(location.search).get('find');
    if (q) {
      const m = constellations.find(
        (c) =>
          c.id.toLowerCase() === q.toLowerCase() ||
          c.name.toLowerCase() === q.toLowerCase()
      );
      if (m) {
        findIdx = m.index;
        sky.quaternion.setFromUnitVectors(
          m.centroid.clone().normalize(),
          new THREE.Vector3(0, 0, -1)
        );
        // eslint-disable-next-line no-console
        console.log(`[constellations] centred on ${m.name} (${m.id})`);
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `[constellations] ?find=${q} not found. ids: ${constellations
            .map((c) => c.id)
            .join(' ')}`
        );
      }
    }
  }

  const target = new THREE.Vector2();
  const smooth = new THREE.Vector2();
  let hasPointer = false;
  let active = -1;
  let reportedActive = -2; // last index sent to onActive (-2 = nothing sent)
  let t = 0;
  let eased = 1;

  const coarse =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  let autoI = 0;
  let autoAt = 0;

  // --- watchdog ---
  const watchdogOff = /[?&]watchdog=off/.test(
    typeof location !== 'undefined' ? location.search : ''
  );
  let samples = [];
  let slow = 0;
  let downgrades = 0;
  let last = typeof performance !== 'undefined' ? performance.now() : 0;
  let fps = 0;
  function watchdog(ms) {
    if (watchdogOff || reducedMotion) return;
    samples.push(ms);
    if (samples.length < 45) return;
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    samples = [];
    const f = 1000 / avg;
    if (f >= 45) return void (slow = 0);
    if (f < 30 || ++slow >= 2) {
      slow = 0;
      if (++downgrades === 1) {
        bgGeometry.setDrawRange(0, Math.floor(bgGeometry.attributes.position.count * 0.4));
        uReducedMotion.value = 1;
        onQuality?.();
      } else {
        onDowngrade?.('static');
      }
    }
  }

  const _dir = new THREE.Vector3();
  const _q = new THREE.Quaternion();

  function pick() {
    const cam = ctx.camera.current;
    if (!cam || !hasPointer) return -1;
    _dir.set(smooth.x, smooth.y, 0.5).unproject(cam).sub(cam.position).normalize();
    _dir.applyQuaternion(_q.copy(sky.quaternion).invert());
    let best = -1;
    let bestDot = 0.82; // ~35° cone for immediate, responsive detection
    for (let i = 0; i < centroids.length; i++) {
      const d = _dir.dot(centroids[i]) / R;
      if (d > bestDot) {
        bestDot = d;
        best = constellations[i].index;
      }
    }
    return best;
  }

  onMount(() => {
    const onMove = (e) => {
      hasPointer = true;
      target.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    const onLeave = () => (hasPointer = false);
    const onTouch = (e) => {
      const p = e.touches && e.touches[0];
      if (!p) return;
      hasPointer = true;
      target.set(
        (p.clientX / window.innerWidth) * 2 - 1,
        -((p.clientY / window.innerHeight) * 2 - 1)
      );
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    const lost = (e) => {
      e.preventDefault();
      onDowngrade?.('static');
    };
    ctx.renderer.domElement.addEventListener('webglcontextlost', lost, false);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
      ctx.renderer.domElement.removeEventListener('webglcontextlost', lost);
      linesGeometry.dispose();
      starsGeometry.dispose();
      bgGeometry.dispose();
      linesMat.dispose();
      starsMat.dispose();
    };
  });

  useTask((delta) => {
    const now = performance.now();
    const ms = now - last;
    last = now;
    if (ms > 0 && ms < 500) {
      fps = fps ? fps * 0.9 + (1000 / ms) * 0.1 : 1000 / ms;
      ctx.renderer.domElement.dataset.fps = fps.toFixed(0);
      if (!paused) watchdog(ms);
    }

    uPixelRatio.value = dpr;

    if (paused) {
      sky.visible = false;
      if (labelsOn && reportedActive !== -2) {
        reportedActive = -2;
        onActive?.(null);
      }
      return;
    }

    const dt = Math.min(delta, 0.05);
    if (!reducedMotion) t += dt;
    uTime.value = t;

    smooth.lerp(target, 1 - Math.pow(0.0009, dt));

    // which constellation is lit — the single nearest to the pointer
    if (findIdx >= 0) {
      active = findIdx;
    } else if (hasPointer) {
      active = pick();
    } else if (coarse && !reducedMotion) {
      if (t - autoAt > 3.8) {
        autoAt = t;
        autoI = (autoI + 1) % rankOrder.length;
        active = rankOrder[autoI];
      }
    } else {
      active = -1;
    }

    // full tier: name and coordinates of figure under pointer (fires only on change)
    if (labelsOn && active !== reportedActive) {
      reportedActive = active;
      onActive?.(
        active >= 0
          ? {
              id: constellations[active].id,
              name: constellations[active].name,
              coords: constellations[active].coords
            }
          : null
      );
    }

    // ease every constellation toward its target reveal
    let maxP = 0;
    for (let i = 0; i < MAX_CONST; i++) {
      const goal = i === active ? 1 : 0;
      const rate = goal > progress[i] ? 0.05 : 0.09;
      progress[i] += (goal - progress[i]) * rate;
      if (progress[i] < 1e-4) progress[i] = 0;
      if (progress[i] > maxP) maxP = progress[i];
    }

    eased += (shrink - eased) * 0.1;

    // signature idle glow — subtle, and only while nothing is revealing and the
    // hero still owns the screen
    uSignatureGlow.value =
      signatureIdx >= 0 ? 0.11 * (1 - Math.min(1, maxP)) * Math.min(1, eased) : 0;
    sky.visible = eased > 0.02;
    if (!sky.visible) return;

    uOpacity.value = Math.min(1, eased);
    sky.scale.setScalar(0.6 + 0.4 * eased);

    if (!reducedMotion && findIdx < 0) {
      sky.rotation.y = 2.0 + t * 0.006 + smooth.x * 0.05;
      sky.rotation.x = 0.15 + smooth.y * 0.05;
    }
  });
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 0.01]} fov={62} near={0.01} far={800} />

<T is={sky} />
