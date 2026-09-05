<script>
  import { tick, onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { portal } from '$lib/actions/portal.js';
  import { ease, dur, stagger } from '$lib/motion.js';
  import { contact } from '$lib/content/site.js';
  import { trivia } from '$lib/palette/trivia.js';
  import { isOwner, unlock } from '$lib/palette/owner.js';

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let show = $state(false);
  let query = $state('');
  let sel = $state(0);
  let owner = $state(false);
  /** @type {any[] | null} */ let svcGroups = $state(null);
  let closing = false;

  /** @type {HTMLElement} */ let backdrop;
  /** @type {HTMLElement} */ let panel;
  /** @type {HTMLInputElement} */ let input;
  /** @type {HTMLElement} */ let listEl;
  let restoreFocus;

  const nav = [
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'Contact', id: 'contact' }
  ];

  function goSection(id) {
    close();
    setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    }, 60);
  }
  function openExternal(href) {
    close();
    window.open(href, '_blank', 'noopener');
  }
  function findSky(id) {
    // The hero reads ?find= once on load; a full nav re-inits it centred on
    // the figure and draws it in.
    window.location.href = `/?find=${id}`;
  }

  const entries = $derived.by(() => {
    /** @type {any[]} */ const list = [];
    if (owner) {
      // Owner mode is just the homelab: nothing else.
      for (const g of svcGroups ?? [])
        for (const s of g.items)
          list.push({
            section: g.label,
            label: s.name,
            hint: s.url ? s.url.replace(/^https?:\/\//, '') : 'no url set',
            disabled: !s.url,
            run: () => s.url && openExternal(s.url)
          });
      return list;
    }
    for (const n of nav)
      list.push({
        section: 'Navigate',
        label: n.label,
        hint: `Jump to ${n.label.toLowerCase()}`,
        run: () => goSection(n.id)
      });
    for (const l of contact.links)
      list.push({
        section: 'Links',
        label: l.label,
        hint: l.href.replace(/^mailto:/, '').replace(/^https?:\/\//, ''),
        run: () => openExternal(l.href)
      });
    for (const t of trivia)
      list.push({
        section: 'The night sky',
        label: t.name,
        hint: t.fact,
        run: () => findSky(t.id)
      });
    return list;
  });

  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        e.section.toLowerCase().includes(q) ||
        e.hint.toLowerCase().includes(q)
    );
  });

  // Filtered rows grouped by section, each row carrying its flat index for
  // keyboard selection.
  const sections = $derived.by(() => {
    /** @type {Map<string, any[]>} */ const map = new Map();
    filtered.forEach((e, i) => {
      if (!map.has(e.section)) map.set(e.section, []);
      map.get(e.section).push({ ...e, i });
    });
    return [...map.entries()];
  });

  $effect(() => {
    if (sel > filtered.length - 1) sel = Math.max(0, filtered.length - 1);
  });

  // Keep the highlighted row in view as the selection moves.
  $effect(() => {
    if (!show) return;
    sel;
    tick().then(() =>
      listEl?.querySelector('[data-sel="true"]')?.scrollIntoView({ block: 'nearest' })
    );
  });

  // Load the homelab service list only when the owner opens the palette, so it
  // stays out of the main bundle.
  $effect(() => {
    if (show && owner && !svcGroups)
      import('$lib/panel/services.js').then((m) => (svcGroups = m.groups));
  });

  function openPalette() {
    if (show) return;
    owner = isOwner();
    query = '';
    sel = 0;
    closing = false;
    restoreFocus = document.activeElement;
    show = true;
    tick().then(() => {
      input?.focus();
      if (reduce || !panel) return;
      gsap
        .timeline({ defaults: { ease: ease.out } })
        .from(backdrop, { autoAlpha: 0, duration: dur.xs })
        .from(panel, { y: -14, scale: 0.975, autoAlpha: 0, duration: dur.sm }, '-=0.08')
        .from(
          gsap.utils.toArray(panel.querySelectorAll('[data-m]')),
          { y: 8, autoAlpha: 0, duration: dur.sm, stagger: stagger.tight },
          '-=0.24'
        );
    });
  }

  function close() {
    if (!show || closing) return;
    closing = true;
    /** @type {HTMLElement} */ (restoreFocus)?.focus?.();
    if (reduce || !panel) {
      show = false;
      return;
    }
    gsap.to(panel, { y: -10, scale: 0.98, autoAlpha: 0, duration: dur.xs, ease: ease.in });
    gsap.to(backdrop, {
      autoAlpha: 0,
      duration: dur.xs,
      ease: ease.in,
      onComplete: () => (show = false)
    });
    setTimeout(() => (show = false), 260); // safety net if a frame never lands
  }

  function flashUnlock() {
    if (!input || reduce) return;
    gsap.fromTo(
      input,
      { boxShadow: '0 0 0 0 rgba(255,255,255,0)' },
      {
        boxShadow: '0 0 0 2px rgba(255,255,255,0.55)',
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut'
      }
    );
  }

  function onKey(e) {
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      show ? close() : openPalette();
      return;
    }
    if (!show) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      sel = Math.min(sel + 1, filtered.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      sel = Math.max(sel - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (unlock(query)) {
        owner = true;
        query = '';
        sel = 0;
        flashUnlock();
        return;
      }
      filtered[sel]?.run?.();
    }
  }

  onMount(() => {
    const handleOpen = () => openPalette();
    const handleToggle = () => (show ? close() : openPalette());
    window.addEventListener('open-command-palette', handleOpen);
    window.addEventListener('toggle-command-palette', handleToggle);
    return () => {
      window.removeEventListener('open-command-palette', handleOpen);
      window.removeEventListener('toggle-command-palette', handleToggle);
    };
  });
