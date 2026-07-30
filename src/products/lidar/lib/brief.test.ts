import { describe, expect, it } from "vitest";
import { briefSchema, type Brief } from "./brief";

const VALID_BRIEF: Brief = {
  famille: "technique",
  offre: "",
  typeSite: "batiment",
  localisation: "Antananarivo, Analakely",
  surface: "",
  objectif: "avant-travaux",
  livrables: ["nuage-de-points"],
  logiciels: "",
  budget: "1-3m",
  periode: "avant fin septembre",
  precisions: "",
  nom: "Rasoa Mia",
  entreprise: "",
  telephone: "+261331122233",
  email: "mia@exemple.mg",
};

describe("briefSchema (lidar) : cohérence famille/solution", () => {
  it("accepte une solution vide (« je ne sais pas encore »)", () => {
    expect(briefSchema.safeParse(VALID_BRIEF).success).toBe(true);
  });

  it("accepte une solution appartenant à la famille choisie", () => {
    const result = briefSchema.safeParse({ ...VALID_BRIEF, offre: "releve-technique-lidar" });
    expect(result.success).toBe(true);
  });

  it("rejette une solution de l'autre famille", () => {
    const result = briefSchema.safeParse({ ...VALID_BRIEF, offre: "business-immersive" });
    expect(result.success).toBe(false);
  });

  it("rejette une solution inconnue", () => {
    const result = briefSchema.safeParse({ ...VALID_BRIEF, offre: "solution-fantome" });
    expect(result.success).toBe(false);
  });

  it("exige budget et période", () => {
    expect(briefSchema.safeParse({ ...VALID_BRIEF, periode: "" }).success).toBe(false);
    expect(briefSchema.safeParse({ ...VALID_BRIEF, budget: "hors-liste" }).success).toBe(false);
  });
});
