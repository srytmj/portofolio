<!--
  CSS-only hero fallback: no WebGL, no JS. A quiet star field for low-end /
  no-WebGL / slow-network / reduced-motion devices and for SSR.
-->
<div class="absolute inset-0 overflow-hidden bg-black" aria-hidden="true">
  <div class="stars stars-a"></div>
  <div class="stars stars-b"></div>
  <div
    class="absolute inset-0"
    style="background: radial-gradient(circle at 50% 45%, rgba(255,255,255,0.05), transparent 55%);"
  ></div>
</div>

<style>
  .stars {
    position: absolute;
    inset: -50%;
    background-repeat: repeat;
  }
  .stars-a {
    background-image:
      radial-gradient(1.4px 1.4px at 20% 30%, #fff, transparent),
      radial-gradient(1.2px 1.2px at 70% 60%, rgba(255, 255, 255, 0.8), transparent),
      radial-gradient(1.6px 1.6px at 40% 80%, #fff, transparent),
      radial-gradient(1px 1px at 85% 20%, rgba(255, 255, 255, 0.7), transparent);
    background-size: 320px 320px;
    opacity: 0.7;
  }
  .stars-b {
    background-image:
      radial-gradient(1px 1px at 15% 65%, rgba(255, 255, 255, 0.6), transparent),
      radial-gradient(1.3px 1.3px at 55% 25%, #fff, transparent),
      radial-gradient(1px 1px at 90% 75%, rgba(255, 255, 255, 0.55), transparent);
    background-size: 500px 500px;
    opacity: 0.5;
  }
  @media (prefers-reduced-motion: no-preference) {
    .stars-a {
      animation: drift 240s linear infinite;
    }
    .stars-b {
      animation: drift 400s linear infinite reverse;
    }
  }
  @keyframes drift {
    to {
      transform: translate3d(-320px, -180px, 0);
    }
  }
</style>
