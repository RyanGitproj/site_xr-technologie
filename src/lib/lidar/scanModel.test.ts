import { describe, expect, it } from "vitest";
import {
  SCANNER_POSITION,
  SCAN_STRUCTURE,
  buildPointCloud,
  buildWireframe,
} from "./scanModel";

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
