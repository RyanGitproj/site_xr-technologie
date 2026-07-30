import { describe, expect, it } from "vitest";
import { briefSchema, type Brief } from "./brief";

const VALID_BRIEF: Brief = {
  typeLieu: "hotel-hebergement",
  offre: "",
  objectif: "attirer-reservations",
  supports: ["site-internet"],
  budget: "1-2m",
  periode: "avant la haute saison",
  message: "",
  nom: "Rakoto Bema",
  telephone: "+261331122233",
  email: "bema@exemple.mg",
};

describe("briefSchema (xr360) : validité de l'offre", () => {
  it("accepte une offre vide (« je ne sais pas encore »)", () => {
    expect(briefSchema.safeParse(VALID_BRIEF).success).toBe(true);
  });

  it("accepte chaque offre du catalogue, quel que soit le lieu", () => {
    for (const offre of ["essentiel", "visite-pro", "immersion-premium"]) {
      expect(briefSchema.safeParse({ ...VALID_BRIEF, offre }).success).toBe(true);
      expect(
        briefSchema.safeParse({ ...VALID_BRIEF, typeLieu: "autre", offre }).success,
      ).toBe(true);
    }
  });

  it("rejette une offre inconnue", () => {
    const result = briefSchema.safeParse({ ...VALID_BRIEF, offre: "offre-fantome" });
    expect(result.success).toBe(false);
  });

  it("accepte la nouvelle cible « site-touristique »", () => {
    expect(
      briefSchema.safeParse({ ...VALID_BRIEF, typeLieu: "site-touristique" }).success,
    ).toBe(true);
  });

  it("exige budget et période", () => {
    expect(briefSchema.safeParse({ ...VALID_BRIEF, periode: "" }).success).toBe(false);
    expect(briefSchema.safeParse({ ...VALID_BRIEF, budget: "hors-liste" }).success).toBe(false);
  });
});
