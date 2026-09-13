<script>
  import { onMount, tick } from 'svelte';
  import { page } from '$app/state';
  import { gsap } from 'gsap';
  import { ease, dur } from '$lib/motion.js';


  let { data } = $props();

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Tab navigation state: 'home' | 'categories' | 'tags' | 'archive'
  let activeTab = $state('home');

  // Home tab state
  let searchQuery = $state('');
  let homeFilterTag = $state('all');
  /** @type {HTMLInputElement | null} */ let searchInput = $state(null);

  // Categories tab state: selected category object
  let selectedCategory = $state(null);
  let selectedSubcategory = $state(null);

  // Tags tab state: selected tag string
  let selectedTag = $state(null);

  // Animation & mount state
  let hasMounted = $state(false);
  let contentPanel = $state(null);
  let homeCardsContainer = $state(null);
  let archiveContainer = $state(null);

  const tabs = [
    { id: 'home', num: '01', label: 'Home' },
    { id: 'categories', num: '02', label: 'Categories' },
    { id: 'tags', num: '03', label: 'Tags' },
    { id: 'archive', num: '04', label: 'Archive' }
  ];

  onMount(() => {
    // Read query params from URL (e.g. /blog?tag=Cloud or /blog?tab=categories)
    const tagParam = page.url.searchParams.get('tag');
    const tabParam = page.url.searchParams.get('tab');
    const catParam = page.url.searchParams.get('category');

    if (tagParam) {
      activeTab = 'tags';
      selectedTag = tagParam;
    } else if (catParam) {
      activeTab = 'categories';
      const found = data.categoriesTree.find((c) => c.name.toLowerCase() === catParam.toLowerCase());
      if (found) selectedCategory = found;
    } else if (tabParam && ['home', 'categories', 'tags', 'archive'].includes(tabParam)) {
      activeTab = tabParam;
    }

    window.scrollTo(0, 0);
    window.__lenis?.scrollTo(0, { immediate: true });
    window.__lenis?.start();

    if (typeof window === 'undefined') return;
    hasMounted = true;

    function onKey(e) {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        activeTab = 'home';
        tick().then(() => searchInput?.focus());
      }
    }
    window.addEventListener('keydown', onKey);
    return () => {
      window.__lenis?.start();
      window.removeEventListener('keydown', onKey);
    };
  });

  // Switch tab with instant state update and scroll reset
  async function switchTab(tabId) {
    if (activeTab === tabId && !selectedCategory && !selectedTag) return;
    activeTab = tabId;
    selectedCategory = null;
    selectedTag = null;
    selectedSubcategory = null;
    await tick();
    const scrollable = contentPanel?.querySelector('.lg\\:overflow-y-auto');
    if (scrollable) scrollable.scrollTop = 0;
  }

  // Forward wheel scrolling anywhere in the content panel to the active scrollable view
  function handlePanelWheel(e) {
    if (!contentPanel) return;
    const scrollable = contentPanel.querySelector('.lg\\:overflow-y-auto');
    if (scrollable && !scrollable.contains(e.target)) {
      scrollable.scrollBy({ top: e.deltaY, behavior: 'auto' });
    }
  }

  // Category selection handlers
  function selectCategory(cat) {
    selectedCategory = cat;
    selectedSubcategory = null;
  }

  function backToCategories() {
    selectedCategory = null;
    selectedSubcategory = null;
  }

  // Tag selection handlers
  function selectTag(tag) {
    selectedTag = tag;
  }

  function backToTags() {
    selectedTag = null;
  }

  // Home tab pagination state (10 posts per page)
  const POSTS_PER_PAGE = 10;
  let currentPage = $state(1);

  // Home tab: Filtered posts
  const filteredHomePosts = $derived.by(() => {
    const q = searchQuery.toLowerCase().trim();
    return data.posts.filter((post) => {
      const matchTag =
        homeFilterTag === 'all' ||
        (post.tags && post.tags.some((t) => t.toLowerCase() === homeFilterTag));

      const matchQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        (post.tags && post.tags.some((t) => t.toLowerCase() === homeFilterTag || t.toLowerCase().includes(q))) ||
        (post.categories && post.categories.some((c) => c.toLowerCase().includes(q)));

      return matchTag && matchQuery;
    });
  });

  const totalPages = $derived(Math.max(1, Math.ceil(filteredHomePosts.length / POSTS_PER_PAGE)));

  // Sliced posts for current page (max 10 entries per page)
  const displayedHomePosts = $derived.by(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredHomePosts.slice(start, start + POSTS_PER_PAGE);
  });

  // Reset to page 1 whenever filter tag or search query changes
  $effect(() => {
    const _q = searchQuery;
    const _t = homeFilterTag;
    currentPage = 1;
  });

  // Navigate pagination page with scroll reset
  function goToPage(p) {
    if (p < 1 || p > totalPages || p === currentPage) return;
    currentPage = p;
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 0.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (homeCardsContainer) {
      homeCardsContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  // Quick tag filter handler with scroll reset
  function setHomeFilterTag(tag) {
    if (homeFilterTag === tag) return;
    homeFilterTag = tag;
    currentPage = 1;
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 0.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (homeCardsContainer) {
      homeCardsContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  // Category tab: Posts for selected category and subcategory
  const categoryPosts = $derived.by(() => {
    if (!selectedCategory) return [];
    if (!selectedSubcategory) {
      const all = [];
      const seen = new Set();
      for (const sub of selectedCategory.subcategories || []) {
        for (const p of sub.posts || []) {
          if (!seen.has(p.slug)) {
            seen.add(p.slug);
            all.push(p);
          }
        }
      }
      return all;
    }
    const sub = selectedCategory.subcategories?.find((s) => s.name === selectedSubcategory);
    return sub?.posts || [];
  });

  // Tags tab: Posts for selected tag
  const tagPosts = $derived.by(() => {
    if (!selectedTag) return [];
    const found = data.tagsWithCount.find((t) => t.name.toLowerCase() === selectedTag.toLowerCase());
    return found?.posts || [];
  });

  // Top tags for Home view quick pills
  const topTags = $derived.by(() => {
    return ['all', ...data.tagsWithCount.slice(0, 8).map((t) => t.name.toLowerCase())];
  });

  // Re-trigger animations when state changes
  $effect(() => {
    activeTab;
    currentPage;
    homeFilterTag;
    searchQuery;
    selectedCategory;
    selectedSubcategory;
    selectedTag;

    if (reduce) return;
    requestAnimationFrame(() => {
      const selectors = [
        '[data-home-card]',
        '[data-category-card]',
        '[data-category-post-item]',
        '[data-tag-pill]',
        '[data-tag-post-item]',
        '[data-archive-group]'
      ];
      
      for (const sel of selectors) {
        gsap.killTweensOf(sel);
        gsap.fromTo(
          sel,
          { y: sel === '[data-tag-pill]' ? 12 : 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, stagger: sel === '[data-tag-pill]' ? 0.015 : 0.04, ease: 'power2.out', clearProps: 'all' }
        );
      }
    });
  });
</script>

<svelte:head>
  <title>Engineering Notes & Technical Journal — Suryatmaja</title>
  <meta
    name="description"
    content="Technical documentation, cloud architectures, homelab logs, and software engineering investigations by Bakti Surya Atmaja."
  />
</svelte:head>

<div data-lenis-prevent class="w-full min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden yorha-tech-bg flex flex-col">
  <section class="wrap pt-20 lg:pt-20 pb-6 lg:pb-3 flex-1 min-h-0 flex flex-col justify-between">
  <!-- Breadcrumb & Compact Header with Theme Switcher -->
  <header data-blog-header class="shrink-0 mb-3 space-y-1.5 border-b border-white/10 pb-2.5">
    <div class="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em]">
      <div class="inline-flex items-center gap-2" style="color: var(--blog-text-muted);">
        <a href="/" class="hover:underline transition-colors" style="color: var(--blog-text-muted);">Home</a>
        <span>/</span>
        <button
          type="button"
          onclick={() => switchTab('home')}
          class="hover:underline transition-colors cursor-pointer"
          style="color: var(--blog-text-primary);"
        >
          Blog
        </button>
        {#if activeTab !== 'home'}
          <span>/</span>
          <button
            type="button"
            onclick={() => {
              if (activeTab === 'categories' && selectedCategory) backToCategories();
              else if (activeTab === 'tags' && selectedTag) backToTags();
            }}
            class="capitalize hover:underline cursor-pointer"
            style="color: var(--blog-accent);"
          >
            {activeTab}
          </button>
        {/if}
        {#if activeTab === 'categories' && selectedCategory}
          <span>/</span>
          <span style="color: var(--blog-text-muted);">{selectedCategory.name}</span>
        {:else if activeTab === 'tags' && selectedTag}
          <span>/</span>
          <span style="color: var(--blog-accent);">#{selectedTag}</span>
        {/if}
      </div>
    </div>

    <!-- Header with title and restored intro text -->
    <div>
      <h1 class="text-h2 font-display tracking-tight leading-tight" style="color: var(--blog-text-primary);">
        Engineering Journal
      </h1>
      <p class="mt-1 font-mono text-[11px] leading-snug" style="color: var(--blog-text-muted);">
        A digital workspace for technical documentation, cloud architecture design, and systems engineering field notes.
      </p>
    </div>
  </header>

  <!-- Main Multi-View Layout with Sidebar -->
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 flex-1 min-h-0 items-stretch">
    <!-- Sidebar Navigation -->
    <aside data-blog-sidebar data-lenis-prevent class="lg:col-span-3 border-b lg:border-b-0 lg:border-r pb-4 lg:pb-0 lg:pr-6 flex flex-col gap-6 shrink-0 overflow-hidden" style="border-color: var(--blog-border);">
      <div class="space-y-3">
        <!-- Section Indicator -->
        <div class="hidden lg:block font-mono text-[10px] uppercase tracking-[0.25em]" style="color: var(--blog-text-muted);">
          <span>[ NAVIGATION ]</span>
        </div>

        <!-- Navigation Tabs (Selected uses Accent Theme; Hover Invert for inactive only; Animation on selected hover) -->
        <nav class="flex items-center lg:items-stretch gap-1.5 font-mono text-xs overflow-x-auto lg:overflow-visible sm:flex-wrap lg:flex-col no-scrollbar pb-1 lg:pb-0">
          {#each tabs as tab}
            {@const active = activeTab === tab.id}
            <button
              type="button"
              onclick={() => switchTab(tab.id)}
              class="group relative shrink-0 lg:shrink lg:w-full flex items-center justify-between px-3.5 py-2.5 rounded-none text-left transition-all duration-200 cursor-pointer border select-none {active
                ? 'font-semibold shadow-sm hover:translate-x-1 active:translate-x-0'
                : 'hover:translate-x-0.5 active:translate-x-0 yorha-invert-hover'}"
              style={active
                ? 'background-color: var(--blog-accent-subtle); color: var(--blog-text-primary); border-color: var(--blog-accent);'
                : 'background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);'}
            >
              <!-- Tactical Corner Reticle for Selected Item -->
              {#if active}
                <span class="pointer-events-none absolute -top-px -left-px h-1.5 w-1.5 border-l border-t" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                <span class="pointer-events-none absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
              {/if}

              <div class="flex items-center gap-2.5">
                <span
                  data-tab-num
                  class="text-[10px] font-mono transition-colors duration-150 {active ? '' : 'group-hover:!text-[var(--blog-accent)]'}"
                  style={active ? 'color: var(--blog-accent) !important; font-weight: 700;' : 'color: var(--blog-text-muted);'}
                >
                  {tab.num}
                </span>
                <span class="tracking-wider uppercase font-medium">{tab.label}</span>
              </div>
              {#if active}
                <span class="hidden lg:inline text-xs transition-transform duration-200 group-hover:translate-x-1" style="color: var(--blog-accent);">→</span>
              {/if}
            </button>
          {/each}
        </nav>
      </div>

      <!-- Stats Indicator Directly Under Menu -->
      <div class="hidden lg:block space-y-2.5 border-t pt-4" style="border-color: var(--blog-border);">
        <div class="font-mono text-[10px] uppercase tracking-[0.25em]" style="color: var(--blog-text-muted);">
          <span>[ STATS ]</span>
        </div>

        <div class="space-y-2 font-mono text-[10px] uppercase tracking-wider" style="color: var(--blog-text-muted);">
          <div class="flex justify-between items-center py-0.5">
            <span>Articles:</span>
            <span class="font-medium">
              <strong class="font-bold" style="color: var(--blog-accent);">{data.posts.length}</strong>
              <span style="color: var(--blog-text-muted);"> entries</span>
            </span>
          </div>
          <div class="flex justify-between items-center py-0.5">
            <span>Categories:</span>
            <span class="font-medium">
              <strong class="font-bold" style="color: var(--blog-accent);">{data.categoriesTree.length}</strong>
              <span style="color: var(--blog-text-muted);"> groups</span>
            </span>
          </div>
          <div class="flex justify-between items-center py-0.5">
            <span>Topics / Tags:</span>
            <span class="font-medium">
              <strong class="font-bold" style="color: var(--blog-accent);">{data.tagsWithCount.length}</strong>
              <span style="color: var(--blog-text-muted);"> tags</span>
            </span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Content Panel -->
    <main data-blog-panel data-lenis-prevent bind:this={contentPanel} onwheel={handlePanelWheel} class="lg:col-span-9 flex flex-col lg:h-full lg:min-h-0 lg:overflow-hidden">
      <!-- VIEW 1: HOME (Newest posts with compact search, quick filter, & pagination) -->
      {#if activeTab === 'home'}
        <div class="flex flex-col lg:h-full lg:min-h-0 space-y-3">
          <!-- Compact Search & Filter Controls (Fixed at top of panel, shrink-0) -->
          <div class="shrink-0 space-y-2 pb-2 border-b" style="border-color: var(--blog-border);">
            <div class="relative">
              <input
                bind:this={searchInput}
                type="search"
                bind:value={searchQuery}
                placeholder="Search articles by title, topic, or tech stack..."
                class="w-full rounded-none border px-3.5 py-2 font-mono text-base sm:text-sm outline-none transition-colors"
                style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-primary);"
              />
              {#if searchQuery}
                <button
                  type="button"
                  onclick={() => (searchQuery = '')}
                  class="absolute right-3 top-2 text-[10px] font-mono hover:underline cursor-pointer"
                  style="color: var(--blog-text-muted);"
                >
                  CLEAR
                </button>
              {/if}
            </div>

            <!-- Quick Tag Pills & Pagination Info Indicator (Tactical YoRHa Styling matching Projects) -->
            <div class="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
              <div class="flex items-center gap-1.5 overflow-x-auto sm:flex-wrap no-scrollbar py-1.5 sm:overflow-visible">
                <span class="uppercase tracking-wider mr-1 shrink-0 inline-flex items-center gap-1.5 leading-none self-center select-none" style="color: var(--blog-text-muted);">
                  <span class="w-1.5 h-1.5 shrink-0 block -translate-y-[0.5px]" style="background-color: var(--blog-accent);"></span>
                  <span class="leading-none">Filter:</span>
                </span>
                {#each topTags as tag}
                  {@const isFilterActive = homeFilterTag === tag}
                  <button
                    type="button"
                    onclick={() => setHomeFilterTag(tag)}
                    class="group relative shrink-0 px-3 py-1 transition-all duration-200 border cursor-pointer rounded-none select-none hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-wider {isFilterActive
                      ? 'font-medium shadow-sm'
                      : 'hover:border-current/60 hover:text-[var(--blog-text-primary)]'}"
                    style={isFilterActive
                      ? 'background-color: var(--yorha-invert-bg); color: var(--yorha-invert-text); border-color: var(--yorha-invert-bg);'
                      : 'background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);'}
                  >
                    <!-- Tactical Corner Reticle on Hover / Active -->
                    <span class="pointer-events-none absolute -top-px -left-px h-1.5 w-1.5 border-l border-t transition-opacity duration-150 {isFilterActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                    <span class="pointer-events-none absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r transition-opacity duration-150 {isFilterActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}" style="border-color: var(--blog-accent);" aria-hidden="true"></span>

                    <span class="relative z-10 flex items-center gap-1.5">
                      {#if isFilterActive}
                        <span class="inline-block w-1 h-1 rounded-full animate-pulse" style="background-color: var(--blog-accent);"></span>
                      {/if}
                      <span>#{tag}</span>
                    </span>
                  </button>
                {/each}
              </div>

              <!-- Filter Indicator / Reset -->
              {#if homeFilterTag}
                <button
                  type="button"
                  onclick={() => setHomeFilterTag(null)}
                  class="font-mono text-[10px] uppercase tracking-wider transition-colors hover:underline cursor-pointer"
                  style="color: var(--blog-accent);"
                >
                  [ Reset Filter ]
                </button>
              {/if}
            </div>
          </div>

          <!-- Posts List (Tactical Monolith Layout matching YoRHa aesthetics) -->
          {#if displayedHomePosts.length === 0}
            <div class="flex-1 flex items-center justify-center font-mono text-sm border p-8 rounded-none" style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);">
              No articles match the current search query or tag filter.
            </div>
          {:else}
            <div
              bind:this={homeCardsContainer}
              data-lenis-prevent
              class="space-y-4 lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain no-scrollbar scroll-smooth pt-2.5 pb-4 px-1"
            >
              {#each displayedHomePosts as post, i (post.slug)}
                <article
                  data-home-card
                  class="group relative p-5 sm:p-6 rounded-none border transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between gap-4 cursor-pointer"
                  style="background-color: var(--blog-surface); border-color: var(--blog-border);"
                >
                  <!-- Pixel-Perfect Tactical Corner Reticles on Hover -->
                  <span class="corner-reticle pointer-events-none absolute -top-px -left-px h-2.5 w-2.5 border-l-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                  <span class="corner-reticle pointer-events-none absolute -top-px -right-px h-2.5 w-2.5 border-r-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                  <span class="corner-reticle pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                  <span class="corner-reticle pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>

                  <!-- Top Scanline on Hover -->
                  <span
                    class="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                    style="background-color: var(--blog-accent);"
                    aria-hidden="true"
                  ></span>

                  <div>
                    <div class="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]" style="color: var(--blog-text-muted);">
                      <div class="flex items-center gap-2">
                        <time datetime={post.date}>{post.date}</time>
                        <span>·</span>
                        <span>{post.readingTime}</span>
                      </div>
                      {#if post.categories && post.categories.length > 0}
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <span class="uppercase tracking-widest font-semibold" style="color: var(--blog-accent);">
                            {post.categories.slice(0, 4).join(' / ')}
                          </span>
                          {#if post.categories.length > 4}
                            <span
                              class="text-[9px] px-1.5 py-0.5 border font-mono font-semibold"
                              style="border-color: var(--blog-accent); color: var(--blog-accent); background-color: var(--blog-surface);"
                              title={post.categories.slice(4).join(', ')}
                            >
                              {post.categories.length - 4}+
                            </span>
                          {/if}
                        </div>
                      {/if}
                    </div>

                    <a href={`/blog/${post.slug}`} class="block mt-2 group/link">
                      <h2 class="text-h3 font-display font-semibold tracking-tight transition-colors duration-150 leading-snug" style="color: var(--blog-text-primary);">
                        {post.title}
                      </h2>
                    </a>

                    {#if post.description}
                      <p class="mt-2 font-serif italic text-caption leading-relaxed max-w-3xl" style="color: var(--blog-text-muted);">
                        {post.description}
                      </p>
                    {/if}
                  </div>

                  <div class="flex flex-wrap items-center justify-between gap-3 border-t pt-3 font-mono text-[11px]" style="border-color: var(--blog-border);">
                    <!-- Tags -->
                    <ul class="flex flex-wrap gap-1.5 items-center">
                      {#each (post.tags || []).slice(0, 4) as t}
                        <li class="rounded-none border px-2 py-0.5 text-[10px] transition-colors" style="background-color: var(--blog-bg); border-color: var(--blog-border); color: var(--blog-text-muted);">
                          #{t}
                        </li>
                      {/each}
                      {#if (post.tags || []).length > 4}
                        <li
                          class="rounded-none border px-1.5 py-0.5 text-[10px] font-semibold transition-colors"
                          style="border-color: var(--blog-accent); color: var(--blog-accent); background-color: var(--blog-surface);"
                          title={(post.tags || []).slice(4).map(t => '#' + t).join(' ')}
                        >
                          {(post.tags || []).length - 4}+
                        </li>
                      {/if}
                    </ul>

                    <!-- Read Link -->
                    <a
                      href={`/blog/${post.slug}`}
                      class="inline-flex items-center gap-1 font-medium transition-colors hover:underline"
                      style="color: var(--blog-text-primary);"
                    >
                      <span>Read Article</span>
                      <span class="transition-transform duration-150 group-hover:translate-x-1" style="color: var(--blog-accent);">→</span>
                    </a>
                  </div>
                </article>
              {/each}
            </div>
          {/if}

          <!-- Pagination Bar (shrink-0) -->
          {#if totalPages > 1}
            <div class="shrink-0 pt-2.5 border-t flex items-center justify-between font-mono text-xs" style="border-color: var(--blog-border); color: var(--blog-text-muted);">
              <button
                type="button"
                disabled={currentPage === 1}
                onclick={() => goToPage(currentPage - 1)}
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer yorha-invert-hover"
                style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);"
              >
                <span>←</span>
                <span>Previous</span>
              </button>

              <div class="flex items-center gap-1">
                {#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNum}
                  {@const isPageActive = currentPage === pageNum}
                  <button
                    type="button"
                    onclick={() => goToPage(pageNum)}
                    class="h-7 w-7 rounded-none border font-mono text-xs flex items-center justify-center transition-colors cursor-pointer {isPageActive ? '' : 'yorha-invert-hover'}"
                    style={isPageActive
                      ? 'background-color: var(--yorha-invert-bg); color: var(--yorha-invert-text); border-color: var(--yorha-invert-bg); font-weight: 600;'
                      : 'background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);'}
                  >
                    {pageNum}
                  </button>
                {/each}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onclick={() => goToPage(currentPage + 1)}
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border hover:underline disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer yorha-invert-hover"
                style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);"
              >
                <span>Next</span>
                <span>→</span>
              </button>
            </div>
          {/if}
        </div>

      <!-- VIEW 2: CATEGORIES (Direct Category Selection & Posts Display — No Accordion Dropdown) -->
      {:else if activeTab === 'categories'}
        <div class="flex flex-col lg:h-full lg:min-h-0 space-y-3">
          {#if !selectedCategory}
            <!-- 2A. All Categories Overview Grid -->
            <div data-categories-grid class="flex flex-col lg:h-full lg:min-h-0 space-y-3">
              <div class="shrink-0 border-b pb-2.5 flex items-center justify-between" style="border-color: var(--blog-border);">
                <div>
                  <h2 class="font-mono text-sm uppercase tracking-widest font-semibold" style="color: var(--blog-text-primary);">
                    [ Engineering Categories ]
                  </h2>
                  <p class="mt-0.5 font-serif italic text-caption" style="color: var(--blog-text-muted);">
                    Click any category to review its associated architecture posts.
                  </p>
                </div>
                <span class="font-mono text-xs border px-2 py-0.5 rounded-none" style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);">
                  <strong style="color: var(--blog-accent);">{data.categoriesTree.length}</strong> categories
                </span>
              </div>

              <div
                data-lenis-prevent
                class="lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain no-scrollbar scroll-smooth pt-2.5 pb-3 px-1 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max"
              >
                {#each data.categoriesTree as cat, i}
                  <button
                    type="button"
                    data-category-card
                    onclick={() => selectCategory(cat)}
                    class="group relative p-5 rounded-none border text-left transition-colors duration-150 cursor-pointer flex flex-col justify-between gap-4"
                    style="background-color: var(--blog-surface); border-color: var(--blog-border);"
                  >
                    <!-- Pixel-Perfect Corner Reticle Brackets on Hover -->
                    <span class="corner-reticle pointer-events-none absolute -top-px -left-px h-2.5 w-2.5 border-l-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                    <span class="corner-reticle pointer-events-none absolute -top-px -right-px h-2.5 w-2.5 border-r-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                    <span class="corner-reticle pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                    <span class="corner-reticle pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>

                    <div>
                      <div class="flex items-center justify-between font-mono text-[11px] mb-2" style="color: var(--blog-text-muted);">
                        <span class="uppercase tracking-widest font-semibold" style="color: var(--blog-accent);">Category</span>
                        <span class="border px-2 py-0.5 rounded-none" style="background-color: var(--blog-bg); border-color: var(--blog-border); color: var(--blog-text-muted);">
                          <strong style="color: var(--blog-accent);">{cat.totalPosts}</strong> {cat.totalPosts === 1 ? 'post' : 'posts'}
                        </span>
                      </div>
                      <h3 class="text-h3 font-display font-semibold transition-colors" style="color: var(--blog-text-primary);">
                        {cat.name}
                      </h3>
                      {#if cat.subcategories && cat.subcategories.length > 0}
                        <div class="mt-2.5 flex flex-wrap gap-1.5 font-mono text-[10px]" style="color: var(--blog-text-muted);">
                          {#each cat.subcategories as sub}
                            <span class="px-1.5 py-0.5 border rounded-none" style="background-color: var(--blog-bg); border-color: var(--blog-border);">
                              {sub.name} (<span style="color: var(--blog-accent);">{sub.count}</span>)
                            </span>
                          {/each}
                        </div>
                      {/if}
                    </div>
                    <div class="flex items-center justify-between font-mono text-[11px] border-t pt-3" style="border-color: var(--blog-border); color: var(--blog-text-muted);">
                      <span>Browse category</span>
                      <span class="transition-transform duration-150 group-hover:translate-x-1" style="color: var(--blog-accent);">→</span>
                    </div>
                  </button>
                {/each}
              </div>
            </div>
          {:else}
            <!-- 2B. Direct Category Posts Display with Back Button -->
            <div data-category-detail class="flex flex-col lg:h-full lg:min-h-0 space-y-3">
              <div class="shrink-0 space-y-2 border-b pb-2.5" style="border-color: var(--blog-border);">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      onclick={backToCategories}
                      class="px-2.5 py-1 border font-mono text-xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer rounded-none yorha-invert-hover"
                      style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-primary);"
                      title="Back to all categories"
                    >
                      <span>←</span>
                      <span>All Categories</span>
                    </button>
                    <h2 class="font-mono text-base uppercase tracking-wider font-bold" style="color: var(--blog-text-primary);">
                      [ {selectedCategory.name} ]
                    </h2>
                  </div>

                  <span class="font-mono text-xs border px-2 py-0.5 rounded-none" style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);">
                    <strong style="color: var(--blog-accent);">{selectedCategory.totalPosts}</strong> {selectedCategory.totalPosts === 1 ? 'article' : 'articles'}
                  </span>
                </div>

                <!-- Subgroups Pill Filter if category has subcategories -->
                {#if selectedCategory.subcategories && selectedCategory.subcategories.length > 1}
                  <div class="flex flex-wrap items-center gap-2 font-mono text-[10px] py-1.5 sm:overflow-visible">
                    <span class="uppercase tracking-wider mr-1 shrink-0 inline-flex items-center gap-1.5 leading-none self-center select-none" style="color: var(--blog-text-muted);">
                      <span class="w-1.5 h-1.5 shrink-0 block -translate-y-[0.5px]" style="background-color: var(--blog-accent);"></span>
                      <span class="leading-none">Subgroup:</span>
                    </span>
                    <button
                      type="button"
                      onclick={() => (selectedSubcategory = null)}
                      class="group relative shrink-0 px-3 py-1 transition-all duration-200 border cursor-pointer rounded-none select-none hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-wider {selectedSubcategory === null
                        ? 'font-medium shadow-sm'
                        : 'hover:border-current/60 hover:text-[var(--blog-text-primary)]'}"
                      style={selectedSubcategory === null
                        ? 'background-color: var(--yorha-invert-bg); color: var(--yorha-invert-text); border-color: var(--yorha-invert-bg);'
                        : 'background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);'}
                    >
                      <!-- Tactical Corner Reticle on Hover / Active -->
                      <span class="pointer-events-none absolute -top-px -left-px h-1.5 w-1.5 border-l border-t transition-opacity duration-150 {selectedSubcategory === null ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                      <span class="pointer-events-none absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r transition-opacity duration-150 {selectedSubcategory === null ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}" style="border-color: var(--blog-accent);" aria-hidden="true"></span>

                      <span class="relative z-10 flex items-center gap-1.5">
                        {#if selectedSubcategory === null}
                          <span class="inline-block w-1 h-1 rounded-full animate-pulse" style="background-color: var(--blog-accent);"></span>
                        {/if}
                        <span>All ({selectedCategory.totalPosts})</span>
                      </span>
                    </button>

                    {#each selectedCategory.subcategories as sub}
                      {@const isSubActive = selectedSubcategory === sub.name}
                      <button
                        type="button"
                        onclick={() => (selectedSubcategory = sub.name)}
                        class="group relative shrink-0 px-3 py-1 transition-all duration-200 border cursor-pointer rounded-none select-none hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-wider {isSubActive
                          ? 'font-medium shadow-sm'
                          : 'hover:border-current/60 hover:text-[var(--blog-text-primary)]'}"
                        style={isSubActive
                          ? 'background-color: var(--yorha-invert-bg); color: var(--yorha-invert-text); border-color: var(--yorha-invert-bg);'
                          : 'background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);'}
                      >
                        <!-- Tactical Corner Reticle on Hover / Active -->
                        <span class="pointer-events-none absolute -top-px -left-px h-1.5 w-1.5 border-l border-t transition-opacity duration-150 {isSubActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                        <span class="pointer-events-none absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r transition-opacity duration-150 {isSubActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}" style="border-color: var(--blog-accent);" aria-hidden="true"></span>

                        <span class="relative z-10 flex items-center gap-1.5">
                          {#if isSubActive}
                            <span class="inline-block w-1 h-1 rounded-full animate-pulse" style="background-color: var(--blog-accent);"></span>
                          {/if}
                          <span>{sub.name} ({sub.count})</span>
                        </span>
                      </button>
                    {/each}
                  </div>
                {/if}
              </div>

              <!-- Direct Posts List -->
              <div
                data-lenis-prevent
                class="lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain no-scrollbar scroll-smooth pt-2.5 pb-3 px-1 space-y-3.5"
              >
                  {#each categoryPosts as p, i (p.slug)}
                    <article
                      
                      data-category-post-item
                      data-list-item
                      class="group relative p-5 rounded-none border transition-colors duration-150 hover:-translate-y-0.5 flex flex-col justify-between gap-3 hover:z-10 cursor-pointer"
                      style="background-color: var(--blog-surface); border-color: var(--blog-border);"
                    >
                      <!-- Pixel-Perfect Corner Reticle Brackets on Hover -->
                      <span class="corner-reticle pointer-events-none absolute -top-px -left-px h-2.5 w-2.5 border-l-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                      <span class="corner-reticle pointer-events-none absolute -top-px -right-px h-2.5 w-2.5 border-r-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                      <span class="corner-reticle pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                      <span class="corner-reticle pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>

                      <span
                        class="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                        style="background-color: var(--blog-accent);"
                        aria-hidden="true"
                      ></span>

                      <div class="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]" style="color: var(--blog-text-muted);">
                        <time datetime={p.date}>{p.date}</time>
                        <span>{p.readingTime}</span>
                      </div>
                      <a href={`/blog/${p.slug}`} class="block group/link">
                        <h3 class="text-h3 font-display font-medium transition-colors" style="color: var(--blog-text-primary);">
                          {p.title}
                        </h3>
                      </a>
                      {#if p.description}
                        <p class="font-serif italic text-caption line-clamp-2 leading-relaxed" style="color: var(--blog-text-muted);">{p.description}</p>
                      {/if}
                      <div class="flex items-center justify-between border-t pt-3 font-mono text-[11px]" style="border-color: var(--blog-border);">
                        <div class="flex flex-wrap gap-1.5 items-center">
                          {#each (p.tags || []).slice(0, 4) as t}
                            <span class="text-[10px] px-2 py-0.5 rounded-none border transition-colors" style="background-color: var(--blog-bg); border-color: var(--blog-border); color: var(--blog-text-muted);">#{t}</span>
                          {/each}
                          {#if (p.tags || []).length > 4}
                            <span
                              class="text-[10px] px-1.5 py-0.5 rounded-none border font-semibold transition-colors"
                              style="border-color: var(--blog-accent); color: var(--blog-accent); background-color: var(--blog-surface);"
                              title={(p.tags || []).slice(4).map(t => '#' + t).join(' ')}
                            >
                              {(p.tags || []).length - 4}+
                            </span>
                          {/if}
                        </div>
                        <a href={`/blog/${p.slug}`} class="inline-flex items-center gap-1 font-medium transition-colors hover:underline" style="color: var(--blog-text-primary);">
                          <span>Read</span>
                          <span class="transition-transform group-hover:translate-x-1" style="color: var(--blog-accent);">→</span>
                        </a>
                      </div>
                    </article>
                  {/each}
                </div>
            </div>
          {/if}
        </div>



      <!-- VIEW 3: TAGS (Direct Tag Selection & Posts Display with Back Button) -->
      {:else if activeTab === 'tags'}
        <div class="flex flex-col lg:h-full lg:min-h-0 space-y-3">
          {#if !selectedTag}
            <!-- 3A. All Tags Overview Cloud -->
            <div data-tags-cloud class="flex flex-col lg:h-full lg:min-h-0 space-y-3">
              <div class="shrink-0 border-b pb-2.5 flex items-center justify-between" style="border-color: var(--blog-border);">
                <div>
                  <h2 class="font-mono text-sm uppercase tracking-widest font-semibold" style="color: var(--blog-text-primary);">
                    [ Topic Tags Cloud ]
                  </h2>
                  <p class="mt-0.5 font-serif italic text-caption" style="color: var(--blog-text-muted);">
                    Click any tag to immediately review all associated engineering notes.
                  </p>
                </div>
                <span class="font-mono text-xs border px-2 py-0.5 rounded-none" style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);">
                  <strong style="color: var(--blog-accent);">{data.tagsWithCount.length}</strong> tags
                </span>
              </div>

              <!-- Tag Badges Grid -->
              <div
                data-lenis-prevent
                class="lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain no-scrollbar scroll-smooth pt-2.5 pb-3 px-1 flex flex-wrap gap-2.5 content-start"
              >
                {#each data.tagsWithCount as t, i}
                  <button
                    type="button"
                    data-tag-pill
                    onclick={() => selectTag(t.name)}
                    class="group inline-flex items-center gap-2 rounded-none px-3 py-2 transition-colors duration-150 cursor-pointer border yorha-invert-hover"
                    style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-primary);"
                  >
                    <span class="font-medium">#{t.name}</span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded-none border font-mono" style="background-color: var(--blog-bg); border-color: var(--blog-border); color: var(--blog-accent);">
                      {t.count}
                    </span>
                  </button>
                {/each}
              </div>
            </div>
          {:else}
            <!-- 3B. Direct Tag Posts Display with Back Button -->
            <div data-tag-detail class="flex flex-col lg:h-full lg:min-h-0 space-y-3">
              <div class="shrink-0 flex flex-wrap items-center justify-between gap-3 border-b pb-2.5" style="border-color: var(--blog-border);">
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    onclick={backToTags}
                    class="px-2.5 py-1 border font-mono text-xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer rounded-none yorha-invert-hover"
                    style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-primary);"
                    title="Back to all tags"
                  >
                    <span>←</span>
                    <span>All Tags</span>
                  </button>
                  <h2 class="font-mono text-base uppercase tracking-wider font-bold" style="color: var(--blog-accent);">
                    #{selectedTag}
                  </h2>
                </div>

                <span class="font-mono text-xs border px-2 py-0.5 rounded-none" style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);">
                  <strong style="color: var(--blog-accent);">{tagPosts.length}</strong> {tagPosts.length === 1 ? 'article' : 'articles'}
                </span>
              </div>

              <!-- Direct Tag Posts List -->
              <div
                data-lenis-prevent
                class="lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain no-scrollbar scroll-smooth pt-2.5 pb-3 px-1 space-y-3.5"
              >
                  {#each tagPosts as p, i (p.slug)}
                    <article
                      data-tag-post-item
                      data-list-item
                      class="group relative p-5 rounded-none border transition-colors duration-150 hover:-translate-y-0.5 flex flex-col justify-between gap-3 hover:z-10 cursor-pointer"
                      style="background-color: var(--blog-surface); border-color: var(--blog-border);"
                    >
                      <!-- Pixel-Perfect Corner Reticle Brackets on Hover -->
                      <span class="corner-reticle pointer-events-none absolute -top-px -left-px h-2.5 w-2.5 border-l-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                      <span class="corner-reticle pointer-events-none absolute -top-px -right-px h-2.5 w-2.5 border-r-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                      <span class="corner-reticle pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>
                      <span class="corner-reticle pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity" style="border-color: var(--blog-accent);" aria-hidden="true"></span>

                      <span
                        class="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                        style="background-color: var(--blog-accent);"
                        aria-hidden="true"
                      ></span>

                      <div class="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]" style="color: var(--blog-text-muted);">
                        <time datetime={p.date}>{p.date}</time>
                        <span>{p.readingTime}</span>
                      </div>
                      <a href={`/blog/${p.slug}`} class="block group/link">
                        <h3 class="text-h3 font-display font-medium transition-colors" style="color: var(--blog-text-primary);">
                          {p.title}
                        </h3>
                      </a>
                      {#if p.description}
                        <p class="font-serif italic text-caption line-clamp-2 leading-relaxed" style="color: var(--blog-text-muted);">{p.description}</p>
                      {/if}
                      <div class="flex items-center justify-between border-t pt-3 font-mono text-[11px]" style="border-color: var(--blog-border);">
                        <div class="flex flex-wrap gap-1.5 items-center">
                          {#each (p.tags || []).slice(0, 4) as t}
                            <span class="text-[10px] px-2 py-0.5 rounded-none border transition-colors" style="background-color: var(--blog-bg); border-color: var(--blog-border); color: var(--blog-text-muted);">#{t}</span>
                          {/each}
                          {#if (p.tags || []).length > 4}
                            <span
                              class="text-[10px] px-1.5 py-0.5 rounded-none border font-semibold transition-colors"
                              style="border-color: var(--blog-accent); color: var(--blog-accent); background-color: var(--blog-surface);"
                              title={(p.tags || []).slice(4).map(t => '#' + t).join(' ')}
                            >
                              {(p.tags || []).length - 4}+
                            </span>
                          {/if}
                        </div>
                        <a href={`/blog/${p.slug}`} class="inline-flex items-center gap-1 font-medium transition-colors hover:underline" style="color: var(--blog-text-primary);">
                          <span>Read</span>
                          <span class="transition-transform group-hover:translate-x-1" style="color: var(--blog-accent);">→</span>
                        </a>
                      </div>
                    </article>
                  {/each}
                </div>
            </div>
          {/if}
        </div>

      <!-- VIEW 4: ARCHIVE (Chronological timeline layout by year & date) -->
      {:else if activeTab === 'archive'}
        <div class="flex flex-col lg:h-full lg:min-h-0 space-y-3">
          <div class="shrink-0 border-b pb-2.5 flex items-center justify-between" style="border-color: var(--blog-border);">
            <div>
              <h2 class="font-mono text-sm uppercase tracking-widest font-semibold" style="color: var(--blog-text-primary);">
                [ Chronological Archive ]
              </h2>
              <p class="mt-0.5 font-serif italic text-caption" style="color: var(--blog-text-muted);">
                Timeline of all engineered systems, notes, and milestones.
              </p>
            </div>
            <span class="font-mono text-xs border px-2 py-0.5 rounded-none" style="background-color: var(--blog-surface); border-color: var(--blog-border); color: var(--blog-text-muted);">
              <strong style="color: var(--blog-accent);">{data.posts.length}</strong> entries
            </span>
          </div>

          <!-- Chronological Timeline Scrollable Container with left padding to prevent clipping -->
          <div
            bind:this={archiveContainer}
            data-lenis-prevent
            class="lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain no-scrollbar scroll-smooth pl-4 pr-2 pt-3 space-y-10"
          >
              {#each data.archiveByYear as yearGroup, i}
                <div
                  data-archive-group
                  class="relative ml-4 pl-6 sm:pl-8 space-y-4"
                >
                  <!-- Vertical Timeline Line (starts under star box, no line poking out above) -->
                  <span
                    class="pointer-events-none absolute left-0 top-3 w-px {i < data.archiveByYear.length - 1 ? '-bottom-10' : 'bottom-2'}"
                    style="background-color: var(--blog-border);"
                    aria-hidden="true"
                  ></span>

                  <!-- Year Pill on Timeline (with ✦ symbol) -->
                  <div class="absolute -left-3 top-0.5 z-10 flex items-center justify-center">
                    <span
                      class="h-6 w-6 rounded-none border flex items-center justify-center font-mono text-[10px] font-bold"
                      style="border-color: var(--blog-accent); background-color: var(--blog-bg); color: var(--blog-accent);"
                    >
                      ✦
                    </span>
                  </div>

                  <div class="flex items-baseline gap-3 pt-0.5">
                    <h3 class="font-mono text-xl font-bold tracking-tight" style="color: var(--blog-text-primary);">
                      {yearGroup.year}
                    </h3>
                    <span class="font-mono text-[11px] uppercase tracking-wider" style="color: var(--blog-text-muted);">
                      ({yearGroup.count} {yearGroup.count === 1 ? 'publication' : 'publications'})
                    </span>
                  </div>

                  <!-- Month Groups within Year -->
                  <div class="space-y-6 pt-1">
                    {#each (yearGroup.months || [{ month: '', monthName: '', count: yearGroup.count, posts: yearGroup.posts }]) as monthGroup}
                      <div class="space-y-3">
                        {#if monthGroup.monthName}
                          <div class="flex items-center gap-2 pt-1 font-mono">
                            <span class="inline-block w-1.5 h-1.5 shrink-0" style="background-color: var(--blog-accent);"></span>
                            <h4 class="text-xs uppercase tracking-widest font-semibold" style="color: var(--blog-accent);">
                              {monthGroup.monthName}
                            </h4>
                            <span class="text-[10px]" style="color: var(--blog-text-muted);">
                              ({monthGroup.count} {monthGroup.count === 1 ? 'post' : 'posts'})
                            </span>
                            <div class="h-px flex-1 border-t border-dashed ml-2 opacity-50" style="border-color: var(--blog-border);"></div>
                          </div>
                        {/if}

                        <!-- Articles in Month -->
                        <ul class="space-y-2.5">
                          {#each monthGroup.posts as p (p.slug)}
                            <li data-archive-item data-list-item>
                              <a
                                href={`/blog/${p.slug}`}
                                class="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-none border transition-all duration-150 hover:translate-x-1 cursor-pointer"
                                style="background-color: var(--blog-surface); border-color: var(--blog-border);"
                              >
                                <div class="flex items-center gap-3">
                                  <span class="font-mono text-[11px] shrink-0" style="color: var(--blog-text-muted);">
                                    {p.date ? p.date.slice(5) : '—'}
                                  </span>
                                  <span class="text-body transition-colors group-hover:text-[var(--blog-accent)]" style="color: var(--blog-text-primary);">
                                    {p.title}
                                  </span>
                                </div>

                                <div class="flex items-center gap-3 font-mono text-[10px] shrink-0" style="color: var(--blog-text-muted);">
                                  {#if p.categories && p.categories.length > 0}
                                    <span class="hidden sm:inline-block px-1.5 py-0.5 border uppercase tracking-wider" style="background-color: var(--blog-bg); border-color: var(--blog-border);">
                                      {p.categories[0]}
                                    </span>
                                  {/if}
                                  <span>{p.readingTime}</span>
                                  <span class="transition-transform group-hover:translate-x-1" style="color: var(--blog-accent);">→</span>
                                </div>
                              </a>
                            </li>
                          {/each}
                        </ul>
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
        </div>
      {/if}
    </main>
  </div>
</section>
</div>

<style>
  /* ==========================================================================
     BLOG THEME DYNAMIC SYSTEM
     Maps OLED Black and Warm Sepia tokens to all blog UI elements
     ========================================================================== */
  section {
    background-color: transparent;
    color: var(--blog-text-primary);
  }

  [data-blog-header] {
    border-color: var(--blog-border) !important;
  }

  /* Aside navigation & sidebar telemetry */
  aside {
    border-color: var(--blog-border) !important;
  }

  /* Cards & Surfaces */
  [data-home-card],
  [data-category-card],
  [data-category-post-item],
  [data-tag-post-item],
  [data-archive-item] a {
    background-color: var(--blog-surface) !important;
    border-color: var(--blog-border) !important;
    color: var(--blog-text-primary);
  }

  [data-home-card]:hover,
  [data-category-card]:hover,
  [data-category-post-item]:hover,
  [data-tag-post-item]:hover,
  [data-archive-item] a:hover {
    border-color: var(--blog-accent) !important;
  }

  /* Pixel-Perfect Corner Reticle Brackets (hugs cards flush with zero overshoot) */
  .corner-reticle {
    border-color: var(--blog-border) !important;
  }

  :global([data-blog-theme]) [data-home-card]:hover .corner-reticle,
  :global([data-blog-theme]) [data-category-card]:hover .corner-reticle,
  :global([data-blog-theme]) [data-category-post-item]:hover .corner-reticle,
  :global([data-blog-theme]) [data-tag-post-item]:hover .corner-reticle {
    border-color: var(--blog-accent) !important;
  }

  /* Inputs & Filters */
  input[type='search'] {
    background-color: var(--blog-input-bg) !important;
    border-color: var(--blog-border) !important;
    color: var(--blog-text-primary) !important;
  }

  input[type='search']::placeholder {
    color: var(--blog-text-muted) !important;
  }

  /* Tag pills */
  [data-tag-pill] {
    background-color: var(--blog-surface) !important;
    border-color: var(--blog-border) !important;
    color: var(--blog-text-primary);
  }

  [data-tag-pill]:hover {
    border-color: var(--blog-accent) !important;
    color: var(--blog-accent) !important;
  }

  :global([data-blog-theme]) [data-home-card]:hover h2,
  :global([data-blog-theme]) [data-category-card]:hover h3,
  :global([data-blog-theme]) [data-category-post-item]:hover h3,
  :global([data-blog-theme]) [data-tag-post-item]:hover h3,
  :global([data-blog-theme]) [data-archive-item] a:hover .text-body,
  :global([data-blog-theme]) [data-home-card]:hover a span,
  :global([data-blog-theme]) [data-category-post-item]:hover a span,
  :global([data-blog-theme]) [data-tag-post-item]:hover a span,
  :global([data-blog-theme]) [data-blog-sidebar] nav button:hover [data-tab-num] {
    color: var(--blog-accent) !important;
  }

  :global([data-blog-theme]) [data-home-card]:hover,
  :global([data-blog-theme]) [data-category-card]:hover,
  :global([data-blog-theme]) [data-category-post-item]:hover,
  :global([data-blog-theme]) [data-tag-post-item]:hover,
  :global([data-blog-theme]) [data-archive-item] a:hover,
  :global([data-blog-theme]) [data-tag-pill]:hover,
  :global([data-blog-theme]) aside nav button:hover {
    border-color: var(--blog-hover-border) !important;
  }
  :global([data-blog-theme]) .border-white\/10 {
    border-color: var(--blog-border);
  }
  :global([data-blog-theme]) span.h-6.w-6 {
    border-color: var(--blog-accent) !important;
    background-color: var(--blog-bg) !important;
    color: var(--blog-accent) !important;
  }

  /* Eliminate ALL shadows in both Dark and Sepia modes */
  :global([data-blog-theme]) *,
  :global([data-blog-theme]) *::before,
  :global([data-blog-theme]) *::after {
    box-shadow: none !important;
    text-shadow: none !important;
  }
</style>
