<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ease } from '$lib/motion.js';

  /**
   * Concept 2: YoRHa Optical Calibration (Upgraded Edition)
   * Brutalist HUD & Military Android OS: Scanline -> Reticles -> 45deg Ratchet -> Radar Ping -> Lock-On Shutter Expand.
   * Zero text. Upgraded with Real Browser Sync & Tailwind Dark/Light Mode.
   * 
   * @type {{ onDone?: () => void, timeScale?: number }}
   */
  let { onDone = () => {}, timeScale = 1 } = $props();

  let root;
  let scanline;
  let reticleBox;
  let crosshair;
  let circleAperture;
  let circleOuter;
  let horizAxis;
  let vertAxis;

  let finished = false;
  function done() {
    if (finished) return;
    finished = true;
    onDone();
  }

  let tl;
  let minTimeTimeout;

  onMount(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    try {
      sessionStorage.setItem('intro:seen', '1');
    } catch {
      /* ignore */
    }

    const corners = root.querySelectorAll('.reticle-corner');

    tl = gsap.timeline({ onComplete: done });
    tl.timeScale(timeScale);

    // Initial state
    tl.set(scanline, { top: '-5%', autoAlpha: 0 });
    tl.set(reticleBox, { scale: 0.8, autoAlpha: 0, rotate: 0 });
    tl.set(crosshair, { scale: 0, autoAlpha: 0 });
    tl.set(circleAperture, { scale: 0.2, autoAlpha: 0 });
    tl.set(circleOuter, { scale: 0.5, autoAlpha: 0 });
    tl.set(horizAxis, { scaleX: 0, autoAlpha: 0 });
    tl.set(vertAxis, { scaleY: 0, autoAlpha: 0 });
    tl.set(corners, { x: 0, y: 0 });

    // PHASE 1: Vertical Scanline sweeps through the dark (0.0s - 0.7s)
    tl.to(scanline, {
      top: '105%',
      autoAlpha: 0.6,
      duration: 0.7,
      ease: 'power2.inOut'
    });

    // PHASE 2: Tactical HUD Reticles & Crosshair ignite (0.5s - 1.2s)
    tl.to(reticleBox, {
      scale: 1,
      autoAlpha: 1,
      duration: 0.45,
      ease: ease.out
    }, '-=0.25');

    tl.to(crosshair, {
      scale: 1,
      autoAlpha: 1,
      duration: 0.35,
      ease: 'power3.out'
    }, '<+=0.1');

    // Hairline coordinate axes snap in
    tl.to([horizAxis, vertAxis], {
      scaleX: 1,
      scaleY: 1,
      autoAlpha: 0.4,
      duration: 0.35,
      ease: 'power2.out'
    }, '<');

    // SYNC PAUSE LABEL (Wait for real browser load)
    tl.addLabel('sync-wait');
    tl.call(() => {
        tl.pause();
    });

    // PHASE 3: Mechanical Step Rotation & Aperture Pulse (Starts after load)
    tl.to(reticleBox, {
      rotate: 45,
      duration: 0.4,
      ease: 'back.out(2)'
    }, 'sync-wait+=0.1');
    tl.to(reticleBox, {
      rotate: 0,
      duration: 0.35,
      ease: 'elastic.out(1, 0.5)'
    });

    tl.to(circleAperture, {
      scale: 1,
      autoAlpha: 0.8,
      duration: 0.5,
      ease: 'power2.out'
    }, '<');
    tl.to(circleOuter, {
      scale: 1,
      autoAlpha: 0.5,
      duration: 0.6,
      ease: 'power2.out'
    }, '<+=0.1');

    // PHASE 4: Double-pulse "Lock-On" sequence
    tl.to(corners, {
      scale: 1.15,
      duration: 0.12,
      yoyo: true,
      repeat: 3,
      ease: 'steps(1)'
    });

    tl.to([circleAperture, circleOuter, horizAxis, vertAxis], {
      autoAlpha: 0,
      duration: 0.3,
      ease: 'power1.in'
    }, 'lock');

    // PHASE 5: Shutter Expansion / Aperture Open
    const dX = window.innerWidth * 0.6;
    const dY = window.innerHeight * 0.6;

    tl.to('.corner-tl', { x: -dX, y: -dY, duration: 0.6, ease: 'expo.in' }, 'open');
    tl.to('.corner-tr', { x: dX, y: -dY, duration: 0.6, ease: 'expo.in' }, 'open');
    tl.to('.corner-bl', { x: -dX, y: dY, duration: 0.6, ease: 'expo.in' }, 'open');
    tl.to('.corner-br', { x: dX, y: dY, duration: 0.6, ease: 'expo.in' }, 'open');
    tl.to(crosshair, { scale: 3, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 'open');

    tl.to(root, {
      autoAlpha: 0,
      duration: 0.55,
      ease: 'power1.inOut'
    }, 'open+=0.15');

    // ==========================================
    // REAL BROWSER LOADING SYNC LOGIC
    // ==========================================
    let minTimePassed = false;
    let windowLoaded = document.readyState === 'complete';

    // 1. Force a minimum display time of 1.2s before lock-on finishes
    minTimeTimeout = setTimeout(() => {
      minTimePassed = true;
      checkProceed();
    }, 1200);

    // 2. Track real window loading
    const handleLoad = () => {
      windowLoaded = true;
      checkProceed();
    };

    if (!windowLoaded) {
      window.addEventListener('load', handleLoad);
    }

    function checkProceed() {
      if (minTimePassed && windowLoaded) {
        if (tl.paused()) tl.play();
      }
    }

    function skip() {
      if (finished) return;
      cleanup();
      gsap.to(root, { autoAlpha: 0, duration: 0.2, onComplete: done });
    }

    function onKeyDown(e) { 
      if (e.key === 'Escape' || e.key === ' ') { e.preventDefault(); skip(); } 
    }

    root.addEventListener('click', skip);
    window.addEventListener('keydown', onKeyDown);

    function cleanup() {
      clearTimeout(minTimeTimeout);
      window.removeEventListener('load', handleLoad);
      if (tl) tl.kill();
      document.body.style.overflow = prevOverflow;
      root?.removeEventListener('click', skip);
      window?.removeEventListener('keydown', onKeyDown);
    }

    return cleanup;
  });
