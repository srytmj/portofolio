<script>
  import { page } from '$app/state';
  import { constellation } from '$lib/stores/constellation.svelte.js';
  import LiveClock from './LiveClock.svelte';

  /** @type {{ activeId?: string }} */
  let { activeId = '' } = $props();

  // On home page ('/'): show constellation info when in hero section (activeId === ''),
  // and smoothly fade in LiveClock when entering About and subsequent sections (activeId !== '').
  // On subpages ('/projects', '/blog', etc.): always show LiveClock.
  const isHome = $derived(!page?.url || page.url.pathname === '/');
  const showClock = $derived(!isHome || activeId !== '');
  const figure = $derived(constellation.figure);
</script>

<div
  aria-live="polite"
  class="hidden sm:block fixed bottom-6 left-6 sm:bottom-7 sm:left-14 z-40 font-mono select-none pointer-events-none"
>
  <div class="relative flex items-end min-h-[42px]">
    <!-- Constellation Figure & Celestial Coordinates (Visible in Main Hero Section) -->
    <div
      class="flex flex-col items-start gap-0.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] {showClock ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto'}"
    >
      <span class="font-serif text-caption italic tracking-wide transition-all duration-300" style="color: var(--yorha-text-primary);">
        {figure.name}
      </span>
      <span class="text-[10px] tracking-[0.2em] uppercase transition-all duration-300" style="color: var(--yorha-text-muted);">
        {figure.coords} · {figure.id}
      </span>
    </div>

    <!-- Realtime Regional Clock HUD (Fades in when entering About section & beyond) -->
    <div
      class="absolute bottom-0 left-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] {showClock ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}"
    >
      <LiveClock />
    </div>
  </div>
</div>
