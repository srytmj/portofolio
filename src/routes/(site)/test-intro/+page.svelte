<script>
  import IntroConstellation from '$lib/components/intro/IntroConstellation.svelte';
  import IntroCalibration from '$lib/components/intro/IntroCalibration.svelte';
  import IntroTacticalCalibration from '$lib/components/intro/IntroTacticalCalibration.svelte';

  let currentConcept = $state(3); // Default to 3 (Upgraded Tactical HUD)
  let isPlaying = $state(true);
  let timeScale = $state(1.0);
  let replayKey = $state(0);

  /** @param {number} num */
  function playConcept(num) {
    currentConcept = num;
    replay();
  }

  function replay() {
    isPlaying = false;
    setTimeout(() => {
      replayKey++;
      isPlaying = true;
    }, 50);
  }

  function handleDone() {
    isPlaying = false;
  }

  /** @param {KeyboardEvent} e */
  function handleKeydown(e) {
    if (e.code === 'Space') {
      e.preventDefault();
      replay();
    } else if (e.key === '1') {
      playConcept(1);
    } else if (e.key === '2') {
      playConcept(2);
    } else if (e.key === '3') {
      playConcept(3);
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
  <title>Intro Concept Arena — Bakti Surya Atmaja</title>
</svelte:head>

<div class="relative min-h-screen w-full bg-black text-white font-mono flex flex-col justify-between select-none overflow-hidden">
  <!-- SIMULATED HERO BACKGROUND (What you see when the intro finishes) -->
  <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 opacity-90">
    <div class="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
    
    <div class="relative max-w-xl space-y-4 border border-white/15 p-8 backdrop-blur-sm bg-white/[0.02]">
      <span class="text-[10px] uppercase tracking-[0.3em] text-emerald-400">
        [ SYSTEM ONLINE // SECTOR_01 ]
      </span>
      <h1 class="text-3xl font-display font-bold tracking-tight">
        Bakti Surya Atmaja
      </h1>
      <p class="text-xs text-neutral-400 font-mono leading-relaxed">
        Production Engineering, Cloud Architecture, and High-Availability Distributed Systems.
      </p>
      <div class="pt-2 flex justify-center gap-2 text-[10px]">
        <span class="border border-white/20 px-2 py-1">✦ 89 CONSTELLATIONS</span>
        <span class="border border-white/20 px-2 py-1">POD-042 HUD ACTIVE</span>
      </div>
    </div>
  </div>

  <!-- THE ACTIVE INTRO SEQUENCE COMPONENT -->
  {#if isPlaying}
    {#key replayKey}
      {#if currentConcept === 1}
        <IntroConstellation onDone={handleDone} {timeScale} />
      {:else if currentConcept === 2}
        <IntroCalibration onDone={handleDone} {timeScale} />
      {:else}
        <IntroTacticalCalibration onDone={handleDone} {timeScale} />
      {/if}
    {/key}
  {/if}

  <!-- TOP BAR INFO -->
  <header class="relative z-50 p-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-black/80 backdrop-blur-md text-xs">
    <div class="flex items-center gap-3">
      <a href="/" class="hover:underline text-neutral-400 hover:text-white transition-colors">
        ← Return Home
      </a>
      <span class="text-neutral-600">/</span>
      <span class="text-white font-bold tracking-wider">
        [ INTRO COMPARISON ARENA ]
      </span>
    </div>

    <div class="text-[11px] text-neutral-400">
      Press <kbd class="px-1.5 py-0.5 border border-white/20 bg-white/5">1</kbd> Constellation · <kbd class="px-1.5 py-0.5 border border-white/20 bg-white/5">2</kbd> YoRHa Base · <kbd class="px-1.5 py-0.5 border border-white/20 bg-white/5">3</kbd> Tactical Masterrace · <kbd class="px-1.5 py-0.5 border border-white/20 bg-white/5">Space</kbd> Replay
    </div>
  </header>

  <!-- BOTTOM FLOATING CONTROLLER BAR -->
  <footer class="relative z-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 bg-black/90 backdrop-blur-lg">
    <!-- Concept Switcher Tabs -->
    <div class="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onclick={() => playConcept(1)}
        class="px-3.5 py-2 text-xs font-mono tracking-wider uppercase border transition-all cursor-pointer {currentConcept === 1
          ? 'bg-white text-black font-bold border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
          : 'bg-white/5 text-neutral-300 border-white/20 hover:border-white/60 hover:text-white'}"
      >
        <span>[ 1 ] Constellation</span>
      </button>

      <button
        type="button"
        onclick={() => playConcept(2)}
        class="px-3.5 py-2 text-xs font-mono tracking-wider uppercase border transition-all cursor-pointer {currentConcept === 2
          ? 'bg-white text-black font-bold border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
          : 'bg-white/5 text-neutral-300 border-white/20 hover:border-white/60 hover:text-white'}"
      >
        <span>[ 2 ] YoRHa Base</span>
      </button>

      <button
        type="button"
        onclick={() => playConcept(3)}
        class="px-3.5 py-2 text-xs font-mono tracking-wider uppercase border transition-all cursor-pointer {currentConcept === 3
          ? 'bg-emerald-400 text-black font-bold border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
          : 'bg-white/5 text-neutral-300 border-white/20 hover:border-white/60 hover:text-white'}"
      >
        <span>[ 3 ] YoRHa Tactical Masterrace</span>
      </button>
    </div>

    <!-- Replay & Playback Controls -->
    <div class="flex items-center gap-3">
      <!-- Speed selector -->
      <div class="flex items-center gap-1 border border-white/20 p-1 text-[10px]">
        <span class="px-1.5 text-neutral-500 uppercase">Speed:</span>
        <button
          type="button"
          onclick={() => { timeScale = 1.0; replay(); }}
          class="px-2 py-0.5 cursor-pointer {timeScale === 1.0 ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'}"
        >
          1.0x
        </button>
        <button
          type="button"
          onclick={() => { timeScale = 0.5; replay(); }}
          class="px-2 py-0.5 cursor-pointer {timeScale === 0.5 ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'}"
        >
          0.5x
        </button>
      </div>

      <!-- Replay Button -->
      <button
        type="button"
        onclick={replay}
        class="px-5 py-2.5 bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider border border-emerald-400 cursor-pointer hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
      >
        <span>⟳</span>
        <span>Replay Intro</span>
      </button>
    </div>
  </footer>
</div>
