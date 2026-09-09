<script>
  import { fade, fly } from 'svelte/transition';
  import { portal } from '$lib/actions/portal.js';
  import Section from './Section.svelte';
  import { stack, headings } from '$lib/content/site.js';

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let activeId = $state(null);
  let cardsContainerEl = $state(null);
  let inspectorEl = $state(null);
  let showMobileInspector = $state(false);

  const allTools = $derived(stack.flatMap((l) => l.items));

  const activeTech = $derived(
    activeId ? allTools.find((t) => t.id === activeId) || null : null
  );

  let leaveTimer = null;

  function handleTechEnter(id) {
    if (leaveTimer) {
      clearTimeout(leaveTimer);
      leaveTimer = null;
    }
    activeId = id;
  }

  function handleTechLeave() {
    if (leaveTimer) clearTimeout(leaveTimer);
    leaveTimer = setTimeout(() => {
      activeId = null;
    }, 120);
  }

  function selectTech(id, openMobile = false) {
    if (leaveTimer) {
      clearTimeout(leaveTimer);
      leaveTimer = null;
    }
    activeId = id;
    if (openMobile && typeof window !== 'undefined' && window.innerWidth < 768) {
      showMobileInspector = true;
    }
  }
</script>

<Section id="skills" title={headings.skills}>
  <div class="relative flex flex-col gap-8">
    
    <!-- Main Grid: Left Matrix (Col 1-7 on md+) & Right Pod Inspector (Col 8-12 on md+) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
      
      <!-- Left Column: Tactical Skill Cards by Layer -->
      <div
        bind:this={cardsContainerEl}
        onpointerleave={handleTechLeave}
        class="md:col-span-7 flex flex-col gap-5 sm:gap-6"
        role="presentation"
      >
        {#each stack as layer (layer.layer)}
          <div data-anim data-skill-layer class="flex flex-col gap-2.5">
            <!-- Domain Layer Header -->
            <div class="w-full flex items-center justify-between border-b border-current/10 pb-2 font-mono text-[11px] tracking-[0.2em] uppercase opacity-75 group text-left">
              <div class="flex items-center gap-2">
                <span style="color: var(--yorha-accent);">SEC // {layer.code || '00'}</span>
                <span class="font-medium opacity-90">{layer.layer}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="opacity-50">{layer.items.length} UNITS</span>
              </div>
            </div>

            <!-- Chips Matrix of Layer Contents -->
            <div class="py-1 flex flex-wrap gap-2 font-mono">
              {#each layer.items as it (it.id)}
                {@const isCurrent = it.id === activeTech?.id}
                <button
                  type="button"
                  onclick={() => selectTech(it.id, true)}
                  onpointerenter={() => handleTechEnter(it.id)}
                  onpointerleave={handleTechLeave}
                  class="group relative inline-flex items-center gap-2 px-3 py-1.5 border transition-colors duration-150 cursor-pointer text-xs {isCurrent
                    ? 'border-current font-semibold shadow-xs'
                    : 'border-current/20 opacity-80 hover:opacity-100 hover:border-current/50'}"
                  style="background-color: {isCurrent ? 'var(--yorha-surface-elevated)' : 'var(--yorha-surface)'};"
                >
                  <span class="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                    {#if isCurrent}
                      <span class="h-1.5 w-1.5 rounded-full" style="background-color: var(--yorha-accent);"></span>
                    {:else}
                      <span class="text-[11px] opacity-40 leading-none">›</span>
                    {/if}
                  </span>
                  <span class="truncate" style="color: {isCurrent ? 'var(--yorha-accent)' : 'inherit'};">{it.name}</span>
                  <span class="px-1.5 py-0.5 border text-[9px] uppercase tracking-wider opacity-60" style="border-color: currentColor;">{it.badge}</span>
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <!-- Right Column: Tactical Diagnostic HUD Monitor (Desktop & Tablet) -->
      <div data-anim class="hidden md:block md:col-span-5 md:sticky md:top-24">
        <div
          bind:this={inspectorEl}
          class="border border-current/20 p-5 font-mono text-xs flex flex-col justify-between gap-4 relative shadow-sm min-h-[460px]"
          style="background-color: var(--yorha-surface-elevated);"
        >
          <!-- Tactical Pod Frame Markings -->
          <span class="pointer-events-none absolute -top-px -left-px h-2.5 w-2.5 border-l-2 border-t-2 border-current" aria-hidden="true"></span>
          <span class="pointer-events-none absolute -top-px -right-px h-2.5 w-2.5 border-r-2 border-t-2 border-current" aria-hidden="true"></span>
          <span class="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b-2 border-l-2 border-current" aria-hidden="true"></span>
          <span class="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 border-current" aria-hidden="true"></span>

          <!-- Top Status Bar -->
          <div class="flex items-center justify-between border-b border-current/10 pb-3">
            <div class="flex items-center gap-2">
              <span
                class="h-2 w-2 rounded-full {activeTech ? 'animate-pulse' : 'opacity-40'}"
                style="background-color: {activeTech ? 'var(--yorha-accent)' : 'var(--yorha-text-muted)'};"
              ></span>
              <span class="font-bold tracking-wider text-[11px]">POD_042 // SPEC_DIAGNOSTICS</span>
            </div>
            <span
              class="text-[10px] px-1.5 py-0.5 border"
              style="color: {activeTech ? 'var(--yorha-accent)' : 'var(--yorha-text-muted)'}; border-color: {activeTech ? 'var(--yorha-accent-border)' : 'var(--yorha-border)'}; background-color: {activeTech ? 'var(--yorha-accent-subtle)' : 'transparent'};"
            >
              {activeTech ? 'TELEMETRY: ONLINE' : 'STATUS: STANDBY'}
            </span>
          </div>

          {#if activeTech}
            <!-- Target Identification -->
            {#key activeTech.id}
              <div data-inspector-body in:fade={{ duration: reduce ? 0 : 150 }} class="flex flex-col gap-3 flex-1">
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
          {:else}
            <!-- Standby State (When mouse is not hovering any skill) -->
            <div in:fade={{ duration: reduce ? 0 : 150 }} class="flex flex-col items-center justify-center flex-1 py-12 px-4 text-center gap-3 border border-dashed border-current/15 my-1">
              <div class="h-10 w-10 border border-current/25 flex items-center justify-center font-mono text-sm opacity-60">
                <span class="animate-pulse" style="color: var(--yorha-accent);">✦</span>
              </div>
              <div class="space-y-1.5">
                <p class="text-[11px] font-semibold tracking-widest uppercase opacity-85">
                  [ POD_042 // STANDBY ]
                </p>
                <p class="text-[10.5px] opacity-50 max-w-[26ch] leading-relaxed mx-auto">
                  Hover over a capability node to inspect architecture specifications and telemetry.
                </p>
              </div>
            </div>
          {/if}

          <!-- Pod Bottom Diagnostics Status -->
          <div class="border-t border-current/10 pt-3 flex flex-wrap items-center justify-between gap-2 text-[9px] opacity-50">
            <span>{activeTech ? 'SYS_LATENCY: 0.2ms' : 'RADAR: SCANNING'}</span>
            <span>{activeTech ? 'MEM_FOOTPRINT: MINIMAL' : `NODES: ${allTools.length} READY`}</span>
            <span class="opacity-80">{activeTech ? 'NODE_VERIFIED: YES' : 'TARGET: NONE'}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Mobile Sticky Pod Mini Bar (< md) -->
    {#if activeTech}
      <div class="md:hidden sticky bottom-4 z-30 pt-1">
        <button
          type="button"
          onclick={() => (showMobileInspector = true)}
          class="w-full flex items-center justify-between px-3.5 py-2.5 border font-mono text-xs shadow-lg backdrop-blur-md transition-all cursor-pointer yorha-invert-hover"
          style="background-color: var(--yorha-surface-elevated); border-color: var(--yorha-border); color: var(--yorha-text-primary);"
        >
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full animate-pulse" style="background-color: var(--yorha-accent);"></span>
            <span class="font-semibold tracking-wider">{activeTech.name}</span>
            <span class="text-[10px]" style="color: var(--yorha-accent);">{activeTech.readiness}%</span>
          </div>
          <span class="text-[10px] tracking-wider uppercase border px-1.5 py-0.5" style="border-color: var(--yorha-border);">[ SPECS ↗ ]</span>
        </button>
      </div>
    {/if}

  </div>
</Section>

<!-- Mobile Tactical Pod 042 Inspector Bottom Sheet Drawer -->
{#if showMobileInspector && (activeTech || allTools[0])}
  {@const modalTech = activeTech || allTools[0]}
  <div
    use:portal
    transition:fade={{ duration: 150 }}
    class="fixed inset-0 z-[998] flex flex-col justify-end bg-black/80 backdrop-blur-sm md:hidden p-0"
    onclick={() => (showMobileInspector = false)}
    role="presentation"
  >
    <div
      transition:fly={{ y: 200, duration: 200 }}
      class="relative w-full max-h-[85vh] overflow-y-auto border-t p-5 font-mono text-xs flex flex-col gap-4 shadow-2xl rounded-none"
      style="background-color: var(--yorha-surface-elevated); border-color: var(--yorha-border); color: var(--yorha-text-primary);"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      data-lenis-prevent
    >
      <!-- Tactical Corner Brackets -->
      <span class="pointer-events-none absolute -top-px -left-px h-2.5 w-2.5 border-l-2 border-t-2" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
      <span class="pointer-events-none absolute -top-px -right-px h-2.5 w-2.5 border-r-2 border-t-2" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>

      <!-- Top Status Bar with Close Button -->
      <div class="flex items-center justify-between border-b pb-3" style="border-color: var(--yorha-border);">
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full animate-pulse" style="background-color: var(--yorha-accent);"></span>
          <span class="font-bold tracking-wider text-[11px]">POD_042 // SPEC_DIAGNOSTICS</span>
        </div>
        <button
          type="button"
          onclick={() => (showMobileInspector = false)}
          class="border px-2 py-1 text-[10px] font-mono tracking-wider uppercase transition-colors yorha-invert-hover cursor-pointer"
          style="border-color: var(--yorha-border); background-color: var(--yorha-surface); color: var(--yorha-text-primary);"
        >
          [ ✕ CLOSE ]
        </button>
      </div>

      <!-- Target Spec Content -->
      <div class="flex flex-col gap-3">
        <div class="flex items-baseline justify-between gap-2 border-b pb-2" style="border-color: var(--yorha-border);">
          <div>
            <span class="text-[9px] opacity-50 block tracking-widest uppercase">ACTIVE TARGET SPEC</span>
            <h4 class="text-lg font-semibold tracking-tight flex items-center gap-2">
              <span>{modalTech.name}</span>
              <span class="text-xs font-normal" style="color: var(--yorha-accent);">[{modalTech.id}]</span>
            </h4>
          </div>
          <div class="text-right">
            <span class="text-[9px] opacity-50 block tracking-widest uppercase">CLASSIFICATION</span>
            <span class="text-[11px] uppercase opacity-90">{modalTech.badge}</span>
          </div>
        </div>

        <!-- Readiness Index Bar -->
        <div class="flex flex-col gap-1">
          <div class="flex justify-between text-[10px] opacity-70">
            <span>PRODUCTION READINESS</span>
            <span class="font-medium" style="color: var(--yorha-accent);">{modalTech.readiness}% // VERIFIED</span>
          </div>
          <div class="h-1.5 w-full bg-current/10 overflow-hidden">
            <div
              class="h-full transition-all duration-300"
              style="width: {modalTech.readiness}%; background-color: var(--yorha-accent);"
            ></div>
          </div>
        </div>

        <!-- Architectural Role -->
        <div class="flex flex-col gap-1 border-t pt-2.5" style="border-color: var(--yorha-border);">
          <span class="text-[10px] opacity-60 uppercase tracking-wider flex items-center gap-1.5">
            <span class="opacity-40">›</span> ARCHITECTURAL ROLE
          </span>
          <p class="text-[11px] opacity-90 leading-relaxed pl-2.5 border-l" style="border-color: var(--yorha-accent-border);">
            {modalTech.role}
          </p>
        </div>

        <!-- Deployment Environment -->
        <div class="flex flex-col gap-1 border-t pt-2.5" style="border-color: var(--yorha-border);">
          <span class="text-[10px] opacity-60 uppercase tracking-wider flex items-center gap-1.5">
            <span class="opacity-40">›</span> PRODUCTION DEPLOYMENT
          </span>
          <p class="text-[11px] opacity-70 leading-relaxed pl-2.5">
            {modalTech.deployedAt}
          </p>
        </div>

        <!-- CLI Console Command Telemetry -->
        <div class="flex flex-col gap-1 border-t pt-2.5" style="border-color: var(--yorha-border);">
          <div class="flex items-center justify-between text-[10px] opacity-60">
            <span class="uppercase tracking-wider flex items-center gap-1.5">
              <span class="opacity-40">›</span> OPERATIONAL TELEMETRY
            </span>
            <span class="text-[9px] opacity-40">TTY_01</span>
          </div>
          <div class="mt-1 border p-2.5 text-[10px] font-mono leading-relaxed opacity-90 overflow-x-auto whitespace-pre-wrap select-all" style="background-color: var(--yorha-bg); border-color: var(--yorha-border);">
            <span style="color: var(--yorha-accent);">{modalTech.command}</span>
          </div>
        </div>

        <button
          type="button"
          onclick={() => (showMobileInspector = false)}
          class="w-full mt-2 py-2.5 border font-mono text-center text-xs tracking-wider uppercase transition-colors yorha-invert-hover cursor-pointer"
          style="border-color: var(--yorha-border); background-color: var(--yorha-surface); color: var(--yorha-text-primary);"
        >
          [ RETURN TO GRID ]
        </button>
      </div>
    </div>
  </div>
{/if}
