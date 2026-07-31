import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/config/products";
import { POLE_SCENES, shouldPreloadScenes } from "./scenePreload";

/** Wrappers qui montent une scène 3D via `dynamic(() => import(...))`. */
const SCENE_WRAPPERS = [
  "HeadsetSceneLazy.tsx",
  "LidarScanSceneLazy.tsx",
  "Pano360Window.tsx",
  "PoleObjectLazy.tsx",
];

const DYNAMIC_IMPORT = /dynamic\(\s*\(\)\s*=>\s*import\("([^"]+)"\)/g;

describe("préchargement des scènes 3D", () => {
  it("chaque chunk lazy d'une scène a son entrée de préchargement", () => {
    const registry = readFileSync(join(__dirname, "ScenePreloader.tsx"), "utf8");
    for (const wrapper of SCENE_WRAPPERS) {
      const source = readFileSync(join(__dirname, wrapper), "utf8");
      const specifiers = [...source.matchAll(DYNAMIC_IMPORT)].map(([, specifier]) => specifier);
      expect(specifiers.length, `${wrapper} : aucun dynamic(() => import()) trouvé`).toBeGreaterThan(0);
      for (const specifier of specifiers) {
        // Même specifier des deux côtés : sinon le bundler crée deux chunks et
        // le préchargement ne sert plus à rien.
        expect(registry, `${specifier} (${wrapper}) absent de SCENE_CHUNKS`).toContain(
          `import("${specifier}")`,
        );
      }
    }
  });

  it("l'accueil précharge l'objet de chaque pôle, dans l'ordre des bandes", () => {
    expect(POLE_SCENES).toEqual(PRODUCTS.map((product) => `pole-${product.id}`));
  });

  it("s'abstient sur lien lent ou économie de données, précharge sans info", () => {
    expect(shouldPreloadScenes(undefined, true)).toBe(true);
    expect(shouldPreloadScenes({ effectiveType: "4g" }, true)).toBe(true);
    expect(shouldPreloadScenes({ effectiveType: "3g" }, true)).toBe(true);
    expect(shouldPreloadScenes({ effectiveType: "4g", saveData: true }, true)).toBe(false);
    expect(shouldPreloadScenes({ effectiveType: "2g" }, true)).toBe(false);
    expect(shouldPreloadScenes({ effectiveType: "slow-2g" }, true)).toBe(false);
  });

  it("s'abstient toujours sur tactile, quel que soit le réseau", () => {
    expect(shouldPreloadScenes(undefined, false)).toBe(false);
    expect(shouldPreloadScenes({ effectiveType: "4g" }, false)).toBe(false);
  });
});
