<script>
  import { onMount } from 'svelte';
  import { blogTheme } from '$lib/blog/blogTheme.js';

  let { children } = $props();

  onMount(() => {
    blogTheme.init();

    return () => {
      blogTheme.clear();
      if (typeof document !== 'undefined') {
        document.body.style.backgroundColor = '';
      }
    };
  });
</script>

<div
  class="min-h-screen w-full"
  style="background-color: var(--blog-bg); color: var(--blog-text-primary);"
>
  {@render children()}
</div>
