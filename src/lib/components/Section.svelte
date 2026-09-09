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
  class="relative flex min-h-[100svh] flex-col justify-center py-12 sm:py-24 md:py-36"
>
  <div class="wrap">
    <header class="relative mb-8 sm:mb-14 pb-3 sm:pb-4">
      <div class="flex items-end justify-between gap-4 pb-1">
          <h2
            class="text-h2 font-semibold uppercase tracking-tight"
          >
            {title}
          </h2>
          <div class="overflow-hidden pb-1">
            <span
              class="block font-mono text-[11px] font-medium tracking-[0.25em] uppercase"
              style="color: var(--yorha-text-muted);"
            >
              {sectionCodes[id] ?? 'SEC // 00'}
            </span>
          </div>
        </div>
        <div class="relative mt-3 h-px w-full overflow-hidden" style="background-color: var(--yorha-border);">
          <span
            class="absolute inset-y-0 left-0 h-full w-full origin-left bg-gradient-to-r from-current/50 via-current/25 to-transparent"
            aria-hidden="true"
          ></span>
        </div>
    </header>
    {@render children()}
  </div>
</section>
