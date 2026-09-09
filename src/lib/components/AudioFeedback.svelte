<script module>
  // Shared audio context so we don't spam the browser
  let audioCtx = null;
  let enabled = false;

  function initAudio() {
    if (!audioCtx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  export function enableAudio() {
    enabled = true;
    initAudio();
  }

  export function disableAudio() {
    enabled = false;
  }

  // Play a very subtle mechanical "tick"
  export function playHover() {
    if (!enabled || !audioCtx) return;
    try {
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      // High frequency click
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(100, t + 0.02);
      
      // Very short envelope
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.05, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(t);
      osc.stop(t + 0.04);
    } catch (e) {}
  }

  // Play a slightly more prominent confirm "beep"
  export function playClick() {
    if (!enabled || !audioCtx) return;
    try {
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.05);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(t);
      osc.stop(t + 0.12);
    } catch (e) {}
  }
</script>

<script>
  import { onMount } from 'svelte';

  onMount(() => {
    // Enable audio on first user interaction to bypass autoplay restrictions
    const enable = () => {
      enableAudio();
      document.removeEventListener('pointerdown', enable);
      document.removeEventListener('keydown', enable);
    };
    document.addEventListener('pointerdown', enable);
    document.addEventListener('keydown', enable);

    // Global event delegation for hover and click sounds
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, [role="button"], .yorha-invert-hover, input');
      if (target && !target.disabled) {
        // Only play if moving onto the element newly
        if (!target.dataset.hovered) {
          target.dataset.hovered = 'true';
          playHover();
          target.addEventListener('mouseleave', () => {
            delete target.dataset.hovered;
          }, { once: true });
        }
      }
    };

    const handleClick = (e) => {
      const target = e.target.closest('a, button, [role="button"], .yorha-invert-hover, input');
      if (target && !target.disabled) {
        playClick();
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('pointerdown', enable);
      document.removeEventListener('keydown', enable);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleClick);
      if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
      }
    };
  });
</script>
