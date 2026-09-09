<script>
  import { onMount, tick } from 'svelte';
  import { gsap } from 'gsap';
  import { portal } from '$lib/actions/portal.js';
  import { ease, dur } from '$lib/motion.js';
  import { resume, identity, about, availability, stats, stack } from '$lib/content/site.js';

  /** @type {{ onClose: () => void }} */
  let { onClose } = $props();

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** @type {HTMLElement} */ let backdrop;
  /** @type {HTMLElement} */ let panel;
  let restoreFocus;
  let closing = false;

  function close() {
    if (closing) return;
    closing = true;
    if (reduce) return onClose();
    gsap.to(panel, { autoAlpha: 0, y: 16, duration: dur.xs, ease: ease.in });
    gsap.to(backdrop, { autoAlpha: 0, duration: dur.xs, ease: ease.in, onComplete: onClose });
    setTimeout(onClose, 300);
  }

  function key(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  }

  function printDoc() {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  onMount(() => {
    restoreFocus = document.activeElement;

    if (!reduce) {
      gsap.from(backdrop, { autoAlpha: 0, duration: 0.16 });
      gsap.from(panel, { autoAlpha: 0, y: 8, duration: 0.18, ease: 'power2.out', clearProps: 'transform,opacity' });
    }

    tick().then(() => panel?.querySelector('button')?.focus());
    return () => {
      /** @type {HTMLElement} */ (restoreFocus)?.focus?.();
    };
  });
</script>

<svelte:window onkeydown={key} />

<!-- Fullscreen backdrop -->
<div
  bind:this={backdrop}
  use:portal
  class="fixed inset-0 z-[999] flex flex-col items-center justify-center overscroll-contain p-2 sm:p-6 backdrop-blur-md"
  style="background-color: var(--yorha-backdrop);"
  onclick={close}
  role="presentation"
>
  <div
    bind:this={panel}
    class="relative flex h-full max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden border-0 font-mono outline-none ring-0 rounded-none"
    style="background-color: var(--yorha-surface); border: none; color: var(--yorha-text-primary);"
    onclick={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
    aria-labelledby="rm-title"
    tabindex="-1"
    data-lenis-prevent
  >
    <!-- Tactical Corner Brackets -->
    <span class="pointer-events-none absolute -top-px -left-px h-3 w-3 border-l-2 border-t-2 z-30" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -top-px -right-px h-3 w-3 border-r-2 border-t-2 z-30" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 z-30" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 z-30" style="border-color: var(--yorha-accent);" aria-hidden="true"></span>

    <!-- Modal Header / Toolbar -->
    <header class="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-6 shrink-0" style="border-color: var(--yorha-border); background-color: var(--yorha-bg);">
      <div class="flex items-center gap-2.5 font-mono">
        <span class="inline-block h-2 w-2 rounded-none" style="background-color: var(--yorha-accent);"></span>
        <h2 id="rm-title" class="text-xs sm:text-sm tracking-wider" style="color: var(--yorha-text-primary);">
          {resume.filename}
        </h2>
        {#if resume.lastUpdated}
          <span class="hidden sm:inline text-[10px] uppercase tracking-widest border px-1.5 py-0.5 rounded-none" style="border-color: var(--yorha-border); color: var(--yorha-text-muted);">
            Updated {resume.lastUpdated}
          </span>
        {/if}
      </div>

      <!-- Action Buttons (Pure Typographic, Zero Icons) -->
      <div class="flex items-center gap-2 font-mono text-[11px]">
        <button
          type="button"
          onclick={printDoc}
          class="inline-flex items-center border px-2.5 py-1 transition-colors cursor-pointer rounded-none yorha-invert-hover"
          style="border-color: var(--yorha-border); background-color: var(--yorha-surface); color: var(--yorha-text-primary);"
        >
          [ PRINT / SAVE ]
        </button>
        <a
          href={resume.url}
          download={resume.filename}
          class="inline-flex items-center border px-2.5 py-1 transition-colors rounded-none yorha-invert-hover"
          style="border-color: var(--yorha-accent-border); background-color: var(--yorha-accent-subtle); color: var(--yorha-accent);"
        >
          [ DOWNLOAD PDF ]
        </a>
        <button
          type="button"
          onclick={close}
          class="grid h-7 w-7 place-items-center rounded-none border transition-colors cursor-pointer yorha-invert-hover"
          style="border-color: var(--yorha-border); background-color: var(--yorha-surface); color: var(--yorha-text-primary);"
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>
    </header>

    <!-- Document Viewer Body (Scrollable Crisp Resume Canvas) -->
    <div class="relative flex-1 w-full overflow-y-auto p-4 sm:p-8 lg:p-12" style="background-color: var(--yorha-surface); color: var(--yorha-text-primary);">
      <article class="mx-auto max-w-3xl rounded-none border p-6 sm:p-10 lg:p-12 shadow-xl space-y-8 font-sans" style="background-color: var(--yorha-bg); border-color: var(--yorha-border);">
        
        <!-- Header Profile -->
        <div class="border-b pb-6" style="border-color: var(--yorha-border);">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight" style="color: var(--yorha-text-primary);">
              Bakti Surya Atmaja
            </h1>
            <span class="font-mono text-xs uppercase tracking-widest" style="color: var(--yorha-accent);">
              {availability.status}
            </span>
          </div>
          <p class="mt-1 text-sm font-mono uppercase tracking-[0.16em]" style="color: var(--yorha-text-muted);">
            Full-stack Developer · Cloud & Homelab Infrastructure
          </p>
          <div class="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] border-t pt-3" style="border-color: var(--yorha-border); color: var(--yorha-text-muted);">
            <span>contact@suryatmaja.dev</span>
            <span>·</span>
            <span>github.com/srytmj</span>
            <span>·</span>
            <span>linkedin.com/in/suryatmaja</span>
            <span>·</span>
            <span>WIB · UTC+7</span>
          </div>
        </div>

        <!-- Executive Summary -->
        <section class="space-y-2">
          <h3 class="font-mono text-xs uppercase tracking-[0.2em]" style="color: var(--yorha-accent);">
            Summary
          </h3>
          <p class="text-sm leading-relaxed max-w-[var(--measure)]" style="color: var(--yorha-text-muted);">
            Full-stack developer with over 4 years of engineering practical web applications and running the cloud and self-hosted homelab infrastructure they scale on. Dedicated to low-overhead system designs, automated deployment pipelines, and high availability architectures.
          </p>
        </section>

        <!-- Technical Telemetry / Stats -->
        <section class="grid grid-cols-2 sm:grid-cols-4 gap-2 border-y py-3.5 font-mono text-center" style="border-color: var(--yorha-border);">
          {#each stats as item}
            <div class="space-y-0.5">
              <div class="text-lg font-light" style="color: var(--yorha-text-primary);">{item.value}</div>
              <div class="text-[9px] uppercase tracking-wider" style="color: var(--yorha-text-muted);">{item.label}</div>
            </div>
          {/each}
        </section>

        <!-- Core Infrastructure & Experience -->
        <section class="space-y-4">
          <h3 class="font-mono text-xs uppercase tracking-[0.2em]" style="color: var(--yorha-accent);">
            Engineering Experience & Systems
          </h3>

          <div class="space-y-4">
            <div class="space-y-1.5 border-l-2 pl-4" style="border-color: var(--yorha-accent);">
              <div class="flex flex-wrap items-baseline justify-between gap-1">
                <h4 class="text-sm font-medium" style="color: var(--yorha-text-primary);">Homelab Cluster & Cloud Infrastructure Operations</h4>
                <span class="font-mono text-[10px]" style="color: var(--yorha-text-muted);">2022 — Present</span>
              </div>
              <p class="text-xs font-mono" style="color: var(--yorha-text-muted);">Proxmox VE · AWS Multi-AZ · Docker · Linux (Debian) · Reverse Proxies</p>
              <ul class="mt-2 space-y-1 text-xs list-disc list-inside" style="color: var(--yorha-text-muted);">
                <li>Architected and actively maintain multi-node virtualization cluster hosting 15+ containerized production & lab services with 99.9% uptime.</li>
                <li>Engineered Highly Available Web Server architecture on AWS utilizing VPC, Multi-AZ Auto Scaling groups, Application Load Balancers, and managed RDS.</li>
                <li>Automated backup pipelines, offsite replication, reverse proxy routing, and local network DNS services.</li>
              </ul>
            </div>

            <div class="space-y-1.5 border-l-2 pl-4" style="border-color: var(--yorha-accent);">
              <div class="flex flex-wrap items-baseline justify-between gap-1">
                <h4 class="text-sm font-medium" style="color: var(--yorha-text-primary);">Full-Stack Application Development</h4>
                <span class="font-mono text-[10px]" style="color: var(--yorha-text-muted);">2020 — Present</span>
              </div>
              <p class="text-xs font-mono" style="color: var(--yorha-text-muted);">SvelteKit · Go · TypeScript · Laravel · PostgreSQL · Redis</p>
              <ul class="mt-2 space-y-1 text-xs list-disc list-inside" style="color: var(--yorha-text-muted);">
                <li>Built <strong>White Archive</strong>: responsive digital preservation web platform with automated data backup pipelines and lightweight client performance.</li>
                <li>Designed <strong>Realtime Group Checklist</strong>: multi-client collaboration system using WebSockets and Redis pub/sub synchronization.</li>
                <li>Developed enterprise point-of-sale accounting systems with double-entry ledgers and audit log tracking.</li>
                <li>Implemented concurrency-safe banking CLI system with transactional journaling and integrity constraints.</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Technical Stack -->
        <section class="space-y-3">
          <h3 class="font-mono text-xs uppercase tracking-[0.2em]" style="color: var(--yorha-accent);">
            Technical Stack & Tools
          </h3>
          <div class="grid gap-2 sm:grid-cols-2 text-xs font-mono">
            <div class="border p-2.5 rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border);">
              <span class="text-[10px] uppercase tracking-wider block mb-1" style="color: var(--yorha-text-muted);">Languages & Frameworks</span>
              <span style="color: var(--yorha-text-primary);">Go, TypeScript, JavaScript, PHP, Python, SvelteKit, React, Laravel, Tailwind CSS</span>
            </div>
            <div class="border p-2.5 rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border);">
              <span class="text-[10px] uppercase tracking-wider block mb-1" style="color: var(--yorha-text-muted);">Cloud & Infrastructure</span>
              <span style="color: var(--yorha-text-primary);">AWS (EC2, VPC, ALB, S3, RDS), Docker, Proxmox VE, Linux (Debian, Ubuntu), Nginx, Cloudflare</span>
            </div>
            <div class="border p-2.5 rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border);">
              <span class="text-[10px] uppercase tracking-wider block mb-1" style="color: var(--yorha-text-muted);">Databases & State</span>
              <span style="color: var(--yorha-text-primary);">PostgreSQL, MySQL, Redis, SQLite, MinIO S3</span>
            </div>
            <div class="border p-2.5 rounded-none" style="background-color: var(--yorha-surface); border-color: var(--yorha-border);">
              <span class="text-[10px] uppercase tracking-wider block mb-1" style="color: var(--yorha-text-muted);">Target Roles</span>
              <span class="font-medium" style="color: var(--yorha-accent);">Full-stack Developer, Backend Engineer, Cloud & DevOps</span>
            </div>
          </div>
        </section>

        <!-- Working Philosophy -->
        <section class="border-t pt-4 font-mono text-[11px] flex flex-wrap gap-x-6 gap-y-1" style="border-color: var(--yorha-border); color: var(--yorha-text-muted);">
          <span>"If it's manual twice, it gets scripted."</span>
          <span>"Small PRs, boring deploys."</span>
          <span>"Fewer moving parts beats clever."</span>
        </section>

      </article>
    </div>
  </div>
</div>
