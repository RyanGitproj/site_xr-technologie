import { describe, expect, it } from "vitest";
import { activeNavId } from "./activeNavId";

describe("activeNavId", () => {
  it("l'accueil ne s'active que sur le match exact de /", () => {
    expect(activeNavId("/")).toBe("home");
    expect(activeNavId("/confidentialite")).toBeNull();
  });

  it("chaque route de pôle active son entrée, sous-routes comprises", () => {
    expect(activeNavId("/vr")).toBe("vr");
    expect(activeNavId("/vr/merci")).toBe("vr");
    expect(activeNavId("/360")).toBe("xr360");
    expect(activeNavId("/lidar")).toBe("lidar");
  });

  it("un préfixe partiel n'active pas un pôle", () => {
    expect(activeNavId("/vrai-sujet")).toBeNull();
    expect(activeNavId("/inconnu")).toBeNull();
  });
});
