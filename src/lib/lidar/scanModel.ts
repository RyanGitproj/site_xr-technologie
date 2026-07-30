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

/** Rapport largeur/hauteur du cadrage d'origine (canvas desktop) : au-delà,
    rien ne change. En deçà, le champ HORIZONTAL se referme (le fov de three
    est vertical) et le scanner, posé à gauche, sortait du cadre en portrait. */
export const SCAN_REFERENCE_ASPECT = 1.4;
/** Portrait plein (390×844 ≈ 0,46) : cadrage rapproché, recentré scanner. */
export const SCAN_PORTRAIT_ASPECT = 0.62;
/** Plancher d'aspect passé à scanFitDistance par la scène /lidar : sous ce
    ratio le fit reste vertical et les côtés de la pièce (12 m de large)
    débordent volontairement du cadre — un fit horizontal strict ferait
    reculer la caméra et la pièce flotterait au milieu du vide. */
export const SCAN_FIT_ASPECT_MIN = 1.05;

export type ScanFraming = {
  fovDeg: number;
  /** Cible du regard : elle glisse vers le scanner en portrait. */
  targetX: number;
  targetY: number;
};

/**
 * Cadrage de la scène de scan selon la forme du canvas et l'avancement :
 * fov et cible du regard (la distance, elle, est résolue sur la boîte
 * englobante par scanFitDistance). Paysage : valeurs d'origine. Portrait :
 * champ élargi, cible recentrée sur le scanner au début puis relâchée vers
 * le centre pour laisser voir le jumeau.
 */
export function scanFraming(aspect: number, progress: number): ScanFraming {
  const span = SCAN_REFERENCE_ASPECT - SCAN_PORTRAIT_ASPECT;
  const raw = (SCAN_REFERENCE_ASPECT - aspect) / span;
  const t = raw < 0 ? 0 : raw > 1 ? 1 : raw;
  const p = progress < 0 ? 0 : progress > 1 ? 1 : progress;
  if (t === 0) return { fovDeg: 42, targetX: 0, targetY: 1.1 };

  return {
    fovDeg: 42 + 18 * t,
    targetX: -1.8 * t * (1 - 0.55 * p),
    targetY: 1.1 + 0.3 * t,
  };
}

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

function pointAt(rect: ScanRect, u: number, v: number): [number, number, number] {
  return [
    rect.origin[0] + rect.uAxis[0] * u + rect.vAxis[0] * v,
    rect.origin[1] + rect.uAxis[1] * u + rect.vAxis[1] * v,
    rect.origin[2] + rect.uAxis[2] * u + rect.vAxis[2] * v,
  ];
}

/** Distance du scanner à une surface (axes u ⟂ v dans SCAN_STRUCTURE :
    projection orthogonale bornée, ouvertures ignorées). */
function distanceToRect(rect: ScanRect, p: readonly [number, number, number]): number {
  const d: [number, number, number] = [
    p[0] - rect.origin[0],
    p[1] - rect.origin[1],
    p[2] - rect.origin[2],
  ];
  const uLen2 = rect.uAxis[0] ** 2 + rect.uAxis[1] ** 2 + rect.uAxis[2] ** 2;
  const vLen2 = rect.vAxis[0] ** 2 + rect.vAxis[1] ** 2 + rect.vAxis[2] ** 2;
  const clamp = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
  const u = clamp((d[0] * rect.uAxis[0] + d[1] * rect.uAxis[1] + d[2] * rect.uAxis[2]) / uLen2);
  const v = clamp((d[0] * rect.vAxis[0] + d[1] * rect.vAxis[1] + d[2] * rect.vAxis[2]) / vLen2);
  const q = pointAt(rect, u, v);
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
}

export type ScanBirthRange = {
  /** Distance scanner → surface la plus proche (naissance 0). */
  minD: number;
  /** Amplitude des distances (naissance 1 au coin le plus lointain). */
  span: number;
};

/**
 * Bornes EXACTES de la normalisation des naissances, calculées sur la
 * géométrie et non sur un échantillon : le nuage (buildPointCloud) et le
 * front radial des surfaces pleines (shader de la bande accueil) partagent
 * ainsi le même repère temporel — le réel disparaît exactement là où les
 * points naissent.
 */
export function scanBirthRange(): ScanBirthRange {
  let minD = Number.POSITIVE_INFINITY;
  let maxD = 0;
  for (const rect of SCAN_STRUCTURE) {
    minD = Math.min(minD, distanceToRect(rect, SCANNER_POSITION));
    for (const [u, v] of [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ] as const) {
      const c = pointAt(rect, u, v);
      maxD = Math.max(
        maxD,
        Math.hypot(
          c[0] - SCANNER_POSITION[0],
          c[1] - SCANNER_POSITION[1],
          c[2] - SCANNER_POSITION[2],
        ),
      );
    }
  }
  return { minD, span: Math.max(1e-6, maxD - minD) };
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

    birthRaw[i] = Math.hypot(x - sx, y - sy, z - sz);
    shade[i] = pseudoRandom(i, salt + 53);
  }

  /* Normalisation + bruit : l'onde a une épaisseur, pas un front dur.
     Bornes GÉOMÉTRIQUES (scanBirthRange) et non échantillonnées : le
     shader des surfaces pleines calcule la même naissance par pixel. */
  const birth = new Float32Array(count);
  const { minD, span } = scanBirthRange();
  for (let i = 0; i < count; i++) {
    const noise = (pseudoRandom(i, salt + 67) - 0.5) * 0.04;
    birth[i] = Math.min(0.98, Math.max(0, (birthRaw[i] - minD) / span + noise));
  }

  return { positions, birth, shade };
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

