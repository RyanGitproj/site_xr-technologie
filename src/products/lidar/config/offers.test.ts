import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  duplicatePackIds,
  groupsWithDecreasingPrices,
  groupsWithoutSingleFeatured,
  missingAccentTokens,
} from "@/components/offers/catalogAudit";
import {
  ALL_LIDAR_PACK_IDS,
  LIDAR_OFFERS,
  LIDAR_OFFER_IDS,
  lidarOfferPriceFrom,
} from "./offers";

/**
 * Invariants du catalogue LiDAR : les ids servent de valeurs Zod et de
 * colonnes DB. Contrairement à VR, les prix ne sont pas strictement
 * croissants (deux solutions techniques partagent le plancher de 1 500 000 Ar,
 * minimum de mission) et la vedette n'est pas contrainte au pack central.
 */
describe("catalogue des offres LiDAR", () => {
  it("expose les 2 familles, dans l'ordre des ids", () => {
    expect(LIDAR_OFFERS.map((offer) => offer.id)).toEqual([...LIDAR_OFFER_IDS]);
  });

  it("a des ids de solutions uniques globalement (valeurs Zod + colonne DB)", () => {
    expect(duplicatePackIds(LIDAR_OFFERS)).toEqual([]);
    expect(ALL_LIDAR_PACK_IDS).toHaveLength(LIDAR_OFFERS.length * 3);
  });

  it("ne fait jamais baisser le prix d'une solution à la suivante", () => {
    expect(groupsWithDecreasingPrices(LIDAR_OFFERS)).toEqual([]);
  });

  it("met en avant exactement une solution par famille", () => {
    expect(groupsWithoutSingleFeatured(LIDAR_OFFERS)).toEqual([]);
  });

  it("prend le plancher de la famille comme prix d'appel de la tuile", () => {
    for (const offer of LIDAR_OFFERS) {
      const cheapest = Math.min(...offer.packs.map((pack) => pack.price));
      expect(lidarOfferPriceFrom(offer)).toBe(cheapest);
    }
  });

  it("chiffre les fourchettes dans les features ou les options, jamais dans le prix", () => {
    // Le prix reste un plancher entier en ariary : toute unité (Ar/m²,
    // Ar/mois) et toute fourchette doivent vivre dans un libellé.
    for (const offer of LIDAR_OFFERS) {
      for (const pack of offer.packs) {
        expect(Number.isInteger(pack.price)).toBe(true);
        expect(pack.price).toBeGreaterThan(0);
      }
    }
    const technique = LIDAR_OFFERS.find((offer) => offer.id === "technique");
    const releve = technique?.packs.find((pack) => pack.id === "releve-technique-lidar");
    expect(releve?.features.some((feature) => feature.includes("Ar par m²"))).toBe(true);
    expect(releve?.options).toBeDefined();
  });

  it("chaque famille a son token couleur et sa map d'accent dans globals.css", () => {
    const globalsCss = readFileSync(
      join(__dirname, "..", "..", "..", "app", "globals.css"),
      "utf8",
    );
    expect(missingAccentTokens(globalsCss, LIDAR_OFFERS)).toEqual([]);
  });
});
