<script>
  import { browser } from '$app/environment';
  import Hero from '$lib/components/Hero.svelte';
  import About from '$lib/components/About.svelte';
  import Skills from '$lib/components/Skills.svelte';
  import Portfolio from '$lib/components/Portfolio.svelte';
  import Contact from '$lib/components/Contact.svelte';
  import IntroSequence from '$lib/components/IntroSequence.svelte';
  import { detectTier, prefersReducedMotion } from '$lib/utils/device.js';

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
</script>

{#if intro}
  <IntroSequence
    onDone={() => {
      intro = false;
      heroReady = true;
    }}
  />
{/if}

<Hero {heroReady} />

<div class="relative z-10 bg-black">
  <About />
  <Skills />
  <Portfolio />
  <Contact />
</div>
