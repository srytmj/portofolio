<script>
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { browser } from '$app/environment';
  import { detectTier, isTouchDevice, prefersReducedMotion } from '$lib/utils/device.js';
  import { engineTrivia } from '$lib/content/site.js';

  let isOpen = $state(false);
  let tier = $state('evaluating...');
  let fps = $state('--');
  let cores = $state('--');
  let memory = $state('--');
  let connection = $state('--');
  let reducedMotion = $state(false);

  onMount(() => {
    if (!browser) return;
    tier = detectTier();
    reducedMotion = prefersReducedMotion();

    if (navigator.hardwareConcurrency) {
      cores = `${navigator.hardwareConcurrency} Cores`;
    }
    if (navigator.deviceMemory) {
      memory = `~${navigator.deviceMemory} GB`;
    }
    const conn =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn?.effectiveType) {
      connection = conn.effectiveType.toUpperCase();
    } else {
      connection = 'N/A';
    }

    // Read live canvas FPS if active
    const timer = setInterval(() => {
      const canvas = document.querySelector('canvas');
      if (canvas?.dataset?.fps) {
        fps = canvas.dataset.fps;
      }
    }, 500);

    return () => clearInterval(timer);
  });
</script>

<div class="border rounded-none transition-colors duration-300" style="background-color: var(--yorha-surface); border-color: var(--yorha-border); color: var(--yorha-text-muted);">
  <!-- Header Bar / Toggle Trigger -->
  <button
    type="button"
    onclick={() => (isOpen = !isOpen)}
    class="w-full text-left p-4 flex flex-wrap items-center justify-between gap-3 transition-colors duration-200 cursor-pointer group rounded-none"
    style="color: var(--yorha-text-primary);"
    aria-expanded={isOpen}
  >
    <div class="flex flex-wrap items-center gap-3">
      <span class="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] uppercase" style="color: var(--yorha-accent);">
        <span class="h-1.5 w-1.5 rounded-none" style="background-color: var(--yorha-accent);"></span>
        Engine Telemetry
      </span>
      <span class="font-mono text-[11px]" style="color: var(--yorha-border);">·</span>
      <span class="font-mono text-[11px]" style="color: var(--yorha-text-primary);">
        Tier <span class="uppercase font-medium" style="color: var(--yorha-accent);">{tier}</span>
      </span>
      {#if fps !== '--'}
        <span class="font-mono text-[11px]" style="color: var(--yorha-text-muted);">
          ({fps} FPS)
        </span>
      {/if}
    </div>

    <div class="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-200" style="color: var(--yorha-text-muted);">
      <span>{isOpen ? 'Close Specs' : 'Inspect Safety Nets'}</span>
      <span class="transition-transform duration-300" class:rotate-180={isOpen}>↓</span>
    </div>
  </button>

  <!-- Expandable Content: Live Specs + Architecture Trivia -->
  {#if isOpen}
    <div transition:slide={{ duration: 320, easing: cubicOut }} class="border-t p-5 space-y-6" style="border-color: var(--yorha-border); background-color: var(--yorha-bg);">
      <!-- Live Client Diagnostics -->
      <div>
        <div class="font-mono text-[10px] uppercase tracking-[0.2em] mb-3" style="color: var(--yorha-text-muted);">
          Visitor Device Profile
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-caption font-mono">
          <div class="p-2.5 border rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border);">
            <span class="block text-[10px] uppercase" style="color: var(--yorha-text-muted);">Detected Tier</span>
            <span class="uppercase font-medium" style="color: var(--yorha-text-primary);">{tier}</span>
          </div>
          <div class="p-2.5 border rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border);">
            <span class="block text-[10px] uppercase" style="color: var(--yorha-text-muted);">CPU Concurrency</span>
            <span style="color: var(--yorha-text-primary);">{cores}</span>
          </div>
          <div class="p-2.5 border rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border);">
            <span class="block text-[10px] uppercase" style="color: var(--yorha-text-muted);">Estimated RAM</span>
            <span style="color: var(--yorha-text-primary);">{memory}</span>
          </div>
          <div class="p-2.5 border rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border);">
            <span class="block text-[10px] uppercase" style="color: var(--yorha-text-muted);">Network / Motion</span>
            <span style="color: var(--yorha-text-primary);">{connection} {reducedMotion ? '· Reduced' : ''}</span>
          </div>
        </div>
      </div>

      <!-- Architecture Safety Nets Trivia -->
      <div class="space-y-3">
        <div class="font-mono text-[10px] uppercase tracking-[0.2em]" style="color: var(--yorha-text-muted);">
          {engineTrivia.title}
        </div>
        <p class="text-caption max-w-[var(--measure)]" style="color: var(--yorha-text-muted);">
          {engineTrivia.overview}
        </p>

        <div class="grid gap-3 sm:grid-cols-3 pt-2">
          {#each engineTrivia.items as item}
            <div class="p-3 border space-y-1.5 rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border);">
              <span class="font-mono text-[11px] font-medium block" style="color: var(--yorha-accent);">
                {item.label}
              </span>
              <p class="text-[12px] leading-relaxed" style="color: var(--yorha-text-muted);">
                {item.desc}
              </p>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>
