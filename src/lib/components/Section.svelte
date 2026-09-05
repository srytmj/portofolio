<script>
  import { sectionAnim } from '$lib/scroll/sectionAnim.js';
  /** @type {{ id: string, title: string, children: import('svelte').Snippet }} */
  let { id, title, children } = $props();

  const sectionCodes = {
    about: 'SEC // 02',
    skills: 'SEC // 03',
    portfolio: 'SEC // 04',
    contact: 'SEC // 05'
  };

  const words = $derived(title.split(' '));
</script>

<section
  {id}
  data-section
  use:sectionAnim
  class="relative flex min-h-[100svh] flex-col justify-center py-28 sm:py-36"
>
  <div class="wrap">
    <header class="relative mb-14 pb-4">
      <div class="flex items-end justify-between gap-4 pb-1">
        <h2
          class="flex flex-wrap gap-x-[0.28em] text-h2 font-semibold uppercase tracking-tight"
        >
          {#each words as word, i}
            <span class="inline-block overflow-hidden pb-1">
              <span
                data-anim-word
                data-dir={i % 2 === 0 ? 'left' : 'right'}
                class="inline-block origin-bottom will-change-transform"
              >
                {word}
              </span>
            </span>
          {/each}
        </h2>
        <div class="overflow-hidden pb-1">
          <span
            data-anim-badge
            class="block font-mono text-[11px] font-medium tracking-[0.25em] text-white/40 uppercase will-change-transform"
          >
            {sectionCodes[id] ?? 'SEC // 00'}
          </span>
        </div>
      </div>
      <div class="relative mt-3 h-px w-full overflow-hidden bg-white/10">
        <span
          data-anim-line
          class="absolute inset-y-0 left-0 h-full w-full origin-left bg-gradient-to-r from-white/70 via-white/30 to-white/10"
          aria-hidden="true"
        ></span>
        <span
          data-anim-scan
          class="absolute inset-y-0 -left-28 h-full w-28 bg-gradient-to-r from-transparent via-white to-transparent"
          aria-hidden="true"
        ></span>
      </div>
    </header>
    {@render children()}
  </div>
</section>
