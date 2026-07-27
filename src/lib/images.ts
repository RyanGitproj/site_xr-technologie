/**
 * Types partagés des manifestes de visuels (chaque pôle a le sien dans
 * products/<pôle>/config/images.ts).
 */

export type ImageSlot = {
  src: string;
  alt: string;
  /** Dimensions intrinsèques, qui réservent le ratio (zéro CLS). */
  width: number;
  height: number;
};

export type VideoSlot = {
  webm: string;
  mp4: string;
  /** Frame de démarrage : ratio réservé (zéro CLS) + fallback reduced-motion. */
  poster: ImageSlot;
};
