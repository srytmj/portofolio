<script>
  import { onMount, tick } from 'svelte';
  import { gsap } from 'gsap';
  import { portal } from '$lib/actions/portal.js';
  import { ease, dur, stagger } from '$lib/motion.js';

  /** @type {{ project: any, index?: number, onClose: () => void }} */
  let { project, index = 0, onClose } = $props();

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const num = String(index + 1).padStart(2, '0');
  const paras = project.detail ?? [project.summary];
  const lead = paras[0];
  const rest = paras.slice(1);
  const images = project.images ?? [];

  /** @type {HTMLElement} */ let backdrop;
  /** @type {HTMLElement} */ let panel;
  let restoreFocus;
  let closing = false;

  function close() {
    if (closing) return;
    closing = true;
    if (reduce) return onClose();
    gsap.to(panel, { autoAlpha: 0, y: 16, duration: dur.xs, ease: ease.in });
    gsap.to(backdrop, { autoAlpha: 0, duration: dur.xs, ease: ease.in, onComplete: onClose });
    setTimeout(onClose, 340); // safety net if a frame never lands
  }

  function key(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab' && panel) {
      const f = panel.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  onMount(() => {
    restoreFocus = document.activeElement;

    if (!reduce) {
      gsap.from(backdrop, { autoAlpha: 0, duration: 0.16 });
      gsap.from(panel, { autoAlpha: 0, y: 8, duration: 0.18, ease: 'power2.out', clearProps: 'transform,opacity' });
    }

    tick().then(() => panel?.querySelector('button')?.focus());
    return () => {
      /** @type {HTMLElement} */ (restoreFocus)?.focus?.();
    };
  });
</script>

<svelte:window onkeydown={key} />

<!-- Full-bleed takeover, portalled to <body>. -->
<div
  bind:this={backdrop}
  use:portal
  class="fixed inset-0 z-[999] overscroll-contain p-0 backdrop-blur-md sm:p-6 lg:p-10 flex flex-col items-center justify-center"
  style="background-color: var(--yorha-backdrop);"
  onclick={close}
  role="presentation"
>
  <div
    bind:this={panel}
    class="relative flex h-full max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden border-0 font-mono outline-none ring-0 rounded-none"
    style="background-color: var(--yorha-surface); border: none; color: var(--yorha-text-primary);"
    onclick={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
    aria-labelledby="pm-title"
    tabindex="-1"
    data-lenis-prevent
  >
    <!-- Tactical Corner Brackets -->
    <span class="pointer-events-none absolute -top-px -left-px h-3 w-3 border-l-2 border-t-2 z-30" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -top-px -right-px h-3 w-3 border-r-2 border-t-2 z-30" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 z-30" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 z-30" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>

    <!-- Tactical Top Toolbar -->
    <header class="flex items-center justify-between border-b px-4 py-3 sm:px-6 shrink-0 font-mono" style="border-color: var(--yorha-border); background-color: var(--yorha-bg);">
      <div class="flex items-center gap-2.5 text-[11px] uppercase tracking-wider">
        <span class="inline-block h-2 w-2 rounded-none animate-pulse" style="background-color: var(--yorha-accent);"></span>
        <span class="font-medium" style="color: var(--yorha-text-primary);">POD // SPEC_INSPECTOR_{num}</span>
        <span class="border px-1.5 py-0.5 text-[9px]" style="border-color: var(--yorha-border); color: var(--yorha-text-muted);">[{project.kind}]</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="hidden sm:inline font-mono text-[10px] tracking-widest" style="color: var(--yorha-text-muted);">[ ESC TO DISMISS ]</span>
        <button
          type="button"
          onclick={close}
          class="grid h-7 w-7 place-items-center border font-mono text-xs transition-colors cursor-pointer rounded-none yorha-invert-hover"
          style="border-color: var(--yorha-border); background-color: var(--yorha-surface); color: var(--yorha-text-primary);"
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>
    </header>

    <!-- Modal Content Grid -->
    <div class="flex-1 overflow-y-auto lg:grid lg:grid-cols-[minmax(18rem,28%)_1fr] lg:overflow-hidden">
      
      <!-- LEFT — index, title, spec sheet -->
      <aside
        class="flex flex-col gap-6 border-b px-7 py-8 sm:px-8 lg:h-full lg:overflow-y-auto lg:border-b-0 lg:border-r lg:py-10"
        style="background-color: var(--yorha-surface); border-color: var(--yorha-border);"
        data-lenis-prevent
      >
        <div>
          <span class="font-mono text-[10px] uppercase tracking-[0.25em] block" style="color: var(--yorha-text-muted);">
            UNIT_INDEX
          </span>
          <p class="font-mono text-4xl sm:text-5xl font-bold tracking-tight mt-1" style="color: var(--yorha-text-primary);">
            {num}
          </p>
        </div>

        <div>
          <span class="font-mono text-[10px] uppercase tracking-[0.25em] block mb-1" style="color: var(--yorha-accent);">
            SYSTEM_NAME
          </span>
          <h2
            id="pm-title"
            class="text-xl sm:text-2xl font-semibold tracking-tight font-display"
            style="color: var(--yorha-text-primary);"
          >
            {project.title}
          </h2>
        </div>

        <dl class="flex flex-col gap-2.5 font-mono text-xs border-t border-b py-4" style="border-color: var(--yorha-border); color: var(--yorha-text-muted);">
          <div class="flex items-baseline justify-between gap-3">
            <dt class="tracking-[0.18em] text-[10px] uppercase" style="color: var(--yorha-text-muted);">YEAR</dt>
            <dd class="m-0 font-medium text-[11px]" style="color: var(--yorha-text-primary);">{project.year}</dd>
          </div>
          <div class="flex items-baseline justify-between gap-3">
            <dt class="tracking-[0.18em] text-[10px] uppercase" style="color: var(--yorha-text-muted);">CLASSIFICATION</dt>
            <dd class="m-0 font-medium text-[11px]" style="color: var(--yorha-text-primary);">{project.kind}</dd>
          </div>
        </dl>

        {#if project.stack?.length}
          <div class="space-y-2">
            <span class="font-mono text-[10px] uppercase tracking-[0.2em] block" style="color: var(--yorha-text-muted);">CORE_STACK</span>
            <div class="flex flex-wrap gap-1.5">
              {#each project.stack as s}
                <span
                  class="rounded-none border px-2 py-0.5 font-mono text-[10px]"
                  style="background-color: var(--yorha-bg); border-color: var(--yorha-border); color: var(--yorha-text-muted);"
                >
                  {s}
                </span>
              {/each}
            </div>
          </div>
        {/if}

        {#if project.slug}
          <div class="pt-2">
            <a
              href={`/projects/${project.slug}`}
              class="inline-flex w-full items-center justify-center gap-2 border py-2.5 px-3 font-mono text-[11px] transition-colors uppercase tracking-wider rounded-none yorha-invert-hover"
              style="border-color: var(--yorha-border); background-color: var(--yorha-bg); color: var(--yorha-text-primary);"
            >
              <span>DEEP DIVE CASE STUDY</span>
              <span style="color: var(--yorha-accent);">→</span>
            </a>
          </div>
        {/if}
      </aside>

      <!-- RIGHT — the narrative -->
      <div
        class="flex flex-col gap-6 py-8 px-7 sm:px-10 lg:h-full lg:overflow-y-auto lg:py-10 lg:px-12"
        style="background-color: var(--yorha-surface);"
        data-lenis-prevent
      >
        <!-- Lead summary with tactical accent line -->
        <p
          class="w-full text-base sm:text-lg leading-relaxed pl-3.5 border-l-2 font-sans"
          style="border-color: var(--yorha-accent); color: var(--yorha-text-primary);"
        >
          {lead}
        </p>

        {#if images[0]}
          <div class="relative w-full shrink-0 overflow-hidden rounded-none border p-2" style="background-color: var(--yorha-bg); border-color: var(--yorha-border);">
            <img
              src={images[0]}
              alt={`${project.title}, 1`}
              loading="lazy"
              class="block h-auto w-full object-contain"
            />
          </div>
        {/if}

        {#each rest as para}
          <p class="w-full text-sm sm:text-base leading-relaxed font-sans" style="color: var(--yorha-text-muted);">
            {para}
          </p>
        {/each}

        {#each images.slice(1) as img, i}
          <div class="relative w-full shrink-0 overflow-hidden rounded-none border p-2" style="background-color: var(--yorha-bg); border-color: var(--yorha-border);">
            <img
              src={img}
              alt={`${project.title}, ${i + 2}`}
              loading="lazy"
              class="block h-auto w-full object-contain"
            />
          </div>
        {/each}

        {#if project.links?.length}
          <div class="flex flex-col gap-2 pt-4 border-t" style="border-color: var(--yorha-border);">
            <span class="font-mono text-[10px] uppercase tracking-widest mb-1" style="color: var(--yorha-accent);">SYSTEM_ENDPOINTS</span>
            {#each project.links as link}
              <a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                class="flex items-center justify-between border p-3 font-mono text-xs transition-all rounded-none yorha-invert-hover"
                style="background-color: var(--yorha-bg); border-color: var(--yorha-border); color: var(--yorha-text-primary);"
              >
                <span>[ ↗ {link.label.toUpperCase()} ]</span>
                <span aria-hidden="true" style="color: var(--yorha-accent);">→</span>
              </a>
            {/each}
          </div>
        {/if}
      </div>

    </div>
  </div>
</div>

<style>
  div[role="dialog"] {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
</style>
