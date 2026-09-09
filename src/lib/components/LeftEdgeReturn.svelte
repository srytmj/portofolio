<script>
  import { onMount } from 'svelte';
  import { returnToMainPage } from '$lib/utils/navigationState.js';

  let isHovered = $state(false);
  let isNearLeftEdge = $state(false);

  onMount(() => {
    const onMouseMove = (e) => {
      // Calculate empty left gutter width based on screen width vs content width (~1152px)
      const emptyMargin = Math.max(60, (window.innerWidth - 1152) / 2 + 40);
      isNearLeftEdge = e.clientX <= emptyMargin;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  });

  const active = $derived(isHovered || isNearLeftEdge);

  function handleReturn() {
    returnToMainPage();
  }
</script>

<!--
  Left Empty Area Hover Return Trigger
  Does not block page interaction: window mousemove detects when cursor is in the empty left gutter.
  When active, the return capsule illuminates and allows instant click to return to the Hero section.
-->
<aside
  class="hidden md:flex fixed left-0 top-0 bottom-0 z-40 pointer-events-none items-center pl-2 sm:pl-4 lg:pl-6"
  aria-label="Return to Hero section"
>
  <button
    type="button"
    class="pointer-events-auto relative flex flex-col gap-1.5 p-2.5 sm:p-3 transition-all duration-200 border cursor-pointer text-left select-none rounded-none {active
      ? 'translate-x-1 sm:translate-x-2 opacity-100'
      : 'opacity-40 hover:opacity-100'}"
    style="background-color: var(--yorha-surface); border-color: {active ? 'var(--yorha-accent)' : 'var(--yorha-border)'}; color: var(--yorha-text-primary);"
    onmouseenter={() => (isHovered = true)}
    onmouseleave={() => (isHovered = false)}
    onfocus={() => (isHovered = true)}
    onblur={() => (isHovered = false)}
    onclick={handleReturn}
    aria-label="Return to Hero section"
    title="Click to return to Hero section"
  >
    <!-- Pixel-Perfect Corner Reticle Brackets on Active/Hover -->
    <span class="pointer-events-none absolute -top-px -left-px h-2 w-2 border-l-2 border-t-2 transition-colors" style="border-color: {active ? 'var(--yorha-accent)' : 'var(--yorha-border)'};" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -top-px -right-px h-2 w-2 border-r-2 border-t-2 transition-colors" style="border-color: {active ? 'var(--yorha-accent)' : 'var(--yorha-border)'};" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-px -left-px h-2 w-2 border-b-2 border-l-2 transition-colors" style="border-color: {active ? 'var(--yorha-accent)' : 'var(--yorha-border)'};" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-px -right-px h-2 w-2 border-b-2 border-r-2 transition-colors" style="border-color: {active ? 'var(--yorha-accent)' : 'var(--yorha-border)'};" aria-hidden="true"></span>

    <!-- Top line indicator -->
    <div class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
      <span class="font-bold transition-transform duration-150 {active ? '-translate-x-0.5' : ''}" style="color: var(--yorha-accent);">
        ←
      </span>
      <span class="font-medium transition-colors" style="color: var(--yorha-text-primary);">
        {active ? 'RETURN TO HERO' : 'BACK'}
      </span>
    </div>

    <!-- Sub-status: Return telemetry when hovered -->
    {#if active}
      <div class="pt-1 border-t font-mono text-[9px] tracking-wider uppercase flex flex-col gap-0.5 whitespace-nowrap" style="border-color: var(--yorha-border);">
        <span style="color: var(--yorha-accent);">
          [ RET // POD_042 ]
        </span>
      </div>
    {/if}
  </button>
</aside>
