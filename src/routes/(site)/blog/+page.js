import {
  getAllPosts,
  getCategoriesTree,
  getTagsWithCount,
  getArchiveByYear
} from '$lib/blog/posts.js';

export const prerender = true;

export function load() {
  const posts = getAllPosts();
  const categoriesTree = getCategoriesTree(posts);
  const tagsWithCount = getTagsWithCount(posts);
  const archiveByYear = getArchiveByYear(posts);

  return {
    posts,
    categoriesTree,
    tagsWithCount,
    archiveByYear
  };
}
