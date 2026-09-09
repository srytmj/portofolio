<script>
  import { onMount, tick } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { gsap } from 'gsap';
  import { ease, dur } from '$lib/motion.js';
  import { portal } from '$lib/actions/portal.js';
  import LeftEdgeReturn from '$lib/components/LeftEdgeReturn.svelte';
  import { blogTheme } from '$lib/blog/blogTheme.js';

  let { data } = $props();
  const post = $derived(data.post);
  const recentPosts = $derived(data.recentPosts || []);
  const trendingTags = $derived(data.trendingTags || []);
  const allPosts = $derived(data.allPosts || []);
  const newerPost = $derived(data.newerPost);
  const olderPost = $derived(data.olderPost);

  let isMobileTocOpen = $state(false);

  // Table of contents & ScrollSpy state
  let activeHeading = $state('');
  let tocNavRef = $state(null);

  // Auto-scroll Table of Contents container so the active heading stays comfortably in view
  $effect(() => {
    const currentActive = activeHeading;
    if (!currentActive || !tocNavRef) return;

    const activeLink = tocNavRef.querySelector(`[data-toc-id="${currentActive}"]`);
    if (!activeLink) return;

    const containerRect = tocNavRef.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    const linkRelativeTop = linkRect.top - containerRect.top;
    const linkRelativeBottom = linkRect.bottom - containerRect.top;

    // Buffer padding so active item isn't flush against top/bottom boundary
    const pad = 36;
    const prefersReduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = prefersReduce ? 'auto' : 'smooth';

    if (linkRelativeTop < pad) {
      tocNavRef.scrollBy({
        top: linkRelativeTop - pad,
        behavior
      });
    } else if (linkRelativeBottom > containerRect.height - pad) {
      tocNavRef.scrollBy({
        top: linkRelativeBottom - containerRect.height + pad,
        behavior
      });
    }
  });

  // Quick Search Modal state
  let isSearchOpen = $state(false);
  let searchQuery = $state('');
  let selectedSearchIndex = $state(0);
  let searchInputRef = $state(null);
  let modalCardRef = $state(null);

  // Filtered posts for search modal
  const filteredPosts = $derived.by(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allPosts.slice(0, 6);
    return allPosts.filter((p) => {
      const titleMatch = p.title?.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(q));
      const catMatch = p.categories?.some((c) => c.toLowerCase().includes(q));
      return titleMatch || descMatch || tagMatch || catMatch;
    });
  });

  // Open search modal
  async function openSearch() {
    isSearchOpen = true;
    searchQuery = '';
    selectedSearchIndex = 0;
    await tick();
    if (searchInputRef) searchInputRef.focus();

    if (modalCardRef) {
      gsap.fromTo(
        modalCardRef,
        { opacity: 0, y: -16, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: ease.out }
      );
    }
  }

  // Close search modal
  function closeSearch() {
    if (modalCardRef) {
      gsap.to(modalCardRef, {
        opacity: 0,
        y: -10,
        scale: 0.98,
        duration: 0.15,
        ease: ease.out,
        onComplete: () => {
          isSearchOpen = false;
        }
      });
    } else {
      isSearchOpen = false;
    }
  }

  // Handle keyboard shortcut for search (Note: Ctrl+K disabled to avoid collision with global Command Palette)
  function handleGlobalKeyDown(e) {
    if (e.key === '/' && !isSearchOpen && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      e.preventDefault();
      openSearch();
    } else if (e.key === 'Escape' && isSearchOpen) {
      e.preventDefault();
      closeSearch();
    }
  }

  // Search input keyboard navigation
  function handleSearchKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredPosts.length > 0) {
        selectedSearchIndex = (selectedSearchIndex + 1) % filteredPosts.length;
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredPosts.length > 0) {
        selectedSearchIndex = (selectedSearchIndex - 1 + filteredPosts.length) % filteredPosts.length;
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredPosts[selectedSearchIndex];
      if (target) {
        closeSearch();
        goto(`/blog/${target.slug}`);
      }
    }
  }

  // Scroll to heading smoothly
  function scrollToHeading(e, id) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    if (window.__lenis) {
      window.__lenis.scrollTo(el, { offset: -50 });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY - 50;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    activeHeading = id;
    history.replaceState(null, '', '#' + id);
  }

  // Back to top smoothly
  function scrollToTop() {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    activeHeading = '';
  }

  let updateScrollSpy = null;

  async function setupCurrentPost() {
    if (!browser) return;
    await tick();

    // 1. Immediately scroll to top when changing articles
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // 2. Detach previous scroll listener if exists
    if (updateScrollSpy) {
      window.removeEventListener('scroll', updateScrollSpy);
      updateScrollSpy = null;
    }

    // 3. Reset TOC scroll and active heading
    activeHeading = '';
    if (tocNavRef) {
      tocNavRef.scrollTop = 0;
    }

    // 4. Query newly rendered headings for the current article
    const headings = Array.from(document.querySelectorAll('.blog-prose h2[id], .blog-prose h3[id]'));
    if (headings.length > 0) {
      activeHeading = headings[0].id;

      updateScrollSpy = () => {
        const threshold = 160;
        const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;

        if (isAtBottom && headings.length > 0) {
          const lastId = headings[headings.length - 1].id;
          if (activeHeading !== lastId) {
            activeHeading = lastId;
          }
          return;
        }

        let currentId = headings[0]?.id || '';
        for (let i = headings.length - 1; i >= 0; i--) {
          const h = headings[i];
          const rect = h.getBoundingClientRect();
          if (rect.top <= threshold) {
            currentId = h.id;
            break;
          }
        }
        if (activeHeading !== currentId) {
          activeHeading = currentId;
        }
      };

      window.addEventListener('scroll', updateScrollSpy, { passive: true });
      updateScrollSpy();
    }

    // 5. Attach copy event listeners to all code block headers
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach((btn) => {
      btn.onclick = async () => {
        const block = btn.closest('.code-block');
        const codeText = block?.querySelector('code')?.innerText || '';
        try {
          await navigator.clipboard.writeText(codeText);
          const original = btn.innerText;
          btn.innerText = 'COPIED';
          btn.style.color = 'var(--blog-accent)';
          btn.style.borderColor = 'var(--blog-accent)';
          setTimeout(() => {
            btn.innerText = original;
            btn.style.color = '';
            btn.style.borderColor = '';
          }, 2000);
        } catch (err) {
          console.error('Clipboard copy failed:', err);
        }
      };
    });

    // 6. Subtle entrance animation
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      gsap.fromTo(
        '[data-article-anim]',
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out', clearProps: 'all' }
      );
    }

    // 7. Render mermaid diagrams for the active article
    await renderMermaid($blogTheme);
  }

  // Reactive effect: runs on initial load AND whenever user navigates to another post (newer/older/recent)
  $effect(() => {
    const slug = post.slug;
    if (browser && slug) {
      setupCurrentPost();
    }

    return () => {
      if (updateScrollSpy) {
        window.removeEventListener('scroll', updateScrollSpy);
        updateScrollSpy = null;
      }
    };
  });

  onMount(() => {
    if (!browser) return;
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  });

  // Helper to render or re-render mermaid diagrams according to the active theme
  async function renderMermaid(currentTheme) {
    if (!browser) return;
    const diagrams = document.querySelectorAll('.mermaid');
    if (diagrams.length === 0) return;

    try {
      const mermaid = (await import('mermaid')).default;
      const isSepia = currentTheme === 'sepia';
      mermaid.initialize({
        startOnLoad: false,
        theme: isSepia ? 'neutral' : 'dark',
        themeVariables: isSepia
          ? {
              darkMode: false,
              background: '#F4E3C1',
              mainBkg: '#FBF0D9',
              primaryColor: '#F4E3C1',
              primaryBorderColor: '#EAD3AF',
              primaryTextColor: '#3D2E24',
              lineColor: '#7A6251',
              textColor: '#3D2E24',
              fontFamily: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif'
            }
          : {
              darkMode: true,
              background: '#080808',
              mainBkg: '#121212',
              primaryColor: '#1a1a1a',
              primaryBorderColor: '#383838',
              primaryTextColor: '#ededed',
              lineColor: '#666666',
              textColor: '#ededed',
              fontFamily: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif'
            }
      });

      // Restore raw diagram text before asking mermaid to re-run
      diagrams.forEach((el) => {
        const raw = el.getAttribute('data-diagram');
        if (raw) {
          el.removeAttribute('data-processed');
          const parser = new DOMParser();
          const decoded = parser.parseFromString(raw, 'text/html').body.textContent || raw;
          el.textContent = decoded;
        }
      });

      await mermaid.run({ querySelector: '.mermaid' });
    } catch (err) {
      console.warn('Failed to render mermaid diagram:', err);
    }
  }

  // Reactively re-render diagrams when user switches theme
  let prevTheme = $state('');
  $effect(() => {
    const active = $blogTheme;
    if (browser && prevTheme && prevTheme !== active) {
      renderMermaid(active);
    }
    prevTheme = active;
  });
