import { browser } from '$app/environment';

const STORAGE_KEY = 'yorha-theme';

function updateFaviconAndThemeColor(theme) {
  if (!browser) return;
  const isLight = theme === 'light';
  const targetFavicon = isLight ? '/favicon-light.svg' : '/favicon-dark.svg';
  const targetThemeColor = isLight ? '#D1D2C5' : '#000000';

  const faviconLinks = document.querySelectorAll("link[rel*='icon']");
  if (faviconLinks.length > 0) {
    faviconLinks.forEach((link) => {
      link.href = targetFavicon;
    });
  }

  const metaThemeColor = document.querySelector("meta[name='theme-color']");
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', targetThemeColor);
  }
}

class ThemeManager {
  current = $state('dark');

  constructor() {
    if (browser) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        this.current = saved;
      }
    }
  }

  init() {
    if (!browser) return;
    const saved = localStorage.getItem(STORAGE_KEY) || this.current;
    this.set(saved);
  }

  set(theme) {
    if (!browser) return;
    this.current = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-blog-theme', theme === 'light' ? 'sepia' : 'dark');
    localStorage.setItem(STORAGE_KEY, theme);
    localStorage.setItem('blog-theme', theme === 'light' ? 'sepia' : 'dark');
    updateFaviconAndThemeColor(theme);
  }

  toggle() {
    if (!browser) return;
    const next = this.current === 'dark' ? 'light' : 'dark';

    document.documentElement.classList.add('theme-transitioning');
    this.set(next);

    window.dispatchEvent(new CustomEvent('yorha-theme-change', { detail: { theme: next } }));

    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 380);
  }
}

export const theme = new ThemeManager();
