<script>
  import Section from './Section.svelte';
  import ProjectModal from './ProjectModal.svelte';
  import { cardHover } from '$lib/scroll/sectionAnim.js';
  import { projects, headings } from '$lib/content/site.js';

  /** @type {number | null} */
  let open = $state(null);

  // Page scroll lock lives here (not in the modal) so it always releases.
  $effect(() => {
    if (typeof document === 'undefined') return;
    if (open !== null) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      window.__lenis?.stop();
      return () => {
        document.body.style.overflow = prev;
        window.__lenis?.start();
      };
    }
  });
</script>

<Section id="portfolio" title={headings.portfolio}>
  <div class="grid gap-6 sm:grid-cols-2">
    {#each projects as p, i}
      <button
        data-anim
        type="button"
        use:cardHover
        onclick={() => (open = i)}
        class="group relative flex flex-col justify-between gap-8 overflow-hidden rounded-lg border border-white/10 bg-ink-1 p-8 text-left transition-colors hover:border-white/40 sm:p-10"
      >
        <span
          class="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-white/50 transition-transform duration-500 group-hover:scale-x-100"
          aria-hidden="true"
        ></span>
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-h3 font-semibold tracking-tight">{p.title}</h3>
            <p class="mt-1 text-label uppercase tracking-[0.25em] text-ash-2">
              {p.kind} · {p.year}
            </p>
          </div>
          <span
            class="text-ash-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden="true">↗</span
          >
        </div>
        <p class="max-w-[var(--measure)] text-body text-white/70">{p.summary}</p>
        <ul class="flex flex-wrap gap-2">
          {#each p.stack as s}
            <li class="rounded-full border border-white/10 px-3 py-1 text-caption text-ash-3">
              {s}
            </li>
          {/each}
        </ul>
        <span class="sr-only">View details</span>
      </button>
    {/each}
  </div>
</Section>

{#if open !== null}
  <ProjectModal project={projects[open]} index={open} onClose={() => (open = null)} />
{/if}
