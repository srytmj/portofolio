<script>
  import { onMount } from 'svelte';

  let timeString = $state('');

  function updateTime() {
    const now = new Date();
    // Format to Asia/Jakarta time (WIB, UTC+7) with seconds
    timeString = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now);
  }

  onMount(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  });
</script>

<div class="clock-container inline-flex items-center gap-3 font-mono select-none">
  <!-- Jam (HH:mm:ss) -->
  <span class="clock-time text-sm sm:text-base font-light tracking-wider tabular-nums">
    {timeString || '--:--:--'}
  </span>

  <!-- Sisi kanan: UTC+7 di atas, WIB di bawah -->
  <div class="flex flex-col text-[9px] leading-tight tracking-[0.16em] uppercase">
    <span class="clock-utc">UTC+7</span>
    <span class="clock-wib font-medium">WIB</span>
  </div>
</div>

<style>
  .clock-container {
    text-shadow: none;
  }
  .clock-time {
    color: var(--yorha-text-primary, var(--blog-text-primary));
  }
  .clock-utc {
    color: var(--yorha-text-muted, var(--blog-text-muted));
  }
  .clock-wib {
    color: var(--yorha-accent, var(--blog-accent));
  }
</style>
