"use client";

import { useEffect } from "react";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";
import {
  readNetworkHint,
  scheduleScenePreload,
  shouldPreloadScenes,
  type SceneChunkId,
} from "./scenePreload";
import { useWebGLSupport } from "./webglSupport";

/**
 * Registre des chunks de scènes : les MÊMES `import()` que les `dynamic()`
 * des wrappers, rejoués à vide. Le bundler sert ensuite le module depuis son
 * cache, donc le montage n'attend plus le réseau. Le typage Record force une
 * entrée par pôle : un 4e pôle ne peut pas arriver sans son objet préchargé.
 * Contrat : toute scène lazy déclare son chunk ici (test gardien dans
 * `scenePreload.test.ts`).
 */
const SCENE_CHUNKS: Record<SceneChunkId, () => Promise<unknown>> = {
  "pole-vr": () => import("./poleModels/Quest3PoleScene"),
  "pole-xr360": () => import("./poleModels/CameraPoleScene"),
  "pole-lidar": () => import("./poleModels/ScannerPoleScene"),
  "vr-headset": () => import("./HeadsetScene"),
  "lidar-scan": () => import("./LidarScanScene"),
  "pano-360": () => import("./Pano360Scene"),
};

/* Une fois chargé, un chunk l'est pour toute la session : on ne redemande
   jamais (plusieurs préchargeurs peuvent viser la même scène). */
const started = new Set<SceneChunkId>();

/**
 * Charge les chunks demandés l'un APRÈS l'autre : ils partagent le noyau
 * three.js, et la première scène de la page est aussi la première rencontrée
 * au scroll. En cas d'échec (réseau coupé, déploiement en cours) on renonce
 * sans bruit : la porte redemandera le chunk au montage.
 */
async function preloadScenes(ids: readonly SceneChunkId[]): Promise<void> {
  for (const id of ids) {
    if (started.has(id)) continue;
    started.add(id);
    try {
      await SCENE_CHUNKS[id]();
    } catch {
      started.delete(id);
      return;
    }
  }
}

type ScenePreloaderProps = {
  /** Scènes 3D de cette surface, dans l'ordre de rencontre au scroll. */
  scenes: readonly SceneChunkId[];
};

/**
 * Déclare les scènes 3D à précharger pour la surface qui le rend. N'affiche
 * rien : il occupe le temps mort entre la fin du chargement et l'arrivée du
 * lecteur sur la section, pour que la 3D soit déjà là quand la porte de
 * `useSceneGate` s'ouvre. Se tait quand la scène ne serait de toute façon pas
 * montée (mouvement réduit, WebGL absent) ou quand le réseau demande la
 * sobriété.
 */
export function ScenePreloader({ scenes }: ScenePreloaderProps) {
  const reduce = useReducedMotionPref();
  const webgl = useWebGLSupport();

  useEffect(() => {
    if (reduce || !webgl) return;
    if (!shouldPreloadScenes(readNetworkHint())) return;
    return scheduleScenePreload(() => void preloadScenes(scenes));
  }, [reduce, webgl, scenes]);

  return null;
}
