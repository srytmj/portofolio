import * as THREE from 'three';
import lines from '$lib/data/constellations.lines.json';
import names from '$lib/data/constellation-names.json';

const DEG = Math.PI / 180;

/** RA (deg, -180..180) + Dec (deg) → point on a sphere of radius R. */
function toVec(ra, dec, R) {
  const a = ra * DEG;
  const d = dec * DEG;
  return new THREE.Vector3(
    R * Math.cos(d) * Math.cos(a),
    R * Math.sin(d),
    -R * Math.cos(d) * Math.sin(a)
  );
}

/**
 * Turn the raw d3-celestial figure data into merged geometry.
 *
 * @param {number} R sphere radius the figures sit on
 * @returns {{
 *   constellations: { id: string, name: string, index: number, centroid: THREE.Vector3 }[],
 *   linesGeometry: THREE.BufferGeometry,
 *   starsGeometry: THREE.BufferGeometry
 * }}
 */
export function buildConstellations(R = 100) {
  const feats = lines.features;
  const constellations = [];

  const linePos = [];
  const lineConst = [];
  const lineT = [];

  const starPos = [];
  const starConst = [];
  const starScale = [];
  const starSeed = [];

  feats.forEach((f, index) => {
    const polylines = f.geometry.coordinates.map((poly) =>
      poly.map(([ra, dec]) => toVec(ra, dec, R))
    );

    // total figure length for aT normalisation
    let total = 0;
    for (const poly of polylines) {
      for (let i = 1; i < poly.length; i++) total += poly[i].distanceTo(poly[i - 1]);
    }
    total = total || 1;

    let acc = 0;
    const centroid = new THREE.Vector3();
    let n = 0;
    const seen = new Set();

    for (const poly of polylines) {
      for (let i = 0; i < poly.length; i++) {
        const p = poly[i];
        centroid.add(p);
        n++;

        // one figure-star per unique vertex
        const key = `${p.x.toFixed(1)},${p.y.toFixed(1)},${p.z.toFixed(1)}`;
        if (!seen.has(key)) {
          seen.add(key);
          starPos.push(p.x, p.y, p.z);
          starConst.push(index);
          starScale.push(1.1 + Math.random() * 0.9);
          starSeed.push(Math.random());
        }

        if (i > 0) {
          const prev = poly[i - 1];
          const tPrev = acc / total;
          acc += p.distanceTo(prev);
          const tCur = acc / total;
          linePos.push(prev.x, prev.y, prev.z, p.x, p.y, p.z);
          lineConst.push(index, index);
          lineT.push(tPrev, tCur);
        }
      }
    }

    constellations.push({
      id: f.id,
      name: names[f.id] || f.id,
      index,
      rank: Number(f.properties?.rank) || 99,
      centroid: centroid.divideScalar(n || 1).setLength(R)
    });
  });

  const linesGeometry = new THREE.BufferGeometry();
  linesGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(linePos, 3)
  );
  linesGeometry.setAttribute('aConst', new THREE.Float32BufferAttribute(lineConst, 1));
  linesGeometry.setAttribute('aT', new THREE.Float32BufferAttribute(lineT, 1));

  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starPos, 3)
  );
  starsGeometry.setAttribute('aConst', new THREE.Float32BufferAttribute(starConst, 1));
  starsGeometry.setAttribute('aScale', new THREE.Float32BufferAttribute(starScale, 1));
  starsGeometry.setAttribute('aSeed', new THREE.Float32BufferAttribute(starSeed, 1));

  return { constellations, linesGeometry, starsGeometry };
}

/** Background (non-figure) stars scattered on a slightly smaller shell. */
export function buildBackgroundStars(count, R) {
  const pos = new Float32Array(count * 3);
  const con = new Float32Array(count).fill(-1);
  const scale = new Float32Array(count);
  const seed = new Float32Array(count);
  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    v.randomDirection().multiplyScalar(R);
    pos.set([v.x, v.y, v.z], i * 3);
    scale[i] = 0.3 + Math.random() * 1.1;
    seed[i] = Math.random();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aConst', new THREE.BufferAttribute(con, 1));
  g.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  return g;
}
