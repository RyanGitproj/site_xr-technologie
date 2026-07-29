import { describe, expect, it } from "vitest";
import {
  PANO_RADIUS,
  cylinderDims,
  horizontalFov,
  hotspotPosition,
  pitchLimit,
  yawLimit,
} from "./panoMath";

const DEG = Math.PI / 180;

describe("cylinderDims", () => {
  it("centre l'arc face caméra (-Z) et préserve le ratio de l'image", () => {
    const { height, thetaStart, thetaLength } = cylinderDims(160, 960 / 1920);
    expect(thetaLength).toBeCloseTo(160 * DEG, 10);
    expect(thetaStart).toBeCloseTo(Math.PI - (160 * DEG) / 2, 10);
    /* H = R·θ·ratio : zéro étirement vertical. */
    expect(height).toBeCloseTo(PANO_RADIUS * 160 * DEG * 0.5, 10);
  });
});

describe("limites de regard", () => {
  it("yawLimit ≈ ±39° pour arc 160°, fov 52, 16/9", () => {
    expect(yawLimit(160, 52, 16 / 9) / DEG).toBeCloseTo(39.05, 0);
  });

  it("pitchLimit ≈ ±9° pour la hauteur anti-distorsion 2:1", () => {
    const { height } = cylinderDims(160, 0.5);
    expect(pitchLimit(height, PANO_RADIUS, 52) / DEG).toBeCloseTo(8.94, 0);
  });

  it("jamais négatives quand le champ dépasse la surface", () => {
    expect(yawLimit(60, 52, 21 / 9)).toBe(0);
    expect(pitchLimit(1, PANO_RADIUS, 52)).toBe(0);
  });

  it("horizontalFov croît avec l'aspect", () => {
    expect(horizontalFov(52, 16 / 9)).toBeGreaterThan(horizontalFov(52, 1));
  });
});

describe("hotspotPosition (cylindre)", () => {
  it("u=0.5, v=0.5 : face caméra, à hauteur d'yeux", () => {
    const [x, y, z] = hotspotPosition(0.5, 0.5, "cylinder", 160, 0.5);
    expect(x).toBeCloseTo(0, 10);
    expect(y).toBeCloseTo(0, 10);
    expect(z).toBeLessThan(0);
  });

  it("u=1 est à droite du spectateur, v=0 en haut", () => {
    const [x] = hotspotPosition(1, 0.5, "cylinder", 160, 0.5);
    expect(x).toBeGreaterThan(0);
    const [, y] = hotspotPosition(0.5, 0, "cylinder", 160, 0.5);
    expect(y).toBeGreaterThan(0);
  });
});

describe("hotspotPosition (sphère)", () => {
  it("u=0.5, v=0.5 : face caméra ; v=0 au zénith", () => {
    const [x, y, z] = hotspotPosition(0.5, 0.5, "sphere", 160, 0.5);
    expect(x).toBeCloseTo(0, 10);
    expect(y).toBeCloseTo(0, 10);
    expect(z).toBeLessThan(0);
    const [, top] = hotspotPosition(0.5, 0, "sphere", 160, 0.5);
    expect(top).toBeCloseTo(PANO_RADIUS - 0.05, 10);
  });
});
