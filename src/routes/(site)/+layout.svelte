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
</svelte:head>

<SideNav {activeId} />
<CommandPalette />

<main id="top">
  {@render children()}
</main>
