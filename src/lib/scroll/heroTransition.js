import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
        overlayEl.style.transform = `translateY(${p * -30}px)`;
      }
    });
    return () => st.kill();
  }

  const gentle = mode === 'lite';

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: 'top top',
        end: gentle ? '+=110%' : '+=140%',
        scrub: 0.6,
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

    // Blur / fade / lift the whole overlay (name + sub-line together) so they
    // dissolve as one; the name additionally spreads its letters.
    tl.to(
      overlayEl,
      {
        opacity: 0,
        y: gentle ? -26 : -44,
        scale: 0.94,
        filter: gentle ? 'blur(6px)' : 'blur(14px)',
        ease: 'power2.in'
      },
      0
    );

    if (!gentle) {
      tl.to(nameEl, { letterSpacing: '0.5em', ease: 'power2.in' }, 0);
    }
  });

  // Pin spacer changes document height — recalc every trigger once it's laid out.
  ScrollTrigger.refresh();
  requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => ctx.revert();
}

export { ScrollTrigger, gsap };
