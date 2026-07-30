import { describe, expect, it } from "vitest";
import { toBriefRow } from "./toBriefRow";
import type { Brief } from "./brief";

const brief: Brief = {
  typeLieu: "hotel-hebergement",
  offre: "",
  objectif: "attirer-reservations",
  supports: ["site-internet", "casque-vr"],
  budget: "1-2m",
  periode: "avant la haute saison",
  message: "",
  nom: "Rakoto",
  telephone: "+261340000000",
  email: "rakoto@example.com",
};

describe("toBriefRow", () => {
  it("mappe le brief en snake_case, optionnels vides → null", () => {
    const row = toBriefRow(brief, null);
    expect(row.type_lieu).toBe("hotel-hebergement");
    expect(row.offre).toBeNull();
    expect(row.objectif).toBe("attirer-reservations");
    expect(row.supports).toEqual(["site-internet", "casque-vr"]);
    expect(row.budget).toBe("1-2m");
    expect(row.periode).toBe("avant la haute saison");
    expect(row.message).toBeNull();
    expect(row.nom).toBe("Rakoto");
  });

  it("porte l'offre choisie telle quelle", () => {
    const row = toBriefRow({ ...brief, offre: "visite-pro" }, null);
    expect(row.offre).toBe("visite-pro");
  });

  it("sans attribution : colonnes null et is_organic true", () => {
    const row = toBriefRow(brief, null);
    expect(row.utm_source).toBeNull();
    expect(row.referrer).toBeNull();
    expect(row.is_organic).toBe(true);
  });

  it("avec marqueur payant : is_organic false et colonnes remplies", () => {
    const row = toBriefRow(
      { ...brief, message: "Villa avec piscine" },
      { utm_source: "facebook", utm_medium: "paid", fbclid: "abc123" },
    );
    expect(row.message).toBe("Villa avec piscine");
    expect(row.utm_source).toBe("facebook");
    expect(row.fbclid).toBe("abc123");
    expect(row.is_organic).toBe(false);
  });
});
