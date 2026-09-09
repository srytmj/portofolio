import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // Every route is prerendered (see src/routes/+layout.js), so the build is
    // a plain folder of HTML. That output is what all three documented hosts
    // want: GitHub Pages, nginx on EC2, or nginx in a container on the homelab.
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false,
      strict: true
    }),
    prerender: {
      handleHttpError: 'warn',
      handleMissingId: 'warn',
      handleEntryGeneratorMismatch: 'warn'
    }
  }
};

export default config;
