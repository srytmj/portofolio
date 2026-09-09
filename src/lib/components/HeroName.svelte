<script>
  /** @type {{ display: string[], role: string[] }} */
  let { display, role } = $props();
</script>

<div class="flex max-w-[52rem] select-none flex-col items-start text-left" style="color: var(--yorha-text-primary);">
  <h1
    data-reveal
    class="text-display font-black uppercase leading-[0.82] tracking-[-0.03em]"
  >
    {#each display as part}
      <span class="block">{part}</span>
    {/each}
  </h1>
  <div
    data-reveal
    class="mt-6 flex flex-col gap-1 font-sans text-label uppercase tracking-[0.28em] opacity-65"
  >
    {#each role as line, i}
      <span class={i > 0 ? 'opacity-70' : ''}>{line}</span>
    {/each}
  </div>
</div>
