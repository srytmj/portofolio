import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll, wired into GSAP's ticker so ScrollTrigger (the hero
 * pin) stays perfectly in sync. Lenis scrolls the real window, so no
 * scrollerProxy is needed — ScrollTrigger reads the native scroll position.
 *
 * Client-only. No-ops under prefers-reduced-motion so native scrolling and
 * assistive tech behave normally.
 *
 * @returns {() => void} cleanup
 */
export function initSmoothScroll() {
  if (typeof window === 'undefined') return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const lenis = new Lenis({
    duration: 1.1,
    lerp: 0.1,
    smoothWheel: true,
    touchMultiplier: 1.4,
    anchors: true
  });

  lenis.on('scroll', ScrollTrigger.update);

  // Scroll-velocity skew: the faster you scroll, the more `[data-skew]`
  // elements lean. Eases back to flat when you stop.
  const skew = gsap.quickSetter('[data-skew]', 'skewY', 'deg');
  let cur = 0;

  const onTick = (time) => {
    lenis.raf(time * 1000);
    const target = gsap.utils.clamp(-2, 2, (lenis.velocity || 0) * 0.055);
    cur += (target - cur) * 0.12;
    if (Math.abs(cur) < 0.002) cur = 0;
    skew(cur);
  };
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);

  window.__lenis = lenis;
  window.__gsap = gsap;

  return () => {
    lenis.off('scroll', ScrollTrigger.update);
    gsap.ticker.remove(onTick);
    skew(0);
    lenis.destroy();
    delete window.__lenis;
  };
}
