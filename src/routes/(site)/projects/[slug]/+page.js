import { error } from '@sveltejs/kit';
import { projects } from '$lib/content/site.js';

export const prerender = true;

export function entries() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
  const index = projects.findIndex((p) => p.slug === params.slug);
  if (index === -1) throw error(404, 'Project not found');

  const project = projects[index];
  const prevProject = index > 0 ? projects[index - 1] : null;
  const nextProject = index < projects.length - 1 ? projects[index + 1] : null;

  return {
    project,
    prevProject,
    nextProject
  };
}
