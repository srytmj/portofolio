<script>
  import { Canvas } from '@threlte/core';
  import { NoToneMapping } from 'three';
  import Constellations from './hero/Constellations.svelte';

  /**
   * @type {{
   *   tier: 'full' | 'lite',
   *   reducedMotion: boolean,
   *   shrink?: number,
   *   paused?: boolean,
   *   onDowngrade?: (t: 'static') => void,
   *   onActive?: (name: string | null) => void
   * }}
   */
  let {
    tier,
    reducedMotion,
    shrink = 1,
    paused = false,
    onDowngrade,
    onActive
  } = $props();

  const maxDpr =
    typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;

  // Stars are crisp, so keep close to native res on full; watchdog drops it.
  let dpr = $state(tier === 'full' ? Math.min(maxDpr, 1.75) : 1);

  function onQuality() {
    dpr = Math.max(0.7, dpr * 0.75);
  }
</script>

<div class="absolute inset-0" aria-hidden="true">
  <Canvas
    {dpr}
    renderMode={paused ? 'manual' : 'always'}
    toneMapping={NoToneMapping}
    rendererParameters={{
      alpha: true,
      antialias: tier === 'full',
      powerPreference: 'high-performance'
    }}
  >
    <Constellations
      {tier}
      {reducedMotion}
      {shrink}
      {paused}
      {dpr}
      {onQuality}
      {onDowngrade}
      {onActive}
    />
  </Canvas>
</div>
