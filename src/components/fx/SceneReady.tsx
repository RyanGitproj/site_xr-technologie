"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/** Frames de chauffe avant de déclarer la scène peinte : la première sert au
    cubemap d'Environment (frames={1}), les suivantes au rendu qui l'utilise.
    En dessous, le repli s'effacerait sur une image encore incomplète. */
const WARMUP_FRAMES = 4;

type SceneReadyProps = {
  /** Appelé une seule fois, quand la scène a réellement peint. */
  onReady: () => void;
};

/**
 * Sonde « la scène a peint ». Montée SOUS la frontière Suspense du Canvas,
 * elle ne compte ses frames qu'une fois le contenu résolu (chunk téléchargé,
 * modèle et textures chargés) : c'est le seul instant où le repli 2D peut
 * s'effacer sans laisser de trou à l'écran, et le signal qui autorise la
 * scène à couper son frameloop hors écran.
 */
export function SceneReady({ onReady }: SceneReadyProps) {
  const frames = useRef(0);

  useFrame(() => {
    if (frames.current >= WARMUP_FRAMES) return;
    frames.current += 1;
    if (frames.current === WARMUP_FRAMES) onReady();
  });

  return null;
}
