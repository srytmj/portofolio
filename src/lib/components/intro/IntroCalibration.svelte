<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ease } from '$lib/motion.js';

  /**
   * YoRHa Optical Calibration.
   * Scanline -> reticle ignition -> 45deg ratchet -> radar ping -> shutter open.
   * Zero text. Colours come from the theme tokens, so the overlay matches
   * whichever theme the visitor already has (see the data-theme stamp in
   * app.html) instead of following the OS colour scheme.
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

  // Nothing here may outlive the overlay: an opening sequence that can stall is
  // worse than no opening sequence at all.
  const MIN_DISPLAY_MS = 700; // never flash past faster than this
  const MAX_WAIT_MS = 2000; // hard ceiling on waiting for window.load

  onMount(() => {
    try {
      sessionStorage.setItem('intro:seen', '1');
    } catch {
      /* private mode - it just plays once and never records */
    }

    // A tab opened in the background has its requestAnimationFrame frozen, so
    // the GSAP timeline would sit still with the page scroll locked until the
    // visitor finally switches to it. An opening sequence that plays minutes
    // late is worse than none: hand over to the hero straight away.
    if (document.hidden) {
      done();
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const corners = root.querySelectorAll('.reticle-corner');

    // `cleared` gates the hold. The timeline asks for it when it reaches the
    // gate; if it has already been granted by then the timeline never pauses.
    // Pausing unconditionally is what used to strand the intro forever when a
    // janky first frame pushed the gate past the resume callbacks.
    let cleared = false;
    let minTimePassed = false;
    let windowLoaded = document.readyState === 'complete';
    let minTimer;
    let maxTimer;

    const tl = gsap.timeline({ onComplete: done });
    tl.timeScale(timeScale);

    tl.set(scanline, { top: '-5%', autoAlpha: 0 });
    tl.set(reticleBox, { scale: 0.8, autoAlpha: 0, rotate: 0 });
    tl.set(crosshair, { scale: 0, autoAlpha: 0 });
    tl.set(circleAperture, { scale: 0.2, autoAlpha: 0 });
    tl.set(circleOuter, { scale: 0.5, autoAlpha: 0 });
    tl.set(horizAxis, { scaleX: 0, autoAlpha: 0 });
    tl.set(vertAxis, { scaleY: 0, autoAlpha: 0 });
    tl.set(corners, { x: 0, y: 0 });

    // PHASE 1 - scanline sweeps the dark
    tl.to(scanline, { top: '105%', autoAlpha: 0.6, duration: 0.5, ease: 'power2.inOut' });

    // PHASE 2 - reticle, crosshair and coordinate axes ignite
    tl.to(reticleBox, { scale: 1, autoAlpha: 1, duration: 0.4, ease: ease.out }, '-=0.22');
    tl.to(crosshair, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'power3.out' }, '<+=0.08');
    tl.to(
      [horizAxis, vertAxis],
      { scaleX: 1, scaleY: 1, autoAlpha: 0.4, duration: 0.3, ease: 'power2.out' },
      '<'
    );

    // GATE - hold here only if the page is not ready yet
    tl.addLabel('gate');
    tl.call(() => {
      if (!cleared) tl.pause();
    });

    // PHASE 3 - mechanical ratchet + aperture ping
    tl.to(reticleBox, { rotate: 45, duration: 0.3, ease: 'back.out(2)' }, 'gate+=0.05');
    tl.to(reticleBox, { rotate: 0, duration: 0.28, ease: 'elastic.out(1, 0.5)' });
    tl.to(circleAperture, { scale: 1, autoAlpha: 0.8, duration: 0.38, ease: 'power2.out' }, '<');
    tl.to(circleOuter, { scale: 1, autoAlpha: 0.5, duration: 0.42, ease: 'power2.out' }, '<+=0.08');

    // PHASE 4 - lock-on
    tl.to(corners, { scale: 1.15, duration: 0.1, yoyo: true, repeat: 1, ease: 'steps(1)' });
    tl.to(
      [circleAperture, circleOuter, horizAxis, vertAxis],
      { autoAlpha: 0, duration: 0.24, ease: 'power1.in' },
      'lock'
    );

    // PHASE 5 - shutter expansion
    const dX = window.innerWidth * 0.6;
    const dY = window.innerHeight * 0.6;
    tl.to('.corner-tl', { x: -dX, y: -dY, duration: 0.45, ease: 'expo.in' }, 'open');
    tl.to('.corner-tr', { x: dX, y: -dY, duration: 0.45, ease: 'expo.in' }, 'open');
    tl.to('.corner-bl', { x: -dX, y: dY, duration: 0.45, ease: 'expo.in' }, 'open');
    tl.to('.corner-br', { x: dX, y: dY, duration: 0.45, ease: 'expo.in' }, 'open');
    tl.to(crosshair, { scale: 3, autoAlpha: 0, duration: 0.32, ease: 'power2.in' }, 'open');
    tl.to(root, { autoAlpha: 0, duration: 0.4, ease: 'power1.inOut' }, 'open+=0.12');

    function clearGate() {
      if (cleared) return;
      cleared = true;
      clearTimeout(maxTimer);
      if (tl.paused()) tl.play();
    }

    function checkProceed() {
      if (minTimePassed && windowLoaded) clearGate();
    }

    const handleLoad = () => {
      windowLoaded = true;
      checkProceed();
    };

    minTimer = setTimeout(() => {
      minTimePassed = true;
      checkProceed();
    }, MIN_DISPLAY_MS);

    // Failsafe: a stalled font or image must never hold the visitor hostage.
    maxTimer = setTimeout(clearGate, MAX_WAIT_MS);

    if (!windowLoaded) window.addEventListener('load', handleLoad);

    function skip() {
      if (finished) return;
      cleanup();
      gsap.to(root, { autoAlpha: 0, duration: 0.2, onComplete: done });
    }

    function onKeyDown(e) {
      if (e.key === ' ' || e.code === 'Space' || e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        skip();
      }
    }

    root.addEventListener('click', skip);
    window.addEventListener('keydown', onKeyDown);

    function cleanup() {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      window.removeEventListener('load', handleLoad);
      tl.kill();
      document.body.style.overflow = prevOverflow;
      root?.removeEventListener('click', skip);
      window.removeEventListener('keydown', onKeyDown);
    }

    return cleanup;
  });
