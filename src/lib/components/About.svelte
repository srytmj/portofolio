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
      <p class="mt-4 font-mono text-label uppercase tracking-[0.2em] text-ash-2">
        {about.location}
      </p>
    </div>

    <div class="space-y-6">
      <p data-anim class="max-w-[var(--measure)] text-balance text-lead font-medium text-white">
        {about.intro}
      </p>
      {#each about.body as para}
        <p data-anim class="max-w-[var(--measure)] text-body text-white/80">{para}</p>
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
