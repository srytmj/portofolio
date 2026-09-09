// Constellation figures + starfield. Monochrome.
//
// Each line vertex / figure star carries its constellation index (aConst) and a
// 0..1 position along that figure's drawing order (aT). uProgress[i] is how far
// constellation i has "drawn in" — driven by pointer proximity on the CPU.

export const MAX_CONST = 90; // 88 IAU + headroom

export const linesVertexShader = /* glsl */ `
uniform float uProgress[${MAX_CONST}];
attribute float aConst;
attribute float aT;
varying float vAlpha;

void main() {
  float p = uProgress[int(aConst)];
  // segment revealed once the draw head (p) passes this point (aT)
  float rev = 1.0 - smoothstep(p - 0.015, p + 0.015, aT);
  vAlpha = rev * step(0.0008, p);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const linesFragmentShader = /* glsl */ `
precision highp float;
uniform float uOpacity;
uniform vec3 uColor;
varying float vAlpha;
void main() {
  if (vAlpha < 0.01) discard;
  gl_FragColor = vec4(uColor, vAlpha * uOpacity * 0.85);
}
`;

export const starsVertexShader = /* glsl */ `
uniform float uProgress[${MAX_CONST}];
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform float uReducedMotion;
uniform float uSignature;      // constellation index of the signature figure, -1 = none
uniform float uSignatureGlow;  // steady additive glow for it while the sky is idle
attribute float aConst;     // -1 for background stars
attribute float aScale;
attribute float aSeed;
varying float vGlow;

void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;

  float p = aConst < 0.0 ? 0.0 : uProgress[int(aConst)];
  float base = aConst < 0.0 ? 0.46 : 0.44;
  float glow = base + p * 0.6;

  if (uReducedMotion < 0.5) {
    glow *= 0.7 + 0.3 * sin(uTime * 1.3 + aSeed * 6.2831);
  }

  // Signature figure: a subtle steady lift so it reads a touch brighter than
  // the rest when nothing is hovered. Only its own stars.
  if (aConst > -0.5 && abs(aConst - uSignature) < 0.5) {
    glow += uSignatureGlow;
  }
  vGlow = glow;

  float sz = uSize * aScale * uPixelRatio * (1.0 + p * 1.4);
  gl_PointSize = clamp(sz * (320.0 / max(-mv.z, 1.0)), 0.6, 7.0);
}
`;

export const starsFragmentShader = /* glsl */ `
precision highp float;
uniform float uOpacity;
uniform vec3 uColor;
varying float vGlow;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d) * clamp(vGlow, 0.0, 1.2) * uOpacity;
  gl_FragColor = vec4(uColor, a);
}
`;
