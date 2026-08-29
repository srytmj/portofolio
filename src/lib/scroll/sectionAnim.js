import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
      duration: 0.9,
      stagger: 0.08,
      ease: 'power4.out',
      overwrite: true
    });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power3.out',
      overwrite: true
    });
    if (line)
      gsap.to(line, { scaleX: 1, duration: 1.1, ease: 'power3.inOut', overwrite: true });
  };

  const hide = (dir) => {
    gsap.to(titles, {
      yPercent: dir > 0 ? 115 : -115,
      duration: 0.4,
      ease: 'power2.in',
      overwrite: true
    });
    gsap.to(items, {
      opacity: 0,
      y: dir * 42,
      duration: 0.45,
      stagger: 0.03,
      ease: 'power2.in',
      overwrite: true
    });
    if (line) gsap.to(line, { scaleX: 0, duration: 0.4, ease: 'power2.in', overwrite: true });
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
    gsap.to(node, { scale: 1.025, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
  const leave = () =>
    gsap.to(node, { scale: 1, duration: 0.55, ease: 'power2.out', overwrite: 'auto' });
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
