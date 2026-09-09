<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ease, dur } from '$lib/motion.js';

  /** @type {{ activeId?: string }} */
  let { activeId = '' } = $props();

  const blogUrl = '/blog';
  const items = [
    // 01 is the hero itself (the "01" marker on that screen); sections start at 02.
    { key: 'home', label: 'Top', num: '' },
    { key: 'about', label: 'About', num: '02' },
    { key: 'skills', label: 'Skills', num: '03' },
    { key: 'portfolio', label: 'Portfolio', num: '04' },
    { key: 'contact', label: 'Contact', num: '05' },
    { key: 'blog', label: 'Blog', num: '06', external: false }
  ];

  const reduce = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** @type {HTMLElement} */ let nav;
  let mounted = $state(false);

  onMount(() => {
    // Hidden until a section is in view (the hero shows nothing).
    // Maintain yPercent: -50 so vertical centering is never overwritten by GSAP!
    gsap.set(nav, { autoAlpha: 0, xPercent: -10, yPercent: -50 });
    gsap.set(nav.querySelectorAll('[data-num]'), { width: 0, marginRight: 0, autoAlpha: 0 });
    gsap.set(nav.querySelectorAll('[data-label]'), { opacity: 0.4 });
    gsap.set(nav.querySelector('[data-star]'), { opacity: 0.6, transformOrigin: '50% 50%' });
    mounted = true;
  });

  $effect(() => {
    if (!mounted || !nav) return;
    const active = activeId;
    const d = reduce() ? 0 : dur.md;
    const visible = active !== '';

    gsap.to(nav, {
      autoAlpha: visible ? 1 : 0,
      xPercent: visible ? 0 : -10,
      yPercent: -50,
      duration: d,
      ease: ease.out,
      overwrite: true
    });

    for (const el of nav.children) {
      const home = el.dataset.key === 'home';
      const on = el.dataset.key === active;
      const num = el.querySelector('[data-num]');
      const label = el.querySelector('[data-label]');
      gsap.to(el, {
        // The star sits at a fixed offset (roughly the column centre) so it
        // never drifts when a wide item like "03 Portfolio" unfolds.
        x: home ? 28 : on ? 14 : 0,
        duration: d,
        ease: ease.out,
        overwrite: 'auto'
      });
      if (num)
        gsap.to(num, {
          width: on ? 'auto' : 0,
          marginRight: on ? 8 : 0,
          autoAlpha: on ? 1 : 0,
          duration: d,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      if (label)
        gsap.to(label, {
          opacity: on ? 1 : 0.4,
          fontWeight: on ? 600 : 400,
          duration: d * 0.7,
          overwrite: 'auto'
        });
    }
  });

  function hover(el, entering) {
    if (reduce()) return;
    const key = el.dataset.key;

    if (key === 'home') {
      // Stays put, just spins in place + brightens.
      gsap.to(el.querySelector('[data-star]'), {
        rotation: entering ? 180 : 0,
        opacity: entering ? 1 : 0.6,
        duration: dur.md,
        ease: ease.ui,
        overwrite: 'auto'
      });
      return;
    }

    const isActive = key === activeId;
    gsap.to(el.querySelector('[data-label]'), {
      opacity: entering || isActive ? 1 : 0.4,
      duration: dur.xs,
      ease: ease.ui,
      overwrite: 'auto'
    });
    gsap.to(el, {
      x: isActive ? 14 : entering ? 6 : 0,
      duration: dur.sm,
      ease: ease.ui,
      overwrite: 'auto'
    });
  }

  function handleNavClick(e, it) {
    if (it.key === 'blog') return;

    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      e.preventDefault();
      const targetId = it.key === 'home' ? 'top' : it.key;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        if (window.__lenis) {
          window.__lenis.scrollTo(targetEl, { offset: 0, duration: 1 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        history.pushState(null, '', it.key === 'home' ? '#top' : `#${it.key}`);
      }
    }
  }
</script>

<nav
  bind:this={nav}
  aria-label="Sections"
  class="invisible hidden lg:flex fixed left-7 top-1/2 z-50 flex-col gap-[18px] sm:left-14"
>
  {#each items as it}
    <a
      data-key={it.key}
      href={it.key === 'blog' ? '/blog' : it.key === 'home' ? '#top' : `/#${it.key}`}
      target={it.external ? '_blank' : undefined}
      rel={it.external ? 'noopener noreferrer' : undefined}
      aria-current={it.key === activeId ? 'true' : undefined}
      onclick={(e) => handleNavClick(e, it)}
      onpointerenter={(e) => hover(e.currentTarget, true)}
      onpointerleave={(e) => hover(e.currentTarget, false)}
      class="group flex items-center whitespace-nowrap py-0.5 text-[11px] uppercase tracking-[0.18em] transition-colors cursor-pointer {it.key ===
      'home'
        ? 'mb-1'
        : ''}"
      style="color: var(--yorha-text-primary);"
    >
      {#if it.key === 'home'}
        <span data-star class="inline-block text-xs leading-none font-mono" style="color: var(--yorha-accent);">✦</span>
        <span class="sr-only">Back to top</span>
      {:else}
        <span data-num class="overflow-hidden font-mono text-[0.85em]" style="color: var(--yorha-text-muted);">{it.num}</span>
        <span data-label>{it.label}</span>
      {/if}
    </a>
  {/each}
</nav>
