<script>
  import Section from './Section.svelte';
  import HalftonePortrait from './HalftonePortrait.svelte';
  import SnakePlaceholder from './SnakePlaceholder.svelte';
  import { about } from '$lib/content/site.js';
</script>

<Section id="about" title={about.heading}>
  <div class="grid gap-10 md:grid-cols-[260px_1fr] md:gap-16">
    <div data-anim class="max-w-[260px]">
      {#if about.portrait}
        <HalftonePortrait src={about.portrait} alt="Suryatmaja" />
      {:else}
        <SnakePlaceholder />
      {/if}
      <p class="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ash-2">
        {about.location}
      </p>
    </div>

    <div class="space-y-6">
      <p
        data-anim
        class="text-balance text-xl font-medium leading-relaxed text-white sm:text-2xl"
      >
        {about.intro}
      </p>
      {#each about.body as para}
        <p data-anim class="text-base leading-relaxed text-white/80">{para}</p>
      {/each}

      <ul data-anim class="!mt-9 space-y-2 border-l border-white/15 pl-5">
        {#each about.working as line}
          <li class="text-sm text-white/70">{line}</li>
        {/each}
      </ul>

      <p data-anim class="!mt-9 flex items-baseline gap-3 text-sm text-ash-3">
        <span class="font-mono text-[11px] uppercase tracking-[0.2em] text-ash-2"
          >Currently</span
        >
        <span>{about.now}</span>
      </p>
    </div>
  </div>
</Section>
