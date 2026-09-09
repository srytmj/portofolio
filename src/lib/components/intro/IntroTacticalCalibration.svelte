<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';

  /**
   * Concept 3: Tactical HUD Calibration (Professional Minimalist & Themed)
   * - 100% Light/Dark mode support via Tailwind `dark:` variants.
   * - Generic professional naming (removed Yorha OS).
   * - Real Browser Loading Sync: Ties the UI progress gauge to the actual window load event.
   * 
   * @type {{ onDone?: () => void, timeScale?: number }}
   */
  let { onDone = () => {}, timeScale = 1 } = $props();

  let root;
  let scanline;
  let arcGauge;
  let reticleBox;
  let crosshair;

  // Telemetry Data (Realistic & Calm)
  let calibPercent = $state(0);
  let lockStateText = $state('OPTICAL_ALIGN // IN_PROGRESS');
  let raCoord = $state('21h 18m 33.40s');
  let decCoord = $state('+45° 16\' 49.2"');
  let hexStream = $state('0x00A1\n0x00B2\n0x00C3');

  // Light/Dark Mode Responsive Color States (Neutral -> Tactical Emerald)
  let primaryText = $state('text-neutral-900 dark:text-white');
  let primaryBg = $state('bg-neutral-900 dark:bg-white');
  let primaryBorder = $state('border-neutral-900/60 dark:border-white/60');

  let finished = false;
  function done() {
    if (finished) return;
    finished = true;
    onDone();
  }

  let tl;
  let mockLoad;
  let interval;
  let rot1, rot2;
  let minTimeTimeout;

  onMount(() => {
    const hexChars = '0123456789ABCDEF';
    let tickerCount = 0;

    interval = setInterval(() => {
      tickerCount++;
      // Smooth, precise jitter
      raCoord = `21h 18m ${(33 + Math.random() * 0.1).toFixed(2)}s`;
      decCoord = `+45° 16' ${(49 + Math.random() * 0.1).toFixed(1)}"`;
      
      if (tickerCount % 4 === 0) {
        hexStream = Array.from({ length: 3 }, () => 
          '0x' + hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)]
        ).join('\n');
      }
    }, 80);

    // Continuous smooth optical rotations
    rot1 = gsap.to('.anim-rotate-slow', { rotate: 360, duration: 40, repeat: -1, ease: 'none' });
    rot2 = gsap.to('.anim-rotate-slow-rev', { rotate: -360, duration: 60, repeat: -1, ease: 'none' });

    tl = gsap.timeline({
      onComplete: () => {
        done();
      }
    });
    tl.timeScale(timeScale);

    // Initial Animation States
    gsap.set('.anim-slide-down', { y: -30, autoAlpha: 0 });
    gsap.set('.anim-slide-up', { y: 30, autoAlpha: 0 });
    gsap.set('.anim-slide-left', { x: 30, autoAlpha: 0 });
    gsap.set('.anim-slide-right', { x: -30, autoAlpha: 0 });
    gsap.set('.anim-fade', { autoAlpha: 0, scale: 0.95 });
    gsap.set(scanline, { top: '-5%', autoAlpha: 0 });

    // Phase 1: Boot Sequence
    tl.to(scanline, { top: '105%', autoAlpha: 0.3, duration: 1.0, ease: 'power2.inOut' }, 0.1);
    tl.to('.anim-fade', { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'expo.out' }, 0.2);
    
    // Phase 2: UI Reveal
    tl.to('.anim-slide-down', { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 0.4);
    tl.to('.anim-slide-up', { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 0.5);
    tl.to(['.anim-slide-left', '.anim-slide-right'], { x: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, 0.6);

    // ==========================================
    // SYNC POINT: Pause timeline until real assets are loaded
    // ==========================================
    tl.addLabel('sync-wait');
    tl.call(() => {
        tl.pause();
    });

    // Phase 4: Target Lock (Resumes when actual load is 100%)
    tl.to(reticleBox, { rotate: 90, duration: 0.5, ease: 'power3.inOut' }, 'sync-wait+=0.1');
    tl.to(reticleBox, { rotate: 0, duration: 0.6, ease: 'back.out(1.2)' }, '+=0.1');

    tl.call(() => {
      lockStateText = 'TARGET_LOCKED // SYSTEM_SYNC';
      primaryText = 'text-emerald-600 dark:text-emerald-400';
      primaryBg = 'bg-emerald-600 dark:bg-emerald-400';
      primaryBorder = 'border-emerald-600 dark:border-emerald-400';
    }, null, '-=0.2');

    tl.to(crosshair, { scale: 3, duration: 0.2, ease: 'power2.out' }, '-=0.2');
    tl.to(crosshair, { scale: 1, duration: 0.4, ease: 'power2.in' }, '+=0.1');

    // Phase 5: Exit Sequence
    tl.to('.anim-fade', { scale: 1.1, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, '+=0.4');
    tl.to(['.anim-slide-down', '.anim-slide-up', '.anim-slide-left', '.anim-slide-right'], { 
      autoAlpha: 0, scale: 0.95, duration: 0.3, ease: 'power2.in' 
    }, '-=0.3');

    tl.to(root, { autoAlpha: 0, duration: 0.4, ease: 'power2.inOut' }, '+=0.1');

    // ==========================================
    // REAL BROWSER LOADING SYNC LOGIC
    // ==========================================
    const progressObj = { val: 0 };
    function updateGauge() {
      calibPercent = Math.floor(progressObj.val);
      if (arcGauge) {
        const maxDash = 302; // 2 * PI * 48
        arcGauge.style.strokeDashoffset = String(maxDash - (progressObj.val / 100) * maxDash);
      }
    }

    // "Mock" load that crawls slowly to 85% if the network is taking time
    mockLoad = gsap.to(progressObj, {
      val: 85,
      duration: 3.5,
      ease: "power2.out",
      onUpdate: updateGauge
    });

    let minTimePassed = false;
    let windowLoaded = document.readyState === 'complete';

    // 1. Force a minimum display time of 1.8s so the user actually sees the intro on fast networks
    minTimeTimeout = setTimeout(() => {
      minTimePassed = true;
      checkProceed();
    }, 1800);

    // 2. Track real window loading
    const handleLoad = () => {
      windowLoaded = true;
      checkProceed();
    };

    if (!windowLoaded) {
      window.addEventListener('load', handleLoad);
    }

    function checkProceed() {
      if (minTimePassed && windowLoaded) {
        if (mockLoad) mockLoad.kill();
        
        // Swiftly complete the gauge to 100%
        gsap.to(progressObj, {
          val: 100,
          duration: 0.4,
          ease: "power2.out",
          onUpdate: updateGauge,
          onComplete: () => {
            if (tl.paused()) tl.play(); // Resume the GSAP sequence!
          }
        });
      }
    }

    // Universal Skip Logic
    function skip() {
      if (finished) return;
      cleanup();
      gsap.to(root, { autoAlpha: 0, duration: 0.2, onComplete: done });
    }

    function onKeyDown(e) { 
      if (e.key === 'Escape' || e.key === ' ') { e.preventDefault(); skip(); } 
    }
    
    root.addEventListener('click', skip);
    window.addEventListener('keydown', onKeyDown);

    function cleanup() {
      clearInterval(interval);
      clearTimeout(minTimeTimeout);
      window.removeEventListener('load', handleLoad);
      if (rot1) rot1.kill(); 
      if (rot2) rot2.kill();
      if (mockLoad) mockLoad.kill();
      if (tl) tl.kill();
      root?.removeEventListener('click', skip);
      window?.removeEventListener('keydown', onKeyDown);
    }

    return cleanup;
  });
</script>

<div bind:this={root} class="fixed inset-0 z-[100] bg-neutral-50 dark:bg-black select-none cursor-pointer font-mono text-neutral-800 dark:text-neutral-300 font-light overflow-hidden transition-colors duration-500" role="presentation" aria-hidden="true">
  
  <!-- 1. Background Grid (Light & Dark Support) -->
  <div class="pointer-events-none absolute inset-0 opacity-[0.15] hidden dark:block" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 32px 32px;"></div>
  <div class="pointer-events-none absolute inset-0 opacity-[0.15] dark:hidden" style="background-image: radial-gradient(#000000 1px, transparent 1px); background-size: 32px 32px;"></div>
  
  <!-- Vignette -->
  <div class="pointer-events-none absolute inset-0 hidden dark:block bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]"></div>
  <div class="pointer-events-none absolute inset-0 dark:hidden bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.85)_100%)]"></div>
  
  <!-- Laser Scanline -->
  <div bind:this={scanline} class="pointer-events-none absolute inset-x-0 h-[1px] bg-neutral-900/40 dark:bg-white/40 shadow-[0_0_15px_1px_rgba(0,0,0,0.3)] dark:shadow-[0_0_15px_1px_rgba(255,255,255,0.3)] z-30"></div>

  <!-- Corner Screen Brackets -->
  <div class="pointer-events-none absolute top-6 left-6 md:top-8 md:left-8 w-6 h-6 border-t border-l border-neutral-900/30 dark:border-white/30 anim-fade"></div>
  <div class="pointer-events-none absolute top-6 right-6 md:top-8 md:right-8 w-6 h-6 border-t border-r border-neutral-900/30 dark:border-white/30 anim-fade"></div>
  <div class="pointer-events-none absolute bottom-6 left-6 md:bottom-8 md:left-8 w-6 h-6 border-b border-l border-neutral-900/30 dark:border-white/30 anim-fade"></div>
  <div class="pointer-events-none absolute bottom-6 right-6 md:bottom-8 md:right-8 w-6 h-6 border-b border-r border-neutral-900/30 dark:border-white/30 anim-fade"></div>

  <!-- 2. Top Header -->
  <div class="absolute top-0 inset-x-0 p-6 md:p-8 flex justify-between items-start z-20 pointer-events-none anim-slide-down">
    <!-- Left Side -->
    <div class="flex flex-col gap-2">
      <div class="bg-neutral-200/80 dark:bg-neutral-950/80 border border-neutral-900/10 dark:border-white/10 backdrop-blur-md px-4 py-2 flex items-center gap-3 shadow-sm">
        <div class="w-1.5 h-1.5 bg-neutral-900 dark:bg-white animate-pulse"></div>
        <span class="text-[10px] md:text-xs tracking-[0.2em] font-bold text-neutral-900 dark:text-white uppercase">SYS_CALIBRATION // OPTICS</span>
      </div>
      <div class="text-[8px] md:text-[9px] text-neutral-900/40 dark:text-white/40 tracking-[0.3em] pl-1">SYS_VER 11.43.2</div>
    </div>

    <!-- Right Side -->
    <div class="hidden sm:flex flex-col items-end gap-2">
      <div class="bg-neutral-200/80 dark:bg-neutral-950/80 border border-neutral-900/10 dark:border-white/10 backdrop-blur-md px-4 py-2 text-right shadow-sm">
        <span class="text-[10px] md:text-xs tracking-[0.2em] text-neutral-900/50 dark:text-white/50 mr-3">LATENCY</span>
        <span class="text-[10px] md:text-xs tracking-widest text-neutral-900 dark:text-white font-bold">1.2ms</span>
      </div>
      <div class="text-[8px] md:text-[9px] text-neutral-900/40 dark:text-white/40 tracking-[0.3em] pr-1">UPLINK SECURE</div>
    </div>
  </div>

  <!-- 3. Center Target Field -->
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10 anim-fade">
    <div class="relative w-[85vw] max-w-[480px] aspect-square flex items-center justify-center">
      
      <!-- Outer Compass SVG (Color inherited automatically) -->
      <svg class="absolute inset-0 w-full h-full text-neutral-900/30 dark:text-white/30 anim-rotate-slow" viewBox="0 0 200 200">
        {#each Array(120) as _, i}
          <line x1="100" y1="4" x2="100" y2={i % 10 === 0 ? 12 : i % 5 === 0 ? 8 : 6} stroke="currentColor" stroke-width="0.5" transform={`rotate(${i * 3} 100 100)`} />
        {/each}
        <circle cx="100" cy="100" r="96" stroke="currentColor" stroke-width="0.3" fill="none" />
        <circle cx="100" cy="100" r="85" stroke="currentColor" stroke-width="0.3" stroke-dasharray="2 4" fill="none" />
      </svg>

      <!-- Inner Aperture SVG -->
      <svg class="absolute inset-[15%] w-[70%] h-[70%] text-neutral-900/40 dark:text-white/40 anim-rotate-slow-rev" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" stroke="currentColor" stroke-width="0.4" stroke-dasharray="10 15 2 15" fill="none" />
        {#each Array(4) as _, i}
          <path d="M 100 10 A 90 90 0 0 1 130 14" stroke="currentColor" stroke-width="1.5" fill="none" transform={`rotate(${i * 90} 100 100)`} />
        {/each}
      </svg>

      <!-- Progress Gauge SVG -->
      <svg class="absolute inset-[25%] w-[50%] h-[50%] -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" stroke="currentColor" stroke-width="1.5" fill="none" class="text-neutral-900/10 dark:text-white/10" />
        <circle bind:this={arcGauge} cx="50" cy="50" r="48" stroke="currentColor" stroke-width="1.5" stroke-dasharray="302" stroke-dashoffset="302" stroke-linecap="butt" fill="none" class="transition-colors duration-500 {primaryText}" />
      </svg>

      <!-- Center Reticle Frame -->
      <div bind:this={reticleBox} class="relative w-[30%] h-[30%] flex items-center justify-center">
        <div class="absolute top-0 left-0 w-3 h-3 md:w-4 md:h-4 border-t border-l transition-colors duration-500 {primaryBorder}"></div>
        <div class="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 border-t border-r transition-colors duration-500 {primaryBorder}"></div>
        <div class="absolute bottom-0 left-0 w-3 h-3 md:w-4 md:h-4 border-b border-l transition-colors duration-500 {primaryBorder}"></div>
        <div class="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 border-b border-r transition-colors duration-500 {primaryBorder}"></div>
        
        <div bind:this={crosshair} class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors duration-500 shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:shadow-[0_0_8px_rgba(255,255,255,0.3)] {primaryBg}"></div>
      </div>
    </div>
  </div>

  <!-- 4. Left Sidebar -->
  <div class="hidden lg:flex absolute left-8 inset-y-0 items-center pointer-events-none z-10 anim-slide-right">
    <div class="relative h-1/2 w-16 border-r border-neutral-900/10 dark:border-white/10 flex flex-col justify-between items-end pr-3 py-4 text-[9px] text-neutral-900/40 dark:text-white/40 tracking-widest">
      <div class="flex items-center gap-2"><span>+90</span><div class="w-3 h-px bg-neutral-900/30 dark:bg-white/30"></div></div>
      <div class="flex items-center gap-2"><span>+45</span><div class="w-2 h-px bg-neutral-900/20 dark:bg-white/20"></div></div>
      <div class="flex items-center gap-2 font-bold transition-colors duration-500 {primaryText}">
        <span>000</span><div class="w-4 h-px transition-colors duration-500 {primaryBg}"></div>
      </div>
      <div class="flex items-center gap-2"><span>-45</span><div class="w-2 h-px bg-neutral-900/20 dark:bg-white/20"></div></div>
      <div class="flex items-center gap-2"><span>-90</span><div class="w-3 h-px bg-neutral-900/30 dark:bg-white/30"></div></div>
    </div>
  </div>

  <!-- 5. Right Sidebar -->
  <div class="hidden lg:flex absolute right-8 inset-y-0 items-center pointer-events-none z-10 anim-slide-left">
    <div class="relative h-1/2 w-40 border-l border-neutral-900/10 dark:border-white/10 flex flex-col justify-between pl-4 py-4 text-[9px] tracking-widest">
      <div class="space-y-6">
        <div>
          <div class="text-neutral-900/40 dark:text-white/30 mb-1">RA (J2000)</div>
          <div class="font-mono text-xs transition-colors duration-500 {primaryText}">{raCoord}</div>
        </div>
        <div>
          <div class="text-neutral-900/40 dark:text-white/30 mb-1">DEC (J2000)</div>
          <div class="font-mono text-xs transition-colors duration-500 {primaryText}">{decCoord}</div>
        </div>
      </div>
      <div>
        <div class="text-neutral-900/40 dark:text-white/30 mb-2">HEX_DUMP</div>
        <div class="text-neutral-900/60 dark:text-white/50 font-mono leading-loose whitespace-pre">{hexStream}</div>
      </div>
    </div>
  </div>

  <!-- 6. Bottom Footer -->
  <div class="absolute bottom-0 inset-x-0 p-6 md:p-8 flex flex-col items-center justify-end z-20 pointer-events-none anim-slide-up">
    
    <div class="text-[8px] md:text-[9px] text-neutral-900/40 dark:text-white/30 uppercase tracking-[0.4em] mb-4">
      [ OVERRIDE_SEQUENCE: CLICK OR SPACE TO BYPASS ]
    </div>

    <div class="w-full max-w-4xl bg-neutral-100/90 dark:bg-neutral-950/80 border border-neutral-900/10 dark:border-white/10 backdrop-blur-md px-6 py-4 flex flex-wrap justify-between items-center gap-4 shadow-lg">
      <div class="flex items-center gap-3">
        <span class="text-[9px] md:text-[10px] text-neutral-900/40 dark:text-white/40 tracking-[0.2em] uppercase">STATUS</span>
        <span class="text-[10px] md:text-xs tracking-[0.2em] font-bold transition-colors duration-500 {primaryText}">
          {lockStateText}
        </span>
      </div>

      <div class="hidden md:block text-[9px] text-neutral-900/40 dark:text-white/30 tracking-[0.4em]">
        SYSTEM_OVERRIDE_READY
      </div>

      <div class="flex items-center gap-3">
        <span class="text-[9px] md:text-[10px] text-neutral-900/40 dark:text-white/40 tracking-[0.2em] uppercase">SYNC</span>
        <span class="text-[10px] md:text-xs tracking-[0.2em] font-bold transition-colors duration-500 {primaryText}">
          {calibPercent}%
        </span>
      </div>
    </div>
  </div>
</div>
