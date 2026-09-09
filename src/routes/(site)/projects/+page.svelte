<script>
  import { onMount, tick } from 'svelte';
  import { gsap } from 'gsap';
  import ProjectModal from '$lib/components/ProjectModal.svelte';
  import { sectionAnim } from '$lib/scroll/sectionAnim.js';

  let { data } = $props();

  let searchQuery = $state('');
  let selectedKind = $state('all');
  let openProject = $state(null);
  let openIndex = $state(0);

  const ITEMS_PER_PAGE = 6;
  let currentPage = $state(1);

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  onMount(() => {
    window.scrollTo(0, 0);
    window.__lenis?.scrollTo(0, { immediate: true });
    
    // Initial animation
    if (!reduce) {
      gsap.fromTo(
        '[data-project-card]',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', clearProps: 'transform,opacity' }
      );
    }
  });

  // Explicit handler when category filter is clicked
  function setKind(kind) {
    if (selectedKind === kind) return;
    selectedKind = kind;
    currentPage = 1;
    animateGrid();
  }

  $effect(() => {
    // When search query changes, reset page and trigger animation
    searchQuery;
    currentPage = 1;
    animateGrid();
  });

  async function animateGrid() {
    if (reduce) return;
    await tick();
    requestAnimationFrame(() => {
      gsap.killTweensOf('[data-project-card]');
      gsap.fromTo(
        '[data-project-card]',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.04, ease: 'power2.out', clearProps: 'transform,opacity' }
      );
    });
  }

  function goToPage(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    currentPage = page;
    animateGrid();
    if (typeof window !== 'undefined') {
      const gridElem = document.getElementById('projects-grid');
      if (gridElem) {
        const y = gridElem.getBoundingClientRect().top + window.scrollY - 120;
        if (window.__lenis) {
          window.__lenis.scrollTo(y);
        } else {
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }
  }

  // Extract all unique project kinds/categories
  const allKinds = $derived.by(() => {
    const set = new Set();
    for (const p of data.projects) {
      if (p.kind) set.add(p.kind);
    }
    return ['all', ...Array.from(set).sort()];
  });

  // Filter projects based on query and kind
  const filteredProjects = $derived.by(() => {
    const q = searchQuery.toLowerCase().trim();
    return data.projects.filter((p) => {
      const matchKind = selectedKind === 'all' || p.kind === selectedKind;
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        (p.stack && p.stack.some((s) => s.toLowerCase().includes(q)));

      return matchKind && matchQuery;
    });
  });

  const totalPages = $derived(Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));
  const paginatedProjects = $derived.by(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  });
</script>

<svelte:head>
  <title>Projects & Architecture Archive — Suryatmaja</title>
  <meta
    name="description"
    content="Curated archive of production software systems, cloud architectures, homelabs, and web platforms engineered by Bakti Surya Atmaja."
  />
</svelte:head>

