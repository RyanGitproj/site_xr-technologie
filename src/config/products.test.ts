import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LIVE_PRODUCTS, PRODUCTS } from "./products";

/** :root de globals.css est le thème du pôle par défaut (voir globals.css). */
const DEFAULT_THEME_ID = "vr";

describe("catalogue des pôles", () => {
  it("ids et routes uniques", () => {
    const ids = PRODUCTS.map((product) => product.id);
    const routes = PRODUCTS.map((product) => product.route);
    expect(new Set(ids).size).toBe(PRODUCTS.length);
    expect(new Set(routes).size).toBe(PRODUCTS.length);
  });

  it("libellés courts distincts (navbar mobile)", () => {
    const shortNames = PRODUCTS.map((product) => product.shortName);
    expect(new Set(shortNames).size).toBe(PRODUCTS.length);
    expect(shortNames.every((label) => label.length <= 6)).toBe(true);
  });

  it("LIVE_PRODUCTS ne contient que les pôles en ligne", () => {
    expect(LIVE_PRODUCTS.every((product) => product.status === "live")).toBe(true);
    expect(LIVE_PRODUCTS.length).toBeGreaterThan(0);
  });

  it("chaque pôle non-défaut a son bloc [data-theme] complet dans globals.css", () => {
    const globalsCss = readFileSync(join(__dirname, "..", "app", "globals.css"), "utf8");
    for (const product of PRODUCTS) {
      if (product.id === DEFAULT_THEME_ID) continue;
      const block = new RegExp(`\\[data-theme="${product.id}"\\]\\s*\\{([^}]+)\\}`).exec(
        globalsCss,
      );
      expect(block, `bloc [data-theme="${product.id}"] manquant`).not.toBeNull();
      // Set minimal pour que le socle (verre, glows, comète) suive le pôle.
      for (const token of [
        "--color-bg-deep:",
        "--color-ink:",
        "--color-accent:",
        "--glass-stroke:",
        "--edge-lit:",
        "--glow-soft:",
        "--color-fx-1:",
      ]) {
        expect(block![1], `${token} manquant dans [data-theme="${product.id}"]`).toContain(token);
      }
    }
  });

  it("chaque pôle a sa couleur d'identité et sa map data-pole-accent dans globals.css", () => {
    const globalsCss = readFileSync(join(__dirname, "..", "app", "globals.css"), "utf8");
    for (const product of PRODUCTS) {
      expect(globalsCss).toContain(`--color-pole-${product.id}:`);
      expect(globalsCss).toContain(`[data-pole-accent="${product.id}"]`);
    }
  });

  it("la barre de défilement du document suit le thème de chaque page", () => {
    const globalsCss = readFileSync(join(__dirname, "..", "app", "globals.css"), "utf8");
    const themeIds = [...PRODUCTS.map((product) => product.id), "site"];
    // Le couple pouce/piste de chaque thème vit au niveau du document…
    for (const themeId of themeIds) {
      expect(globalsCss, `--palette-${themeId}-bg-deep manquant`).toContain(
        `--palette-${themeId}-bg-deep:`,
      );
      expect(globalsCss, `--palette-${themeId}-accent-deep manquant`).toContain(
        `--palette-${themeId}-accent-deep:`,
      );
    }
    // …et chaque thème NON défaut le sélectionne sur <html> (les wrappers
    // [data-theme] ne peuvent pas colorer le chrome du navigateur).
    for (const themeId of themeIds.filter((id) => id !== DEFAULT_THEME_ID)) {
      expect(globalsCss, `règle html:has([data-page-theme="${themeId}"]) manquante`).toContain(
        `html:has([data-page-theme="${themeId}"])`,
      );
    }
  });

  it("le thème socle « site » (accueil) existe dans globals.css", () => {
    const globalsCss = readFileSync(join(__dirname, "..", "app", "globals.css"), "utf8");
    const block = /\[data-theme="site"\]\s*\{([^}]+)\}/.exec(globalsCss);
    expect(block).not.toBeNull();
    expect(block![1]).toContain("--color-accent:");
    expect(block![1]).toContain("--fx-aurora-1:");
  });
});
