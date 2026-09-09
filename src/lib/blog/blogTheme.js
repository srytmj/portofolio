import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'blog-theme';

function createThemeStore() {
  const initialTheme = browser
    ? localStorage.getItem(STORAGE_KEY) || 'dark'
    : 'dark';

  const { subscribe, set, update } = writable(initialTheme);

  let isSwitching = false;

  function applyTheme(theme) {
    if (browser) {
      document.documentElement.setAttribute('data-blog-theme', theme);
      localStorage.setItem(STORAGE_KEY, theme);
    }
    set(theme);
  }

  async function toggle() {
    if (!browser || isSwitching) return;
    isSwitching = true;

    const current = localStorage.getItem(STORAGE_KEY) || 'dark';
    const next = current === 'dark' ? 'sepia' : 'dark';

    // 1. Add temporary smooth transition class to root element
    document.documentElement.classList.add('theme-transitioning');

    // 2. Switch theme attributes and store state immediately
    document.documentElement.setAttribute('data-blog-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
    set(next);

    // 3. Dispatch custom event if layout needs to sync
    window.dispatchEvent(
      new CustomEvent('blog-theme-switch-start', { detail: { from: current, to: next } })
    );

    // 4. Allow CSS smooth transition to complete (380ms), then cleanly remove .theme-transitioning
    // so normal CSS hovers and GSAP tweens run with zero transition interference
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
      isSwitching = false;
    }, 400);
  }

  return {
    subscribe,
    set: applyTheme,
    toggle,
    init: () => {
      if (browser) {
        const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
        applyTheme(saved);
      }
    },
    clear: () => {
      if (browser) {
        document.documentElement.removeAttribute('data-blog-theme');
        document.documentElement.classList.remove('theme-transitioning');
      }
    }
  };
}

export const blogTheme = createThemeStore();
