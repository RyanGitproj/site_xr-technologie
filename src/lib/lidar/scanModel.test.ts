import { describe, expect, it } from "vitest";
import {
  SCANNER_POSITION,
  SCAN_REFERENCE_ASPECT,
  SCAN_STRUCTURE,
  buildPointCloud,
  buildSolidSurfaces,
  buildWireframe,
  scanBirthRange,
  scanBounds,
  scanFitDistance,
  scanFraming,
} from "./scanModel";

describe("scanFraming", () => {
  it("ne touche à rien en paysage (cadrage d'origine)", () => {
    for (const aspect of [SCAN_REFERENCE_ASPECT, 1.78, 2.4]) {
      const f = scanFraming(aspect, 0.5);
      expect(f.fovDeg).toBe(42);
      expect(f.radiusScale).toBe(1);
      expect(f.targetX).toBe(0);
      expect(f.targetY).toBe(1.1);
    }
  });

  /** Le défaut corrigé : en portrait, le scanner (x = -3.2) tombait hors du
      champ horizontal. On re-projette ici la demi-largeur visible au niveau
      de la cible pour vérifier qu'il y rentre, avec de la marge. */
  const halfWidthAt = (aspect: number, progress: number, radius: number) => {
    const f = scanFraming(aspect, progress);
    const vHalf = ((f.fovDeg / 2) * Math.PI) / 180;
    return Math.tan(vHalf) * aspect * radius * f.radiusScale;
  };

  it("garde le scanner dans le cadre en portrait (390×844)", () => {
    const aspect = 390 / 844;
    for (const [progress, radius] of [
      [0, 15],
      [0.5, 11.5],
      [1, 10.5],
    ] as const) {
      const f = scanFraming(aspect, progress);
      const half = halfWidthAt(aspect, progress, radius);
      const distance = Math.abs(SCANNER_POSITION[0] - f.targetX);
      expect(distance, `progress ${progress}`).toBeLessThan(half - 0.4);
    }
  });

  it("interpole sans à-coup entre paysage et portrait", () => {
    const mid = scanFraming(1, 0);
    expect(mid.fovDeg).toBeGreaterThan(42);
    expect(mid.fovDeg).toBeLessThan(60);
    expect(mid.targetX).toBeLessThan(0);
  });
});

describe("buildPointCloud", () => {
  const cloud = buildPointCloud(3000);

  it("produit exactement le nombre de points demandé", () => {
    expect(cloud.positions.length).toBe(9000);
    expect(cloud.birth.length).toBe(3000);
    expect(cloud.shade.length).toBe(3000);
  });

  it("est déterministe (même salt = mêmes points, SSR-safe)", () => {
    const again = buildPointCloud(3000);
    expect(again.positions[123]).toBe(cloud.positions[123]);
    expect(again.birth[456]).toBe(cloud.birth[456]);
  });

  it("borne birth à [0, 0.98] : tous les points naissent avant la fin", () => {
    let min = 1;
    let max = 0;
    for (const b of cloud.birth) {
      min = Math.min(min, b);
      max = Math.max(max, b);
    }
    expect(min).toBeGreaterThanOrEqual(0);
    /* Tolérance d'arrondi Float32 sur la borne 0.98. */
    expect(max).toBeLessThanOrEqual(0.9801);
  });

  it("les points proches du scanner naissent avant les points lointains", () => {
    const [sx, sy, sz] = SCANNER_POSITION;
    let nearBirth = 0;
    let nearD = Number.POSITIVE_INFINITY;
    let farBirth = 0;
    let farD = 0;
    for (let i = 0; i < 3000; i++) {
      const d = Math.hypot(
        cloud.positions[i * 3] - sx,
        cloud.positions[i * 3 + 1] - sy,
        cloud.positions[i * 3 + 2] - sz,
      );
      if (d < nearD) {
        nearD = d;
        nearBirth = cloud.birth[i];
      }
      if (d > farD) {
        farD = d;
        farBirth = cloud.birth[i];
      }
    }
    expect(nearBirth).toBeLessThan(farBirth);
  });

  it("reste dans l'emprise de la pièce (12×8, murs 3,2)", () => {
    for (let i = 0; i < 3000; i++) {
      expect(cloud.positions[i * 3]).toBeGreaterThanOrEqual(-6.001);
      expect(cloud.positions[i * 3]).toBeLessThanOrEqual(6.001);
      expect(cloud.positions[i * 3 + 1]).toBeGreaterThanOrEqual(-0.001);
      expect(cloud.positions[i * 3 + 1]).toBeLessThanOrEqual(3.201);
      expect(cloud.positions[i * 3 + 2]).toBeGreaterThanOrEqual(-4.001);
      expect(cloud.positions[i * 3 + 2]).toBeLessThanOrEqual(4.001);
    }
  });
});

describe("scanBirthRange", () => {
  /** Contrat de la bande accueil : la matière s'efface exactement là où les
      points naissent, donc les deux doivent lire la MÊME normalisation. */
  it("encadre les naissances du nuage (mêmes bornes que buildPointCloud)", () => {
    const { minD, span } = scanBirthRange();
    const cloud = buildPointCloud(4000);
    const [sx, sy, sz] = SCANNER_POSITION;
    for (let i = 0; i < 4000; i++) {
      const d = Math.hypot(
        cloud.positions[i * 3] - sx,
        cloud.positions[i * 3 + 1] - sy,
        cloud.positions[i * 3 + 2] - sz,
      );
      const birth = (d - minD) / span;
      /* Tolérance = le bruit ±0,02 appliqué aux naissances. */
      expect(birth).toBeGreaterThanOrEqual(-0.001);
      expect(birth).toBeLessThanOrEqual(1.001);
      expect(Math.abs(birth - cloud.birth[i])).toBeLessThanOrEqual(0.021);
    }
  });
});

