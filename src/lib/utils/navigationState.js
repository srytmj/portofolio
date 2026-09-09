import { goto } from '$app/navigation';

/**
 * Returns the currently active section. Defaults to 'hero'.
 * @returns {'hero'}
 */
export function getCurrentlyViewedSection() {
  return 'hero';
}

/**
 * Saves current scroll/section. Kept for backward compatibility as a no-op,
 * as return navigation now always routes directly to the Hero section.
 */
export function saveMainPageScroll() {
  // No-op: back navigation always targets Hero section (top 0, 0)
}

/**
 * Retrieves the saved main page section and scroll coordinate.
 * @returns {{ y: number, section: string }}
 */
export function getMainPageScroll() {
  return { y: 0, section: 'hero' };
}

/**
 * Initiates return to the main page, resetting scroll directly to Hero section (top 0, 0)
 */
export function returnToMainPage() {
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
    window.__lenis?.scrollTo(0, { immediate: true });
  }
  goto('/');
}

/**
 * Ensures main page scroll is anchored at the top (Hero section) when returning
 */
export function restoreMainPageScrollIfNeeded() {
  if (typeof window === 'undefined') return;
  if (!window.location.hash) {
    window.scrollTo(0, 0);
    window.__lenis?.scrollTo(0, { immediate: true });
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      window.__lenis?.scrollTo(0, { immediate: true });
    });
  }
}

