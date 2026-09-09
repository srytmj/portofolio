<script>
  import { onMount } from 'svelte';
  import { sectionAnim } from '$lib/scroll/sectionAnim.js';
  import { contact, headings, identity } from '$lib/content/site.js';
  const year = new Date().getFullYear();

  let copied = $state(false);
  let copyTimer;

  // Public visit counter. The endpoint counts every hit and this footer
  // remounts on client-side navigation, so bump it once per session and read
  // the cached value afterwards. There is no local fallback on purpose:
  // inventing a number only that visitor can see is worse than showing nothing.
  let visitorCount = $state(null);

  const COUNTER_URL = 'https://api.counterapi.dev/v1/suryatmaja-portfolio/visits';
  const COUNTER_SESSION_KEY = 'visitor_count';

  onMount(async () => {
    let cached = null;
    try {
      cached = sessionStorage.getItem(COUNTER_SESSION_KEY);
    } catch {
      /* private mode */
    }

    if (cached) {
      visitorCount = Number(cached) || null;
      return;
    }

    try {
      const signal = AbortSignal?.timeout ? AbortSignal.timeout(4000) : undefined;
      const res = await fetch(`${COUNTER_URL}/up`, { signal });
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data?.count !== 'number') return;
      visitorCount = data.count;
      try {
        sessionStorage.setItem(COUNTER_SESSION_KEY, String(data.count));
      } catch {
        /* private mode */
      }
    } catch {
      // Offline, blocked or too slow: the badge simply does not render.
    }
  });

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      copied = true;
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => {
        copied = false;
      }, 2000);
    } catch {
      // Fallback
    }
  }

</script>

<footer
  id="contact"
  data-section
  use:sectionAnim
  class="relative flex flex-col justify-center py-12 sm:py-24"
