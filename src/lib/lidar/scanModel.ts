import { pseudoRandom } from "@/lib/pseudoRandom";

/**
 * Modèle procédural de la scène « le scan construit le jumeau » (/lidar) :
 * une pièce déclarée en surfaces rectangulaires orientées (avec ouvertures),
 * SOURCE UNIQUE des points ET du filaire : l'alignement nuage/jumeau est
 * garanti par construction. Génération déterministe (pseudoRandom) :
 * zéro mismatch SSR, zéro Math.random.
 */

export type ScanRect = {
  /** Coin origine de la surface (monde). */
  origin: readonly [number, number, number];
  /** Côté U (monde) : origin + uAxis = coin adjacent. */
  uAxis: readonly [number, number, number];
  /** Côté V (monde) : origin + vAxis = coin adjacent. */
  vAxis: readonly [number, number, number];
  /** Ouvertures (fenêtres, portes) en fractions [0..1] de la surface. */
  holes?: readonly { u0: number; v0: number; u1: number; v1: number }[];
};

/** Position du scanner dans la pièce (la naissance des points est radiale
    depuis cette origine : l'onde révèle ce qu'elle a balayé). */
export const SCANNER_POSITION: readonly [number, number, number] = [-3.2, 1.2, 1.6];

/** Pièce 12×8, murs 3,2 m : sol, mur du fond à 2 fenêtres, mur gauche à
    porte, bandeau de plafond, 2 colonnes (2 faces visibles chacune). */
export const SCAN_STRUCTURE: readonly ScanRect[] = [
  /* Sol. */
  { origin: [-6, 0, -4], uAxis: [12, 0, 0], vAxis: [0, 0, 8] },
  /* Mur du fond (z = -4), 2 fenêtres. */
  {
    origin: [-6, 0, -4],
    uAxis: [12, 0, 0],
    vAxis: [0, 3.2, 0],
    holes: [
      { u0: 0.14, v0: 0.34, u1: 0.34, v1: 0.78 },
      { u0: 0.56, v0: 0.34, u1: 0.76, v1: 0.78 },
    ],
  },
  /* Mur gauche (x = -6), porte. */
  {
    origin: [-6, 0, -4],
    uAxis: [0, 0, 8],
    vAxis: [0, 3.2, 0],
    holes: [{ u0: 0.58, v0: 0, u1: 0.74, v1: 0.7 }],
  },
  /* Bandeau de plafond le long du fond. */
  { origin: [-6, 3.2, -4], uAxis: [12, 0, 0], vAxis: [0, 0, 1.4] },
  /* Colonne A (x -1.5, z -1) : faces +Z et +X. */
  { origin: [-1.75, 0, -0.75], uAxis: [0.5, 0, 0], vAxis: [0, 3.2, 0] },
  { origin: [-1.25, 0, -1.25], uAxis: [0, 0, 0.5], vAxis: [0, 3.2, 0] },
  /* Colonne B (x 2.5, z 0.5) : faces +Z et -X. */
  { origin: [2.25, 0, 0.75], uAxis: [0.5, 0, 0], vAxis: [0, 3.2, 0] },
  { origin: [2.25, 0, 0.25], uAxis: [0, 0, 0.5], vAxis: [0, 3.2, 0] },
];

function rectArea(rect: ScanRect): number {
  const u = Math.hypot(...rect.uAxis);
  const v = Math.hypot(...rect.vAxis);
  const holes = rect.holes ?? [];
  const holeFraction = holes.reduce((sum, h) => sum + (h.u1 - h.u0) * (h.v1 - h.v0), 0);
  return u * v * (1 - holeFraction);
}

function inHole(rect: ScanRect, u: number, v: number): boolean {
  return (rect.holes ?? []).some((h) => u >= h.u0 && u <= h.u1 && v >= h.v0 && v <= h.v1);
}

export type ScanPointCloud = {
  positions: Float32Array;
  /** Seuil d'apparition [0..1] : distance radiale au scanner, bruitée. */
  birth: Float32Array;
  /** Variation de teinte par point [0..1]. */
  shade: Float32Array;
};

