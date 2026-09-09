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
    lerp: 0.14,
    wheelMultiplier: 1.05,
    touchMultiplier: 1.2,
    smoothWheel: true,
    syncTouch: false,
    anchors: true
  });

  lenis.on('scroll', ScrollTrigger.update);

  const onTick = (time) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(500, 33);

  window.__lenis = lenis;
  window.__gsap = gsap;

  return () => {
    lenis.off('scroll', ScrollTrigger.update);
    gsap.ticker.remove(onTick);
    lenis.destroy();
    delete window.__lenis;
  };
}
