<script>
  import Hero from '$lib/components/Hero.svelte';
  import About from '$lib/components/About.svelte';
  import Skills from '$lib/components/Skills.svelte';
  import Portfolio from '$lib/components/Portfolio.svelte';
  import Contact from '$lib/components/Contact.svelte';
</script>

<Hero />

<div class="relative z-10 bg-black">
  <About />
  <Skills />
  <Portfolio />
  <Contact />
</div>
