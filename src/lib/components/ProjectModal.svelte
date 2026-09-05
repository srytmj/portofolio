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
      const q = gsap.utils.selector(panel);
      gsap
        .timeline({ defaults: { ease: ease.out } })
        .from(backdrop, { autoAlpha: 0, duration: dur.sm, ease: ease.ui })
        .from(panel, { autoAlpha: 0, y: 26, scale: 0.99, duration: dur.md }, '-=0.24')
        .from(
          q('[data-m]'),
          { y: 18, autoAlpha: 0, duration: dur.md, stagger: stagger.base },
          '-=0.4'
        );
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
  class="fixed inset-0 z-[999] overscroll-contain bg-black/92 p-0 backdrop-blur-md sm:p-6 lg:p-10"
  onclick={close}
  role="presentation"
>
  <div
    bind:this={panel}
    class="relative flex h-full w-full flex-col overflow-y-auto border-white/10 bg-[#0a0a0a] font-serif outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none sm:rounded-xl sm:border lg:grid lg:grid-cols-[minmax(18rem,28%)_1fr] lg:overflow-hidden"
    onclick={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
    aria-labelledby="pm-title"
    tabindex="-1"
    data-lenis-prevent
  >
    <button
      class="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/40 text-white/70 outline-none transition-colors hover:border-white/40 hover:text-white focus:outline-none focus-visible:outline-none"
      onclick={close}
      aria-label="Close"
    >
      <svg
        viewBox="0 0 24 24"
        class="h-4 w-4"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>

    <!-- LEFT — index, title, spec sheet -->
    <aside
      class="flex flex-col gap-6 border-b border-white/10 px-7 py-10 sm:px-10 lg:h-full lg:overflow-y-auto lg:border-b-0 lg:border-r lg:py-14"
      data-lenis-prevent
    >
      <p data-m class="font-sans text-label uppercase tracking-[0.32em] text-ash-2">
        Project
      </p>
      <p
        data-m
        class="font-sans font-[900] tracking-[-0.02em] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.32)] text-display"
      >
        {num}
      </p>
      <h2
        id="pm-title"
        data-m
        class="text-h2 font-semibold tracking-tight text-white"
      >
        {project.title}
      </h2>

      <dl data-m class="flex flex-col gap-2 font-sans text-label text-white/70">
        <div class="flex items-baseline gap-3">
          <dt class="tracking-[0.18em] text-ash-2">YEAR</dt>
          <span class="h-px flex-1 translate-y-[-2px] border-b border-dotted border-white/25"></span>
          <dd class="m-0">{project.year}</dd>
        </div>
        <div class="flex items-baseline gap-3">
          <dt class="tracking-[0.18em] text-ash-2">TYPE</dt>
          <span class="h-px flex-1 translate-y-[-2px] border-b border-dotted border-white/25"></span>
          <dd class="m-0">{project.kind}</dd>
        </div>
      </dl>

      {#if project.stack?.length}
        <div data-m class="font-sans text-label leading-[1.9] text-white/65">
          <span class="mb-1 block tracking-[0.18em] text-ash-2">STACK</span>
          {#each project.stack as s}
            <span class="block">{s}</span>
          {/each}
        </div>
      {/if}

      <span
        class="mt-auto hidden font-sans text-label tracking-[0.28em] text-ash-1 lg:block"
        aria-hidden="true">✕ · ESC</span
      >
    </aside>

    <!-- RIGHT — the narrative -->
    <div
      class="flex flex-col gap-8 py-10 px-7 sm:px-10 lg:h-full lg:overflow-y-auto lg:py-14 lg:px-14"
      data-lenis-prevent
    >
      <p
        data-m
        class="w-full text-lead italic text-white/95 leading-relaxed"
      >
        {lead}
      </p>

      {#if images[0]}
        <div data-m class="w-full shrink-0 overflow-hidden rounded-md border border-white/10 bg-black/60">
          <img
            src={images[0]}
            alt={`${project.title}, 1`}
            loading="lazy"
            class="block h-auto w-full object-contain"
          />
        </div>
      {/if}

      {#each rest as para}
        <p data-m class="w-full text-body text-white/80 leading-relaxed">
          {para}
        </p>
      {/each}

      {#each images.slice(1) as img, i}
        <div data-m class="w-full shrink-0 overflow-hidden rounded-md border border-white/10 bg-black/60">
          <img
            src={img}
            alt={`${project.title}, ${i + 2}`}
            loading="lazy"
            class="block h-auto w-full object-contain"
          />
        </div>
      {/each}

      {#if project.links?.length}
        <div data-m class="flex flex-col pt-2">
          {#each project.links as link}
            <a
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              class="flex items-center justify-between border-b border-white/10 py-3 font-sans text-lead font-medium text-white/90 transition-colors hover:text-white"
            >
              {link.label}<span aria-hidden="true">→</span>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
