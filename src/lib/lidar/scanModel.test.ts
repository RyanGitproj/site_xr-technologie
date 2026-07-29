import { describe, expect, it } from "vitest";
import {
  SCANNER_POSITION,
  SCAN_REFERENCE_ASPECT,
  SCAN_STRUCTURE,
  buildPointCloud,
  buildWireframe,
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

describe("buildWireframe", () => {
  it("trace 4 segments par surface + 4 par ouverture (paires xyz)", () => {
    const holeCount = SCAN_STRUCTURE.reduce((sum, r) => sum + (r.holes?.length ?? 0), 0);
    const expectedSegments = (SCAN_STRUCTURE.length + holeCount) * 4;
    expect(buildWireframe().length).toBe(expectedSegments * 6);
  });
});
