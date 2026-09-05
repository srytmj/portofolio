<script>
  import { onMount } from 'svelte';
  import { identity } from '$lib/content/site.js';
  import SideNav from '$lib/components/SideNav.svelte';
  import CommandPalette from '$lib/components/CommandPalette.svelte';
  let { children } = $props();

  let activeId = $state('');

  const sectionIds = ['about', 'skills', 'portfolio', 'contact'];

  onMount(() => {
    let stopSmooth = () => {};
    let alive = true;
    import('$lib/scroll/smoothScroll.js').then(({ initSmoothScroll }) => {
      if (alive) stopSmooth = initSmoothScroll();
    });

    const docTop = (el) => el.getBoundingClientRect().top + window.scrollY;

    const onScroll = () => {
      const probe = window.scrollY + window.innerHeight * 0.4;
      let current = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && docTop(el) <= probe) current = id;
      }
      activeId = current;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      alive = false;
      stopSmooth();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  });
</script>

<svelte:head>
  <title>{identity.title}</title>
  <meta name="description" content={identity.tagline} />
  <!-- OpenGraph / Social Cards -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content={identity.title} />
  <meta property="og:description" content={identity.tagline} />
  <meta property="og:image" content="/og-preview.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={identity.title} />
  <meta name="twitter:description" content={identity.tagline} />
  <meta name="twitter:image" content="/og-preview.png" />
</svelte:head>

<button
  type="button"
  aria-label="Open Command Palette"
  onclick={() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-command-palette'));
    }
  }}
  class="fixed right-6 top-6 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ash-3 backdrop-blur-md transition-all hover:border-white/30 hover:text-white sm:right-10 sm:top-8"
>
  <svg
    viewBox="0 0 24 24"
    class="h-3 w-3 text-white/50"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
  <span class="hidden sm:inline">Menu</span>
  <kbd class="rounded border border-white/10 bg-white/5 px-1 py-0.5 text-[9px] text-white/70">⌘K</kbd>
</button>

<SideNav {activeId} />
<CommandPalette />

<main id="top">
  {@render children()}
</main>
