<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ease } from '$lib/motion.js';

  /**
   * Concept 1: Constellation Ignition
   * Pure visual celestial geometry: Single star seed -> splits into nodes -> constellation lines draw -> warp dissolve.
   * Zero text.
   * 
   * @type {{ onDone?: () => void, timeScale?: number }}
   */
  let { onDone = () => {}, timeScale = 1 } = $props();

  /** @type {HTMLElement} */ let root;
  /** @type {SVGSVGElement} */ let svgEl;
  /** @type {HTMLElement} */ let centerSeed;
  /** @type {HTMLElement} */ let shockwave;

  // Constellation node coordinates (Cygnus / Northern Cross celestial geometry)
  const nodes = [
    { id: 'n0', x: 0, y: 0, size: 4 },
    { id: 'n1', x: 0, y: -95, size: 3.5 },
    { id: 'n2', x: -110, y: -25, size: 3 },
    { id: 'n3', x: -180, y: -45, size: 2.5 },
    { id: 'n4', x: 110, y: -25, size: 3 },
    { id: 'n5', x: 180, y: -45, size: 2.5 },
    { id: 'n6', x: 0, y: 80, size: 3 },
    { id: 'n7', x: 0, y: 155, size: 2.5 }
  ];

  const connections = [
    [0, 1],
    [0, 2],
    [2, 3],
    [0, 4],
    [4, 5],
    [0, 6],
    [6, 7]
  ];

  let finished = false;
  function done() {
    if (finished) return;
    finished = true;
    onDone();
  }

  let tl;
  onMount(() => {
    const starEls = root.querySelectorAll('.constellation-node');
    const lineEls = svgEl.querySelectorAll('.constellation-line');
    const glowEls = root.querySelectorAll('.node-glow');

    tl = gsap.timeline({ onComplete: done });
    tl.timeScale(timeScale);

    tl.set(starEls, { scale: 0, autoAlpha: 0, transformOrigin: 'center center' });
    tl.set(lineEls, { strokeDasharray: 300, strokeDashoffset: 300 });
    tl.set(shockwave, { scale: 0.1, autoAlpha: 0 });
    tl.set(centerSeed, { scale: 0, autoAlpha: 0 });

    // PHASE 1: Center seed star awakens & pulses (0.0s - 0.7s)
    tl.to(centerSeed, {
      scale: 1,
      autoAlpha: 1,
      duration: 0.6,
      ease: 'power2.out'
    });
    tl.to(centerSeed, {
      scale: 1.4,
      boxShadow: '0 0 24px 6px rgba(255,255,255,0.9)',
      duration: 0.35,
      ease: 'power1.inOut'
    });

    // PHASE 2: Supernova burst — Seed splits into surrounding nodes (0.7s - 1.4s)
    tl.to(centerSeed, {
      scale: 0,
      autoAlpha: 0,
      duration: 0.25,
      ease: 'power2.in'
    }, 'burst');

    tl.to(starEls, {
      scale: 1,
      autoAlpha: 1,
      duration: 0.65,
      ease: ease.out,
      stagger: {
        each: 0.04,
        from: 'start'
      }
    }, 'burst+=0.1');

    tl.to(glowEls, {
      autoAlpha: 0.8,
      duration: 0.4,
      stagger: 0.04
    }, 'burst+=0.2');

    // PHASE 3: Hairline constellation lines draw sequentially (1.4s - 2.5s)
    tl.to(lineEls, {
      strokeDashoffset: 0,
      duration: 0.55,
      ease: 'power2.out',
      stagger: 0.06
    }, '-=0.2');

    // PHASE 4: Luminous ring radiates outward once connected (2.5s - 3.2s)
    tl.to(shockwave, {
      scale: 3.5,
      autoAlpha: 0.7,
      duration: 0.5,
      ease: 'power2.out'
    }, 'flash');
    tl.to(shockwave, {
      autoAlpha: 0,
      duration: 0.4,
      ease: 'power1.out'
    }, 'flash+=0.2');

    tl.to(starEls, {
      scale: 1.5,
      duration: 0.25,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut'
    }, 'flash');

    // PHASE 5: Celestial Warp-In Zoom — Constellation zooms forward dissolving the screen
    tl.to({}, { duration: 0.3 });
    tl.to(svgEl, {
      scale: 2.8,
      autoAlpha: 0,
      duration: 0.75,
      ease: 'power2.in'
    }, 'warp');
    tl.to(starEls, {
      scale: 4,
      autoAlpha: 0,
      duration: 0.75,
      ease: 'power2.in'
    }, 'warp');
    tl.to(root, {
      autoAlpha: 0,
      duration: 0.6,
      ease: 'power1.inOut'
    }, 'warp+=0.15');

    function skip() {
      if (finished) return;
      tl.kill();
      gsap.to(root, { autoAlpha: 0, duration: 0.2, onComplete: done });
    }

    root.addEventListener('click', skip);
    return () => {
      tl.kill();
      root.removeEventListener('click', skip);
    };
  });
</script>

<div
  bind:this={root}
  class="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black select-none cursor-pointer"
  role="presentation"
  aria-hidden="true"
>
  <div class="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]"></div>

  <div
    bind:this={centerSeed}
    class="pointer-events-none absolute h-3 w-3 rounded-full bg-white shadow-[0_0_16px_4px_rgba(255,255,255,0.8)]"
  ></div>

  <div
    bind:this={shockwave}
    class="pointer-events-none absolute h-64 w-64 rounded-full border border-white/60 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
  ></div>

  <svg
    bind:this={svgEl}
    class="pointer-events-none absolute h-[440px] w-[440px] overflow-visible"
    viewBox="-220 -220 440 440"
  >
    <defs>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {#each connections as [fromIdx, toIdx]}
      {@const p1 = nodes[fromIdx]}
      {@const p2 = nodes[toIdx]}
      <line
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        class="constellation-line stroke-white/80"
        stroke-width="1.25"
        stroke-linecap="round"
        filter="url(#glow)"
      />
    {/each}
  </svg>

  <div class="pointer-events-none absolute">
    {#each nodes as node}
      <div
        class="constellation-node absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style="left: {node.x}px; top: {node.y}px;"
      >
        <span
          class="node-glow absolute rounded-full bg-white/30 blur-[2px]"
          style="width: {node.size * 5}px; height: {node.size * 5}px;"
        ></span>
        <span
          class="relative rounded-full bg-white shadow-[0_0_8px_1.5px_rgba(255,255,255,0.85)]"
          style="width: {node.size * 2}px; height: {node.size * 2}px;"
        ></span>
      </div>
    {/each}
  </div>

  <div class="pointer-events-none absolute bottom-8 font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">
    [ CLICK OR ESC TO SKIP ]
  </div>
</div>