export type ScanSolid = {
  positions: Float32Array;
  normals: Float32Array;
};

/**
 * Les MÊMES surfaces en maillage plein : c'est « l'avant » de la bande
 * accueil (le bâtiment réel), que le front radial efface pixel par pixel
 * pour laisser le nuage. Triangulation par grille : les bords d'ouvertures
 * découpent le rectangle en cellules, celles qui tombent dans un trou sont
 * jetées (fenêtres et porte réellement percées, pas peintes).
 */
export function buildSolidSurfaces(): ScanSolid {
  const positions: number[] = [];
  const normals: number[] = [];

  const axisCuts = (values: readonly number[]) =>
    [...new Set([0, ...values, 1])].sort((a, b) => a - b);

  for (const rect of SCAN_STRUCTURE) {
    const holes = rect.holes ?? [];
    const us = axisCuts(holes.flatMap((h) => [h.u0, h.u1]));
    const vs = axisCuts(holes.flatMap((h) => [h.v0, h.v1]));

    /* Normale = u × v, normalisée (matériau DoubleSide côté scène : la
       pièce se regarde de l'extérieur comme de l'intérieur). */
    const n: [number, number, number] = [
      rect.uAxis[1] * rect.vAxis[2] - rect.uAxis[2] * rect.vAxis[1],
      rect.uAxis[2] * rect.vAxis[0] - rect.uAxis[0] * rect.vAxis[2],
      rect.uAxis[0] * rect.vAxis[1] - rect.uAxis[1] * rect.vAxis[0],
    ];
    const nLen = Math.hypot(...n) || 1;

    for (let i = 0; i < us.length - 1; i++) {
      for (let j = 0; j < vs.length - 1; j++) {
        const [u0, u1] = [us[i], us[i + 1]];
        const [v0, v1] = [vs[j], vs[j + 1]];
        if (inHole(rect, (u0 + u1) / 2, (v0 + v1) / 2)) continue;
        const a = pointAt(rect, u0, v0);
        const b = pointAt(rect, u1, v0);
        const c = pointAt(rect, u1, v1);
        const d = pointAt(rect, u0, v1);
        for (const corner of [a, b, c, a, c, d]) {
          positions.push(corner[0], corner[1], corner[2]);
          normals.push(n[0] / nLen, n[1] / nLen, n[2] / nLen);
        }
      }
    }
  }

  return { positions: new Float32Array(positions), normals: new Float32Array(normals) };
}

export type ScanBounds = {
  min: readonly [number, number, number];
  max: readonly [number, number, number];
};

/** Boîte englobante de la pièce, déduite des surfaces (source unique). */
export function scanBounds(): ScanBounds {
  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  for (const rect of SCAN_STRUCTURE) {
    for (const [u, v] of [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ] as const) {
      const c = pointAt(rect, u, v);
      for (let axis = 0; axis < 3; axis++) {
        min[axis] = Math.min(min[axis], c[axis]);
        max[axis] = Math.max(max[axis], c[axis]);
      }
    }
  }
  return { min, max };
}

/**
 * Distance de caméra qui garde TOUTE la pièce dans le cadre, pour un
 * azimut/une élévation et une forme de canvas donnés. La bande accueil est
 * un cadre court et large en desktop, presque carré en mobile : plutôt que
 * des constantes réglées à l'œil, on résout la distance sur les 8 coins de
 * la boîte englobante (marge comprise).
 */
export function scanFitDistance(
  azimut: number,
  elevation: number,
  fovDeg: number,
  aspect: number,
  target: readonly [number, number, number],
  margin = 1.08,
): number {
  const tanV = Math.tan(((fovDeg / 2) * Math.PI) / 180);
  const tanH = tanV * Math.max(aspect, 0.1);

  /* Base caméra : direction cible → caméra, puis droite et haut. */
  const dir: [number, number, number] = [
    Math.sin(azimut) * Math.cos(elevation),
    Math.sin(elevation),
    Math.cos(azimut) * Math.cos(elevation),
  ];
  const forward: [number, number, number] = [-dir[0], -dir[1], -dir[2]];
  const rightLen = Math.hypot(dir[2], dir[0]) || 1;
  const right: [number, number, number] = [dir[2] / rightLen, 0, -dir[0] / rightLen];
  const up: [number, number, number] = [
    right[1] * forward[2] - right[2] * forward[1],
    right[2] * forward[0] - right[0] * forward[2],
    right[0] * forward[1] - right[1] * forward[0],
  ];

  const bounds = scanBounds();
  let distance = 0;
  for (let corner = 0; corner < 8; corner++) {
    const p: [number, number, number] = [
      (corner & 1 ? bounds.max : bounds.min)[0] - target[0],
      (corner & 2 ? bounds.max : bounds.min)[1] - target[1],
      (corner & 4 ? bounds.max : bounds.min)[2] - target[2],
    ];
    const along = p[0] * forward[0] + p[1] * forward[1] + p[2] * forward[2];
    const x = Math.abs(p[0] * right[0] + p[1] * right[1] + p[2] * right[2]);
    const y = Math.abs(p[0] * up[0] + p[1] * up[1] + p[2] * up[2]);
    distance = Math.max(distance, x / tanH - along, y / tanV - along);
  }
  return distance * margin;
}
