import { describe, expect, it } from "vitest";
import {
  railNearestPage,
  railPageOffsets,
  railPerView,
  railSlideState,
} from "./deckRailMath";

/* Rail type des tests : 3 cartes de 300 px, gouttière 20 px, fenêtre 640 px
   (2 cartes pleines + une amorce). Offsets = 0, 320, 640. */
const WIDTH = 300;
const OFFSETS = [0, 320, 640] as const;
const VIEW = 640;

describe("railSlideState", () => {
  it("donne une profondeur pleine et aucun côté à une carte entièrement visible", () => {
    expect(railSlideState(OFFSETS[0], WIDTH, 0, VIEW)).toEqual({ depth: 1, side: 0 });
    expect(railSlideState(OFFSETS[1], WIDTH, 0, VIEW)).toEqual({ depth: 1, side: 0 });
  });

  it("donne une profondeur nulle à une carte hors champ", () => {
    expect(railSlideState(2000, WIDTH, 0, VIEW).depth).toBe(0);
    expect(railSlideState(-2000, WIDTH, 0, VIEW).depth).toBe(0);
  });

  it("mesure l'amorce de la carte qui déborde à droite", () => {
    /* La 3e carte commence à 640, la fenêtre s'arrête à 640 : rien de visible. */
    expect(railSlideState(OFFSETS[2], WIDTH, 0, VIEW)).toEqual({ depth: 0, side: 1 });
    /* Après 160 px de scroll, 160 px de ses 300 px sont visibles. */
    const state = railSlideState(OFFSETS[2], WIDTH, 160, VIEW);
    expect(state.depth).toBeCloseTo(160 / 300, 10);
    expect(state.side).toBe(1);
  });

  it("mesure la carte tronquée à gauche et lui donne le côté opposé", () => {
    const state = railSlideState(OFFSETS[0], WIDTH, 160, VIEW);
    expect(state.depth).toBeCloseTo(140 / 300, 10);
    expect(state.side).toBe(-1);
  });

  it("retient le plus grand débordement pour une carte plus large que la fenêtre", () => {
    expect(railSlideState(0, 900, 100, 400).side).toBe(1);
    expect(railSlideState(0, 900, 450, 400).side).toBe(-1);
  });

  it("tolère un demi-pixel de débordement sans déclencher l'effet de pile", () => {
    /* scrollLeft fractionnaire : Chrome en produit après un défilement lissé.
       Sans tolérance, la carte active se mettrait à pivoter au repos. */
    expect(railSlideState(0, WIDTH, 0.3, VIEW).side).toBe(0);
  });

  it("reste neutre sur une carte de largeur nulle (mesure avant layout)", () => {
    expect(railSlideState(0, 0, 0, VIEW)).toEqual({ depth: 1, side: 0 });
  });
});

describe("railPerView", () => {
  it("déduit le nombre de cartes pleines de la géométrie réelle", () => {
    expect(railPerView(640, 300, 20)).toBe(2);
    expect(railPerView(980, 313.33, 20)).toBe(3);
    expect(railPerView(390, 330, 16)).toBe(1);
  });

  it("ne descend jamais sous une carte par vue", () => {
    expect(railPerView(120, 330, 16)).toBe(1);
    expect(railPerView(640, 0, 20)).toBe(1);
  });
});

describe("railPageOffsets", () => {
  it("découpe les cartes en pages de perView", () => {
    const offsets = [0, 320, 640, 960, 1280, 1600, 1920, 2240];
    expect(railPageOffsets(offsets, 3, 9999)).toEqual([0, 960, 1920]);
  });

  it("borne la dernière page à maxScroll (sinon le bout du rail est inatteignable)", () => {
    const offsets = [0, 320, 640, 960];
    /* 4 cartes, 2 par vue → pages à 0 et 640, mais le rail ne peut défiler
       que de 300 px : la 2e page doit viser 300, pas 640. */
    expect(railPageOffsets(offsets, 2, 300)).toEqual([0, 300]);
  });

  it("rend une page unique quand tout tient dans la vue", () => {
    expect(railPageOffsets([0, 320, 640], 3, 0)).toEqual([0]);
    expect(railPageOffsets([], 3, 0)).toEqual([0]);
  });
});

describe("railNearestPage", () => {
  it("retient la page dont l'offset est le plus proche", () => {
    const pages = [0, 640, 1280];
    expect(railNearestPage(pages, 0)).toBe(0);
    expect(railNearestPage(pages, 300)).toBe(0);
    expect(railNearestPage(pages, 340)).toBe(1);
    expect(railNearestPage(pages, 1400)).toBe(2);
  });

  it("garde la première page en cas d'égalité stricte", () => {
    expect(railNearestPage([0, 640], 320)).toBe(0);
  });
});
