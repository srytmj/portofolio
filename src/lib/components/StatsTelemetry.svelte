<script>
  import { stats } from '$lib/content/site.js';
</script>

<div class="grid grid-cols-2 sm:grid-cols-4 gap-px border overflow-hidden rounded-none" style="background-color: var(--yorha-border); border-color: var(--yorha-border);">
  {#each stats as item}
    <div
      class="p-4 flex flex-col justify-between transition-all duration-200 group cursor-default"
      style="background-color: var(--yorha-surface);"
    >
      <span class="font-mono text-xl sm:text-2xl font-light tracking-tight transition-colors duration-200" style="color: var(--yorha-text-primary);">
        {item.value}
      </span>
      <span class="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] mt-1 transition-colors duration-200" style="color: var(--yorha-text-muted);">
        {item.label}
      </span>
    </div>
  {/each}
</div>
