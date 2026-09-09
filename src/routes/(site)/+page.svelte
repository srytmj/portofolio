<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import Hero from '$lib/components/Hero.svelte';
  import About from '$lib/components/About.svelte';
  import Skills from '$lib/components/Skills.svelte';
  import Portfolio from '$lib/components/Portfolio.svelte';
  import Contact from '$lib/components/Contact.svelte';
  import IntroCalibration from '$lib/components/intro/IntroCalibration.svelte';
  import { detectTier, prefersReducedMotion } from '$lib/utils/device.js';
  import { restoreMainPageScrollIfNeeded } from '$lib/utils/navigationState.js';

  // Opening sequence: once per browser session, motion-capable tiers only.
  // Decided during client init (not onMount) so the black overlay is in the
  // very first client paint — otherwise the hero flashes through first.
  function wantIntro() {
    if (!browser) return false;
    try {
      if (sessionStorage.getItem('intro:seen')) return false;
    } catch {
      return false;
    }
    return !prefersReducedMotion() && detectTier() !== 'static';
  }

  let intro = $state(wantIntro());
  // Hero's supporting lines wait for the intro to hand over (or start straight
  // away when there's no intro).
  let heroReady = $state(!intro);

  onMount(() => {
    restoreMainPageScrollIfNeeded();
  });
</script>

{#if intro}
  <IntroCalibration
    onDone={() => {
      intro = false;
      heroReady = true;
    }}
  />
{/if}

<Hero {heroReady} />

<div class="relative z-10 yorha-tech-bg" style="background-color: var(--yorha-bg);">
  <!-- Seamless Grid Dissolve Mask: Top 260px smoothly dissolves the 3px tech grid in -->
  <div
    class="pointer-events-none absolute top-0 left-0 right-0 h-56 sm:h-72 z-0 bg-gradient-to-b from-[var(--yorha-bg)] via-[var(--yorha-bg)]/85 to-transparent"
    aria-hidden="true"
  ></div>

  <!-- Tactical HUD Transition Seam / Telemetry Hairline -->
  <div class="relative z-10 w-full border-b border-current/15 bg-current/[0.015] overflow-hidden">
    <div class="flex items-center py-2 font-mono text-[9px] tracking-[0.3em] uppercase opacity-45 whitespace-nowrap pointer-events-none">
      <div class="flex animate-marquee min-w-max">
        {#each Array(4) as _}
          <div class="flex items-center gap-12 sm:gap-24 pr-12 sm:pr-24">
            <div class="flex items-center gap-2">
              <span class="inline-block h-1.5 w-1.5 animate-pulse" style="background-color: var(--yorha-accent);"></span>
              <span>SYS_ENGAGE // SECTOR_02_MONITOR</span>
            </div>
            <div class="flex items-center gap-3">
              <span>+ + +</span>
              <span class="h-2 w-px bg-current/30"></span>
              <span>HUD_MATRIX_ONLINE</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="h-1 w-1 rounded-full bg-current"></span>
              <span>ORBIT → TERRESTRIAL</span>
            </div>
            <div class="flex items-center gap-3 text-[8px] opacity-70">
              <span>DATA_LINK_ESTABLISHED</span>
              <span>[0x00FF9]</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <About />
  <Skills />
  <Portfolio />
  <Contact />
</div>
