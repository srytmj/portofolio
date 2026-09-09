<script>
  import { onMount } from 'svelte';
  import '../app.css';
  import CustomCursor from '$lib/components/CustomCursor.svelte';

  let { children } = $props();

  onMount(() => {
    // Hydration is done and any opening-sequence overlay is already painted —
    // lift the first-paint cover (see app.html).
    const bc = document.getElementById('boot-cover');
    if (bc) {
      bc.style.opacity = '0';
      setTimeout(() => bc.remove(), 350);
    }
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Baskervville:ital@0;1&family=Epilogue:ital,wght@0,100..900;1,100..900&family=Fira+Code:wght@400;500&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Space+Grotesk:wght@600;700&family=Space+Mono&display=swap"
  />
</svelte:head>

<CustomCursor />
{@render children()}
