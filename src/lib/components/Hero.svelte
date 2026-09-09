<script>
  import { onMount, tick } from 'svelte';
  import { gsap } from 'gsap';
  import HeroCanvas from './HeroCanvas.svelte';
  import HeroName from './HeroName.svelte';
  import StaticHero from './StaticHero.svelte';
  import { identity } from '$lib/content/site.js';
  import { ease, dur } from '$lib/motion.js';
  import { detectTier, prefersReducedMotion } from '$lib/utils/device.js';
  import { setConstellationFigure } from '$lib/stores/constellation.svelte.js';

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

  function handleActive(fig) {
    activeFigure = fig;
    if (fig) {
      lastRevealedFigure = fig;
      setConstellationFigure(fig);
    }
  }

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

<section bind:this={section} class="relative" style="background-color: var(--yorha-bg);" data-hero>
  <div
    bind:this={pinInner}
    class="relative flex h-[100svh] w-full items-center justify-center overflow-hidden"
  >
    {#if useCanvas}
      {#key tier}
        <HeroCanvas
          {tier}
          {reducedMotion}
          {shrink}
          paused={dormant}
          onDowngrade={() => (tier = 'static')}
          onActive={handleActive}
        />
      {/key}
    {:else}
      <StaticHero />
    {/if}

    <!-- Readability scrim: only visible in dark mode via --hero-scrim, completely disabled in light mode -->
    <div
      class="pointer-events-none absolute inset-0 z-[5]"
      style="background: var(--hero-scrim);"
    ></div>

    <span
      class="pointer-events-none absolute left-[8vw] top-10 z-10 text-label tracking-[0.35em] opacity-40 sm:left-[9vw]"
      style="font-family: 'Space Mono', ui-monospace, monospace; color: var(--yorha-text-primary);"
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
        class="flex max-w-[42ch] flex-col gap-3.5 lg:self-center lg:items-end"
      >
        <!-- Quick Shortcut to Blog / Engineering Journal -->
        <a
          href="/blog"
          class="pointer-events-auto group yorha-invert-hover inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase px-3.5 py-1.5 border border-current/20 bg-current/5 transition-all duration-150 cursor-pointer"
          style="color: var(--yorha-text-primary);"
        >
          <span class="text-[9px] text-[var(--yorha-accent)]">■</span>
          <span>Engineering Journal</span>
          <span class="text-[10px] transition-transform group-hover:translate-x-1">→</span>
        </a>

        <div
          class="flex flex-col gap-2.5 border-t border-current/15 pt-3.5 font-serif text-caption italic leading-[1.6] opacity-60 lg:text-right"
          style="color: var(--yorha-text-primary);"
        >
          {#each identity.trivia as line}
            <p class="text-balance">{line}</p>
          {/each}
        </div>
      </div>
    </div>

    <!-- Bottom atmospheric blend into the content section background -->
    <div
      class="pointer-events-none absolute bottom-0 left-0 right-0 h-40 z-[5] bg-gradient-to-b from-transparent via-[var(--yorha-bg)]/50 to-[var(--yorha-bg)]"
      aria-hidden="true"
    ></div>

    <a
      href="#about"
      aria-label="Scroll down to content"
      class="scroll-beacon absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 p-2 group"
      style="color: var(--yorha-text-primary);"
    >
      <div class="relative h-10 w-[1px] overflow-hidden bg-current opacity-25 transition-opacity duration-300 group-hover:opacity-60">
        <div class="beacon-beam absolute left-0 w-full bg-gradient-to-b from-transparent via-current to-transparent"></div>
      </div>
    </a>
  </div>
</section>

<style>
  .beacon-beam {
    height: 16px;
    box-shadow: 0 0 8px 1px var(--yorha-accent-border), 0 0 16px 2px var(--yorha-accent-subtle);
    animation: flowDown 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  }
  @keyframes flowDown {
    0% {
      top: -18px;
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      top: 100%;
      opacity: 0;
    }
  }
</style>
