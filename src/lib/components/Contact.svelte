<script>
  import { sectionAnim } from '$lib/scroll/sectionAnim.js';
  import { contact, headings, identity } from '$lib/content/site.js';
  const year = new Date().getFullYear();

  let copied = $state(false);
  let copyTimer;

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

  const words = $derived(headings.contact.split(' '));
</script>

<footer
  id="contact"
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
                data-glitch={word}
                class="chromatic-glitch inline-block origin-bottom will-change-transform"
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
            SEC // 05
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

    <div class="mt-14 grid gap-12 md:grid-cols-[1.4fr_1fr]">
      <div data-anim>
        <p class="max-w-[var(--measure)] text-lead text-white/80">
          {contact.body}
        </p>
        <div class="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={'mailto:' + contact.email}
            class="text-h3 font-medium tracking-tight underline decoration-white/20 underline-offset-8 transition-colors hover:decoration-white"
          >
            {contact.email}
          </a>
          <button
            type="button"
            onclick={copyEmail}
            aria-label="Copy email address"
            class="group relative inline-flex items-center gap-2 overflow-hidden rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] outline-none transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white active:scale-95 focus:outline-none focus-visible:outline-none {copied ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/15 bg-white/5'}"
          >
            <span class="relative flex h-3.5 w-3.5 items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                class="absolute h-3.5 w-3.5 text-white/50 transition-all duration-300 {copied ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                class="absolute h-3.5 w-3.5 text-emerald-400 transition-all duration-300 {copied ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span class="transition-colors duration-300 {copied ? 'font-semibold text-emerald-400' : 'text-ash-3 group-hover:text-white'}">
              {copied ? 'copied to clipboard' : 'copy'}
            </span>
          </button>
        </div>
      </div>

      <nav class="flex flex-col gap-3">
        {#each contact.links as link}
          <a
            data-anim
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            class="flex items-center justify-between border-b border-white/10 py-3 text-sm uppercase tracking-[0.2em] text-ash-3 transition-colors hover:text-white"
          >
            {link.label}<span aria-hidden="true">→</span>
          </a>
        {/each}
      </nav>
    </div>

    <p data-anim class="mt-24 text-label uppercase tracking-[0.3em] text-ash-1">
      © {year} {identity.name}. Built with SvelteKit, Threlte, GSAP, Lenis.
    </p>
  </div>
</footer>