describe("buildSolidSurfaces", () => {
  const solid = buildSolidSurfaces();

  it("produit des triangles complets, une normale par sommet", () => {
    expect(solid.positions.length % 9).toBe(0);
    expect(solid.normals.length).toBe(solid.positions.length);
  });

  it("perce vraiment les ouvertures (aucun sommet dans une fenêtre)", () => {
    /* La fenêtre gauche du mur du fond : u 0,14→0,34 de 12 m, v 0,34→0,78
       de 3,2 m. Son centre ne doit être couvert par aucun triangle. */
    const cx = -6 + 12 * 0.24;
    const cy = 3.2 * 0.56;
    let covered = 0;
    for (let t = 0; t < solid.positions.length; t += 9) {
      const zs = [solid.positions[t + 2], solid.positions[t + 5], solid.positions[t + 8]];
      if (!zs.every((z) => Math.abs(z + 4) < 1e-6)) continue;
      const xs = [solid.positions[t], solid.positions[t + 3], solid.positions[t + 6]];
      const ys = [solid.positions[t + 1], solid.positions[t + 4], solid.positions[t + 7]];
      const inside =
        cx >= Math.min(...xs) &&
        cx <= Math.max(...xs) &&
        cy >= Math.min(...ys) &&
        cy <= Math.max(...ys);
      if (inside) covered += 1;
    }
    expect(covered).toBe(0);
  });

  it("reste dans l'emprise de la pièce", () => {
    const { min, max } = scanBounds();
    for (let i = 0; i < solid.positions.length; i += 3) {
      for (let axis = 0; axis < 3; axis++) {
        expect(solid.positions[i + axis]).toBeGreaterThanOrEqual(min[axis] - 0.001);
        expect(solid.positions[i + axis]).toBeLessThanOrEqual(max[axis] + 0.001);
      }
    }
  });
});

describe("scanFitDistance", () => {
  const TARGET = [0, 1.15, 0] as const;

  /** Le défaut qu'on refuse : une pièce rognée par le cadre court et large
      de la bande accueil. On reprojette les 8 coins depuis la caméra
      calculée et on vérifie qu'ils tombent tous dans le frustum. */
  const allCornersVisible = (azimut: number, elevation: number, aspect: number) => {
    const fov = 40;
    const distance = scanFitDistance(azimut, elevation, fov, aspect, TARGET);
    const cam = [
      TARGET[0] + Math.sin(azimut) * Math.cos(elevation) * distance,
      TARGET[1] + Math.sin(elevation) * distance,
      TARGET[2] + Math.cos(azimut) * Math.cos(elevation) * distance,
    ];
    const forward = [
      TARGET[0] - cam[0],
      TARGET[1] - cam[1],
      TARGET[2] - cam[2],
    ].map((v) => v / distance);
    const rightLen = Math.hypot(forward[0], forward[2]) || 1;
    const right = [-forward[2] / rightLen, 0, forward[0] / rightLen];
    const up = [
      right[1] * forward[2] - right[2] * forward[1],
      right[2] * forward[0] - right[0] * forward[2],
      right[0] * forward[1] - right[1] * forward[0],
    ];
    const tanV = Math.tan(((fov / 2) * Math.PI) / 180);
    const { min, max } = scanBounds();
    return [0, 1, 2, 3, 4, 5, 6, 7].every((corner) => {
      const p = [
        (corner & 1 ? max : min)[0] - cam[0],
        (corner & 2 ? max : min)[1] - cam[1],
        (corner & 4 ? max : min)[2] - cam[2],
      ];
      const z = p[0] * forward[0] + p[1] * forward[1] + p[2] * forward[2];
      const x = Math.abs(p[0] * right[0] + p[1] * right[1] + p[2] * right[2]);
      const y = Math.abs(p[0] * up[0] + p[1] * up[1] + p[2] * up[2]);
      return z > 0 && x <= z * tanV * aspect && y <= z * tanV;
    });
  };

  it("garde toute la pièce dans le cadre, quelle que soit la forme", () => {
    for (const aspect of [2.4, 1.6, 1.2, 0.8]) {
      for (const azimut of [-0.6, -0.28, 0.22, 0.72]) {
        expect(allCornersVisible(azimut, 0.42, aspect), `${aspect} / ${azimut}`).toBe(true);
      }
    }
  });

  it("recule quand le cadre se resserre", () => {
    const large = scanFitDistance(0.22, 0.42, 40, 2.4, TARGET);
    const étroit = scanFitDistance(0.22, 0.42, 40, 0.8, TARGET);
    expect(étroit).toBeGreaterThan(large);
  });
});

describe("buildWireframe", () => {
  it("trace 4 segments par surface + 4 par ouverture (paires xyz)", () => {
    const holeCount = SCAN_STRUCTURE.reduce((sum, r) => sum + (r.holes?.length ?? 0), 0);
    const expectedSegments = (SCAN_STRUCTURE.length + holeCount) * 4;
    expect(buildWireframe().length).toBe(expectedSegments * 6);
  });
});
