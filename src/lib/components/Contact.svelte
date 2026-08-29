<script>
  import { sectionAnim } from '$lib/scroll/sectionAnim.js';
  import { contact, identity } from '$lib/content/site.js';
  const year = new Date().getFullYear();
</script>

<footer
  id="contact"
  data-section
  use:sectionAnim
  class="relative flex min-h-[100svh] flex-col justify-center py-28 sm:py-36"
>
  <div data-skew class="mx-auto w-full max-w-6xl px-6 sm:px-10">
    <div class="relative pb-4">
      <h2
        class="overflow-hidden pb-1 text-2xl font-semibold uppercase tracking-tight sm:text-3xl"
      >
        <span data-anim-title class="block">{contact.heading}</span>
      </h2>
      <span
        data-anim-line
        class="absolute bottom-0 left-0 h-px w-full bg-white/15"
        aria-hidden="true"
      ></span>
    </div>

    <div class="mt-14 grid gap-12 md:grid-cols-[1.4fr_1fr]">
      <div data-anim>
        <p class="max-w-md text-lg leading-relaxed text-white/80">{contact.body}</p>
        <a
          href={'mailto:' + contact.email}
          class="mt-8 inline-block text-2xl font-medium tracking-tight underline decoration-white/20 underline-offset-8 transition-colors hover:decoration-white sm:text-3xl"
        >
          {contact.email}
        </a>
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

    <p data-anim class="mt-24 text-xs uppercase tracking-[0.3em] text-ash-1">
      © {year} {identity.name}. Built with SvelteKit, Threlte, GSAP, Lenis.
    </p>
  </div>
</footer>
