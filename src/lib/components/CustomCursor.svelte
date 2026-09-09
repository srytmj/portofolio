<script>
  import { onMount } from 'svelte';

  let cursorEl = $state(null);
  let isHovering = $state(false);
  let isDown = $state(false);
  let isVisible = $state(false);
  let isSupported = $state(false);

  onMount(() => {
    // Strictly activate for desktop devices with true hover capability and a fine pointer (mouse / trackpad)
    // Never activate on mobile smartphones or touch tablets
    const hasHoverAndFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasHoverAndFinePointer) {
      return;
    }

    isSupported = true;
    document.documentElement.classList.add('custom-cursor-active');

    let mouseX = -100;
    let mouseY = -100;
    let isTouchInteracting = false;

    const onTouchStart = () => {
      isTouchInteracting = true;
      isVisible = false;
    };

    const onMouseMove = (e) => {
      if (isTouchInteracting) {
        isVisible = false;
        return;
      }
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
      }
      if (cursorEl) {
        cursorEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Detect if hovering over an interactive element or text
      const target = e.target;
      if (target && target.closest) {
        const interactive = target.closest(
          'a, button, [role="button"], input, textarea, select, label, summary, .cursor-pointer, [data-interactive], [tabindex]:not([tabindex="-1"])'
        );
        isHovering = !!interactive;
      } else {
        isHovering = false;
      }
    };

    const onMouseDown = () => {
      if (isTouchInteracting) return;
      isDown = true;
    };

    const onMouseUp = () => {
      isDown = false;
      isTouchInteracting = false;
    };

    const onMouseLeave = () => {
      isVisible = false;
    };

    const onMouseEnter = () => {
      if (!isTouchInteracting) {
        isVisible = true;
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  });
</script>

{#if isSupported}
  <div
    bind:this={cursorEl}
    class="cursor-root pointer-events-none fixed top-0 left-0 z-[999999] select-none"
    class:is-hovering={isHovering}
    class:is-down={isDown}
    style:opacity={isVisible ? 1 : 0}
    style:will-change="transform"
    aria-hidden="true"
  >
    <div class="custom-cursor-cross">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="overflow-visible"
      >
        <!-- Tactical Crosshair with center dot -->
        <path d="M12 2 L12 8 M12 16 L12 22 M2 12 L8 12 M16 12 L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="square" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    </div>
  </div>
{/if}

<style>
  .cursor-root {
    /* Follows the theme instead of being hard white: on the Bunker (light)
       theme a white crosshair on cream is effectively invisible. */
    color: var(--yorha-text-primary);
    margin-left: -12px;
    margin-top: -12px;
    transition: opacity 0.15s ease;
  }

  .custom-cursor-cross {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
    /* Halo in the page background colour, so the crosshair keeps a readable
       edge over imagery and over the canvas in either theme. */
    filter: drop-shadow(0 0 1px var(--yorha-bg)) drop-shadow(0 0 3px var(--yorha-bg));
  }

  /* When hovering interactive elements, spin 45deg and scale up for tactical lock-on */
  .is-hovering .custom-cursor-cross {
    transform: scale(1.2) rotate(45deg);
  }

  /* When mouse is pressed down, scale down slightly and spin back */
  .is-down .custom-cursor-cross {
    transform: scale(0.85) rotate(0deg);
  }

  /* Strictly hide on touch devices */
  @media (hover: none), (pointer: coarse) {
    .custom-cursor-cross {
      display: none !important;
    }
  }
</style>
