<script>
  import { onMount } from 'svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  
  // This is a dedicated playground page for the user to test UI components.
</script>

<svelte:head>
  <title>Sandbox // YoRHa</title>
</svelte:head>

<div class="min-h-screen pt-32 pb-20 wrap">
  <header class="mb-12 border-b border-neutral-900/10 dark:border-white/10 pb-6 flex justify-between items-end">
    <div>
      <h1 class="font-sans text-3xl font-bold tracking-widest uppercase text-neutral-900 dark:text-white mb-2">UI Sandbox</h1>
      <p class="font-mono text-xs tracking-[0.2em] text-neutral-900/50 dark:text-white/50 uppercase">
        Experimental Zone // Component Stress Test
      </p>
    </div>
    <div class="flex items-center gap-4">
      <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-900/40 dark:text-white/40">Toggle Theme</span>
      <ThemeToggle />
    </div>
  </header>

  <section class="space-y-16">
    <!-- Test Block 1 -->
    <div class="border border-neutral-900/10 dark:border-white/10 p-8 bg-neutral-200/20 dark:bg-neutral-900/20">
      <h2 class="font-sans text-xs tracking-[0.3em] uppercase text-neutral-900/60 dark:text-white/60 mb-6 flex items-center gap-4">
        <span class="w-2 h-2 bg-neutral-900 dark:bg-white inline-block"></span>
        Typography & Colors
      </h2>
      
      <div class="space-y-6">
        <h3 class="font-serif text-4xl">The quick brown fox jumps over the lazy dog.</h3>
        <p class="font-mono text-sm leading-loose text-neutral-900/70 dark:text-white/70">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        
        <div class="flex gap-4 pt-4">
          <button class="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity">
            Primary Action
          </button>
          <button class="px-6 py-2 border border-neutral-900 dark:border-white text-neutral-900 dark:text-white font-mono text-xs tracking-widest uppercase hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
            Secondary Action
          </button>
        </div>
      </div>
    </div>
  </section>
</div>
