<script>
  import { goto } from '$app/navigation';
  import Section from './Section.svelte';
  import ProjectModal from './ProjectModal.svelte';
  import CurrentlyBuilding from './CurrentlyBuilding.svelte';
  import { projects, headings } from '$lib/content/site.js';

  /** @type {number | null} */
  let open = $state(null);
  let isNavigating = $state(false);

  async function handleExploreClick(e) {
    e.preventDefault();
    if (isNavigating) return;
    isNavigating = true;
    try {
      await goto('/projects');
    } finally {
      isNavigating = false;
    }
  }

  // Stop Lenis page scroll when modal is open without altering body overflow or scrollbar gutter
  $effect(() => {
    if (typeof window === 'undefined') return;
    if (open !== null) {
      window.__lenis?.stop();
      return () => {
        window.__lenis?.start();
      };
    }
  });
</script>

<Section id="portfolio" title={headings.portfolio}>
  <!-- Currently Building Spotlight -->
  <div data-anim class="mb-10">
    <CurrentlyBuilding />
  </div>

  <div class="grid gap-6 sm:grid-cols-2">
    {#each projects.slice(0, 4) as p, i}
      <button
        data-anim
        type="button"
        onclick={() => (open = i)}
        class="group relative flex flex-col justify-between gap-6 sm:gap-8 rounded-none border border-current/15 p-6 text-left outline-none ring-0 transition-all duration-150 hover:border-current/50 hover:bg-current/[0.03] hover:-translate-y-0.5 focus:outline-none focus:ring-0 focus-visible:outline-none sm:p-10 cursor-pointer"
        style="background-color: var(--yorha-surface);"
      >
        <!-- Tactical Reticle Brackets on Hover -->
        <span class="pointer-events-none absolute -top-px -left-px h-2 w-2 border-l-2 border-t-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
        <span class="pointer-events-none absolute -top-px -right-px h-2 w-2 border-r-2 border-t-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
        <span class="pointer-events-none absolute -bottom-px -left-px h-2 w-2 border-b-2 border-l-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
        <span class="pointer-events-none absolute -bottom-px -right-px h-2 w-2 border-b-2 border-r-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>

        <span
          class="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"
          style="background-color: var(--yorha-accent);"
          aria-hidden="true"
        ></span>
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-h3 font-semibold tracking-tight transition-colors duration-150 group-hover:opacity-90">{p.title}</h3>
            <p class="mt-1 font-mono text-label uppercase tracking-[0.22em] opacity-60">
              [ {p.kind} · {p.year} ]
            </p>
          </div>
          <span
            class="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style="color: var(--yorha-accent);"
            aria-hidden="true">↗</span
          >
        </div>
        <p class="max-w-[var(--measure)] text-body opacity-75">{p.summary}</p>
        <ul class="flex flex-wrap gap-2">
          {#each p.stack as s}
            <li class="rounded-none border border-current/10 bg-current/[0.02] px-2.5 py-1 font-mono text-[10px] opacity-70 transition-colors duration-150 group-hover:border-current/30 group-hover:opacity-100">
              {s}
            </li>
          {/each}
        </ul>
        <span class="sr-only">View details</span>
      </button>
    {/each}
  </div>

  <!-- Shortcut / CTA to dedicated /projects archive -->
  <div data-anim class="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-current/10 pt-6">
    <span class="font-mono text-[11px] opacity-60 uppercase tracking-widest">
      Selected {Math.min(4, projects.length)} of {projects.length} systems
    </span>
    <a
      href="/projects"
      onclick={handleExploreClick}
      class="group yorha-invert-hover inline-flex items-center gap-2.5 border border-current/20 bg-current/5 px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider transition-all duration-150 cursor-pointer"
      class:opacity-75={isNavigating}
    >
      <span class="text-[9px]" style="color: var(--yorha-accent);">■</span>
      <span>{isNavigating ? 'Navigating to Archive...' : 'Explore All Projects Archive'}</span>
      <span class="transition-transform duration-150 group-hover:translate-x-1" class:translate-x-1={isNavigating}>→</span>
    </a>
  </div>
</Section>

{#if open !== null}
  <ProjectModal project={projects[open]} index={open} onClose={() => (open = null)} />
{/if}
