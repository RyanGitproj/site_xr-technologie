import { PRODUCTS, type ProductId } from "@/config/products";

/**
 * Politique de préchargement des scènes 3D : QUI est concerné, QUAND on y va.
 * Le registre des chunks vit dans `ScenePreloader.tsx` (les `import()` de
 * three.js n'ont rien à faire dans un module que les Server Components
 * importent) ; ce fichier-ci reste sans dépendance lourde.
 *
 * Le MONTAGE, lui, ne change pas : il reste gouverné par `useSceneGate`
 * (près du viewport, frameloop coupé hors écran). Ce qu'on avance, c'est
 * l'arrivée du code, pour que la scène s'affiche à l'ouverture de la porte au
 * lieu de laisser le repli 2D à l'écran le temps de télécharger three.js (et
 * le GLB du casque, dont le `useGLTF.preload` part avec son chunk).
 */

export type SceneChunkId = `pole-${ProductId}` | "vr-headset" | "lidar-scan" | "pano-360";

/** Les objets de pôle de l'accueil, dans l'ordre des bandes. */
export const POLE_SCENES: readonly SceneChunkId[] = PRODUCTS.map(
  (product): SceneChunkId => `pole-${product.id}`,
);

/** Network Information API : absente de Safari et Firefox. */
export type NetworkHint = { saveData?: boolean; effectiveType?: string };

const SLOW_NETWORKS: readonly string[] = ["slow-2g", "2g"];

/**
 * Précharger coûte plusieurs centaines de ko (three.js + GLB) : on s'en
 * abstient sur tactile (mesure Lighthouse mobile du 31/07 : ~1,4 Mo tirés
 * pour des scènes que le lecteur n'atteint pas forcément, TBT et LCP
 * plombés ; le repli 2D couvre l'approche, la porte `useSceneGate` charge
 * la scène près du viewport), quand l'utilisateur a demandé l'économie de
 * données ou quand le lien est trop lent pour l'absorber sans gêner le
 * reste de la page. Pas d'info réseau = on précharge : l'absence d'API
 * n'est pas un signal de lenteur.
 */
export function shouldPreloadScenes(hint: NetworkHint | undefined, finePointer: boolean): boolean {
  if (!finePointer) return false;
  if (hint === undefined) return true;
  if (hint.saveData === true) return false;
  return !SLOW_NETWORKS.includes(hint.effectiveType ?? "");
}

export function readNetworkHint(): NetworkHint | undefined {
  return (navigator as Navigator & { connection?: NetworkHint }).connection;
}

/** Délai max avant de forcer le créneau, et repli sans requestIdleCallback. */
const IDLE_TIMEOUT_MS = 3000;
const IDLE_FALLBACK_MS = 1200;

/**
 * Planifie le préchargement APRÈS le chargement de la page (jamais en
 * concurrence du premier rendu ni du LCP), au premier créneau d'inactivité du
 * fil principal. Retourne l'annulation.
 */
export function scheduleScenePreload(run: () => void): () => void {
  let cancelled = false;
  let idleHandle: number | null = null;
  let timer: number | null = null;

  const fire = () => {
    if (!cancelled) run();
  };

  const start = () => {
    if (cancelled) return;
    if (typeof window.requestIdleCallback === "function") {
      idleHandle = window.requestIdleCallback(fire, { timeout: IDLE_TIMEOUT_MS });
    } else {
      timer = window.setTimeout(fire, IDLE_FALLBACK_MS);
    }
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener("load", start);
    if (idleHandle !== null) window.cancelIdleCallback(idleHandle);
    if (timer !== null) window.clearTimeout(timer);
  };
}