<div class="w-full min-h-screen yorha-tech-bg">
  <section class="wrap pt-32 pb-28 min-h-screen" style="color: var(--yorha-text-primary);">
  <!-- Header -->
  <header use:sectionAnim class="mb-12 max-w-[var(--measure)] space-y-4">
    <div class="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]" style="color: var(--yorha-text-muted);">
      <a href="/" class="hover:underline transition-colors" style="color: var(--yorha-text-muted);">Home</a>
      <span>/</span>
      <span style="color: var(--yorha-text-primary);">Projects</span>
    </div>

    <h1 class="text-h1 font-display tracking-normal leading-[1.15] sm:leading-[1.18] pt-1 pb-1" style="color: var(--yorha-text-primary);">
      Projects Archive
    </h1>
    <p class="text-body leading-relaxed" style="color: var(--yorha-text-muted);">
      A curated collection of production systems, cloud architectures, and web platforms I have engineered, complete with technical notes and case studies.
    </p>
  </header>

  <!-- Filter & Search Bar (Tactical Styling) -->
  <div class="mb-10 space-y-4 max-w-4xl">
    <div class="relative">
      <input
        type="search"
        bind:value={searchQuery}
        placeholder="Search projects, architecture, tech stack (Laravel, Docker, AWS, Go, PostgreSQL)..."
        class="w-full rounded-none border px-4 py-3 font-mono text-base sm:text-xs outline-none transition-colors"
        style="background-color: var(--yorha-surface); border-color: var(--yorha-border); color: var(--yorha-text-primary);"
      />
      {#if searchQuery}
        <button
          type="button"
          onclick={() => (searchQuery = '')}
          class="absolute right-3.5 top-3 text-[11px] font-mono cursor-pointer transition-colors"
          style="color: var(--yorha-text-muted);"
        >
          [ CLEAR ]
        </button>
      {/if}
    </div>

    <!-- Category Filters (Tactical Brackets & Animated Hover) -->
    <div class="flex items-center gap-2 py-1.5 font-mono text-[10px] uppercase tracking-wider overflow-x-auto sm:overflow-visible sm:flex-wrap no-scrollbar">
      <span class="mr-1 select-none shrink-0 inline-flex items-center gap-1.5 leading-none self-center" style="color: var(--yorha-text-muted);">
        <span class="w-1.5 h-1.5 shrink-0 block -translate-y-[0.5px]" style="background-color: var(--yorha-accent);"></span>
        <span class="leading-none">FILTER:</span>
      </span>
      {#each allKinds as kind}
        {@const active = selectedKind === kind}
        <button
          type="button"
          onclick={() => setKind(kind)}
          class="group relative shrink-0 px-3 py-1.5 transition-all duration-200 border cursor-pointer rounded-none select-none hover:-translate-y-0.5 active:translate-y-0 {active
            ? 'font-medium shadow-sm'
            : 'hover:border-current/60 hover:text-[var(--yorha-text-primary)]'}"
          style={active
            ? 'background-color: var(--yorha-invert-bg); color: var(--yorha-invert-text); border-color: var(--yorha-invert-bg);'
            : 'background-color: var(--yorha-surface); color: var(--yorha-text-muted); border-color: var(--yorha-border);'}
        >
          <!-- Tactical Corner Reticle on Hover / Active -->
          <span class="pointer-events-none absolute -top-px -left-px h-1.5 w-1.5 border-l border-t transition-opacity duration-150 {active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
          <span class="pointer-events-none absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r transition-opacity duration-150 {active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>

          <span class="relative z-10 flex items-center gap-1.5">
            {#if active}
              <span class="inline-block w-1 h-1 rounded-full animate-pulse" style="background-color: var(--yorha-accent);"></span>
            {/if}
            {kind}
          </span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Projects Grid -->
  <div id="projects-grid" class="space-y-8 max-w-5xl">
    <div class="grid gap-6 sm:grid-cols-2">
      {#if paginatedProjects.length === 0}
        <div class="col-span-full py-16 text-center font-mono text-sm border p-8 rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border); color: var(--yorha-text-muted);">
          No projects match the specified search query or category filter.
        </div>
      {:else}
        {#each paginatedProjects as p, i (p.slug)}
          <div
            data-project-card
            class="group relative flex flex-col justify-between gap-6 rounded-none border border-transparent hover:border-current/40 hover:bg-current/[0.02] p-5 sm:p-7 sm:p-8 transition-all duration-150 hover:-translate-y-0.5 cursor-pointer"
            style="background-color: var(--yorha-surface);"
          >
          <!-- Tactical Corner Reticle Brackets (SVG for perfect pixel alignment) -->
          <svg class="pointer-events-none absolute -top-px -left-px w-2 h-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100" style="color: var(--yorha-accent);" viewBox="0 0 8 8" fill="none">
            <path d="M0 8V0H8" stroke="currentColor" stroke-width="2" />
          </svg>
          <svg class="pointer-events-none absolute -top-px -right-px w-2 h-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100" style="color: var(--yorha-accent);" viewBox="0 0 8 8" fill="none">
            <path d="M0 0H8V8" stroke="currentColor" stroke-width="2" />
          </svg>
          <svg class="pointer-events-none absolute -bottom-px -left-px w-2 h-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100" style="color: var(--yorha-accent);" viewBox="0 0 8 8" fill="none">
            <path d="M0 0V8H8" stroke="currentColor" stroke-width="2" />
          </svg>
          <svg class="pointer-events-none absolute -bottom-px -right-px w-2 h-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100" style="color: var(--yorha-accent);" viewBox="0 0 8 8" fill="none">
            <path d="M8 0V8H0" stroke="currentColor" stroke-width="2" />
          </svg>

          <span
            class="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
            style="background-color: var(--yorha-accent);"
            aria-hidden="true"
          ></span>

          <div>
            <div class="flex items-start justify-between gap-4">
              <a href={`/projects/${p.slug}`} class="block group/title">
                <h2
                  data-card-title
                  class="text-h3 font-semibold tracking-tight transition-colors duration-200"
                  style="color: var(--yorha-text-primary);"
                >
                  {p.title}
                </h2>
                <p class="mt-1 font-mono text-label uppercase tracking-[0.22em]" style="color: var(--yorha-text-muted);">
                  [ {p.kind} · {p.year} ]
                </p>
              </a>
            </div>

            <p class="mt-4 text-caption leading-relaxed" style="color: var(--yorha-text-muted);">
              {p.summary}
            </p>
          </div>

          <div class="space-y-4">
            <!-- Tech Stack Pills (Uniformity with Portfolio) -->
            <ul class="flex flex-wrap gap-1.5">
              {#each p.stack as s}
                <li class="rounded-none border px-2.5 py-1 font-mono text-[10px] transition-colors duration-200" style="background-color: var(--yorha-bg); border-color: var(--yorha-border); color: var(--yorha-text-muted);">
                  {s}
                </li>
              {/each}
            </ul>

            <!-- Links & Action Toolbar -->
            <div class="flex items-center justify-between border-t pt-4 font-mono text-[11px]" style="border-color: var(--yorha-border);">
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  onclick={() => {
                    openProject = p;
                    openIndex = (currentPage - 1) * ITEMS_PER_PAGE + i;
                  }}
                  class="inline-flex items-center gap-1.5 transition-colors cursor-pointer group/btn yorha-invert-hover px-2 py-0.5 border"
                  style="border-color: var(--yorha-border); color: var(--yorha-text-primary); background-color: var(--yorha-bg);"
                >
                  <span>Quick Specs</span>
                  <span class="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">↗</span>
                </button>
                <span style="color: var(--yorha-border);">·</span>
                <a
                  href={`/projects/${p.slug}`}
                  class="transition-colors hover:underline"
                  style="color: var(--yorha-accent);"
                >
                  Deep Dive →
                </a>
              </div>

              {#if p.links && p.links.length > 0}
                <div class="flex items-center gap-3">
                  {#each p.links as link}
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      class="underline underline-offset-2 transition-colors hover:opacity-80"
                      style="color: var(--yorha-text-muted);"
                    >
                      {link.label}
                    </a>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Pagination Bar (When items > 6) -->
  {#if totalPages > 1}
    <div class="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs" style="border-color: var(--yorha-border);">
      <div class="text-[11px] uppercase tracking-wider" style="color: var(--yorha-text-muted);">
        <span>RECORDS: </span>
        <span style="color: var(--yorha-text-primary);">
          {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)}
        </span>
        <span> OF {filteredProjects.length}</span>
        <span class="mx-2 opacity-40">|</span>
        <span>PAGE </span>
        <span style="color: var(--yorha-accent);">{currentPage}</span>
        <span> OF {totalPages}</span>
      </div>

      <div class="flex items-center gap-1.5">
        <!-- Previous Page Button -->
        <button
          type="button"
          onclick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          class="px-3 py-1.5 border rounded-none uppercase tracking-wider transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:-translate-y-0.5"
          style="background-color: var(--yorha-surface); border-color: var(--yorha-border); color: var(--yorha-text-primary);"
          aria-label="Previous Page"
        >
          ← PREV
        </button>

        <!-- Page Number Chips -->
        {#each Array.from({ length: totalPages }, (_, idx) => idx + 1) as pageNum}
          {@const isCurrent = currentPage === pageNum}
          <button
            type="button"
            onclick={() => goToPage(pageNum)}
            class="relative px-3 py-1.5 border rounded-none transition-all duration-150 cursor-pointer hover:-translate-y-0.5 {isCurrent
              ? 'font-bold'
              : 'hover:border-current/60'}"
            style={isCurrent
              ? 'background-color: var(--yorha-invert-bg); color: var(--yorha-invert-text); border-color: var(--yorha-invert-bg);'
              : 'background-color: var(--yorha-surface); color: var(--yorha-text-muted); border-color: var(--yorha-border);'}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {#if isCurrent}
              <span class="pointer-events-none absolute -top-px -left-px h-1 w-1 border-l border-t" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
              <span class="pointer-events-none absolute -bottom-px -right-px h-1 w-1 border-b border-r" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
            {/if}
            {String(pageNum).padStart(2, '0')}
          </button>
        {/each}

        <!-- Next Page Button -->
        <button
          type="button"
          onclick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          class="px-3 py-1.5 border rounded-none uppercase tracking-wider transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:-translate-y-0.5"
          style="background-color: var(--yorha-surface); border-color: var(--yorha-border); color: var(--yorha-text-primary);"
          aria-label="Next Page"
        >
          NEXT →
        </button>
      </div>
    </div>
  {/if}
  </div>

  <!-- Footer Navigation -->
  <footer class="mt-16 pt-8 border-t max-w-5xl flex items-center justify-between font-mono text-xs" style="border-color: var(--yorha-border); color: var(--yorha-text-muted);">
    <a href="/" class="hover:underline transition-colors" style="color: var(--yorha-text-muted);">
      ← Back to Home
    </a>
    <a href="/blog" class="hover:underline transition-colors" style="color: var(--yorha-accent);">
      Explore Technical Notes (Blog) →
    </a>
  </footer>
</section>
</div>

<!-- Detail Modal -->
{#if openProject !== null}
  <ProjectModal
    project={openProject}
    index={openIndex}
    onClose={() => (openProject = null)}
  />
{/if}

<style>
  [data-project-card]:hover [data-card-title],
  [data-project-card]:focus-within [data-card-title] {
    color: var(--yorha-accent) !important;
  }
</style>
