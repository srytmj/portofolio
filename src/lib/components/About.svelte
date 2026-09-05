<script>
  import Section from './Section.svelte';
  import HalftonePortrait from './HalftonePortrait.svelte';
  import SnakePlaceholder from './SnakePlaceholder.svelte';
  import { about, headings } from '$lib/content/site.js';
</script>

<Section id="about" title={headings.about}>
  <div class="grid gap-10 md:grid-cols-[260px_1fr] md:gap-16">
    <div data-anim class="max-w-[260px]">
      {#if about.portrait}
        <HalftonePortrait src={about.portrait} alt="Suryatmaja" />
      {:else}
        <SnakePlaceholder />
      {/if}
      <div class="mt-4 flex flex-col gap-1.5 font-mono text-[11px] tracking-[0.16em]">
        <p class="uppercase text-ash-2">
          {about.location}
        </p>
        {#if about.status}
          <div class="inline-flex items-center gap-2 text-[10px] text-white/55">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
            </span>
            <span>{about.status}</span>
          </div>
        {/if}
      </div>
    </div>

    <div class="space-y-6">
      <p data-anim class="max-w-[var(--measure)] text-balance text-lead font-medium text-white">
        {about.intro}
      </p>
      {#each about.body as para}
        <p data-anim class="max-w-[var(--measure)] text-body text-white/80">
          {para}
        </p>
      {/each}

      <ul data-anim class="!mt-10 space-y-2 border-l border-white/15 pl-5">
        {#each about.working as line}
          <li class="text-caption text-white/70">{line}</li>
        {/each}
      </ul>

      <p data-anim class="!mt-10 flex items-baseline gap-3 text-caption text-ash-3">
        <span class="font-mono text-label uppercase tracking-[0.2em] text-ash-2"
          >Currently</span
        >
        <span>{about.now}</span>
      </p>
    </div>
  </div>
</Section>
