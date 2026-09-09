<script>
  import { onMount, tick } from 'svelte';
  import { gsap } from 'gsap';
  import ProjectModal from '$lib/components/ProjectModal.svelte';
  import LeftEdgeReturn from '$lib/components/LeftEdgeReturn.svelte';

  let { data } = $props();

  let searchQuery = $state('');
  let selectedKind = $state('all');
  let open = $state(null);
  let hasMounted = $state(false);
  let cardsGridEl = $state(null);

  onMount(() => {
    window.scrollTo(0, 0);
    window.__lenis?.scrollTo(0, { immediate: true });
    hasMounted = true;
  });

  // Explicit handler to animate cards synchronously when category filter is clicked
  async function setKind(kind) {
    if (selectedKind === kind) return;
    selectedKind = kind;
    await tick();
    if (cardsGridEl) {
      const cards = cardsGridEl.querySelectorAll('[data-card-anim]');
      if (cards.length) {
        gsap.killTweensOf(cards);
        gsap.fromTo(
          cards,
          { y: 4, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.16,
            ease: 'power2.out',
            clearProps: 'transform,opacity'
          }
        );
      }
    }
  }

  let prevSearch = $state('');
  // Re-animate cards only when search query actually changes
  $effect(() => {
    const q = searchQuery;
    if (!hasMounted || typeof document === 'undefined') return;

    if (q !== prevSearch) {
      prevSearch = q;
      tick().then(() => {
        if (cardsGridEl) {
          const cards = cardsGridEl.querySelectorAll('[data-card-anim]');
          if (!cards.length) return;
          gsap.killTweensOf(cards);
          gsap.fromTo(
            cards,
            { y: 4, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.16,
              ease: 'power2.out',
              clearProps: 'transform,opacity'
            }
          );
        }
      });
    }
  });

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
  <!-- Tactical Return Trigger on Left Edge Hover -->
  <LeftEdgeReturn />

  <!-- Header -->
  <header class="mb-12 max-w-[var(--measure)] space-y-3">
    <div class="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]" style="color: var(--yorha-text-muted);">
      <a href="/" class="hover:underline transition-colors" style="color: var(--yorha-text-muted);">Home</a>
      <span>/</span>
      <span style="color: var(--yorha-text-primary);">Projects</span>
    </div>

    <h1 class="text-h1 font-display tracking-tight" style="color: var(--yorha-text-primary);">
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
        class="w-full rounded-none border px-4 py-3 font-mono text-xs outline-none transition-colors"
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

    <!-- Category Filters (Tactical Brackets & Block Invert) -->
    <div class="flex flex-wrap items-center gap-1.5 pt-1 font-mono text-[10px] uppercase tracking-wider">
      <span class="mr-1 select-none flex items-center gap-1.5" style="color: var(--yorha-text-muted);">
        <span class="inline-block h-1.5 w-1.5" style="background-color: var(--yorha-accent);"></span>
        FILTER:
      </span>
      {#each allKinds as kind}
        {@const active = selectedKind === kind}
        <button
          type="button"
          onclick={() => setKind(kind)}
          class="group relative px-2.5 py-1 transition-all duration-150 border cursor-pointer rounded-none {active
            ? 'font-medium'
            : 'hover:opacity-80'}"
          style={active
            ? 'background-color: var(--yorha-invert-bg); color: var(--yorha-invert-text); border-color: var(--yorha-invert-bg);'
            : 'background-color: var(--yorha-surface); color: var(--yorha-text-muted); border-color: var(--yorha-border);'}
        >
          <span class="relative z-10">{kind}</span>
          {#if active}
            <span class="pointer-events-none absolute -top-px -left-px h-1.5 w-1.5 border-l border-t" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
            <span class="pointer-events-none absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <!-- Projects Grid -->
  <div bind:this={cardsGridEl} class="grid gap-6 sm:grid-cols-2 max-w-5xl">
    {#if filteredProjects.length === 0}
      <div class="col-span-full py-16 text-center font-mono text-sm border p-8 rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border); color: var(--yorha-text-muted);">
        No projects match the specified search query or category filter.
      </div>
    {:else}
      {#each filteredProjects as p, i (p.slug)}
        <div
          data-card-anim
          class="group relative flex flex-col justify-between gap-6 rounded-none border p-7 sm:p-8 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          style="background-color: var(--yorha-surface); border-color: var(--yorha-border);"
        >
          <!-- Tactical Reticle Brackets on Hover -->
          <span class="pointer-events-none absolute -top-px -left-px h-2 w-2 border-l-2 border-t-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
          <span class="pointer-events-none absolute -top-px -right-px h-2 w-2 border-r-2 border-t-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
          <span class="pointer-events-none absolute -bottom-px -left-px h-2 w-2 border-b-2 border-l-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
          <span class="pointer-events-none absolute -bottom-px -right-px h-2 w-2 border-b-2 border-r-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>

          <span
            class="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
            style="background-color: var(--yorha-accent);"
            aria-hidden="true"
          ></span>

          <div>
            <div class="flex items-start justify-between gap-4">
              <a href={`/projects/${p.slug}`} class="block group/title">
                <h2 class="text-h3 font-semibold tracking-tight transition-colors duration-200" style="color: var(--yorha-text-primary);">
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
                  onclick={() => (open = i)}
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
{#if open !== null}
  <ProjectModal
    project={filteredProjects[open]}
    index={open}
    onClose={() => (open = null)}
  />
{/if}

<style>
  :global([data-card-anim]) {
    background-color: var(--yorha-surface) !important;
    border-color: var(--yorha-border) !important;
  }
</style>
