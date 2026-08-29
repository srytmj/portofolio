<script>
  import { onMount } from 'svelte';

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** @type {HTMLCanvasElement} */
  let canvas;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const TICK = 95; // ms per move
    const FOOD = 5;
    const MAX_LEN = 34;

    let W = 0;
    let H = 0;
    let cols = 15;
    let rows = 20;
    let cell = 0;
    let snake = [];
    let dir = { x: 1, y: 0 };
    let food = [];
    let grow = 0;
    let raf = 0;
    let last = 0;
    let acc = 0;
    let running = false;

    const wrap = (n, m) => ((n % m) + m) % m;

    function fit() {
      const r = canvas.getBoundingClientRect();
      W = Math.round(r.width);
      H = Math.round(r.height);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = 15;
      cell = W / cols;
      rows = Math.max(6, Math.floor(H / cell));
    }

    function addFood() {
      for (let t = 0; t < 60; t++) {
        const f = {
          x: Math.floor(Math.random() * cols),
          y: Math.floor(Math.random() * rows)
        };
        if (
          !snake.some((s) => s.x === f.x && s.y === f.y) &&
          !food.some((o) => o.x === f.x && o.y === f.y)
        ) {
          food.push(f);
          return;
        }
      }
    }

    function reset() {
      const cx = Math.floor(cols / 2);
      const cy = Math.floor(rows / 2);
      snake = [
        { x: cx, y: cy },
        { x: cx - 1, y: cy },
        { x: cx - 2, y: cy }
      ];
      dir = { x: 1, y: 0 };
      grow = 0;
      food = [];
      while (food.length < FOOD) addFood();
    }

    const dist = (x, y, t) => {
      const dx = Math.min(Math.abs(x - t.x), cols - Math.abs(x - t.x));
      const dy = Math.min(Math.abs(y - t.y), rows - Math.abs(y - t.y));
      return dx + dy;
    };

    function step() {
      const head = snake[0];

      // nearest dot
      let target = food[0];
      let best = Infinity;
      for (const f of food) {
        const d = dist(head.x, head.y, f);
        if (d < best) {
          best = d;
          target = f;
        }
      }

      // greedy toward target, never reverse, avoid the body
      const opts = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
      ].filter((d) => !(d.x === -dir.x && d.y === -dir.y));

      opts.sort(
        (a, b) =>
          dist(wrap(head.x + a.x, cols), wrap(head.y + a.y, rows), target) -
          dist(wrap(head.x + b.x, cols), wrap(head.y + b.y, rows), target)
      );

      let chosen = opts[0];
      for (const o of opts) {
        const nx = wrap(head.x + o.x, cols);
        const ny = wrap(head.y + o.y, rows);
        if (!snake.slice(0, -1).some((s) => s.x === nx && s.y === ny)) {
          chosen = o;
          break;
        }
      }
      dir = chosen;

      const nx = wrap(head.x + dir.x, cols);
      const ny = wrap(head.y + dir.y, rows);
      if (snake.some((s) => s.x === nx && s.y === ny)) {
        reset();
        return;
      }

      snake.unshift({ x: nx, y: ny });
      const fi = food.findIndex((f) => f.x === nx && f.y === ny);
      if (fi >= 0) {
        food.splice(fi, 1);
        addFood();
        grow += 2;
      }
      if (grow > 0 && snake.length < MAX_LEN) grow--;
      else snake.pop();
    }

    function render() {
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      for (const f of food) {
        ctx.beginPath();
        ctx.arc(f.x * cell + cell / 2, f.y * cell + cell / 2, cell * 0.15, 0, 7);
        ctx.fill();
      }

      const pad = cell * 0.16;
      for (let i = snake.length - 1; i >= 0; i--) {
        const s = snake[i];
        const t = 1 - i / snake.length;
        ctx.fillStyle = `rgba(255,255,255,${(0.3 + t * 0.65).toFixed(3)})`;
        ctx.fillRect(s.x * cell + pad, s.y * cell + pad, cell - 2 * pad, cell - 2 * pad);
      }
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!last) last = now;
      acc += now - last;
      last = now;
      let n = 0;
      while (acc >= TICK && n++ < 4) {
        step();
        acc -= TICK;
      }
      render();
    }

    function start() {
      if (running || reduce) return;
      running = true;
      last = 0;
      acc = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    fit();
    reset();
    render();

    if (reduce) {
      for (let i = 0; i < 24; i++) step();
      render();
    }

    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0.05 }
    );
    io.observe(canvas);

    const onResize = () => {
      fit();
      reset();
      render();
    };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  });
</script>

<div
  class="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-white/10 bg-black"
>
  <canvas bind:this={canvas} class="h-full w-full" aria-hidden="true"></canvas>
  <span class="sr-only">Auto-playing snake — placeholder for a portrait</span>
</div>
