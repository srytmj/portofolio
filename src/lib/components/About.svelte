<script>
  import Section from './Section.svelte';
  import HalftonePortrait from './HalftonePortrait.svelte';
  import SnakePlaceholder from './SnakePlaceholder.svelte';
  import StatsTelemetry from './StatsTelemetry.svelte';
  import SiteTelemetry from './SiteTelemetry.svelte';
  import ResumeModal from './ResumeModal.svelte';
  import { about, availability, headings } from '$lib/content/site.js';

  let showResume = $state(false);
</script>

<Section id="about" title={headings.about}>
  <div class="grid gap-8 md:grid-cols-[260px_1fr] md:gap-16">
    <div data-anim class="w-full max-w-sm sm:max-w-[260px] mx-auto md:mx-0 space-y-3 sm:space-y-4">
      <div class="flex sm:flex-col items-stretch sm:items-start gap-3.5 sm:gap-4">
        <div class="w-24 sm:w-36 md:w-full shrink-0">
          {#if about.portrait}
            <HalftonePortrait src={about.portrait} alt={about.name || 'Bakti Surya Atmaja'} />
          {:else}
            <SnakePlaceholder />
          {/if}
        </div>

        <!-- Mobile-Only Compact Column: Node 01, Location, Open for Opportunities, & View CV aligned with photo -->
        <div class="flex-1 flex flex-col justify-between min-w-0 py-0.5 sm:hidden font-mono">
          <div class="space-y-1.5">
            <!-- Node 01 Status -->
            {#if about.status}
              <div class="inline-flex items-center gap-1.5 text-[9.5px] opacity-85 leading-none">
                <span class="h-1.5 w-1.5 shrink-0 rounded-full -translate-y-[0.5px]" style="background-color: var(--yorha-accent);"></span>
                <span class="leading-none truncate font-medium">{about.status}</span>
              </div>
            {/if}

            <!-- Location -->
            <div class="text-[9px] opacity-75 tracking-[0.16em] uppercase">
              LOC: {about.location}
            </div>

            <!-- Under Node 01: Open for Opportunities -->
            {#if availability}
              <div class="pt-0.5 flex items-center gap-1.5 text-[9.5px] uppercase tracking-wider font-semibold" style="color: var(--yorha-accent);">
                <span class="relative flex h-1.5 w-1.5 shrink-0">
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style="background-color: var(--yorha-accent);"></span>
                  <span class="relative inline-flex h-1.5 w-1.5 rounded-full" style="background-color: var(--yorha-accent);"></span>
                </span>
                <span class="leading-none truncate">{availability.status}</span>
              </div>
            {/if}
          </div>

          <!-- View CV button aligned with photo area and under Node 01 -->
          <button
            type="button"
            onclick={() => (showResume = true)}
            class="yorha-invert-hover inline-flex items-center justify-center rounded-none border border-current/20 bg-current/5 py-1.5 px-2 font-mono text-[9.5px] tracking-wider uppercase transition-all duration-150 cursor-pointer w-full mt-2"
          >
            <span>[ VIEW RESUME / CV ]</span>
          </button>
        </div>

        <!-- Tablet / Desktop Telemetry: Node Status & Region -->
        <div class="hidden sm:flex flex-col gap-1.5 font-mono text-[11px] tracking-[0.16em]">
          {#if about.status}
            <div class="inline-flex items-center gap-2 text-[10px] opacity-80 leading-none">
              <span class="h-2 w-2 shrink-0 rounded-full -translate-y-[0.5px]" style="background-color: var(--yorha-accent);"></span>
              <span class="leading-none">{about.status}</span>
            </div>
          {/if}
          <div class="text-[10px] opacity-75 tracking-[0.18em] uppercase">
            LOC: {about.location}
          </div>
        </div>
      </div>

      <!-- Availability Card (Tablet / Desktop only) -->
      {#if availability}
        <div class="hidden sm:block relative rounded-none border border-current/15 p-3.5 bg-current/[0.02] font-mono text-[11px] space-y-2 transition-all duration-200 hover:border-current/40 group">


          <div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] leading-none font-semibold" style="color: var(--yorha-accent);">
            <span class="relative flex h-1.5 w-1.5 shrink-0 -translate-y-[0.5px] group-hover:scale-125 transition-transform duration-200">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style="background-color: var(--yorha-accent);"></span>
              <span class="relative inline-flex h-1.5 w-1.5 rounded-full" style="background-color: var(--yorha-accent);"></span>
            </span>
            <span class="leading-none">{availability.status}</span>
          </div>
          <p class="opacity-70 text-[10px] tracking-wider uppercase">
            {availability.type}
          </p>
          <div class="pt-1 flex flex-wrap gap-1">
            {#each availability.roles as role}
              <span class="text-[9px] px-1.5 py-0.5 bg-current/[0.04] border border-current/10 transition-colors duration-150 hover:border-current/40">
                {role}
              </span>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Resume / CV Action (Tablet / Desktop only) -->
      <div class="hidden sm:block">
        <button
          type="button"
          onclick={() => (showResume = true)}
          class="w-full yorha-invert-hover inline-flex items-center justify-center rounded-none border border-current/20 bg-current/5 py-2.5 px-3 font-mono text-[11px] tracking-wider uppercase transition-all duration-150 cursor-pointer"
        >
          <span>[ VIEW RESUME / CV ]</span>
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <p data-anim class="max-w-[var(--measure)] text-balance text-lead font-medium font-sans leading-relaxed tracking-wide" style="color: var(--yorha-text-primary);">
        {about.intro}
      </p>
      {#each about.body as para}
        <p data-anim class="max-w-[var(--measure)] text-body font-sans leading-relaxed tracking-wide" style="color: var(--yorha-text-primary); opacity: 0.85;">
          {para}
        </p>
      {/each}

      <!-- Stats Telemetry Grid -->
      <div data-anim class="!mt-8">
        <StatsTelemetry />
      </div>

      <ul data-anim class="!mt-8 space-y-2 border-l pl-5" style="border-color: var(--yorha-border);">
        {#each about.working as line}
          <li class="text-caption" style="color: var(--yorha-text-muted);">{line}</li>
        {/each}
      </ul>

      <p data-anim class="!mt-6 flex items-baseline gap-3 text-caption" style="color: var(--yorha-text-muted);">
        <span class="font-mono text-label uppercase tracking-[0.2em]" style="color: var(--yorha-text-primary); opacity: 0.6;"
          >Currently</span
        >
        <span>{about.now}</span>
      </p>
    </div>
  </div>

  <!-- Engine Diagnostics & Safety Nets Trivia -->
  <div data-anim class="mt-14 max-w-[var(--container)]">
    <SiteTelemetry />
  </div>
</Section>

{#if showResume}
  <ResumeModal onClose={() => (showResume = false)} />
{/if}

