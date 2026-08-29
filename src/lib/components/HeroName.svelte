<script>
  /** @type {{ title: string, line: string }} */
  let { title, line } = $props();
</script>

<div class="mx-auto flex max-w-3xl select-none flex-col items-center gap-4 text-center">
  <h1
    class="text-[clamp(2.2rem,7vw,4.25rem)] font-semibold uppercase leading-[0.95] tracking-tight text-white [text-shadow:0_2px_40px_rgba(0,0,0,0.75)]"
  >
    {title}
  </h1>
  <p
    class="max-w-lg text-balance font-sans text-[clamp(1rem,2.3vw,1.25rem)] font-normal leading-relaxed text-white/60 [text-shadow:0_1px_20px_rgba(0,0,0,0.85)]"
  >
    {line}
  </p>
</div>
