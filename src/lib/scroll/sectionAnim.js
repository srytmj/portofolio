import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, dur, stagger } from '$lib/motion.js';

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== 'undefined') window.__st = ScrollTrigger;

// One shared refresh after a burst of sections mount, so triggers land in the
// right place relative to the pinned hero.
let queued = false;
function queueRefresh() {
  if (queued || typeof window === 'undefined') return;
  queued = true;
  // rAF catches the same-frame layout; the timeout catches the hero's async
  // pin setup (dynamic import) which adds a spacer and shifts everything down.
  requestAnimationFrame(() => ScrollTrigger.refresh());
  setTimeout(() => {
    queued = false;
    ScrollTrigger.refresh();
  }, 350);
}

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Svelte action for a content section. Its `[data-anim]` descendants animate
 * in (staggered rise + fade) when the section enters the viewport and animate
 * out when it leaves — reversible in both scroll directions, every time, not
 * just on first load. A `[data-anim-line]` element is drawn in via scaleX.
 *
 * @param {HTMLElement} node
 */
export function sectionAnim(node) {
  const items = [...node.querySelectorAll('[data-anim]')];
  const words = [...node.querySelectorAll('[data-anim-word]')];
  const titles = [...node.querySelectorAll('[data-anim-title]')];
  const line = node.querySelector('[data-anim-line]');
  const scan = node.querySelector('[data-anim-scan]');
  const index = node.querySelector('[data-anim-badge]') || node.querySelector('[data-anim-index]');

  if (reduced()) {
    gsap.set(items, { opacity: 1, y: 0, filter: 'none' });
    gsap.set(words, { yPercent: 0, x: 0, rotate: 0, opacity: 1 });
    gsap.set(titles, { yPercent: 0, opacity: 1 });
    if (index) gsap.set(index, { yPercent: 0, x: 0, opacity: 1 });
    if (line) gsap.set(line, { scaleX: 1 });
    if (scan) gsap.set(scan, { display: 'none' });
    return {};
  }

  // Initial state: directional split offsets for kinetic typography
  words.forEach((w) => {
    const isLeft = w.dataset.dir === 'left';
    gsap.set(w, {
      yPercent: 125,
      x: isLeft ? -24 : 24,
      rotate: isLeft ? -3 : 3,
      opacity: 0
    });
  });

  gsap.set(titles, { yPercent: 125, opacity: 0 });
  if (index) gsap.set(index, { yPercent: 120, opacity: 0 });
  if (line) gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
  if (scan) gsap.set(scan, { opacity: 0, x: -100 });
  gsap.set(items, { opacity: 0, y: 32, filter: 'blur(4px)' });

  const show = () => {
    // 1. Kinetic word split — punchy opposing vector entrance
    if (words.length) {
      gsap.to(words, {
        yPercent: 0,
        x: 0,
        rotate: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.05,
        ease: 'power4.out',
        overwrite: true
      });
    }

    if (titles.length) {
      gsap.to(titles, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power4.out',
        overwrite: true
      });
    }

    // 2. Technical section badge snaps in
    if (index) {
      gsap.to(index, {
        yPercent: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.08,
        overwrite: true
      });
    }

    // 3. Precision hairline draws in
    if (line) {
      gsap.to(line, {
        scaleX: 1,
        duration: 0.85,
        ease: 'power3.out',
        delay: 0.04,
        overwrite: true
      });
    }

    // 4. Luminous scanline beam sweeps across the hairline
    if (scan) {
      const sweepDistance = node.clientWidth ? Math.max(node.clientWidth, 1200) : 1200;
      gsap.fromTo(
        scan,
        { x: -120, opacity: 1 },
        {
          x: sweepDistance,
          opacity: 0,
          duration: 0.95,
          ease: 'power2.inOut',
          overwrite: true
        }
      );
    }

    // 5. Content items rise with optical unblur and crisp spring
    gsap.to(items, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      stagger: 0.06,
      ease: 'power3.out',
      delay: 0.1,
      overwrite: true
    });
  };

  const hide = (dir) => {
    words.forEach((w) => {
      const isLeft = w.dataset.dir === 'left';
      gsap.to(w, {
        yPercent: dir > 0 ? 120 : -120,
        x: isLeft ? -14 : 14,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
        overwrite: true
      });
    });

    if (titles.length) {
      gsap.to(titles, {
        yPercent: dir > 0 ? 120 : -120,
        opacity: 0,
        duration: 0.35,
        ease: 'power3.in',
        overwrite: true
      });
    }

    if (index) {
      gsap.to(index, {
        yPercent: dir > 0 ? 100 : -100,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        overwrite: true
      });
    }

    if (line) {
      gsap.to(line, {
        scaleX: 0,
        duration: 0.35,
        ease: 'power2.in',
        overwrite: true
      });
    }

    gsap.to(items, {
      opacity: 0,
      y: dir * 20,
      filter: 'blur(3px)',
      duration: 0.35,
      stagger: 0.03,
      ease: 'power2.in',
      overwrite: true
    });
  };

  const st = ScrollTrigger.create({
    trigger: node,
    start: 'top 78%',
    end: 'bottom 22%',
    onEnter: show,
    onEnterBack: show,
    onLeave: () => hide(-1),
    onLeaveBack: () => hide(1)
  });
  queueRefresh();

  return {
    destroy() {
      st.kill();
      gsap.killTweensOf([...items, ...words, ...titles]);
      if (index) gsap.killTweensOf(index);
      if (line) gsap.killTweensOf(line);
      if (scan) gsap.killTweensOf(scan);
    }
  };
}

/**
 * Springy GSAP hover for a card. Scale only — leaves `y`/`opacity` free for
 * the entrance animation on the same element.
 *
 * @param {HTMLElement} node
 */
export function cardHover(node) {
  if (reduced()) return {};
  const enter = () =>
    gsap.to(node, { scale: 1.025, duration: dur.sm, ease: ease.ui, overwrite: 'auto' });
  const leave = () =>
    gsap.to(node, { scale: 1, duration: dur.md, ease: ease.ui, overwrite: 'auto' });
  node.addEventListener('pointerenter', enter);
  node.addEventListener('pointerleave', leave);
  node.addEventListener('focusin', enter);
  node.addEventListener('focusout', leave);
  return {
    destroy() {
      node.removeEventListener('pointerenter', enter);
      node.removeEventListener('pointerleave', leave);
      node.removeEventListener('focusin', enter);
      node.removeEventListener('focusout', leave);
      gsap.killTweensOf(node);
    }
  };
}
