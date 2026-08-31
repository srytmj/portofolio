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
  const titles = [...node.querySelectorAll('[data-anim-title]')];
  const line = node.querySelector('[data-anim-line]');

  if (reduced()) {
    gsap.set(items, { opacity: 1, y: 0 });
    gsap.set(titles, { yPercent: 0 });
    if (line) gsap.set(line, { scaleX: 1 });
    return {};
  }

  gsap.set(items, { opacity: 0, y: 46 });
  gsap.set(titles, { yPercent: 115 });
  if (line) gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });

  const show = () => {
    gsap.to(titles, {
      yPercent: 0,
      duration: dur.lg,
      stagger: stagger.base,
      ease: ease.out,
      overwrite: true
    });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: dur.lg,
      stagger: stagger.base,
      ease: ease.out,
      overwrite: true
    });
    if (line)
      gsap.to(line, { scaleX: 1, duration: dur.xl, ease: ease.draw, overwrite: true });
  };

  const hide = (dir) => {
    gsap.to(titles, {
      yPercent: dir > 0 ? 115 : -115,
      duration: dur.sm,
      ease: ease.in,
      overwrite: true
    });
    gsap.to(items, {
      opacity: 0,
      y: dir * 42,
      duration: dur.sm,
      stagger: stagger.tight,
      ease: ease.in,
      overwrite: true
    });
    if (line) gsap.to(line, { scaleX: 0, duration: dur.sm, ease: ease.in, overwrite: true });
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
      gsap.killTweensOf([...items, ...titles]);
      if (line) gsap.killTweensOf(line);
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
