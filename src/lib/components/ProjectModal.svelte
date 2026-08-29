<script>
  import { onMount, tick } from 'svelte';
  import { gsap } from 'gsap';
  import { portal } from '$lib/actions/portal.js';

  /** @type {{ project: any, onClose: () => void }} */
  let { project, onClose } = $props();

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const images = project.images ?? [];
  let active = $state(0);

  /** @type {HTMLElement} */ let backdrop;
  /** @type {HTMLElement} */ let panel;
  let restoreFocus;
  let closing = false;

  function close() {
    if (closing) return;
    closing = true;
    if (reduce) return onClose();
    gsap.to(panel, { y: 20, scale: 0.96, autoAlpha: 0, duration: 0.18, ease: 'power2.in' });
    gsap.to(backdrop, { autoAlpha: 0, duration: 0.22, ease: 'power1.in', onComplete: onClose });
    setTimeout(onClose, 320); // safety net if a frame never lands
  }

  function key(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowRight' && images.length > 1) {
      active = (active + 1) % images.length;
    } else if (e.key === 'ArrowLeft' && images.length > 1) {
      active = (active - 1 + images.length) % images.length;
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
      const q = gsap.utils.selector(panel);
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(backdrop, { autoAlpha: 0, duration: 0.28 })
        .from(panel, { y: 34, scale: 0.93, autoAlpha: 0, duration: 0.44 }, '-=0.12')
        .from(
          q('[data-m]'),
          { y: 22, autoAlpha: 0, duration: 0.42, stagger: 0.07 },
          '-=0.24'
        );
    }

    tick().then(() => panel?.querySelector('button')?.focus());
    return () => {
      /** @type {HTMLElement} */ (restoreFocus)?.focus?.();
    };
  });
</script>

<svelte:window onkeydown={key} />

<!-- Backdrop (portalled to <body> so it clears the fixed header + stacking contexts) -->
<div
  bind:this={backdrop}
  use:portal
  class="fixed inset-0 z-[999] flex items-center justify-center overscroll-contain bg-black/75 p-3 backdrop-blur-md sm:p-6"
  onclick={close}
  role="presentation"
>
  <!-- Panel -->
  <div
    bind:this={panel}
    class="relative flex max-h-[calc(100svh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/12 bg-ink-1 shadow-2xl shadow-black/60 sm:max-h-[calc(100svh-3rem)] sm:max-w-2xl"
    onclick={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
    aria-labelledby="pm-title"
  >
    <button
      class="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/40 text-lg text-white/70 transition-colors hover:border-white/40 hover:text-white"
      onclick={close}
      aria-label="Close"
    >
      ✕
    </button>

    <!-- Gallery -->
    {#if images.length}
      <div data-m class="shrink-0 overflow-hidden border-b border-white/10 bg-black">
        <div class="aspect-[16/9] w-full">
          {#key active}
            <img
              src={images[active]}
              alt={`${project.title}, image ${active + 1}`}
              class="h-full w-full object-cover"
              loading="lazy"
            />
          {/key}
        </div>
        {#if images.length > 1}
          <div class="flex gap-2 p-3">
            {#each images as img, i}
              <button
                class="h-14 w-20 shrink-0 overflow-hidden rounded-md border transition-opacity {i ===
                active
                  ? 'border-white/70'
                  : 'border-white/10 opacity-50 hover:opacity-90'}"
                onclick={() => (active = i)}
                aria-label={`Show image ${i + 1}`}
              >
                <img src={img} alt="" class="h-full w-full object-cover" />
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    <!-- Body -->
    <div class="min-h-0 flex-1 space-y-6 overflow-y-auto p-6 sm:p-8" data-lenis-prevent>
      <div data-m>
        <p class="text-xs uppercase tracking-[0.25em] text-ash-2">
          {project.kind} · {project.year}
        </p>
        <h3 id="pm-title" class="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
          {project.title}
        </h3>
      </div>

      <div data-m class="space-y-4">
        {#each project.detail ?? [project.summary] as para}
          <p class="text-sm leading-relaxed text-white/75">{para}</p>
        {/each}
      </div>

      {#if project.stack?.length}
        <ul data-m class="flex flex-wrap gap-2">
          {#each project.stack as s}
            <li class="rounded-full border border-white/10 px-3 py-1 text-xs text-ash-3">
              {s}
            </li>
          {/each}
        </ul>
      {/if}

      {#if project.links?.length}
        <div data-m class="flex flex-wrap gap-3 pt-2">
          {#each project.links as link}
            <a
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              class="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white/85 transition-colors hover:border-white hover:text-white"
            >
              {link.label}<span aria-hidden="true">→</span>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