</script>

<div
  bind:this={root}
  class="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center overflow-hidden select-none"
  style="background-color: var(--yorha-bg); color: var(--yorha-text-primary);"
  role="presentation"
  aria-hidden="true"
>
  <!-- Technical dot grid -->
  <div
    class="pointer-events-none absolute inset-0 opacity-15"
    style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 4px 4px;"
  ></div>

  <!-- Horizontal scanline -->
  <div
    bind:this={scanline}
    class="pointer-events-none absolute inset-x-0 h-px"
    style="background-image: linear-gradient(to right, transparent, currentColor, transparent);"
  ></div>

  <!-- Hairline coordinate axes -->
  <div bind:this={horizAxis} class="pointer-events-none absolute inset-x-0 h-px bg-current/20"></div>
  <div bind:this={vertAxis} class="pointer-events-none absolute inset-y-0 w-px bg-current/20"></div>

  <!-- Radar calibration rings -->
  <div
    bind:this={circleAperture}
    class="pointer-events-none absolute h-64 w-64 rounded-full border border-dashed border-current/40"
  ></div>
  <div
    bind:this={circleOuter}
    class="pointer-events-none absolute h-96 w-96 rounded-full border border-current/20"
  ></div>

  <!-- Centre reticle -->
  <div
    bind:this={reticleBox}
    class="pointer-events-none relative flex h-36 w-36 items-center justify-center"
  >
    <span class="reticle-corner corner-tl absolute -top-px -left-px h-5 w-5 border-l-2 border-t-2 border-current"></span>
    <span class="reticle-corner corner-tr absolute -top-px -right-px h-5 w-5 border-r-2 border-t-2 border-current"></span>
    <span class="reticle-corner corner-bl absolute -bottom-px -left-px h-5 w-5 border-b-2 border-l-2 border-current"></span>
    <span class="reticle-corner corner-br absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-current"></span>

    <span class="absolute top-0 left-1/2 h-1 w-px -translate-x-1/2 -translate-y-1 bg-current/80"></span>
    <span class="absolute bottom-0 left-1/2 h-1 w-px -translate-x-1/2 translate-y-1 bg-current/80"></span>
    <span class="absolute left-0 top-1/2 h-px w-1 -translate-x-1 -translate-y-1/2 bg-current/80"></span>
    <span class="absolute right-0 top-1/2 h-px w-1 translate-x-1 -translate-y-1/2 bg-current/80"></span>

    <div bind:this={crosshair} class="relative flex items-center justify-center">
      <span class="absolute h-3 w-px bg-current"></span>
      <span class="absolute h-px w-3 bg-current"></span>
      <span class="h-1 w-1 rounded-full bg-current"></span>
    </div>
  </div>

  <div
    class="pointer-events-none absolute bottom-8 font-mono text-[9px] uppercase tracking-[0.3em] opacity-40"
  >
    [ CLICK OR SPACE TO BYPASS ]
  </div>
</div>
