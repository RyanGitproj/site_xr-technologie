import { useSyncExternalStore } from "react";

/** Capacité WebGL, invariante et détectée une fois (hydration-safe via
 * useSyncExternalStore : true côté serveur, valeur réelle au client).
 * Mêmes exigences que les Canvas des scènes : un contexte GPU matériel non
 * dégradé ; si seul le rendu logiciel (SwiftShader) est dispo, les scènes
 * préfèrent leur repli 2D. Extrait de HeadsetSceneLazy, partagé par tous les
 * wrappers lazy de scènes. */
let cachedWebGL: boolean | null = null;

function webglSnapshot(): boolean {
  if (cachedWebGL === null) {
    try {
      const attrs = { failIfMajorPerformanceCaveat: true, powerPreference: "high-performance" as const };
      const canvas = document.createElement("canvas");
      cachedWebGL = Boolean(
        window.WebGLRenderingContext &&
          (canvas.getContext("webgl2", attrs) || canvas.getContext("webgl", attrs)),
      );
    } catch {
      cachedWebGL = false;
    }
  }
  return cachedWebGL;
}

const subscribeNever = () => () => {};

export function useWebGLSupport(): boolean {
  return useSyncExternalStore(subscribeNever, webglSnapshot, () => true);
}
