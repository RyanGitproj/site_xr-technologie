/**
 * État d'interaction de la fenêtre panoramique, partagé par référence entre
 * le wrapper DOM (qui écrit les gestes) et la scène R3F (qui les consomme
 * dans useFrame). Aucun état React : zéro re-render pendant le drag.
 */
export type PanoMotor = {
  /** Deltas pointeur (px) accumulés depuis la dernière frame. */
  pendingDx: number;
  pendingDy: number;
  /** Vitesse horizontale (px/s) au relâcher : consommée une fois (inertie). */
  releaseVx: number;
  dragging: boolean;
  /** Horodatage du dernier geste (performance.now) : pilote l'auto-pan. */
  lastInputAt: number;
};

export function createPanoMotor(): PanoMotor {
  return {
    pendingDx: 0,
    pendingDy: 0,
    releaseVx: 0,
    dragging: false,
    lastInputAt: 0,
  };
}