</script>

<svelte:head>
  <title>{post.title} — Bakti Surya Atmaja</title>
  {#if post.description}
    <meta name="description" content={post.description} />
  {/if}
</svelte:head>

<div class="blog-reading-view min-h-screen pt-24 sm:pt-28 pb-28 yorha-tech-bg-reader">
  <!-- Tactical Return Trigger on Left Edge Hover -->
  <LeftEdgeReturn />

  <div class="wrap relative z-10">
    <!-- Top Navigation / Breadcrumb & Quick Search Trigger (Non-Sticky, Traditional Flow) -->
    <nav
      data-article-anim
      class="mb-10 flex flex-wrap items-center justify-between gap-4 border-b pb-4 font-mono text-[11px]"
      style="border-color: var(--blog-border); color: var(--blog-text-muted);"
    >
      <!-- Breadcrumbs -->
      <div class="flex items-center gap-2">
        <a href="/" class="hover:underline transition-colors" style="color: var(--blog-text-muted);">Home</a>
        <span>/</span>
        <a href="/blog" class="hover:underline transition-colors" style="color: var(--blog-text-muted);">Blog</a>
        <span>/</span>
        <span class="truncate max-w-[180px] sm:max-w-xs" style="color: var(--blog-text-primary); opacity: 0.6;">{post.slug}</span>
      </div>

      <!-- Action items: Quick Search & Back link -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          onclick={openSearch}
          class="flex items-center gap-2 px-2.5 py-1 border text-[11px] font-mono transition-all duration-150 cursor-pointer rounded-none yorha-invert-hover"
          style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-primary);"
          title="Quick Search Articles (Press /)"
        >
          <span>[ SEARCH ]</span>
        </button>

        <a href="/blog" class="inline-flex items-center gap-1.5 hover:underline transition-colors group" style="color: var(--blog-text-muted);">
          <span class="transition-transform duration-200 group-hover:-translate-x-1" style="color: var(--blog-accent);">←</span>
          <span>All Articles</span>
        </a>
      </div>
    </nav>
    <!-- Main Content 2-Column Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
      <!-- Article Column (Left, 8 cols) -->
      <main class="lg:col-span-8 min-w-0">
        <!-- Post Header -->
        <header data-article-anim class="mb-12 space-y-4">
          <div class="flex flex-wrap items-center gap-3 font-mono text-[11px]" style="color: var(--blog-text-muted);">
            <time datetime={post.date}>{post.date}</time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>

          <h1 class="blog-heading text-xl sm:text-2xl md:text-3xl lg:text-h1 font-bold tracking-tight leading-snug sm:leading-tight">
            <span class="bg-white text-black px-1.5 sm:px-2 py-0.5 box-decoration-clone inline" style="color: #000000;">
              {post.title}
            </span>
          </h1>

          {#if post.description}
            <p class="text-lead leading-relaxed pt-2 font-normal" style="color: var(--blog-text-muted);">
              {post.description}
            </p>
          {/if}

          <!-- Metadata Rows: Category & Tags separated into 2 distinct rows across all layouts -->
          {#if (post.categories && post.categories.length > 0) || (post.tags && post.tags.length > 0)}
            <div class="pt-3 border-t space-y-2.5 font-mono text-xs" style="border-color: var(--blog-border);">
              <!-- Row 1: Category -->
              {#if post.categories && post.categories.length > 0}
                <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span class="text-[10px] uppercase tracking-wider font-semibold shrink-0 sm:w-24" style="color: var(--blog-accent);">
                    [ CATEGORY ]
                  </span>
                  <div class="flex flex-wrap items-center gap-1.5">
                    {#each post.categories as cat, idx}
                      <a
                        href={`/blog?category=${encodeURIComponent(cat)}`}
                        class="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border rounded-none transition-colors yorha-invert-hover cursor-pointer"
                        style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-primary);"
                      >
                        {cat}
                      </a>
                      {#if idx < post.categories.length - 1}
                        <span class="text-[10px] opacity-40 font-mono">/</span>
                      {/if}
                    {/each}
                  </div>
                </div>
              {/if}

              <!-- Row 2: Tags -->
              {#if post.tags && post.tags.length > 0}
                <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span class="text-[10px] uppercase tracking-wider font-semibold shrink-0 sm:w-24" style="color: var(--blog-text-muted);">
                    [ TAGS ]
                  </span>
                  <div class="flex flex-wrap items-center gap-1.5">
                    {#each post.tags as tag}
                      <a
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        class="font-mono text-[10px] px-2 py-0.5 border rounded-none transition-colors yorha-invert-hover cursor-pointer"
                        style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);"
                      >
                        #{tag}
                      </a>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        </header>

        <!-- Markdown Rendered Post Content (HTML) -->
        <article
          data-article-anim
          class="blog-prose leading-relaxed space-y-6"
        >
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html post.html}
        </article>

        <!-- Post Navigation Pager (Newer Post on Left, Older/Previous Post on Right) -->
        {#if newerPost || olderPost}
          <div data-article-anim class="mt-16 pt-8 border-t" style="border-color: var(--blog-border);">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {#if newerPost}
                <a
                  href={`/blog/${newerPost.slug}`}
                  class="group relative p-4 rounded-none border transition-all flex flex-col justify-between gap-2"
                  style="background-color: var(--blog-surface); border-color: var(--blog-border);"
                >
                  <span class="pointer-events-none absolute -top-px -left-px h-2 w-2 border-l-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                  <span class="pointer-events-none absolute -top-px -right-px h-2 w-2 border-r-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                  <span class="pointer-events-none absolute -bottom-px -left-px h-2 w-2 border-b-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                  <span class="pointer-events-none absolute -bottom-px -right-px h-2 w-2 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>

                  <div class="font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-colors" style="color: var(--blog-text-muted);">
                    <span class="transition-transform duration-200 group-hover:-translate-x-1" style="color: var(--blog-accent);">←</span>
                    <span>Newer Article</span>
                  </div>
                  <div class="text-sm font-semibold transition-colors line-clamp-2" style="color: var(--blog-text-primary);">
                    {newerPost.title}
                  </div>
                  <div class="font-mono text-[10px]" style="color: var(--blog-text-muted);">
                    {newerPost.date}
                  </div>
                </a>
              {:else}
                <div class="hidden sm:block"></div>
              {/if}

              {#if olderPost}
                <a
                  href={`/blog/${olderPost.slug}`}
                  class="group relative p-4 rounded-none border transition-all flex flex-col justify-between gap-2 text-right sm:col-start-2"
                  style="background-color: var(--blog-surface); border-color: var(--blog-border);"
                >
                  <span class="pointer-events-none absolute -top-px -left-px h-2 w-2 border-l-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                  <span class="pointer-events-none absolute -top-px -right-px h-2 w-2 border-r-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                  <span class="pointer-events-none absolute -bottom-px -left-px h-2 w-2 border-b-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                  <span class="pointer-events-none absolute -bottom-px -right-px h-2 w-2 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>

                  <div class="font-mono text-[10px] uppercase tracking-wider flex items-center justify-end gap-1.5 transition-colors" style="color: var(--blog-text-muted);">
                    <span>Previous Article</span>
                    <span class="transition-transform duration-200 group-hover:translate-x-1" style="color: var(--blog-accent);">→</span>
                  </div>
                  <div class="text-sm font-semibold transition-colors line-clamp-2" style="color: var(--blog-text-primary);">
                    {olderPost.title}
                  </div>
                  <div class="font-mono text-[10px]" style="color: var(--blog-text-muted);">
                    {olderPost.date}
                  </div>
                </a>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Bottom Navigation Footer -->
        <footer
          data-article-anim
          class="mt-8 pt-6 border-t flex flex-wrap items-center justify-between gap-4 font-mono text-xs"
          style="border-color: var(--blog-border); color: var(--blog-text-muted);"
        >
          <a href="/blog" class="inline-flex items-center gap-1.5 hover:underline transition-colors group" style="color: var(--blog-text-muted);">
            <span class="transition-transform duration-200 group-hover:-translate-x-1" style="color: var(--blog-accent);">←</span>
            <span>Back to All Articles</span>
          </a>
          <button
            type="button"
            onclick={scrollToTop}
            class="inline-flex items-center gap-1.5 transition-colors cursor-pointer yorha-invert-hover px-2 py-0.5 border rounded-none"
            style="border-color: var(--blog-border); color: var(--blog-text-primary); background-color: var(--blog-surface);"
          >
            <span>[ ↑ Top of Article ]</span>
          </button>
        </footer>
      </main>

      <!-- Flying Sticky Sidebar (Right, 4 cols) -->
      <aside data-flying-sidebar class="hidden lg:block lg:col-span-4 min-w-0 h-full">
        <div class="flex flex-col h-full pl-6 border-l" style="border-color: var(--blog-border);">
          <!-- Top non-sticky section: scrolls away naturally with post intro -->
          <div class="space-y-8 pb-8">
            <!-- 1. Recently Updated Posts -->
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b pb-2 font-mono text-[10px] uppercase tracking-widest" style="border-color: var(--blog-border); color: var(--blog-text-muted);">
                <span class="font-bold" style="color: var(--blog-text-primary);">[ RECENTLY UPDATED ]</span>
                <span>latest</span>
              </div>

              <div class="space-y-3">
                {#each recentPosts as rPost}
                  <a
                    href={`/blog/${rPost.slug}`}
                    class="group block p-2.5 border transition-all duration-200 rounded-none"
                    style="background-color: var(--blog-surface); border-color: var(--blog-border);"
                  >
                    <div class="text-xs font-semibold transition-colors line-clamp-2 leading-snug" style="color: var(--blog-text-primary);">
                      {rPost.title}
                    </div>
                    <div class="mt-2 flex items-center justify-between font-mono text-[10px]" style="color: var(--blog-text-muted);">
                      <time datetime={rPost.date}>{rPost.date}</time>
                      <span>{rPost.readingTime}</span>
                    </div>
                  </a>
                {/each}
              </div>
            </div>

            <!-- 2. Trending Topics (Trending Tags) -->
            {#if trendingTags.length > 0}
              <div class="space-y-3 pt-2">
                <div class="flex items-center justify-between border-b pb-2 font-mono text-[10px] uppercase tracking-widest" style="border-color: var(--blog-border); color: var(--blog-text-muted);">
                  <span class="font-bold" style="color: var(--blog-text-primary);">[ TRENDING TOPICS ]</span>
                  <span>top {trendingTags.length}</span>
                </div>

                <div class="flex flex-wrap gap-1.5">
                  {#each trendingTags as t}
                    <a
                      href={`/blog?tag=${encodeURIComponent(t.name)}`}
                      class="font-mono text-[11px] px-2 py-1 border transition-colors flex items-center gap-1.5 rounded-none"
                      style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);"
                    >
                      <span>#{t.name}</span>
                      <span class="text-[9px] opacity-60">[{t.count}]</span>
                    </a>
                  {/each}
                </div>
              </div>
            {/if}
          </div>

          <!-- Sticky Section: Contents (TOC) follows the user down! -->
          <div class="sticky top-20 space-y-6 pt-4 border-t" style="border-color: var(--blog-border);">
            <!-- 3. Contents (Table of Contents / TOC with ScrollSpy) -->
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b pb-2 font-mono text-[10px] uppercase tracking-widest" style="border-color: var(--blog-border); color: var(--blog-text-muted);">
                <span class="font-bold" style="color: var(--blog-text-primary);">[ CONTENTS ]</span>
                <span>{post.toc?.length || 0} sections</span>
              </div>

              {#if post.toc && post.toc.length > 0}
                <nav bind:this={tocNavRef} class="space-y-1 max-h-[50vh] overflow-y-auto pl-1 pr-2 custom-scrollbar">
                  {#each post.toc as item}
                    <a
                      href={`#${item.id}`}
                      data-toc-id={item.id}
                      onclick={(e) => scrollToHeading(e, item.id)}
                      class="block text-xs py-1 transition-all duration-150 border-l-2 rounded-none {item.depth === 3 ? 'pl-5 text-[11px]' : 'pl-3'}"
                      style={activeHeading === item.id
                        ? 'border-color: var(--blog-accent); color: var(--blog-accent); font-weight: 600; background-color: var(--blog-accent-subtle);'
                        : 'border-color: transparent; color: var(--blog-text-muted);'}
                    >
                      <span class="truncate block">{item.text}</span>
                    </a>
                  {/each}
                </nav>
              {:else}
                <div class="font-mono text-xs py-1 italic" style="color: var(--blog-text-muted);">
                  Single section post
                </div>
              {/if}
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</div>

<!-- Quick Search Modal (Blurred Backdrop) -->
{#if isSearchOpen}
  <div
    class="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/80 backdrop-blur-md"
    onclick={(e) => {
      if (e.target === e.currentTarget) closeSearch();
    }}
    role="presentation"
  >
    <div
      bind:this={modalCardRef}
      class="w-full max-w-2xl border overflow-hidden flex flex-col max-h-[80vh] rounded-none"
      style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-primary);"
    >
      <!-- Modal Header / Input -->
      <div class="p-4 border-b flex items-center gap-3" style="border-color: var(--blog-border); background-color: var(--blog-bg);">
        <span class="font-mono text-sm font-bold" style="color: var(--blog-accent);">&gt;</span>
        <input
          bind:this={searchInputRef}
          type="text"
          bind:value={searchQuery}
          onkeydown={handleSearchKeyDown}
          placeholder="Search articles by title, tag, or topic..."
          class="w-full bg-transparent font-sans text-base focus:outline-none rounded-none"
          style="color: var(--blog-text-primary);"
        />
        <button
          type="button"
          onclick={closeSearch}
          class="font-mono text-xs px-2 py-1 border transition-colors cursor-pointer rounded-none yorha-invert-hover"
          style="border-color: var(--blog-border); color: var(--blog-text-muted);"
          title="Close (Esc)"
        >
          ✕ ESC
        </button>
      </div>

      <!-- Real-time Results Info Bar -->
      <div class="px-4 py-2 border-b flex items-center justify-between font-mono text-[10px] uppercase" style="border-color: var(--blog-border); color: var(--blog-text-muted);">
        <span>{filteredPosts.length} article{filteredPosts.length === 1 ? '' : 's'} found</span>
        <span>Use ↑ ↓ to navigate · Enter to select</span>
      </div>

      <!-- Real-time Results List -->
      <div class="overflow-y-auto p-2 space-y-1 custom-scrollbar max-h-[50vh]">
        {#if filteredPosts.length > 0}
          {#each filteredPosts as item, index}
            {@const isSelected = index === selectedSearchIndex}
            <a
              href={`/blog/${item.slug}`}
              onclick={() => closeSearch()}
              onmouseenter={() => (selectedSearchIndex = index)}
              class="block p-3 border transition-all duration-150 rounded-none"
              style={isSelected
                ? 'border-color: var(--blog-accent); background-color: var(--blog-accent-subtle); color: var(--blog-text-primary);'
                : 'border-color: transparent; background-color: var(--blog-bg); color: var(--blog-text-muted);'}
            >
              <div class="flex items-center justify-between gap-4">
                <span class="font-semibold text-sm transition-colors" style="color: var(--blog-text-primary);">
                  {item.title}
                </span>
                <span class="font-mono text-[10px] shrink-0" style="color: var(--blog-text-muted);">{item.date}</span>
              </div>
              {#if item.description}
                <p class="text-xs line-clamp-1 mt-1 font-sans" style="color: var(--blog-text-muted);">
                  {item.description}
                </p>
              {/if}
              <div class="mt-2 flex flex-wrap items-center gap-2 font-mono text-[10px]" style="color: var(--blog-text-muted);">
                {#if item.categories && item.categories.length > 0}
                  <span class="uppercase" style="color: var(--blog-accent);">{item.categories.join(' / ')}</span>
                  <span>·</span>
                {/if}
                <span>{item.readingTime}</span>
                {#if item.tags && item.tags.length > 0}
                  <span>·</span>
                  <span>#{item.tags.slice(0, 3).join(' #')}</span>
                {/if}
              </div>
            </a>
          {/each}
        {:else}
          <div class="py-12 text-center font-mono text-sm" style="color: var(--blog-text-muted);">
            [ No articles match "{searchQuery}" ]
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<!-- Mobile Tactical Quick Navigation Toolbar (TOC & Back to Top) -->
<div class="lg:hidden fixed bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2">
  {#if post.toc && post.toc.length > 0}
    <button
      type="button"
      onclick={() => (isMobileTocOpen = true)}
      class="px-3 py-2.5 font-mono text-xs backdrop-blur-md cursor-pointer transition-all rounded-none yorha-invert-hover border shadow-lg"
      style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-primary);"
      title="Table of Contents"
    >
      [ TOC ]
    </button>
  {/if}
  <button
    type="button"
    onclick={scrollToTop}
    class="px-3 py-2.5 font-mono text-xs backdrop-blur-md cursor-pointer transition-all rounded-none yorha-invert-hover border shadow-lg"
    style="background-color: var(--blog-surface); border-color: var(--blog-accent); color: var(--blog-accent);"
    title="Back to top"
  >
    ↑ TOP
  </button>
</div>

<!-- Mobile Tactical TOC Bottom Sheet Drawer -->
{#if isMobileTocOpen}
  <div
    use:portal
    transition:fade={{ duration: 150 }}
    class="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm lg:hidden p-0"
    onclick={() => (isMobileTocOpen = false)}
    role="presentation"
  >
    <div
      transition:fly={{ y: 200, duration: 200 }}
      class="relative w-full max-h-[75vh] overflow-y-auto border-t p-5 font-mono text-xs flex flex-col gap-4 shadow-2xl rounded-none"
      style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-primary);"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      data-lenis-prevent
    >
      <div class="flex items-center justify-between border-b pb-3" style="border-color: var(--blog-border);">
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full animate-pulse" style="background-color: var(--blog-accent);"></span>
          <span class="font-bold tracking-wider text-[11px] uppercase">[ CONTENTS // {post.toc?.length || 0} SECTIONS ]</span>
        </div>
        <button
          type="button"
          onclick={() => (isMobileTocOpen = false)}
          class="border px-2 py-1 text-[10px] font-mono tracking-wider uppercase transition-colors yorha-invert-hover cursor-pointer"
          style="border-color: var(--blog-border); background-color: var(--blog-bg); color: var(--blog-text-primary);"
        >
          [ ✕ CLOSE ]
        </button>
      </div>

      <nav class="space-y-1.5 max-h-[50vh] overflow-y-auto py-1">
        {#each post.toc as item}
          <a
            href={`#${item.id}`}
            onclick={(e) => {
              isMobileTocOpen = false;
              scrollToHeading(e, item.id);
            }}
            class="block py-2 px-3 border-l-2 text-xs transition-colors rounded-none {item.depth === 3 ? 'ml-3 text-[11px]' : ''}"
            style={activeHeading === item.id
              ? 'border-color: var(--blog-accent); color: var(--blog-accent); font-weight: 600; background-color: var(--blog-accent-subtle);'
              : 'border-color: var(--blog-border); color: var(--blog-text-muted); background-color: var(--blog-bg);'}
          >
            <span class="truncate block">{item.text}</span>
          </a>
        {/each}
      </nav>
    </div>
  </div>
{/if}

<style>
  /* ==========================================================================
     STRICTLY SCOPED TYPOGRAPHY & THEME SYSTEM FOR BLOG READING POST ONLY
     Heading: Space Grotesk (600 / 700)
     Body: Plus Jakarta Sans (400 / 500)
     Code: Fira Code
     Theme Tokens: OLED Black Mode (#000000) & Warm Sepia Mode (#FBF0D9)
     ========================================================================== */
  .blog-reading-view {
    font-family: var(--font-blog-body);
    background-color: var(--blog-bg);
    color: var(--blog-text-primary);
  }

  .blog-heading,
  .blog-prose :global(h1),
  .blog-prose :global(h2),
  .blog-prose :global(h3),
  .blog-prose :global(h4),
  .blog-prose :global(h5),
  .blog-prose :global(h6) {
    font-family: var(--font-blog-head);
    color: var(--blog-text-primary);
  }

  .blog-prose {
    font-family: var(--font-blog-body);
    font-size: 1.0625rem;
    font-weight: 400;
    line-height: 1.8;
    color: var(--blog-text-primary);
  }

  .blog-prose :global(h2) {
    font-family: var(--font-blog-head);
    font-weight: 700;
    font-size: clamp(1.6rem, 1.3rem + 1.2vw, 2.2rem);
    line-height: 1.15;
    color: var(--blog-text-primary);
    margin-top: 2.75rem;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
  }

  .blog-prose :global(h3) {
    font-family: var(--font-blog-head);
    font-weight: 600;
    font-size: clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem);
    line-height: 1.25;
    color: var(--blog-text-primary);
    margin-top: 2.25rem;
    margin-bottom: 0.75rem;
    letter-spacing: -0.01em;
  }

  .blog-prose :global(h4) {
    font-family: var(--font-blog-head);
    font-weight: 600;
    font-size: 1.15rem;
    color: var(--blog-text-primary);
    margin-top: 1.75rem;
    margin-bottom: 0.5rem;
  }

  .blog-prose :global(p) {
    margin-bottom: 1.35rem;
  }

  .blog-prose :global(strong),
  .blog-prose :global(b) {
    font-weight: 600;
    color: var(--blog-text-primary);
  }

  .blog-prose :global(a) {
    color: var(--blog-accent);
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.15s ease;
  }
  .blog-prose :global(a:hover) {
    color: var(--blog-accent-hover);
  }

  .blog-prose :global(ul),
  .blog-prose :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
  }
  .blog-prose :global(ul) {
    list-style-type: disc;
  }
  .blog-prose :global(ol) {
    list-style-type: decimal;
  }
  .blog-prose :global(li) {
    margin-bottom: 0.5rem;
  }

  .blog-prose :global(blockquote) {
    border-left: 3px solid var(--blog-accent);
    padding: 0.75rem 1.25rem;
    font-style: italic;
    color: var(--blog-text-muted);
    background: var(--blog-surface);
    border-radius: 0 6px 6px 0;
    margin: 1.75rem 0;
  }

  .blog-prose :global(hr) {
    border: 0;
    border-top: 1px solid var(--blog-border);
    margin: 2.5rem 0;
  }

  /* Scoped code typography & color tokens */
  .blog-prose :global(pre),
  .blog-prose :global(code) {
    font-family: var(--font-blog-code) !important;
  }

  .blog-prose :global(code:not(pre code)) {
    font-family: var(--font-blog-code) !important;
    font-size: 0.85em;
    background: var(--blog-surface);
    border: 1px solid var(--blog-border);
    padding: 0.15rem 0.35rem;
    border-radius: 3px;
    color: var(--blog-accent);
  }

  .blog-prose :global(.code-block) {
    background: var(--blog-code-bg);
    border: 1px solid var(--blog-border);
  }
  .blog-prose :global(.code-block:hover) {
    border-color: var(--blog-accent);
  }
  .blog-prose :global(.code-block-header) {
    border-bottom: 1px solid var(--blog-border);
    background: var(--blog-surface);
    color: var(--blog-text-muted);
  }
  .blog-prose :global(.code-block pre) {
    color: var(--blog-code-text);
  }

  /* Scoped table formatting */
  .blog-prose :global(.table-wrapper) {
    margin: 2rem 0;
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid var(--blog-border);
    background: var(--blog-surface);
  }

  .blog-prose :global(table) {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-blog-body);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .blog-prose :global(th) {
    font-family: var(--font-blog-head);
    font-weight: 600;
    text-align: left;
    padding: 0.75rem 1rem;
    background: var(--blog-input-bg);
    color: var(--blog-text-primary);
    border-bottom: 1px solid var(--blog-border);
    letter-spacing: 0.02em;
  }

  .blog-prose :global(td) {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--blog-border);
    color: var(--blog-text-muted);
  }

  .blog-prose :global(tr:last-child td) {
    border-bottom: none;
  }

  .blog-prose :global(tr:hover td) {
    background: var(--blog-card-hover);
  }

  /* Sidebar, Pager, and Reader UI mappings */
  :global([data-blog-theme]) nav[data-article-anim] {
    border-color: var(--blog-border) !important;
  }

  :global([data-blog-theme]) [data-article-anim] .border-white\/10 {
    border-color: var(--blog-border) !important;
  }

  :global([data-blog-theme]) aside[data-flying-sidebar] .border-l {
    border-color: var(--blog-border) !important;
  }

  :global([data-blog-theme]) aside[data-flying-sidebar] .border-b {
    border-color: var(--blog-border) !important;
  }

  :global([data-blog-theme]) aside[data-flying-sidebar] a {
    background-color: var(--blog-surface);
    border-color: var(--blog-border);
  }
  :global([data-blog-theme]) aside[data-flying-sidebar] a:hover {
    border-color: var(--blog-accent);
  }

  :global([data-blog-theme]) .text-ash-2,
  :global([data-blog-theme]) .text-ash-3,
  :global([data-blog-theme]) .text-white\/70,
  :global([data-blog-theme]) .text-white\/80 {
    color: var(--blog-text-muted);
  }

  :global([data-blog-theme]) .text-white,
  :global([data-blog-theme]) .text-white\/90 {
    color: var(--blog-text-primary);
  }

  :global([data-blog-theme]) .text-emerald-400 {
    color: var(--blog-accent) !important;
  }

  :global([data-blog-theme]) .hover\:text-emerald-400:hover,
  :global([data-blog-theme]) .group:hover .group-hover\:text-emerald-400 {
    color: var(--blog-accent) !important;
  }

  :global([data-blog-theme]) .hover\:border-emerald-400:hover {
    border-color: var(--blog-accent) !important;
  }

  :global([data-blog-theme]) .shadow-2xl,
  :global([data-blog-theme]) .shadow-lg,
  :global([data-blog-theme]) .shadow-md,
  :global([data-blog-theme]) [class*='shadow-'] {
    box-shadow: none !important;
    text-shadow: none !important;
  }

  :global([data-blog-theme]) .border-emerald-400,
  :global([data-blog-theme]) .border-emerald-400\/50,
  :global([data-blog-theme]) .border-emerald-400\/60 {
    border-color: var(--blog-accent) !important;
  }

  :global([data-blog-theme]) .bg-emerald-400\/10,
  :global([data-blog-theme]) .bg-emerald-400\/20 {
    background-color: var(--blog-accent-subtle) !important;
  }

  :global([data-blog-theme]) .border-white\/10,
  :global([data-blog-theme]) .border-white\/15,
  :global([data-blog-theme]) .border-white\/5 {
    border-color: var(--blog-border) !important;
  }

  :global([data-blog-theme]) .bg-ink-1 {
    background-color: var(--blog-surface) !important;
  }

  :global([data-blog-theme]) .bg-white\/\[0\.03\],
  :global([data-blog-theme]) .bg-white\/\[0\.05\],
  :global([data-blog-theme]) .bg-white\/\[0\.015\] {
    background-color: var(--blog-input-bg) !important;
  }

  /* Search modal */
  :global([data-blog-theme]) .bg-ink-1\/95 {
    background-color: var(--blog-surface) !important;
    border-color: var(--blog-border) !important;
  }

  /* Custom scrollbar for TOC & modal */
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--blog-border);
    border-radius: 2px;
  }
</style>
