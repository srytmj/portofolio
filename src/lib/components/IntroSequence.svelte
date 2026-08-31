<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ease } from '$lib/motion.js';

  /** @type {{ onDone: () => void }} */
  let { onDone } = $props();

  /** @type {HTMLElement} */ let root;
  /** @type {HTMLElement} */ let textEl;
  /** @type {HTMLElement} */ let field;

  // One first star at the centre, then a scatter that spreads outward — later
  // dots sit further out so they "ignite" in expanding rings. Kept clear of the
  // middle so the line stays readable over them.
  const N = 30;
  const points = [{ x: 0, y: 0 }];
  for (let i = 1; i < N; i++) {
    const ang = Math.random() * Math.PI * 2;
    const r = 90 + Math.pow(i / N, 0.6) * 320;
    points.push({ x: Math.cos(ang) * r, y: Math.sin(ang) * r * 0.66 });
  }

  let finished = false;
  function done() {
    if (finished) return;
    finished = true;
    try {
      window.scrollTo(0, 0);
    } catch {
      /* ignore */
    }
    onDone();
  }

  onMount(() => {
    try {
      sessionStorage.setItem('intro:seen', '1');
    } catch {
      /* private mode — it just plays once and never records */
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const dots = gsap.utils.toArray(field.querySelectorAll('.dot'));
    let skipping = false;

    const tl = gsap.timeline({ onComplete: done });
    tl.set(dots, { scale: 0, autoAlpha: 0 });
    tl.set(textEl, { autoAlpha: 0, y: 8 });

    // the first star
    tl.to(dots[0], { scale: 1, autoAlpha: 1, duration: 0.7, ease: ease.out });
    // the rest light up progressively, from the centre outward
    tl.to(
      dots.slice(1),
      {
        scale: 1,
        autoAlpha: 1,
        duration: 0.55,
        ease: ease.out,
        stagger: { each: 0.05, from: 'start' }
      },
      0.5
    );
    tl.to({}, { duration: 0.35 }); // let the field settle
    // "Alone, a star. Together, a constellation." — the field recedes so the
    // line reads cleanly over it.
    tl.to(textEl, { autoAlpha: 1, y: 0, duration: 0.8, ease: ease.out });
    tl.to(
      dots,
      { autoAlpha: 0.3, scale: 0.88, duration: 0.8, ease: 'power1.inOut' },
      '<'
    );
    tl.to({}, { duration: 1.2 }); // hold
    tl.to(root, { autoAlpha: 0, duration: 0.6, ease: 'power1.inOut' });
    // total ≈ 4.8s

    function skip() {
      if (skipping || finished) return;
      skipping = true;
      tl.kill();
      gsap.to(root, {
        autoAlpha: 0,
        duration: 0.16,
        ease: 'power1.in',
        onComplete: done
      });
    }

    root.addEventListener('click', skip);
    root.addEventListener('touchstart', skip, { passive: true });
    const onKey = () => skip();
    window.addEventListener('keydown', onKey);

    return () => {
      tl.kill();
      document.body.style.overflow = prevOverflow;
      root.removeEventListener('click', skip);
      root.removeEventListener('touchstart', skip);
      window.removeEventListener('keydown', onKey);
    };
  });
</script>

<div
  bind:this={root}
  class="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
  role="presentation"
  aria-hidden="true"
>
  <div bind:this={field} class="pointer-events-none absolute left-1/2 top-1/2">
    {#each points as p, i}
      <span
        class="dot absolute rounded-full bg-white"
        class:first={i === 0}
        style="left:{p.x}px; top:{p.y}px;"
      ></span>
    {/each}
  </div>

  <p
    bind:this={textEl}
    class="pointer-events-none relative max-w-md px-6 text-center font-serif text-2xl italic text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.95),0_0_3px_rgba(0,0,0,0.9)]"
  >
    Alone, a star. Together, a constellation.
  </p>
</div>

<style>
  .dot {
    width: 3px;
    height: 3px;
    margin: -1.5px 0 0 -1.5px;
    box-shadow: 0 0 6px 1px rgba(255, 255, 255, 0.45);
  }
  .dot.first {
    width: 4px;
    height: 4px;
    margin: -2px 0 0 -2px;
    box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.6);
  }
</style>
