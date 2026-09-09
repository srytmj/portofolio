<script>
  import { building } from '$lib/content/site.js';
</script>

<div
  class="border p-5 backdrop-blur-sm transition-all duration-300 rounded-none group"
  style="background-color: var(--yorha-surface); border-color: var(--yorha-border);"
>
  <div class="flex flex-wrap items-center justify-between gap-2 border-b pb-3" style="border-color: var(--yorha-border);">
    <div class="inline-flex items-center gap-2">
      <span class="relative flex h-2 w-2">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-none opacity-75" style="background-color: var(--yorha-accent);"></span>
        <span class="relative inline-flex h-2 w-2 rounded-none" style="background-color: var(--yorha-accent);"></span>
      </span>
      <span class="font-mono text-[10px] uppercase tracking-[0.2em] font-medium" style="color: var(--yorha-accent);">
        Currently Building
      </span>
    </div>
    <span class="font-mono text-[10px] uppercase tracking-[0.14em]" style="color: var(--yorha-text-muted);">
      {building.status}
    </span>
  </div>

  <div class="mt-3.5 space-y-2">
    <h3 class="font-mono text-sm tracking-wide transition-colors duration-200" style="color: var(--yorha-text-primary);">
      {building.project}
    </h3>
    <p class="text-caption leading-relaxed max-w-[var(--measure)]" style="color: var(--yorha-text-muted);">
      {building.tagline}
    </p>

    {#if building.stack && building.stack.length > 0}
      <div class="pt-2 flex flex-wrap gap-1.5">
        {#each building.stack as item}
          <span
            class="font-mono text-[10px] tracking-wider px-2 py-0.5 border rounded-none transition-colors duration-200"
            style="background-color: var(--yorha-bg); border-color: var(--yorha-border); color: var(--yorha-text-muted);"
          >
            {item}
          </span>
        {/each}
      </div>
    {/if}
  </div>
</div>
