<script>
  import { onMount, tick } from 'svelte';
  import HeroCanvas from './HeroCanvas.svelte';
  import HeroName from './HeroName.svelte';
  import StaticHero from './StaticHero.svelte';
  import { identity } from '$lib/content/site.js';
  import { detectTier, prefersReducedMotion } from '$lib/utils/device.js';

  let tier = $state('static');
  let reducedMotion = $state(false);
  let mounted = $state(false);

  // Scroll-driven: 1 = hero fully expanded, 0 = collapsed. Flows into the
  // Threlte scene as a plain prop. `dormant` frees the GPU once past the hero.
  let shrink = $state(1);
  let dormant = $state(false);

  /** @type {HTMLElement} */ let section;
  /** @type {HTMLElement} */ let pinInner;
  /** @type {HTMLElement} */ let overlay;
  /** @type {HTMLElement} */ let nameWrap;

  const useCanvas = $derived(mounted && (tier === 'full' || tier === 'lite'));
  const mode = $derived(reducedMotion ? 'static' : tier);

  onMount(() => {
    tier = detectTier();
    reducedMotion = prefersReducedMotion();
    mounted = true;
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
        />
      {/key}
    {:else}
      <StaticHero />
    {/if}

    <!-- Readability scrim: darkens the dust field directly behind the text. -->
    <div
      class="pointer-events-none absolute inset-0 z-[5]"
      style="background: radial-gradient(ellipse 58% 42% at 50% 50%, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.4) 42%, rgba(0,0,0,0) 70%);"
    ></div>

    <div
      bind:this={overlay}
      class="pointer-events-none relative z-10 flex flex-col items-center px-6 text-center"
    >
      <div bind:this={nameWrap}>
        <HeroName title={identity.role} line={identity.pitch} />
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
