import { error } from '@sveltejs/kit';
import { getAllPosts, getPostBySlug, getTagsWithCount } from '$lib/blog/posts.js';

export const prerender = true;

export function entries() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    throw error(404, `Post not found: ${params.slug}`);
  }
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === params.slug);

  // Newer post (lebih baru) is at currentIndex - 1 (sorted newest first)
  const newerPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  // Older/previous post (sebelumnya) is at currentIndex + 1
  const olderPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const recentPosts = allPosts.filter((p) => p.slug !== params.slug).slice(0, 4);
  const trendingTags = getTagsWithCount(allPosts).slice(0, 8);

  return { post, newerPost, olderPost, recentPosts, trendingTags, allPosts };
}
