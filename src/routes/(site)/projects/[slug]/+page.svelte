<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { gsap } from 'gsap';
  import { ease, dur } from '$lib/motion.js';
  import LeftEdgeReturn from '$lib/components/LeftEdgeReturn.svelte';

  let { data } = $props();
  const project = $derived(data.project);
  const prevProject = $derived(data.prevProject);
  const nextProject = $derived(data.nextProject);

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      goto('/projects');
    }
  }

  onMount(() => {
    // No layout animations needed
  });
</script>

<svelte:window onkeydown={handleKeyDown} />

<svelte:head>
  <title>{project.title} — Architecture & Case Study — Suryatmaja</title>
  <meta name="description" content={project.summary} />
  <meta property="og:title" content={`${project.title} — Suryatmaja`} />
  <meta property="og:description" content={project.summary} />
</svelte:head>

<div class="w-full min-h-screen yorha-tech-bg">
<section class="wrap pt-32 pb-24 min-h-screen" style="color: var(--yorha-text-primary);">
  <!-- Tactical Return Trigger on Left Edge Hover -->
  <LeftEdgeReturn />

  <!-- Top Navigation Bar: Breadcrumbs (Left) & All Projects Shortcut (Right) -->
  <div class="flex items-center justify-between gap-4 mb-8 max-w-5xl">
    <nav aria-label="Breadcrumbs" class="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] min-w-0">
      <a href="/" class="hover:underline transition-colors shrink-0" style="color: var(--yorha-text-muted);">Home</a>
      <span class="shrink-0" style="color: var(--yorha-text-muted);">/</span>
      <a href="/projects" class="hover:underline transition-colors shrink-0" style="color: var(--yorha-text-muted);">Projects</a>
      <span class="shrink-0" style="color: var(--yorha-text-muted);">/</span>
      <span class="truncate" style="color: var(--yorha-text-primary);">{project.title}</span>
    </nav>

    <a
      href="/projects"
      class="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs border rounded-none transition-all duration-150 hover:-translate-y-0.5 yorha-invert-hover cursor-pointer shrink-0"
      style="background-color: var(--yorha-surface); border-color: var(--yorha-border); color: var(--yorha-text-primary);"
      title="Return to all projects (Press ESC)"
    >
      <span>← [ ALL PROJECTS ]</span>
      <kbd class="px-1.5 py-0.5 text-[9px] font-mono border rounded-none opacity-80" style="border-color: var(--yorha-border); background-color: var(--yorha-bg); color: var(--yorha-text-muted);">ESC</kbd>
    </a>
  </div>

  <!-- Header -->
  <header data-project-anim class="mb-12 space-y-4 max-w-4xl">
    <div class="flex flex-wrap items-center gap-3 font-mono text-xs">
      <span
        class="px-2 py-0.5 text-[10px] uppercase tracking-widest font-medium rounded-none border"
        style="border-color: var(--yorha-accent-border); background-color: var(--yorha-accent-subtle); color: var(--yorha-accent);"
      >
        {project.kind}
      </span>
      <span class="uppercase tracking-widest" style="color: var(--yorha-text-muted);">{project.year}</span>
    </div>

    <h1 class="text-h1 font-display tracking-normal leading-[1.15] sm:leading-[1.18] pt-1 pb-1" style="color: var(--yorha-text-primary);">
      {project.title}
    </h1>

    <p class="text-lead leading-relaxed max-w-[var(--measure)]" style="color: var(--yorha-text-muted);">
      {project.summary}
    </p>
  </header>

  <!-- Technical Spec Grid -->
  <div class="grid gap-12 lg:grid-cols-[280px_1fr] max-w-5xl border-t pt-10" style="border-color: var(--yorha-border);">
    <!-- Sidebar: Technical Specs & Links -->
    <aside data-project-anim class="space-y-6 font-mono text-xs">
      <div>
        <span class="text-[10px] uppercase tracking-[0.2em] block mb-1.5" style="color: var(--yorha-text-muted);">Category</span>
        <span style="color: var(--yorha-text-primary);">{project.kind} System</span>
      </div>

      <div>
        <span class="text-[10px] uppercase tracking-[0.2em] block mb-1.5" style="color: var(--yorha-text-muted);">Timeline</span>
        <span style="color: var(--yorha-text-primary);">{project.year}</span>
      </div>

      <div>
        <span class="text-[10px] uppercase tracking-[0.2em] block mb-2" style="color: var(--yorha-text-muted);">Technologies</span>
        <div class="flex flex-wrap gap-1.5">
          {#each project.stack as tech}
            <span
              class="rounded-none border px-2 py-1 text-[11px]"
              style="background-color: var(--yorha-surface); border-color: var(--yorha-border); color: var(--yorha-text-muted);"
            >
              {tech}
            </span>
          {/each}
        </div>
      </div>

      {#if project.links && project.links.length > 0}
        <div class="border-t pt-5" style="border-color: var(--yorha-border);">
          <span class="text-[10px] uppercase tracking-[0.2em] block mb-2" style="color: var(--yorha-text-muted);">External Links</span>
          <div class="flex flex-col gap-2">
            {#each project.links as link}
              <a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                class="inline-flex items-center justify-between border px-3 py-2 transition-colors rounded-none yorha-invert-hover"
                style="background-color: var(--yorha-surface); border-color: var(--yorha-border); color: var(--yorha-text-primary);"
              >
                <span>[ {link.label.toUpperCase()} ]</span>
                <span style="color: var(--yorha-accent);">↗</span>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </aside>

    <!-- Main Content: Architecture Breakdown & Gallery -->
    <div data-project-anim class="space-y-10">
      <!-- Detail Paragraphs -->
      <div class="space-y-4">
        <h2 class="font-mono text-xs uppercase tracking-[0.2em] mb-3" style="color: var(--yorha-accent);">
          Architecture & Engineering Notes
        </h2>
        {#each project.detail as para}
          <p class="text-body leading-relaxed" style="color: var(--yorha-text-muted);">
            {para}
          </p>
        {/each}
      </div>

      <!-- Gallery Images / Illustrations if available -->
      {#if project.images && project.images.length > 0}
        <div class="space-y-4 border-t pt-8" style="border-color: var(--yorha-border);">
          <h2 class="font-mono text-xs uppercase tracking-[0.2em]" style="color: var(--yorha-accent);">
            System Diagrams & Artifacts
          </h2>
          <div class="grid gap-4 sm:grid-cols-2">
            {#each project.images as img, i}
              <div class="overflow-hidden rounded-none border p-2" style="background-color: var(--yorha-surface); border-color: var(--yorha-border);">
                <img
                  src={img}
                  alt={`${project.title} diagram ${i + 1}`}
                  loading="lazy"
                  class="w-full object-cover rounded-none"
                />
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Bottom Pager -->
      <nav class="border-t pt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs" style="border-color: var(--yorha-border); color: var(--yorha-text-muted);">
        {#if prevProject}
          <a href={`/projects/${prevProject.slug}`} class="hover:underline transition-colors" style="color: var(--yorha-text-primary);">
            ← {prevProject.title}
          </a>
        {:else}
          <a href="/projects" class="hover:underline transition-colors" style="color: var(--yorha-text-primary);">
            ← All Projects
          </a>
        {/if}

        <a
          href="/projects"
          class="inline-flex items-center gap-1.5 px-3 py-1 border rounded-none transition-all duration-150 hover:-translate-y-0.5 yorha-invert-hover cursor-pointer order-last sm:order-none"
          style="background-color: var(--yorha-surface); border-color: var(--yorha-border); color: var(--yorha-text-primary);"
        >
          <span>[ ALL PROJECTS ARCHIVE ]</span>
        </a>

        {#if nextProject}
          <a href={`/projects/${nextProject.slug}`} class="hover:underline transition-colors" style="color: var(--yorha-text-primary);">
            {nextProject.title} →
          </a>
        {:else}
          <a href="/projects" class="hover:underline transition-colors" style="color: var(--yorha-text-primary);">
            Back to Archive ↑
          </a>
        {/if}
      </nav>
    </div>
  </div>
</section>
</div>
