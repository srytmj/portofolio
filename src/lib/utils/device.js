// Client-only capability detection for the hero WebGL scene.
//
// Three tiers, decided before Three.js is ever downloaded:
//   full   — desktop + discrete/capable GPU: full shader + mouse distortion
//   lite   — mobile / integrated GPU / mid-tier: cheap shader, auto motion
//   static — no WebGL, weak CPU/RAM, slow network, data-saver, or
//            prefers-reduced-motion: CSS-only gradient, zero WebGL cost

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

function connectionInfo() {
  if (typeof navigator === 'undefined') return {};
  const c =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!c) return {};
  return { effectiveType: c.effectiveType, saveData: !!c.saveData };
}

export function detectTier() {
  if (typeof window === 'undefined') return 'static';

  // Dev / QA override: ?tier=full|lite|static (persisted for the session).
  // Add ?tier=auto to clear it.
  try {
    const q = new URLSearchParams(location.search).get('tier');
    if (q === 'auto') sessionStorage.removeItem('tier:override');
    else if (q === 'full' || q === 'lite' || q === 'static')
      sessionStorage.setItem('tier:override', q);
    const forced = sessionStorage.getItem('tier:override');
    if (forced) return forced;
  } catch {
    /* no-op */
  }

  if (prefersReducedMotion()) return 'static';

  const { effectiveType, saveData } = connectionInfo();
  if (saveData) return 'static';
  if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'static';

  const gl = probeWebGL();
  if (!gl) return 'static';

  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  const smallViewport = Math.min(window.innerWidth, window.innerHeight) < 720;
  const coarse = isTouchDevice();
  const weakGpu = hasWeakGpu(gl);

  // Bail straight to CSS only on genuinely unusable hardware (e.g. single core or slow 2G)
  if (cores < 2 || (mem && mem <= 1)) return 'static';
  if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'static';

  if (coarse || smallViewport || cores <= 6 || weakGpu) return 'lite';
  return 'full';
}

function probeWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return (
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return null;
  }
}

// Integrated / mobile GPUs choke on the full-detail fragment shader even on
// machines with plenty of CPU cores, so start them one tier down. The
// in-scene watchdog still catches anything this misses.
function hasWeakGpu(gl) {
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return false;
    const r = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)).toLowerCase();
    return /(intel|swiftshader|llvmpipe|software|adreno|mali|powervr|videocore|apple a)/.test(
      r
    );
  } catch {
    return false;
  }
}
