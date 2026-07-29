import { describe, expect, it } from "vitest";
import { VIDEO_VISIBLE_RATIO, isVideoVisibleEnough } from "./videoVisibility";

describe("isVideoVisibleEnough", () => {
  const viewport = 800;

  it("joue quand la moitié de la vidéo est à l'écran", () => {
    expect(
      isVideoVisibleEnough({ intersectionHeight: 200, elementHeight: 400, rootHeight: viewport }),
    ).toBe(true);
  });

  it("coupe dès que la vidéo passe sous le seuil (l'utilisateur a scrollé)", () => {
    expect(
      isVideoVisibleEnough({ intersectionHeight: 150, elementHeight: 400, rootHeight: viewport }),
    ).toBe(false);
    expect(
      isVideoVisibleEnough({ intersectionHeight: 0, elementHeight: 400, rootHeight: viewport }),
    ).toBe(false);
  });

  /** Le piège : une vidéo plus HAUTE que le viewport ne peut jamais atteindre
      50 % de sa propre hauteur, elle ne jouerait donc jamais. */
  it("reste jouable quand la vidéo dépasse le viewport", () => {
    expect(
      isVideoVisibleEnough({ intersectionHeight: 600, elementHeight: 1600, rootHeight: viewport }),
    ).toBe(true);
    expect(
      isVideoVisibleEnough({ intersectionHeight: 300, elementHeight: 1600, rootHeight: viewport }),
    ).toBe(false);
  });

  it("tombe sur la hauteur de l'élément sans rootBounds", () => {
    expect(
      isVideoVisibleEnough({ intersectionHeight: 300, elementHeight: 400, rootHeight: null }),
    ).toBe(true);
  });

  it("ne joue pas sur un élément de hauteur nulle (non monté)", () => {
    expect(
      isVideoVisibleEnough({ intersectionHeight: 0, elementHeight: 0, rootHeight: viewport }),
    ).toBe(false);
  });

  it("seuil par défaut à la moitié", () => {
    expect(VIDEO_VISIBLE_RATIO).toBe(0.5);
  });
});
