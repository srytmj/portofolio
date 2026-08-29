<script>
  import { fade } from 'svelte/transition';
  import Section from './Section.svelte';
  import { stack } from '$lib/content/site.js';

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const DEFAULT = "Hover a tool to see what it's for.";

  // Track by name (primitive) — Svelte 5 proxies objects put in $state, so
  // object-identity comparisons across the import boundary would never match.
  let activeName = $state(null);

  const activeTool = $derived(
    activeName ? stack.flatMap((l) => l.items).find((t) => t.name === activeName) : null
  );
  const caption = $derived(activeTool?.detail ?? DEFAULT);
  const isActiveLayer = (layer) => layer.items.some((i) => i.name === activeName);
</script>

<Section id="skills" title="Skills">
  <div class="relative">
    <div
      class="pointer-events-none absolute bottom-6 left-[5px] top-6 hidden w-px bg-white/10 md:block"
      aria-hidden="true"
    ></div>

    <div class="flex flex-col">
      {#each stack as layer}
        {@const on = isActiveLayer(layer)}
        <div
          data-anim
          class="flex flex-col gap-3 border-t border-white/10 py-6 first:border-t-0 md:flex-row md:items-baseline md:gap-10"
        >
          <div class="flex shrink-0 items-center gap-3 md:w-44">
            <span
              class="relative z-10 h-[11px] w-[11px] shrink-0 rounded-full border transition-colors duration-300 {on
                ? 'border-white bg-white'
                : 'border-white/40 bg-black'}"
              aria-hidden="true"
            ></span>
            <span
              class="font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-300 {on
                ? 'text-white'
                : 'text-ash-2'}"
            >
              {layer.layer}
            </span>
          </div>

          <ul class="flex flex-wrap gap-x-6 gap-y-2.5">
            {#each layer.items as it}
              {@const sel = it.name === activeName}
              <li>
                <button
                  type="button"
                  onpointerenter={() => (activeName = it.name)}
                  onfocus={() => (activeName = it.name)}
                  aria-pressed={sel}
                  class="group relative pb-1 text-lg transition-colors {sel
                    ? 'text-white'
                    : 'text-white/80 hover:text-white'}"
                >
                  {it.name}
                  <span
                    class="absolute inset-x-0 bottom-0 h-px origin-left bg-white transition-transform duration-300 group-hover:scale-x-100 {sel
                      ? 'scale-x-100'
                      : 'scale-x-0'}"
                    aria-hidden="true"
                  ></span>
                </button>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>

    <p
      data-anim
      class="mt-10 flex min-h-[1.5em] items-start gap-2.5 text-sm leading-relaxed text-ash-3"
    >
      <span class="mt-[0.15em] text-ash-1" aria-hidden="true">—</span>
      {#key caption}
        <span in:fade={{ duration: reduce ? 0 : 220 }}>{caption}</span>
      {/key}
    </p>
  </div>
</Section>
