<script>
  import { onMount } from 'svelte';

  /** @type {{ src?: string, alt?: string }} */
  let { src = '/portrait.jpg', alt = 'Portrait' } = $props();

  /** @type {HTMLCanvasElement} */
  let canvas;

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    const STEP = 5; // css px between dots
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999, on: false };
    let W = 0;
    let H = 0;
    let grid = [];
    let raf = 0;

    function fit() {
      const r = canvas.getBoundingClientRect();
      W = Math.round(r.width);
      H = Math.round(r.height);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function build(sample) {
      const cols = Math.max(1, Math.ceil(W / STEP));
      const rows = Math.max(1, Math.ceil(H / STEP));
      grid = new Array(cols * rows);
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          grid[gy * cols + gx] = {
            x: gx * STEP + STEP / 2,
            y: gy * STEP + STEP / 2,
            b: sample(gx, gy, cols, rows)
          };
        }
      }
      render();
    }

    function fromImage(img) {
      const cols = Math.max(1, Math.ceil(W / STEP));
      const rows = Math.max(1, Math.ceil(H / STEP));
      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const octx = off.getContext('2d');
      // cover-fit, biased slightly up so the face sits in frame
      const ir = img.width / img.height;
      const cr = cols / rows;
      let sw, sh, sx, sy;
      if (ir > cr) {
        sh = img.height;
        sw = sh * cr;
        sx = (img.width - sw) / 2;
        sy = 0;
      } else {
        sw = img.width;
        sh = sw / cr;
        sx = 0;
        sy = (img.height - sh) * 0.18;
      }
      octx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
      const data = octx.getImageData(0, 0, cols, rows).data;

      // Knock out a solid studio background: average the four corners, drop any
      // cell whose colour is close to it (handles the red passport-photo bg).
      const px = (gx, gy) => {
        const i = (gy * cols + gx) * 4;
        return [data[i], data[i + 1], data[i + 2]];
      };
      const corners = [
        px(0, 0),
        px(cols - 1, 0),
        px(0, rows - 1),
        px(cols - 1, rows - 1)
      ];
      const bg = [0, 1, 2].map((k) => corners.reduce((s, c) => s + c[k], 0) / 4);

      build((gx, gy, c, r) => {
        const i = (gy * c + gx) * 4;
        const R = data[i];
        const G = data[i + 1];
        const B = data[i + 2];

        const dist = Math.hypot(R - bg[0], G - bg[1], B - bg[2]);
        const keep = Math.min(1, Math.max(0, (dist - 46) / 34)); // 0 = background

        let b = (0.299 * R + 0.587 * G + 0.114 * B) / 255;
        b = Math.pow(b, 1.35);

        const nx = (gx / c - 0.5) * 2;
        const ny = (gy / r - 0.42) * 2;
        const v = 1 - Math.min(1, Math.max(0, (nx * nx + ny * ny) * 0.5 - 0.12));

        return b * keep * v;
      });
    }

    function fallback() {
      // no photo yet — a faint drifting star field, on brand
      build(() => (Math.random() < 0.5 ? Math.random() * 0.5 : 0));
    }

    function render() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#ffffff';
      for (const d of grid) {
        let rad = d.b * (STEP * 0.78);
        if (mouse.on) {
          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const infl = Math.max(0, 1 - Math.hypot(dx, dy) / 120);
          rad += infl * infl * 2.4;
        }
        if (rad < 0.35) continue;
        ctx.beginPath();
        ctx.arc(d.x, d.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    fit();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => fromImage(img);
    img.onerror = fallback;
    img.src = src;

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.on =
        mouse.x > -60 && mouse.x < W + 60 && mouse.y > -60 && mouse.y < H + 60;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          render();
        });
    };
    const onLeave = () => {
      mouse.on = false;
      render();
    };
    const onResize = () => {
      fit();
      if (img.complete && img.naturalWidth) fromImage(img);
      else fallback();
    };

    if (!reduce) {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerleave', onLeave);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  });
</script>

<div
  class="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-white/10 bg-black"
>
  <canvas bind:this={canvas} class="h-full w-full" aria-hidden="true"></canvas>
  <span class="sr-only">{alt}</span>
</div>
