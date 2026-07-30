import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  groupsWithDecreasingPrices,
  groupsWithoutSingleFeatured,
  missingAccentTokens,
} from "@/components/offers/catalogAudit";
import { TYPE_LIEU_VALUES } from "@/products/xr360/lib/brief";
import {
  XR360_BASE_PACKS,
  XR360_OFFERS,
  XR360_OFFER_IDS,
  XR360_PACK_IDS,
} from "./offers";

/**
 * Invariants du catalogue XR 360 : 8 cibles qui vendent les 3 MÊMES offres.
 * L'unicité globale des ids de packs ne s'applique donc pas (les 3 ids se
 * répètent par construction) ; l'invariant inverse la remplace : chaque
 * tuile doit présenter exactement les offres de base, aux mêmes prix et aux
 * mêmes contenus, seule la recommandation (featured) variant par cible.
 */
describe("catalogue des offres XR 360", () => {
  it("expose les 8 cibles, dans l'ordre des ids", () => {
    expect(XR360_OFFERS.map((offer) => offer.id)).toEqual([...XR360_OFFER_IDS]);
  });

  it("aligne les cibles sur les valeurs type_lieu du brief (colonne DB)", () => {
    for (const id of XR360_OFFER_IDS) {
      expect(TYPE_LIEU_VALUES).toContain(id);
    }
  });

  it("vend les 3 mêmes offres sur chaque tuile (ids, prix, features)", () => {
    for (const offer of XR360_OFFERS) {
      expect(offer.packs.map((pack) => pack.id)).toEqual([...XR360_PACK_IDS]);
      offer.packs.forEach((pack, index) => {
        const base = XR360_BASE_PACKS[index];
        expect(pack.name).toBe(base.name);
        expect(pack.price).toBe(base.price);
        expect(pack.features).toEqual(base.features);
        expect(pack.visual).toEqual(base.visual);
      });
    }
  });

  it("a 3 offres de base à prix strictement croissants", () => {
    expect(groupsWithDecreasingPrices(XR360_OFFERS)).toEqual([]);
    const [essentiel, visitePro, premium] = XR360_BASE_PACKS;
    expect(essentiel.price).toBeLessThan(visitePro.price);
    expect(visitePro.price).toBeLessThan(premium.price);
  });

  it("recommande exactement une offre par cible, badgée", () => {
    expect(groupsWithoutSingleFeatured(XR360_OFFERS)).toEqual([]);
    for (const offer of XR360_OFFERS) {
      const featured = offer.packs.find((pack) => pack.featured === true);
      expect(featured?.badge).toBeDefined();
    }
  });

  it("les offres de base ne portent ni vedette ni badge (posés par cible)", () => {
    for (const base of XR360_BASE_PACKS) {
      expect(base.featured).toBeUndefined();
      expect(base.badge).toBeUndefined();
    }
  });

  it("chaque cible a son token couleur et sa map d'accent dans globals.css", () => {
    const globalsCss = readFileSync(
      join(__dirname, "..", "..", "..", "app", "globals.css"),
      "utf8",
    );
    expect(missingAccentTokens(globalsCss, XR360_OFFERS)).toEqual([]);
  });
});
