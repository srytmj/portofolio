import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease } from '$lib/motion.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero → content scroll choreography. Client-only.
 *
 * mode:
 *  - 'full'    : pin the hero for ~1.4 viewports, scrub the shader shrink/fade
 *                and distort the name away. Desktop / capable devices.
 *  - 'lite'    : same pin + scrub but gentler, no name distortion. Mid devices.
 *  - 'static'  : NO pin (pinning is the expensive part). Hero just scrolls
 *                away while the overlay cross-fades. Potato / reduced-motion.
 *
 * @param {{
 *   pinTarget: HTMLElement,
 *   trigger: HTMLElement,
 *   nameEl: HTMLElement,
 *   overlayEl: HTMLElement,
 *   mode: 'full' | 'lite' | 'static',
 *   onProgress: (p: number) => void
 * }} cfg
 * @returns {() => void} cleanup
 */
export function createHeroTransition(cfg) {
  const { pinTarget, trigger, nameEl, overlayEl, mode, onProgress } = cfg;

  if (mode === 'static') {
    const st = ScrollTrigger.create({
      trigger,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        const p = self.progress;
        onProgress(p);
        overlayEl.style.opacity = String(Math.max(0, 1 - p * 1.6));
        overlayEl.style.transform = `translateY(${p * -20}px)`;
      }
    });
    return () => st.kill();
  }

  const gentle = mode === 'lite';
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
  const endDistance = isMobile ? '+=40%' : isTablet ? '+=60%' : (gentle ? '+=75%' : '+=90%');

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: 'top top',
        end: endDistance,
        scrub: isMobile ? 0.3 : 0.6,
        pin: pinTarget,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Refresh this pinned trigger BEFORE the section triggers below it, so
        // the pin spacer exists when they measure their positions.
        refreshPriority: 1,
        onUpdate: (self) => onProgress(self.progress)
      }
    });

    // Fade + lift the whole overlay (name + sub-line together) so it dissolves
    // as one. No scale — on a large left-aligned headline the shrink read as a
    // glitch rather than a transition.
    tl.to(
      overlayEl,
      {
        opacity: 0,
        y: gentle ? -18 : -28,
        filter: gentle ? 'blur(5px)' : 'blur(9px)',
        ease: ease.in
      },
      0
    );
  });

  // Pin spacer changes document height — recalc every trigger once it's laid out.
  ScrollTrigger.refresh();
  requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => ctx.revert();
}

export { ScrollTrigger, gsap };
