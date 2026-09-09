<script>
  import { theme } from '$lib/stores/theme.svelte.js';

  let { class: className = '' } = $props();

  function toggle() {
    theme.toggle();
  }
</script>

<button
  type="button"
  onclick={toggle}
  aria-label={theme.current === 'light' ? 'Switch to OLED Tactical Mode' : 'Switch to Bunker Archive Mode'}
  class="group inline-flex items-center gap-1.5 px-2 py-1 border border-current/20 hover:border-current bg-transparent transition-all duration-150 cursor-pointer font-mono text-[10px] uppercase tracking-wider select-none {className}"
  style="color: var(--yorha-accent);"
  title={theme.current === 'light' ? 'BUNKER // LIGHT [ACTIVE] - Click for OLED Tactical' : 'OLED // DARK [ACTIVE] - Click for Bunker Archive'}
>
  {#if theme.current === 'light'}
    <span class="material-symbols-outlined text-[14px] leading-none select-none">light_mode</span>
    <span class="hidden sm:inline">[ ARCHIVE ]</span>
  {:else}
    <span class="material-symbols-outlined text-[14px] leading-none select-none">dark_mode</span>
    <span class="hidden sm:inline">[ TACTICAL ]</span>
  {/if}
</button>