</script>

<svelte:window onkeydown={onKey} />

{#if show}
  <div
    bind:this={backdrop}
    use:portal
    class="fixed inset-0 z-[1000] flex items-start justify-center bg-black/70 px-4 pt-[14vh] backdrop-blur-md"
    onclick={close}
    role="presentation"
  >
    <div
      bind:this={panel}
      class="flex max-h-[62vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/12 bg-ink-1 font-sans shadow-2xl shadow-black/60"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      tabindex="-1"
    >
      <div data-m class="flex items-center gap-3 border-b border-white/10 px-4">
        <span class="text-ash-2" aria-hidden="true">⌕</span>
        <input
          bind:this={input}
          bind:value={query}
          oninput={() => (sel = 0)}
          type="text"
          placeholder={owner ? 'Search services and pages' : 'Search the sky and pages'}
          class="w-full rounded-md bg-transparent py-4 text-sm text-white placeholder:text-ash-2 focus:outline-none"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
        />
        {#if owner}
          <span
            class="shrink-0 rounded-full border border-white/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ash-3"
            >homelab</span
          >
        {/if}
      </div>

      <div
        bind:this={listEl}
        class="min-h-0 flex-1 overflow-y-auto py-2"
        data-lenis-prevent
      >
        {#if filtered.length === 0}
          <p class="px-4 py-6 text-center text-xs text-ash-2">
            Nothing matches “{query}”.
          </p>
        {/if}
        {#each sections as [label, items] (label)}
          <p
            data-m
            class="px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ash-1"
          >
            {label}
          </p>
          {#each items as e (e.section + e.label)}
            <button
              data-m
              data-sel={e.i === sel}
              disabled={e.disabled}
              onclick={() => e.run?.()}
              onpointermove={() => (sel = e.i)}
              class="flex w-full items-center gap-3 px-4 py-2 text-left transition-colors disabled:opacity-35 {e.i ===
              sel
                ? 'bg-white/10'
                : 'hover:bg-white/5'}"
            >
              <span class="shrink-0 text-sm text-white/90">{e.label}</span>
              <span class="truncate text-xs text-ash-2">{e.hint}</span>
              {#if e.i === sel && !e.disabled}
                <span class="ml-auto shrink-0 text-xs text-ash-3" aria-hidden="true"
                  >↵</span
                >
              {/if}
            </button>
          {/each}
        {/each}
      </div>

      <div
        data-m
        class="flex items-center justify-between border-t border-white/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-ash-1"
      >
        <span>↑↓ move · ↵ open · esc close</span>
        <span>⌘K</span>
      </div>
    </div>
  </div>
{/if}
