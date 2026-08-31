<script>
  /** @type {{ display: string[], role: string[] }} */
  let { display, role } = $props();
</script>

<div class="flex max-w-[52rem] select-none flex-col items-start text-left">
  <h1
    class="text-display font-black uppercase leading-[0.82] tracking-[-0.03em] text-white [text-shadow:0_2px_40px_rgba(0,0,0,0.75)]"
  >
    {#each display as part}
      <span class="block">{part}</span>
    {/each}
  </h1>
  <div
    data-reveal
    class="mt-6 flex flex-col gap-1 font-sans text-label uppercase tracking-[0.28em] text-white/55"
  >
    {#each role as line, i}
      <span class={i > 0 ? 'text-white/40' : ''}>{line}</span>
    {/each}
  </div>
</div>