>
  <div class="wrap">
    <!-- Header Section -->
    <header class="relative mb-6 sm:mb-10 pb-3 sm:pb-4">
      <div class="flex items-end justify-between gap-4 pb-1">
        <h2
          class="text-h2 font-semibold uppercase tracking-tight font-display"
        >
          {headings.contact}
        </h2>
        <div class="overflow-hidden pb-1">
          <span
            data-anim-badge
            class="block font-mono text-[11px] font-medium tracking-[0.25em] uppercase will-change-transform"
            style="color: var(--yorha-text-muted);"
          >
            SEC // 05
          </span>
        </div>
      </div>

      <div class="relative mt-3 h-px w-full overflow-hidden" style="background-color: var(--yorha-border);">
        <span
          data-anim-line
          class="absolute inset-y-0 left-0 h-full w-full origin-left bg-gradient-to-r from-current/50 via-current/25 to-transparent"
          aria-hidden="true"
        ></span>
        <span
          data-anim-scan
          class="absolute inset-y-0 -left-28 h-full w-28 bg-gradient-to-r from-transparent via-current to-transparent opacity-40"
          aria-hidden="true"
        ></span>
      </div>
    </header>

    <!-- Intro Prose (Baskervville) & Blog Link Navigation -->
    <div data-anim class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
      <div class="max-w-[var(--measure)]">
        <p class="font-sans text-lead leading-relaxed tracking-wide" style="color: var(--yorha-text-primary); opacity: 0.85;">
          {contact.body}
        </p>
      </div>

      <a
        href="/blog"
        class="yorha-invert-hover group inline-flex items-center gap-2 self-start sm:self-auto border border-current/20 bg-current/5 px-3 py-2 sm:px-4 sm:py-2.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] transition-all duration-150 shrink-0"
      >
        <span class="text-[9px]" style="color: var(--yorha-accent);">■</span>
        <span>ACCESS JOURNAL / BLOG</span>
        <span class="transition-transform group-hover:translate-x-1">→</span>
      </a>
    </div>

    <!-- Symmetrical 2-Card Tactical Channel Grid -->
    <div data-anim class="mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
      
      <!-- CHANNEL 01: Direct Email Dispatch -->
      <div
        class="group relative flex flex-col justify-between border border-current/15 p-4 sm:p-6 sm:p-7 transition-all duration-150 hover:-translate-y-0.5 hover:border-current/40"
        style="background-color: var(--yorha-surface);"
      >
        <span class="pointer-events-none absolute top-[-1px] left-[-1px] h-2.5 w-2.5 border-l-2 border-t-2 border-transparent group-hover:border-current/70 transition-colors" aria-hidden="true"></span>
        <span class="pointer-events-none absolute top-[-1px] right-[-1px] h-2.5 w-2.5 border-r-2 border-t-2 border-transparent group-hover:border-current/70 transition-colors" aria-hidden="true"></span>
        <span class="pointer-events-none absolute bottom-[-2px] left-[-1px] h-2.5 w-2.5 border-b-2 border-l-2 border-transparent group-hover:border-current/70 transition-colors" aria-hidden="true"></span>
        <span class="pointer-events-none absolute bottom-[-2px] right-[-1px] h-2.5 w-2.5 border-b-2 border-r-2 border-transparent group-hover:border-current/70 transition-colors" aria-hidden="true"></span>

        <!-- Top Sweep Line on Hover -->
        <span
          class="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"
          style="background-color: var(--yorha-accent);"
          aria-hidden="true"
        ></span>

        <div>
          <div class="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider opacity-60 leading-none">
            <span>CHANNEL // 01</span>
            <span class="inline-flex items-center gap-1.5 leading-none">
              <span class="h-1.5 w-1.5 shrink-0 rounded-full -translate-y-[0.5px] bg-current opacity-60"></span>
              <span class="leading-none">[ DIRECT_INBOX ]</span>
            </span>
          </div>

          <h3 class="mt-2.5 sm:mt-4 font-display text-base sm:text-lg font-semibold uppercase tracking-wider transition-colors">
            EMAIL DISPATCH
          </h3>

          <p class="mt-1.5 sm:mt-2 font-sans text-[11px] opacity-70 leading-relaxed line-clamp-2 sm:line-clamp-none tracking-wide">
            Fastest channel for infrastructure architecture, cloud contracts, or direct consulting.
          </p>
        </div>

        <div class="mt-4 sm:mt-8 pt-3 sm:pt-4 border-t border-current/10 flex flex-col gap-2">
          <a
            href={'mailto:' + contact.email}
            class="font-mono text-xs sm:text-sm font-medium tracking-tight hover:underline transition-colors select-all truncate"
            style="color: var(--yorha-accent);"
          >
            {contact.email}
          </a>
          <button
            type="button"
            onclick={copyEmail}
            aria-label="Copy email address"
            class="w-full yorha-invert-hover inline-flex items-center justify-center gap-2 border px-2.5 py-1.5 sm:px-3 sm:py-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] transition-all cursor-pointer {copied ? 'border-current font-semibold' : 'border-current/20 bg-current/5 hover:border-current/50'}"
            style={copied ? 'color: var(--yorha-accent);' : ''}
          >
            <span>{copied ? '[ ┌ COPIED TO BUFFER ┘ ]' : '[ ┌ COPY ADDRESS ┘ ]'}</span>
          </button>
        </div>
      </div>

      <!-- CHANNEL 02: Combined Codespace & Network (GitHub + LinkedIn) -->
      <div
        class="group relative flex flex-col justify-between border border-current/15 p-4 sm:p-6 sm:p-7 transition-all duration-150 hover:-translate-y-0.5 hover:border-current/40"
        style="background-color: var(--yorha-surface);"
      >
        <span class="pointer-events-none absolute top-[-1px] left-[-1px] h-2.5 w-2.5 border-l-2 border-t-2 border-transparent group-hover:border-current/70 transition-colors" aria-hidden="true"></span>
        <span class="pointer-events-none absolute top-[-1px] right-[-1px] h-2.5 w-2.5 border-r-2 border-t-2 border-transparent group-hover:border-current/70 transition-colors" aria-hidden="true"></span>
        <span class="pointer-events-none absolute bottom-[-2px] left-[-1px] h-2.5 w-2.5 border-b-2 border-l-2 border-transparent group-hover:border-current/70 transition-colors" aria-hidden="true"></span>
        <span class="pointer-events-none absolute bottom-[-2px] right-[-1px] h-2.5 w-2.5 border-b-2 border-r-2 border-transparent group-hover:border-current/70 transition-colors" aria-hidden="true"></span>

        <!-- Top Sweep Line on Hover -->
        <span
          class="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"
          style="background-color: var(--yorha-accent);"
          aria-hidden="true"
        ></span>

        <div>
          <div class="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider opacity-60 leading-none">
            <span>CHANNEL // 02</span>
            <span>[ EXTERNAL_NODES ]</span>
          </div>

          <h3 class="mt-2.5 sm:mt-4 font-display text-base sm:text-lg font-semibold uppercase tracking-wider transition-colors">
            CODESPACE & PROFILES
          </h3>

          <p class="mt-1.5 sm:mt-2 font-sans text-[11px] opacity-70 leading-relaxed line-clamp-2 sm:line-clamp-none tracking-wide">
            Open-source infrastructure code repositories and professional career trajectory.
          </p>
        </div>

        <!-- 2-in-1 Compact Sub-Links for GitHub & LinkedIn -->
        <div class="mt-4 sm:mt-8 pt-3 sm:pt-4 border-t border-current/10 flex flex-col gap-2">
          <!-- GitHub Sub-Card -->
          <a
            href="https://github.com/srytmj"
            target="_blank"
            rel="noopener noreferrer"
            class="group/item flex items-center justify-between px-3 py-2 border border-current/15 bg-current/[0.02] hover:border-current/40 hover:bg-current/5 transition-all font-mono"
          >
            <div class="flex items-center gap-2">
              <span class="text-[9px]" style="color: var(--yorha-accent);">■</span>
              <div class="flex flex-col">
                <span class="text-xs font-semibold tracking-tight">GITHUB / SRYTMJ</span>
                <span class="text-[9px] opacity-75 select-all">github.com/srytmj</span>
              </div>
            </div>
            <span class="text-[10px] uppercase tracking-wider group-hover/item:translate-x-1 transition-transform" style="color: var(--yorha-accent);">
              EXPLORE →
            </span>
          </a>

          <!-- LinkedIn Sub-Card -->
          <a
            href="https://www.linkedin.com/in/suryatmaja/"
            target="_blank"
            rel="noopener noreferrer"
            class="group/item flex items-center justify-between px-3 py-2 border border-current/15 bg-current/[0.02] hover:border-current/40 hover:bg-current/5 transition-all font-mono"
          >
            <div class="flex items-center gap-2">
              <span class="text-[9px]" style="color: var(--yorha-accent);">■</span>
              <div class="flex flex-col">
                <span class="text-xs font-semibold tracking-tight">LINKEDIN / SURYATMAJA</span>
                <span class="text-[9px] opacity-75 select-all">linkedin.com/in/suryatmaja</span>
              </div>
            </div>
            <span class="text-[10px] uppercase tracking-wider group-hover/item:translate-x-1 transition-transform" style="color: var(--yorha-accent);">
              CONNECT →
            </span>
          </a>
        </div>
      </div>

    </div>

    <!-- Compact Tactical Status & Bunker Footer Bar -->
    <div
      data-anim
      class="mt-8 sm:mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-t border-current/10 pt-4 sm:pt-6 font-mono text-label uppercase tracking-[0.22em]"
    >
      <div class="flex flex-wrap items-center gap-3 opacity-60">
        <span>PORTOFOLIO_OS v2.6.4</span>
        <span class="opacity-40">·</span>
        <span>© {year} {identity.name}</span>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <span
          class="inline-flex items-center justify-center gap-2 border px-3 h-7 font-mono text-[11px] select-none"
          style="border-color: var(--yorha-accent-border); background-color: var(--yorha-accent-subtle); color: var(--yorha-accent);"
        >
          <span class="h-1.5 w-1.5 shrink-0 rounded-full animate-pulse" style="background-color: var(--yorha-accent);"></span>
          <span class="font-medium tracking-wider uppercase leading-none">COMMISSIONS: OPEN // UTC+7</span>
        </span>

        {#if visitorCount && visitorCount > 1000}
          <div class="inline-flex items-center gap-2 border border-current/15 bg-current/[0.02] px-2.5 py-1 opacity-70 leading-none">
            <span class="leading-none">Visited by {visitorCount.toLocaleString()}</span>
          </div>
        {/if}
      </div>
    </div>
  </div>
</footer>
