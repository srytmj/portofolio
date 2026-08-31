// Central motion vocabulary. Every GSAP call site speaks this language so the
// whole site eases and times the same way.
//
//  ease.out  — things arriving / revealing. Deep deceleration (expo) reads as
//              "designed" and is the site's signature reveal curve.
//  ease.ui   — small, quick UI moves (nav rows, hovers). Soft landing.
//  ease.in   — things leaving.
//  ease.draw — continuous draws (underline scaleX) and anything scrubbed.

export const ease = {
  out: 'expo.out',
  ui: 'power3.out',
  in: 'power2.in',
  draw: 'power4.inOut'
};

// Duration scale, seconds. Pick by role, don't free-type numbers.
export const dur = {
  xs: 0.22, // micro: hover, tiny toggle
  sm: 0.4, // standard UI move
  md: 0.6, // panel / card enter
  lg: 0.9, // section reveal, title mask
  xl: 1.1 // long draw
};

export const stagger = {
  tight: 0.03,
  base: 0.06
};
