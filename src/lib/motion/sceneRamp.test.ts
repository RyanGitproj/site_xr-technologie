import { describe, expect, it } from "vitest";
import { clamp01, ramp } from "./sceneRamp";

describe("clamp01", () => {
  it("borne à [0, 1]", () => {
    expect(clamp01(-0.5)).toBe(0);
    expect(clamp01(1.5)).toBe(1);
    expect(clamp01(0.25)).toBe(0.25);
  });
});

describe("ramp", () => {
  it("vaut a avant la fenêtre et b après", () => {
    expect(ramp(0, 0.2, 0.6, -2.8, 3.7)).toBe(-2.8);
    expect(ramp(1, 0.2, 0.6, -2.8, 3.7)).toBe(3.7);
  });

  it("passe par le milieu exact à mi-fenêtre (symétrie du smoothstep)", () => {
    expect(ramp(0.4, 0.2, 0.6, 0, 10)).toBeCloseTo(5, 10);
  });

  it("est monotone croissante sur la fenêtre quand b > a", () => {
    let prev = ramp(0.2, 0.2, 0.6, 0, 1);
    for (let p = 0.21; p <= 0.6; p += 0.01) {
      const v = ramp(p, 0.2, 0.6, 0, 1);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });

  it("lisse les extrémités : pente quasi nulle aux bords de fenêtre", () => {
    const eps = 0.001;
    const startSlope = ramp(0.2 + eps, 0.2, 0.6, 0, 1) - ramp(0.2, 0.2, 0.6, 0, 1);
    const midSlope = ramp(0.4 + eps, 0.2, 0.6, 0, 1) - ramp(0.4, 0.2, 0.6, 0, 1);
    expect(startSlope).toBeLessThan(midSlope);
  });

  it("interpole aussi en décroissant (b < a)", () => {
    expect(ramp(0.5, 0, 1, 15, 10.5)).toBeCloseTo(12.75, 10);
  });
});