</script>

<div bind:this={root} class="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-neutral-50 dark:bg-black select-none cursor-pointer transition-colors duration-500" role="presentation" aria-hidden="true">
  <!-- Micro 3px technical background grid -->
  <div class="pointer-events-none absolute inset-0 opacity-15 hidden dark:block bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:4px_4px]"></div>
  <div class="pointer-events-none absolute inset-0 opacity-15 dark:hidden bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:4px_4px]"></div>

  <!-- Horizontal Scanline Laser -->
  <div bind:this={scanline} class="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-neutral-900 dark:via-white to-transparent shadow-[0_0_12px_2px_rgba(0,0,0,0.8)] dark:shadow-[0_0_12px_2px_rgba(255,255,255,0.8)]"></div>

  <!-- Hairline Coordinate Axes -->
  <div bind:this={horizAxis} class="pointer-events-none absolute inset-x-0 h-px bg-neutral-900/20 dark:bg-white/20"></div>
  <div bind:this={vertAxis} class="pointer-events-none absolute inset-y-0 w-px bg-neutral-900/20 dark:bg-white/20"></div>

  <!-- Radar Calibration Rings -->
  <div bind:this={circleAperture} class="pointer-events-none absolute h-64 w-64 rounded-full border border-dashed border-neutral-900/40 dark:border-white/40 shadow-[0_0_15px_rgba(0,0,0,0.15)] dark:shadow-[0_0_15px_rgba(255,255,255,0.15)]"></div>
  <div bind:this={circleOuter} class="pointer-events-none absolute h-96 w-96 rounded-full border border-neutral-900/20 dark:border-white/20"></div>

  <!-- Center Tactical HUD Reticle Box -->
  <div bind:this={reticleBox} class="pointer-events-none relative h-36 w-36 flex items-center justify-center">
    <!-- Corner Reticles (YoRHa brackets) -->
    <span class="reticle-corner corner-tl absolute -top-px -left-px h-5 w-5 border-l-2 border-t-2 border-neutral-900 dark:border-white"></span>
    <span class="reticle-corner corner-tr absolute -top-px -right-px h-5 w-5 border-r-2 border-t-2 border-neutral-900 dark:border-white"></span>
    <span class="reticle-corner corner-bl absolute -bottom-px -left-px h-5 w-5 border-b-2 border-l-2 border-neutral-900 dark:border-white"></span>
    <span class="reticle-corner corner-br absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-neutral-900 dark:border-white"></span>

    <!-- Tactical Reticle Tick Marks -->
    <span class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 h-1 w-px bg-neutral-900/80 dark:bg-white/80"></span>
    <span class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 h-1 w-px bg-neutral-900/80 dark:bg-white/80"></span>
    <span class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1 h-px bg-neutral-900/80 dark:bg-white/80"></span>
    <span class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-1 h-px bg-neutral-900/80 dark:bg-white/80"></span>

    <!-- Center Crosshair -->
    <div bind:this={crosshair} class="relative flex items-center justify-center">
      <span class="absolute h-3 w-px bg-neutral-900 dark:bg-white"></span>
      <span class="absolute w-3 h-px bg-neutral-900 dark:bg-white"></span>
      <span class="h-1 w-1 rounded-full bg-neutral-900 dark:bg-white shadow-[0_0_6px_1px_rgba(0,0,0,0.9)] dark:shadow-[0_0_6px_1px_rgba(255,255,255,0.9)]"></span>
    </div>
  </div>

  <div class="pointer-events-none absolute bottom-8 font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-900/40 dark:text-white/30">
    [ CLICK OR SPACE TO BYPASS ]
  </div>
</div>