/**
 * Distribution des points pondérée par l'aire des surfaces, ouvertures
 * rejetées (re-hash déterministe), naissance = distance au scanner
 * normalisée + bruit léger.
 */
export function buildPointCloud(count: number, salt = 7): ScanPointCloud {
  const areas = SCAN_STRUCTURE.map(rectArea);
  const total = areas.reduce((a, b) => a + b, 0);
  const positions = new Float32Array(count * 3);
  const birthRaw = new Float32Array(count);
  const shade = new Float32Array(count);
  const [sx, sy, sz] = SCANNER_POSITION;
  let minD = Number.POSITIVE_INFINITY;
  let maxD = 0;

  for (let i = 0; i < count; i++) {
    /* Choix de surface pondéré par l'aire. */
    let pick = pseudoRandom(i, salt) * total;
    let rectIndex = 0;
    while (rectIndex < areas.length - 1 && pick > areas[rectIndex]) {
      pick -= areas[rectIndex];
      rectIndex += 1;
    }
    const rect = SCAN_STRUCTURE[rectIndex];

    /* Position (u,v) hors ouvertures : re-hash déterministe borné. */
    let u = pseudoRandom(i, salt + 11 + rectIndex);
    let v = pseudoRandom(i, salt + 23 + rectIndex);
    for (let attempt = 0; attempt < 6 && inHole(rect, u, v); attempt++) {
      u = pseudoRandom(i + attempt * 7919, salt + 37);
      v = pseudoRandom(i + attempt * 104729, salt + 41);
    }

    const x = rect.origin[0] + rect.uAxis[0] * u + rect.vAxis[0] * v;
    const y = rect.origin[1] + rect.uAxis[1] * u + rect.vAxis[1] * v;
    const z = rect.origin[2] + rect.uAxis[2] * u + rect.vAxis[2] * v;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const d = Math.hypot(x - sx, y - sy, z - sz);
    birthRaw[i] = d;
    if (d < minD) minD = d;
    if (d > maxD) maxD = d;
    shade[i] = pseudoRandom(i, salt + 53);
  }

  /* Normalisation + bruit : l'onde a une épaisseur, pas un front dur. */
  const birth = new Float32Array(count);
  const span = Math.max(1e-6, maxD - minD);
  for (let i = 0; i < count; i++) {
    const noise = (pseudoRandom(i, salt + 67) - 0.5) * 0.04;
    birth[i] = Math.min(0.98, Math.max(0, (birthRaw[i] - minD) / span + noise));
  }

  return { positions, birth, shade };
}

function pointAt(rect: ScanRect, u: number, v: number): [number, number, number] {
  return [
    rect.origin[0] + rect.uAxis[0] * u + rect.vAxis[0] * v,
    rect.origin[1] + rect.uAxis[1] * u + rect.vAxis[1] * v,
    rect.origin[2] + rect.uAxis[2] * u + rect.vAxis[2] * v,
  ];
}

/** Filaire du jumeau : contours des surfaces + contours des ouvertures,
    en paires de segments (Float32Array pour LineSegments). */
export function buildWireframe(): Float32Array {
  const segments: number[] = [];
  const push = (a: readonly number[], b: readonly number[]) => {
    segments.push(a[0], a[1], a[2], b[0], b[1], b[2]);
  };

  for (const rect of SCAN_STRUCTURE) {
    const corners = [
      pointAt(rect, 0, 0),
      pointAt(rect, 1, 0),
      pointAt(rect, 1, 1),
      pointAt(rect, 0, 1),
    ];
    for (let i = 0; i < 4; i++) push(corners[i], corners[(i + 1) % 4]);
    for (const hole of rect.holes ?? []) {
      const h = [
        pointAt(rect, hole.u0, hole.v0),
        pointAt(rect, hole.u1, hole.v0),
        pointAt(rect, hole.u1, hole.v1),
        pointAt(rect, hole.u0, hole.v1),
      ];
      for (let i = 0; i < 4; i++) push(h[i], h[(i + 1) % 4]);
    }
  }

  return new Float32Array(segments);
}
