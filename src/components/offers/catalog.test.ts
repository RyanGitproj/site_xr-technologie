import { describe, expect, it } from "vitest";
import { Building2 } from "lucide-react";
import {
  allPackIds,
  findPack,
  getGroup,
  groupLabels,
  groupPriceFrom,
  packBelongsToGroup,
  selectorColumns,
} from "./catalog";
import {
  duplicatePackIds,
  groupsWithDecreasingPrices,
  groupsWithoutSingleFeatured,
  missingAccentTokens,
} from "./catalogAudit";
import type { OfferGroup, OfferPack } from "./types";

function pack(id: string, price: number, featured = false): OfferPack {
  return { id, name: id, tagline: "", price, features: [], featured: featured || undefined };
}

function group(id: string, prices: [number, number, number], featuredIndex = 1): OfferGroup {
  return {
    id,
    name: `Groupe ${id}`,
    shortName: id,
    icon: Building2,
    tagline: "",
    packs: [
      pack(`${id}-a`, prices[0], featuredIndex === 0),
      pack(`${id}-b`, prices[1], featuredIndex === 1),
      pack(`${id}-c`, prices[2], featuredIndex === 2),
    ],
  };
}

const GROUPS = [group("alpha", [100, 200, 300]), group("beta", [150, 150, 400])];

describe("helpers de catalogue", () => {
  it("retrouve un groupe par son id", () => {
    expect(getGroup(GROUPS, "beta").name).toBe("Groupe beta");
  });

  it("échoue bruyamment sur un id inconnu plutôt que de rendre undefined", () => {
    expect(() => getGroup(GROUPS, "gamma")).toThrow(/gamma/);
  });

  it("prend le pack le moins cher comme prix d'appel", () => {
    expect(groupPriceFrom(GROUPS[0])).toBe(100);
    expect(groupPriceFrom(GROUPS[1])).toBe(150);
  });

  it("aplatit les ids de packs dans l'ordre du catalogue", () => {
    expect(allPackIds(GROUPS)).toEqual([
      "alpha-a",
      "alpha-b",
      "alpha-c",
      "beta-a",
      "beta-b",
      "beta-c",
    ]);
  });

  it("dérive les libellés du formulaire depuis les noms complets", () => {
    expect(groupLabels(GROUPS)).toEqual({ alpha: "Groupe alpha", beta: "Groupe beta" });
  });

  it("ne reconnaît un pack que dans son propre groupe", () => {
    expect(findPack(GROUPS, "alpha", "alpha-b")?.price).toBe(200);
    expect(packBelongsToGroup(GROUPS, "alpha", "alpha-b")).toBe(true);
    expect(packBelongsToGroup(GROUPS, "alpha", "beta-b")).toBe(false);
  });

  it("choisit un nombre de colonnes qui remplit des rangées pleines", () => {
    expect(selectorColumns(2)).toBe(2);
    expect(selectorColumns(3)).toBe(3);
    expect(selectorColumns(8)).toBe(4);
    expect(selectorColumns(10)).toBe(5);
    // Aucun diviseur parmi 5/4/3 : on retombe sur 4, une rangée reste courte.
    expect(selectorColumns(7)).toBe(4);
  });
});

describe("audits de catalogue", () => {
  it("ne signale rien sur un catalogue sain", () => {
    expect(duplicatePackIds(GROUPS)).toEqual([]);
    expect(groupsWithoutSingleFeatured(GROUPS)).toEqual([]);
    expect(groupsWithDecreasingPrices(GROUPS)).toEqual([]);
  });

  it("nomme les ids de packs partagés par deux groupes", () => {
    const clash = [GROUPS[0], { ...GROUPS[1], packs: GROUPS[0].packs }];
    expect(duplicatePackIds(clash)).toEqual(["alpha-a", "alpha-b", "alpha-c"]);
  });

  it("nomme les groupes sans pack vedette unique", () => {
    const noFeatured: OfferGroup = {
      ...GROUPS[0],
      packs: [pack("x", 1), pack("y", 2), pack("z", 3)],
    };
    const twoFeatured: OfferGroup = {
      ...GROUPS[1],
      packs: [pack("p", 1, true), pack("q", 2, true), pack("r", 3)],
    };
    expect(groupsWithoutSingleFeatured([noFeatured, twoFeatured])).toEqual(["alpha", "beta"]);
  });

  it("tolère deux prix égaux mais refuse une baisse", () => {
    expect(groupsWithDecreasingPrices([group("egaux", [150, 150, 400])])).toEqual([]);
    expect(groupsWithDecreasingPrices([group("baisse", [300, 200, 400])])).toEqual(["baisse"]);
  });

  it("exige token ET mappeur pour chaque id d'accent", () => {
    const complete = `--color-offer-alpha: #fff; [data-offer-accent="alpha"] { --offer-accent: red; }
      --color-offer-beta: #000; [data-offer-accent="beta"] { --offer-accent: blue; }`;
    expect(missingAccentTokens(complete, GROUPS)).toEqual([]);
    // Token présent mais mappeur absent : l'accent ne descendrait jamais.
    expect(missingAccentTokens("--color-offer-alpha: #fff; --color-offer-beta: #000;", GROUPS)).toEqual([
      "alpha",
      "beta",
    ]);
  });
});
