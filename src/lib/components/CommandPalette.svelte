<script>
  import { tick, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { page } from '$app/state';
  import { portal } from '$lib/actions/portal.js';
  import { contact, projects } from '$lib/content/site.js';
  import { trivia } from '$lib/palette/trivia.js';

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let show = $state(false);
  let query = $state('');
  let sel = $state(0);
  let closing = false;

  /** @type {HTMLElement | null} */ let backdrop = $state(null);
  /** @type {HTMLElement | null} */ let panel = $state(null);
  /** @type {HTMLInputElement | null} */ let input = $state(null);
  /** @type {HTMLElement | null} */ let listEl = $state(null);
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
    for (const n of nav)
      list.push({
        section: 'Navigate',
        label: n.label,
        hint: `Jump to ${n.label.toLowerCase()}`,
        run: () => goSection(n.id)
      });

    list.push({
      section: 'Pages',
      label: 'Projects Archive',
      hint: 'Explore all 6 architectures and shipped systems',
      run: () => {
        close();
        window.location.href = '/projects';
      }
    });

    list.push({
      section: 'Pages',
      label: 'Blog / Engineering Journal',
      hint: 'Technical notes on cloud, homelab & systems',
      run: () => {
        close();
        window.location.href = '/blog';
      }
    });

    for (const p of projects) {
      list.push({
        section: 'Projects',
        label: p.title,
        hint: `${p.kind} (${p.year}) — ${p.stack.slice(0, 3).join(', ')}`,
        run: () => {
          close();
          window.location.href = `/projects/${p.slug}`;
        }
      });
    }
    for (const l of contact.links)
      list.push({
        section: 'Links',
        label: l.label,
        hint: l.href.replace(/^mailto:/, '').replace(/^https?:\/\//, ''),
        run: () => {
          close();
          if (l.href.startsWith('/')) {
            window.location.href = l.href;
          } else {
            openExternal(l.href);
          }
        }
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

  let typedPlaceholder = $state('');
  let typeInterval;

  function openPalette() {
    if (show) return;
    query = '';
    sel = 0;
    closing = false;
    restoreFocus = document.activeElement;
    show = true;

    // Typewriter effect
    typedPlaceholder = '';
    clearInterval(typeInterval);
    const targetText = 'AWAITING_COMMAND_INPUT_';
    let i = 0;
    typeInterval = setInterval(() => {
      typedPlaceholder += targetText.charAt(i);
      i++;
      if (i >= targetText.length) clearInterval(typeInterval);
    }, 25);

    tick().then(() => {
      input?.focus();
    });
  }

  function close() {
    if (!show || closing) return;
    closing = true;
    clearInterval(typeInterval);
    /** @type {HTMLElement} */ (restoreFocus)?.focus?.();
    show = false;
  }

  // /blog and /projects have their own local search input bound to Ctrl+K;
  // the global palette stays out of the way on those routes.
  function scopedElsewhere() {
    const path = page.url.pathname;
    return path.startsWith('/blog') || path.startsWith('/projects');
  }

  function onKey(e) {
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      if (scopedElsewhere()) return;
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
    use:portal
    transition:fade={{ duration: 150 }}
    class="fixed inset-0 z-[1000] flex items-start justify-center px-4 pt-[14vh] backdrop-blur-md"
    style="background-color: var(--yorha-backdrop);"
    onclick={close}
    role="presentation"
  >
    <div
      class="animate-crt-on relative flex max-h-[62vh] w-full max-w-lg flex-col overflow-hidden rounded-none border font-sans"
      style="background-color: var(--yorha-surface); border-color: var(--yorha-border); color: var(--yorha-text-primary);"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      tabindex="-1"
    >
      <span class="pointer-events-none absolute top-[-1px] left-[-1px] h-3 w-3 border-l-2 border-t-2 z-30" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
      <span class="pointer-events-none absolute top-[-1px] right-[-1px] h-3 w-3 border-r-2 border-t-2 z-30" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
      <span class="pointer-events-none absolute bottom-[-2px] left-[-1px] h-3 w-3 border-b-2 border-l-2 z-30" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
      <span class="pointer-events-none absolute bottom-[-2px] right-[-1px] h-3 w-3 border-b-2 border-r-2 z-30" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>

      <div data-m class="flex items-center gap-3 border-b px-4" style="border-color: var(--yorha-border); background-color: var(--yorha-bg);">
        <span class="font-mono text-xs font-bold" style="color: var(--yorha-accent);" aria-hidden="true">&gt;_</span>
        <input
          bind:this={input}
          bind:value={query}
          oninput={() => (sel = 0)}
          type="text"
          placeholder={typedPlaceholder}
          class="w-full rounded-none bg-transparent py-3.5 font-mono text-xs uppercase placeholder:normal-case focus:outline-none placeholder:opacity-50"
          style="color: var(--yorha-text-primary);"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </div>

      <div
        bind:this={listEl}
        class="min-h-0 flex-1 overflow-y-auto py-2"
        data-lenis-prevent
      >
        {#if filtered.length === 0}
          <p class="px-4 py-6 text-center text-xs" style="color: var(--yorha-text-muted);">
            Nothing matches “{query}”.
          </p>
        {/if}
        {#each sections as [label, items] (label)}
          <p
            data-m
            class="px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.22em]"
            style="color: var(--yorha-text-muted);"
          >
            {label}
          </p>
          {#each items as e (e.section + e.label)}
            {@const isSelected = e.i === sel}
            <button
              data-m
              data-sel={isSelected}
              disabled={e.disabled}
              onclick={() => e.run?.()}
              onpointermove={() => (sel = e.i)}
              class="flex w-full items-center gap-3 px-4 py-2 text-left transition-colors duration-150 rounded-none disabled:opacity-35 cursor-pointer"
              style={isSelected
                ? 'background-color: var(--yorha-invert-bg); color: var(--yorha-invert-text);'
                : 'color: var(--yorha-text-primary);'}
            >
              <span class="shrink-0 text-sm font-medium" style={isSelected ? 'color: var(--yorha-invert-text);' : 'color: var(--yorha-text-primary);'}>{e.label}</span>
              <span class="truncate text-xs" style={isSelected ? 'color: var(--yorha-invert-text); opacity: 0.7;' : 'color: var(--yorha-text-muted);'}>{e.hint}</span>
              {#if isSelected && !e.disabled}
                <span class="ml-auto shrink-0 text-xs font-bold" aria-hidden="true" style="color: var(--yorha-invert-text);"
                  >↵</span
                >
              {/if}
            </button>
          {/each}
        {/each}
      </div>

      <div
        data-m
        class="flex items-center justify-between border-t px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest"
        style="border-color: var(--yorha-border); color: var(--yorha-text-muted);"
      >
        <span>↑↓ move · ↵ open · esc close</span>
        <span style="color: var(--yorha-accent);">⌘K</span>
      </div>
    </div>
  </div>
{/if}
