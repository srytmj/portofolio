<script>
  import { page } from '$app/state';
  import { constellation } from '$lib/stores/constellation.svelte.js';
  import LiveClock from './LiveClock.svelte';
  import { returnToMainPage } from '$lib/utils/navigationState.js';

  /** @type {{ activeId?: string }} */
  let { activeId = '' } = $props();

  const isHome = $derived(!page?.url || page.url.pathname === '/');
  const showClock = $derived(!isHome || activeId !== '');
  const figure = $derived(constellation.figure);
  
  // Animate the button in only when we're definitively on a subpage (blog, projects, etc)
  const isSubpage = $derived(!isHome);
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

    <!-- Realtime Regional Clock HUD & Return Button (Fades in when entering About section & beyond) -->
    <div
      class="absolute bottom-0 left-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] {showClock ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}"
    >
      <!-- Return Button container (animates height and opacity when navigating to subpages) -->
      <div
        class="grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto"
        style="grid-template-rows: {isSubpage ? '1fr' : '0fr'}; opacity: {isSubpage ? '1' : '0'}; margin-bottom: {isSubpage ? '12px' : '0px'};"
      >
        <div class="overflow-hidden">
          <button
            type="button"
            onclick={returnToMainPage}
            title="Return to Hero"
            class="flex items-center gap-2 px-3 py-1.5 border transition-colors yorha-invert-hover cursor-pointer font-mono"
            style="background-color: var(--yorha-surface); border-color: var(--yorha-border); color: var(--yorha-text-primary);"
          >
            <span style="color: var(--yorha-accent);">←</span>
            <span class="text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap">RETURN TO HERO</span>
          </button>
        </div>
      </div>

      <!-- Clock -->
      <LiveClock />
    </div>
  </div>
</div>
