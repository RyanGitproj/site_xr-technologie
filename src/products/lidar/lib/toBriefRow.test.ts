import { describe, expect, it } from "vitest";
import { toBriefRow } from "./toBriefRow";
import type { Brief } from "./brief";

const brief: Brief = {
  famille: "technique",
  offre: "",
  typeSite: "batiment",
  localisation: "Antananarivo, Analakely",
  surface: "",
  objectif: "avant-travaux",
  livrables: ["nuage-de-points", "plans-2d"],
  logiciels: "",
  budget: "1-3m",
  periode: "avant fin septembre",
  precisions: "",
  nom: "Rasoa",
  entreprise: "",
  telephone: "+261340000000",
  email: "rasoa@example.com",
};

describe("toBriefRow (lidar)", () => {
  it("mappe le brief en snake_case, optionnels vides → null", () => {
    const row = toBriefRow(brief, null);
    expect(row.famille).toBe("technique");
    expect(row.offre).toBeNull();
    expect(row.type_site).toBe("batiment");
    expect(row.localisation).toBe("Antananarivo, Analakely");
    expect(row.surface_estimee).toBeNull();
    expect(row.livrables).toEqual(["nuage-de-points", "plans-2d"]);
    expect(row.logiciels).toBeNull();
    expect(row.budget).toBe("1-3m");
    expect(row.periode).toBe("avant fin septembre");
    expect(row.precisions).toBeNull();
    expect(row.entreprise).toBeNull();
  });

  it("porte la solution choisie telle quelle", () => {
    const row = toBriefRow({ ...brief, offre: "releve-technique-lidar" }, null);
    expect(row.offre).toBe("releve-technique-lidar");
  });

  it("sans attribution : is_organic true", () => {
    const row = toBriefRow(brief, null);
    expect(row.utm_source).toBeNull();
    expect(row.is_organic).toBe(true);
  });

  it("avec marqueur payant : is_organic false et optionnels remplis", () => {
    const row = toBriefRow(
      { ...brief, surface: "800 m²", entreprise: "Cabinet A", logiciels: "Revit" },
      { utm_source: "google", gclid: "xyz" },
    );
    expect(row.surface_estimee).toBe("800 m²");
    expect(row.entreprise).toBe("Cabinet A");
    expect(row.logiciels).toBe("Revit");
    expect(row.gclid).toBe("xyz");
    expect(row.is_organic).toBe(false);
  });
});
