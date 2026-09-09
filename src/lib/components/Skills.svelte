<script>
  import { tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import Section from './Section.svelte';
  import { stack, headings } from '$lib/content/site.js';

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const categories = [
    { id: 'ALL', label: 'ALL CAPABILITIES', count: 18 },
    { id: 'cloud', label: '01 // CLOUD & AUTOMATION', count: 5 },
    { id: 'systems', label: '02 // SYSTEMS & VIRT', count: 4 },
    { id: 'networking', label: '03 // NETWORKING', count: 4 },
    { id: 'application', label: '04 // APP RUNTIME', count: 5 }
  ];

  let selectedCat = $state('ALL');
  let activeId = $state('INF-01');
  let cardsContainerEl = $state(null);
  let inspectorEl = $state(null);

  const allTools = $derived(stack.flatMap((l) => l.items));

  const filteredLayers = $derived(
    selectedCat === 'ALL'
      ? stack
      : stack.filter((l) => l.layer.toLowerCase().includes(selectedCat.toLowerCase()))
  );

  const activeTech = $derived(
    allTools.find((t) => t.id === activeId) || allTools[0]
  );

  async function setSkillCategory(catId) {
    if (selectedCat === catId) return;
    selectedCat = catId;
    await tick();

    // Immediately recalculate ScrollTrigger coordinates and Lenis scroll limits
    if (typeof window !== 'undefined') {
      window.__lenis?.resize();
      ScrollTrigger.refresh();
    }

    if (cardsContainerEl && !reduce) {
      const layerHeaders = cardsContainerEl.querySelectorAll('[data-skill-layer]');
      const cards = cardsContainerEl.querySelectorAll('[data-skill-card]');
      if (layerHeaders.length) {
        gsap.killTweensOf(layerHeaders);
        gsap.fromTo(
          layerHeaders,
          { opacity: 0, y: -4 },
          { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out', clearProps: 'transform,opacity' }
        );
      }
      if (cards.length) {
        gsap.killTweensOf(cards);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 6 },
          {
            opacity: 1,
            y: 0,
            duration: 0.18,
            ease: 'power2.out',
            clearProps: 'transform,opacity'
          }
        );
      }
    }

    // Refresh once more after card transitions settle
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.__lenis?.resize();
        ScrollTrigger.refresh();
      }
    }, 220);
  }

  async function selectTech(id) {
    if (activeId === id) return;
    activeId = id;
    await tick();
    if (inspectorEl && !reduce) {
      const body = inspectorEl.querySelector('[data-inspector-body]');
      if (body) {
        gsap.killTweensOf(body);
        gsap.fromTo(
          body,
          { opacity: 0, y: 4 },
          { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out', clearProps: 'transform,opacity' }
        );
      }
    }
  }
</script>

<Section id="skills" title={headings.skills}>
  <div class="relative flex flex-col gap-8">
    
    <!-- Tactical Filter Controls -->
    <div data-anim class="flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider border-b border-current/10 pb-4">
      <span class="mr-2 opacity-50 select-none flex items-center gap-1.5">
        <span class="inline-block h-1.5 w-1.5" style="background-color: var(--yorha-accent);"></span>
        FILTER_NODE:
      </span>
      {#each categories as cat}
        {@const active = selectedCat === cat.id}
        <button
          type="button"
          onclick={() => setSkillCategory(cat.id)}
          class="group relative px-2.5 py-1 transition-all duration-150 border cursor-pointer hover:-translate-y-0.5 active:translate-y-0 {active
            ? 'border-current bg-[var(--yorha-invert-bg)] text-[var(--yorha-invert-text)] font-semibold'
            : 'border-current/15 opacity-70 hover:opacity-100 hover:border-current/40'}"
          style={active ? '' : 'background-color: var(--yorha-surface);'}
        >
          <span class="relative z-10">{cat.label}</span>
          {#if active}
            <span class="pointer-events-none absolute -top-px -left-px h-1.5 w-1.5 border-l border-t border-current" aria-hidden="true"></span>
            <span class="pointer-events-none absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r border-current" aria-hidden="true"></span>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Main Grid: Left Matrix (Col 1-7) & Right Pod Inspector (Col 8-12) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      
      <!-- Left Column: Tactical Skill Cards by Layer -->
      <div bind:this={cardsContainerEl} class="lg:col-span-7 flex flex-col gap-6" role="presentation">
        {#each filteredLayers as layer (layer.layer)}
          <div data-anim class="flex flex-col gap-2.5">
            <!-- Domain Layer Header -->
            <div data-skill-layer class="flex items-center justify-between border-b border-current/10 pb-1.5 font-mono text-[10px] tracking-[0.2em] uppercase opacity-60">
              <div class="flex items-center gap-2">
                <span style="color: var(--yorha-accent);">SEC // {layer.code || '00'}</span>
                <span class="font-medium opacity-90">{layer.layer}</span>
              </div>
              <span class="opacity-40">{layer.items.length} UNITS</span>
            </div>

            <!-- Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {#each layer.items as it (it.id)}
                {@const isCurrent = it.id === activeTech.id}
                <button
                  data-skill-card
                  type="button"
                  onclick={() => selectTech(it.id)}
                  onpointerenter={() => selectTech(it.id)}
                  onfocus={() => selectTech(it.id)}
                  aria-pressed={isCurrent}
                  class="group relative text-left p-3 border transition-all duration-150 flex flex-col justify-between gap-2.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 {isCurrent
                    ? 'border-current/80 shadow-sm'
                    : 'border-current/15 opacity-85 hover:opacity-100 hover:border-current/40'}"
                  style="background-color: {isCurrent ? 'var(--yorha-surface-elevated)' : 'var(--yorha-surface)'};"
                >
                  <!-- Tactical Reticle Brackets on Active/Hover -->
                  {#if isCurrent}
                    <span class="pointer-events-none absolute -top-px -left-px h-2 w-2 border-l-2 border-t-2" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
                    <span class="pointer-events-none absolute -top-px -right-px h-2 w-2 border-r-2 border-t-2" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
                    <span class="pointer-events-none absolute -bottom-px -left-px h-2 w-2 border-b-2 border-l-2" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
                    <span class="pointer-events-none absolute -bottom-px -right-px h-2 w-2 border-b-2 border-r-2" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
                  {/if}

                  <!-- Card Header: ID & Badge -->
                  <div class="flex items-center justify-between font-mono text-[10px]">
                    <span class="tracking-widest" style="color: {isCurrent ? 'var(--yorha-accent)' : 'inherit'}; opacity: {isCurrent ? 1 : 0.6};">
                      {it.id}
                    </span>
                    <span
                      class="px-1.5 py-0.2 border text-[9px] uppercase tracking-wider transition-colors duration-150"
                      style="border-color: {isCurrent ? 'var(--yorha-accent-border)' : 'currentColor'}; color: {isCurrent ? 'var(--yorha-accent)' : 'inherit'}; background-color: {isCurrent ? 'var(--yorha-accent-subtle)' : 'transparent'}; opacity: {isCurrent ? 1 : 0.6};"
                    >
                      {it.badge}
                    </span>
                  </div>

                  <!-- Card Body: Name -->
                  <div>
                    <h3 class="font-mono text-sm tracking-tight font-medium transition-colors duration-150">
                      {it.name}
                    </h3>
                    <p class="mt-1 text-[11px] leading-relaxed opacity-60 line-clamp-1">
                      {it.detail}
                    </p>
                  </div>

                  <!-- Card Footer: Telemetry Readiness Bar -->
                  <div class="pt-1.5 border-t border-current/10 flex items-center justify-between font-mono text-[10px]">
                    <span class="opacity-50 text-[9px]">READINESS</span>
                    <div class="flex items-center gap-1.5">
                      <div class="h-1 w-12 bg-current/15 overflow-hidden">
                        <div
                          class="h-full transition-all duration-500 ease-out"
                          style="width: {it.readiness}%; background-color: {isCurrent ? 'var(--yorha-accent)' : 'currentColor'}; opacity: {isCurrent ? 1 : 0.4};"
                        ></div>
                      </div>
                      <span class="text-[9px]" style="color: {isCurrent ? 'var(--yorha-accent)' : 'inherit'}; opacity: {isCurrent ? 1 : 0.6};">{it.readiness}%</span>
                    </div>
                  </div>
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <!-- Right Column: Tactical Diagnostic HUD Monitor -->
      <div data-anim class="lg:col-span-5 lg:sticky lg:top-24">
        <div bind:this={inspectorEl} class="border border-current/20 p-5 font-mono text-xs flex flex-col gap-4 relative shadow-sm" style="background-color: var(--yorha-surface-elevated);">
          
          <!-- Tactical Pod Frame Markings -->
          <span class="pointer-events-none absolute -top-px -left-px h-2.5 w-2.5 border-l-2 border-t-2 border-current" aria-hidden="true"></span>
          <span class="pointer-events-none absolute -top-px -right-px h-2.5 w-2.5 border-r-2 border-t-2 border-current" aria-hidden="true"></span>
          <span class="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b-2 border-l-2 border-current" aria-hidden="true"></span>
          <span class="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 border-current" aria-hidden="true"></span>

          <!-- Top Status Bar -->
          <div class="flex items-center justify-between border-b border-current/10 pb-3">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full animate-pulse" style="background-color: var(--yorha-accent);"></span>
              <span class="font-bold tracking-wider text-[11px]">POD_042 // SPEC_DIAGNOSTICS</span>
            </div>
            <span
              class="text-[10px] px-1.5 py-0.5 border"
              style="color: var(--yorha-accent); border-color: var(--yorha-accent-border); background-color: var(--yorha-accent-subtle);"
            >
              TELEMETRY: ONLINE
            </span>
          </div>

          <!-- Target Identification -->
          {#key activeTech.id}
            <div data-inspector-body in:fade={{ duration: reduce ? 0 : 180 }} class="flex flex-col gap-3">
              <div class="flex items-baseline justify-between gap-2 border-b border-current/10 pb-2">
                <div>
                  <span class="text-[9px] opacity-50 block tracking-widest uppercase">ACTIVE TARGET SPEC</span>
                  <h4 class="text-base sm:text-lg font-semibold tracking-tight flex items-center gap-2">
                    <span>{activeTech.name}</span>
                    <span class="text-xs font-normal" style="color: var(--yorha-accent);">[{activeTech.id}]</span>
                  </h4>
                </div>
                <div class="text-right">
                  <span class="text-[9px] opacity-50 block tracking-widest uppercase">CLASSIFICATION</span>
                  <span class="text-[11px] uppercase opacity-90">{activeTech.badge}</span>
                </div>
              </div>

              <!-- Readiness Index Bar -->
              <div class="flex flex-col gap-1">
                <div class="flex justify-between text-[10px] opacity-70">
                  <span>PRODUCTION READINESS</span>
                  <span class="font-medium" style="color: var(--yorha-accent);">{activeTech.readiness}% // VERIFIED</span>
                </div>
                <div class="h-1.5 w-full bg-current/10 overflow-hidden">
                  <div
                    class="h-full transition-all duration-300"
                    style="width: {activeTech.readiness}%; background-color: var(--yorha-accent);"
                  ></div>
                </div>
              </div>

              <!-- Architectural Role -->
              <div class="flex flex-col gap-1 border-t border-current/10 pt-2.5">
                <span class="text-[10px] opacity-60 uppercase tracking-wider flex items-center gap-1.5">
                  <span class="opacity-40">›</span> ARCHITECTURAL ROLE
                </span>
                <p class="text-[11px] opacity-90 leading-relaxed pl-2.5 border-l" style="border-color: var(--yorha-accent-border);">
                  {activeTech.role}
                </p>
              </div>

              <!-- Deployment Environment -->
              <div class="flex flex-col gap-1 border-t border-current/10 pt-2.5">
                <span class="text-[10px] opacity-60 uppercase tracking-wider flex items-center gap-1.5">
                  <span class="opacity-40">›</span> PRODUCTION DEPLOYMENT
                </span>
                <p class="text-[11px] opacity-70 leading-relaxed pl-2.5">
                  {activeTech.deployedAt}
                </p>
              </div>

              <!-- CLI Console Command Telemetry -->
              <div class="flex flex-col gap-1 border-t border-current/10 pt-2.5">
                <div class="flex items-center justify-between text-[10px] opacity-60">
                  <span class="uppercase tracking-wider flex items-center gap-1.5">
                    <span class="opacity-40">›</span> OPERATIONAL TELEMETRY
                  </span>
                  <span class="text-[9px] opacity-40">TTY_01</span>
                </div>
                <div class="mt-1 border border-current/15 bg-current/[0.04] p-2.5 text-[10px] font-mono leading-relaxed opacity-90 overflow-x-auto whitespace-pre-wrap select-all">
                  <span style="color: var(--yorha-accent);">{activeTech.command}</span>
                </div>
              </div>
            </div>
          {/key}

          <!-- Pod Bottom Diagnostics Status -->
          <div class="border-t border-current/10 pt-3 flex flex-wrap items-center justify-between gap-2 text-[9px] opacity-50">
            <span>SYS_LATENCY: 0.2ms</span>
            <span>MEM_FOOTPRINT: MINIMAL</span>
            <span class="opacity-80">NODE_VERIFIED: YES</span>
          </div>

        </div>
      </div>

    </div>

  </div>
</Section>
