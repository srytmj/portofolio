<script>
  import { onMount, tick } from 'svelte';
  import { gsap } from 'gsap';
  import HeroCanvas from './HeroCanvas.svelte';
  import HeroName from './HeroName.svelte';
  import StaticHero from './StaticHero.svelte';
  import { identity } from '$lib/content/site.js';
  import { ease, dur } from '$lib/motion.js';
  import { detectTier, prefersReducedMotion } from '$lib/utils/device.js';

  /** @type {{ heroReady?: boolean }} */
  let { heroReady = true } = $props();

  let tier = $state('static');
  let reducedMotion = $state(false);
  let mounted = $state(false);

  // Scroll-driven: 1 = hero fully expanded, 0 = collapsed. Flows into the
  // Threlte scene as a plain prop. `dormant` frees the GPU once past the hero.
  let shrink = $state(1);
  let dormant = $state(false);

  // Default signature figure (Capricornus)
  const defaultFigure = {
    id: 'Cap',
    name: 'Capricornus',
    coords: 'RA 21h 00m · Dec -20°'
  };

  // Figure the pointer is revealing
  let activeFigure = $state(null);
  let lastRevealedFigure = $state(null);

  $effect(() => {
    if (activeFigure) {
      lastRevealedFigure = activeFigure;
    }
  });

  let currentFigure = $derived(activeFigure || lastRevealedFigure || defaultFigure);

  /** @type {HTMLElement} */ let section;
  /** @type {HTMLElement} */ let pinInner;
  /** @type {HTMLElement} */ let overlay;
  /** @type {HTMLElement} */ let nameWrap;

  const useCanvas = $derived(mounted && (tier === 'full' || tier === 'lite'));
  const mode = $derived(reducedMotion ? 'static' : tier);

  onMount(() => {
    tier = detectTier();
    reducedMotion = prefersReducedMotion();
    // Hold the supporting lines back so they can arrive after the name.
    if (!reducedMotion) gsap.set(overlay?.querySelectorAll('[data-reveal]') ?? [], { autoAlpha: 0 });
    mounted = true;
  });

  // Fade the role line then the trivia in, once the hero is actually on screen
  // (either straight away, or when the opening sequence hands over).
  let revealed = false;
  $effect(() => {
    if (!heroReady || !mounted || revealed) return;
    revealed = true;
    const targets = overlay?.querySelectorAll('[data-reveal]');
    if (!targets?.length) return;
    if (reducedMotion) {
      gsap.set(targets, { autoAlpha: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      targets,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: dur.lg, ease: ease.out, stagger: 0.22, delay: 0.15 }
    );
  });

  // (Re)build the scroll choreography whenever the effective mode changes —
  // e.g. the in-scene watchdog downgrades 'full' → 'static' at runtime.
  $effect(() => {
    if (!mounted) return;
    const m = mode;
    let cleanup = () => {};
    let alive = true;

    (async () => {
      await tick();
      if (!alive) return;
      const { createHeroTransition, ScrollTrigger } = await import(
        '$lib/scroll/heroTransition.js'
      );
      cleanup = createHeroTransition({
        pinTarget: pinInner,
        trigger: section,
        nameEl: nameWrap,
        overlayEl: overlay,
        mode: m,
        onProgress: (p) => {
          shrink = 1 - p;
          dormant = p >= 0.995;
        }
      });
      ScrollTrigger.refresh();
    })();

    return () => {
      alive = false;
      cleanup();
    };
  });
</script>

<section bind:this={section} class="relative" data-hero>
  <div
    bind:this={pinInner}
    class="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-black"
  >
    {#if useCanvas}
      {#key tier}
        <HeroCanvas
          {tier}
          {reducedMotion}
          {shrink}
          paused={dormant}
          onDowngrade={() => (tier = 'static')}
          onActive={(fig) => (activeFigure = fig)}
        />
      {/key}
    {:else}
      <StaticHero />
    {/if}

    <!-- Readability scrim: darkens the dust field behind the text, offset left
         to sit under the asymmetric headline. -->
    <div
      class="pointer-events-none absolute inset-0 z-[5]"
      style="background: radial-gradient(ellipse 64% 48% at 34% 50%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.42) 44%, rgba(0,0,0,0) 72%);"
    ></div>

    <span
      class="pointer-events-none absolute left-[8vw] top-10 z-10 text-label tracking-[0.35em] text-white/40 sm:left-[9vw]"
      style="font-family: 'Space Mono', ui-monospace, monospace;"
      aria-hidden="true">01</span
    >

    <div
      bind:this={overlay}
      class="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center gap-12 px-[8vw] sm:px-[9vw] lg:flex-row lg:items-center lg:justify-between lg:gap-16"
    >
      <div bind:this={nameWrap} class="shrink-0">
        <HeroName display={identity.display} role={identity.role} />
      </div>
      <div
        data-reveal
        class="flex max-w-[42ch] flex-col gap-2.5 border-t border-white/15 pt-4 font-serif text-caption italic leading-[1.6] text-white/45 lg:self-center lg:text-right"
      >
        {#each identity.trivia as line}
          <p class="text-balance">{line}</p>
        {/each}
      </div>
    </div>

    <a
      href="#about"
      aria-label="Scroll to content"
      class="scroll-cue absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white/45 transition-colors hover:text-white"
    >
      <svg
        viewBox="0 0 24 24"
        class="h-6 w-6"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </a>

    <!-- Name and astronomical coordinates of the constellation (full tier only). -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute bottom-7 right-7 z-10 flex flex-col items-end gap-1 text-right font-mono transition-opacity duration-500"
      class:opacity-0={shrink <= 0.5}
    >
      <span class="font-serif text-caption italic tracking-wide text-white/90 transition-all duration-300">
        {currentFigure.name}
      </span>
      <span class="text-[10px] tracking-[0.2em] text-white/40 uppercase transition-all duration-300">
        {currentFigure.coords} · {currentFigure.id}
      </span>
    </div>
  </div>
</section>

<style>
  .scroll-cue svg {
    animation: cue 1.9s ease-in-out infinite;
  }
  @keyframes cue {
    0%,
    100% {
      transform: translateY(0);
      opacity: 0.55;
    }
    50% {
      transform: translateY(5px);
      opacity: 1;
    }
  }
</style>
