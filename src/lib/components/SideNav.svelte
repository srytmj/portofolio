<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ease, dur } from '$lib/motion.js';

  /** @type {{ activeId?: string }} */
  let { activeId = '' } = $props();

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

  // The rail lives in the left gutter, and that gutter only exists once the
  // viewport is wider than the 72rem content container plus its padding.
  //
  //   content left edge = max(gutter, (100vw - 1152px) / 2 + gutter)
  //
  // Below 1440 there is room for the numbers but not the labels, so the rail
  // collapses to a number column and expands over the page only while it is
  // hovered or focused. Below 1280 there is no usable gutter at all and the
  // rail stays hidden, which is why it used to sit on top of the About column.
  // Navigation is still covered there by the MENU button and Ctrl+K palette.
  let compact = $state(false);
  let railOpen = $state(false);
  const expanded = $derived(!compact || railOpen);

  onMount(() => {
    const mq = window.matchMedia('(max-width: 1439.98px)');
    const sync = () => (compact = mq.matches);
    sync();
    mq.addEventListener('change', sync);

    // Hidden until a section is in view (the hero shows nothing).
    // Maintain yPercent: -50 so vertical centering is never overwritten by GSAP.
    gsap.set(nav, { autoAlpha: 0, xPercent: -10, yPercent: -50 });
    gsap.set(nav.querySelector('[data-star]'), { opacity: 0.6, transformOrigin: '50% 50%' });
    mounted = true;

    return () => mq.removeEventListener('change', sync);
  });

  $effect(() => {
    if (!mounted || !nav) return;
    const active = activeId;
    const open = expanded;
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
      const labelWrap = el.querySelector('[data-label-wrap]');
      const label = el.querySelector('[data-label]');

      // Collapsed, every number shows: it is the only thing left to navigate
      // by. Expanded, the number belongs to the active row only.
      const showNum = !open || on;

      gsap.to(el, {
        // The star sits at a fixed offset (roughly the label column centre) so
        // it never drifts when a wide item like "04 Portfolio" unfolds. With
        // the labels collapsed there is no label column to align to.
        x: home ? (open ? 28 : 0) : on ? 14 : 0,
        duration: d,
        ease: ease.out,
        overwrite: 'auto'
      });

      if (num)
        gsap.to(num, {
          width: showNum ? 'auto' : 0,
          marginRight: showNum && open ? 8 : 0,
          autoAlpha: showNum ? (on ? 1 : 0.5) : 0,
          duration: d,
          ease: 'power3.out',
          overwrite: 'auto'
        });

      if (labelWrap)
        gsap.to(labelWrap, {
          width: open ? 'auto' : 0,
          autoAlpha: open ? 1 : 0,
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

  function openRail() {
    railOpen = true;
  }

  function closeRail(e) {
    if (e?.relatedTarget && nav?.contains(e.relatedTarget)) return;
    railOpen = false;
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
  onpointerenter={openRail}
  onpointerleave={closeRail}
  onfocusin={openRail}
  onfocusout={closeRail}
  class="invisible fixed top-1/2 z-50 hidden flex-col gap-[18px] xl:flex"
  style="left: {compact ? '1.5rem' : '3.5rem'};"
>
  {#each items as it}
    <a
      data-key={it.key}
      href={it.key === 'blog' ? '/blog' : it.key === 'home' ? '#top' : `/#${it.key}`}
      target={it.external ? '_blank' : undefined}
      rel={it.external ? 'noopener noreferrer' : undefined}
      aria-current={it.key === activeId ? 'true' : undefined}
      aria-label={it.key === 'home' ? 'Back to top' : it.label}
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
      {:else}
        <span data-num class="overflow-hidden font-mono text-[0.85em]" style="color: var(--yorha-text-muted);">{it.num}</span>
        <span data-label-wrap class="overflow-hidden"><span data-label>{it.label}</span></span>
      {/if}
    </a>
  {/each}
</nav>
