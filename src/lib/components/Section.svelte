<script>
  import { sectionAnim } from '$lib/scroll/sectionAnim.js';
  /** @type {{ id: string, title: string, children: import('svelte').Snippet }} */
  let { id, title, children } = $props();
</script>

<section
  {id}
  data-section
  use:sectionAnim
  class="relative flex min-h-[100svh] flex-col justify-center py-28 sm:py-36"
>
  <div data-skew class="wrap">
    <header class="relative mb-14 pb-4">
      <h2
        class="overflow-hidden pb-1 text-h2 font-semibold uppercase tracking-tight"
      >
        <span data-anim-title class="block">{title}</span>
      </h2>
      <span
        data-anim-line
        class="absolute bottom-0 left-0 h-px w-full bg-white/15"
        aria-hidden="true"
      ></span>
    </header>
    {@render children()}
  </div>
</section>
