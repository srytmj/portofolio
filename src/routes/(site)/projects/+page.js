import { projects } from '$lib/content/site.js';

export const prerender = true;

export function load() {
  return { projects };
}
