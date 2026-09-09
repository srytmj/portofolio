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
    class="custom-cursor-wrapper pointer-events-none fixed top-0 left-0 z-[999999] will-change-transform select-none"
    class:is-hovering={isHovering}
    class:is-down={isDown}
    style="opacity: {isVisible ? 1 : 0};"
    aria-hidden="true"
  >
    <div class="custom-cursor-cross">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="overflow-visible"
      >
        <!-- Horizontal line -->
        <line
          x1="3"
          y1="10"
          x2="17"
          y2="10"
          stroke="#ffffff"
          stroke-width="2"
          stroke-linecap="square"
        />
        <!-- Vertical line -->
        <line
          x1="10"
          y1="3"
          x2="10"
          y2="17"
          stroke="#ffffff"
          stroke-width="2"
          stroke-linecap="square"
        />
      </svg>
    </div>
  </div>
{/if}

<style>
  .custom-cursor-wrapper {
    margin-left: -10px;
    margin-top: -10px;
    mix-blend-mode: difference;
    transition: opacity 0.15s ease;
  }

  .custom-cursor-cross {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* When hovering interactive elements, subtly scale up for responsive targeting feedback */
  .custom-cursor-wrapper.is-hovering .custom-cursor-cross {
    transform: scale(1.4);
  }

  /* When mouse is pressed down, scale down slightly */
  .custom-cursor-wrapper.is-down .custom-cursor-cross {
    transform: scale(0.85);
  }

  /* Strictly hide on touch devices */
  @media (hover: none), (pointer: coarse) {
    .custom-cursor-wrapper {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  }
</style>
