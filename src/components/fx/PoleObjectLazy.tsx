"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import dynamic from "next/dynamic";
import type { ProductId } from "@/config/products";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";
import { cx } from "@/lib/cx";
import type { PolePointer } from "./poleModels/PoleObjectScene";
import { readCssColor } from "./readCssColor";
import { useSceneGate } from "./useSceneGate";
import { useWebGLSupport } from "./webglSupport";
import styles from "./PoleObjectLazy.module.css";

/** Un chunk dynamique PAR modèle : le GLB du casque (765 Ko) ne se charge
    que pour la bande VR, les modèles procéduraux restent minuscules. */
const SCENES = {
  vr: dynamic(() => import("./poleModels/Quest3PoleScene"), { ssr: false }),
  xr360: dynamic(() => import("./poleModels/CameraPoleScene"), { ssr: false }),
  lidar: dynamic(() => import("./poleModels/ScannerPoleScene"), { ssr: false }),
} as const;

type PoleObjectLazyProps = {
  model: ProductId;
  /** Repli (reduced-motion, WebGL absent, chunk ou modèle en vol) : halo CSS
      aujourd'hui, packshot Codex (lot H) demain, sans toucher ce composant. */
  fallback: ReactNode;
  className?: string;
};

/**
 * Objet 3D d'une bande pôle : monté près du viewport (useSceneGate),
 * frameloop coupé hors écran, accent lu du token `--pole-accent` posé par
 * la bande (tokens-only : aucun hex de thème côté scène). Sous
 * reduced-motion : repli direct, AUCUN three.js chargé.
 *
 * Le repli 2D n'est pas remplacé mais RECOUVERT : il reste sous la scène
 * jusqu'à sa première frame dessinée (`onReady`), sans quoi le canvas
 * transparent laisse un trou pendant le téléchargement du chunk puis du
 * modèle.
 */
export function PoleObjectLazy({ model, fallback, className }: PoleObjectLazyProps) {
  const reduce = useReducedMotionPref();
  const webgl = useWebGLSupport();
  const fine = usePointerFine();
  const { ref, mounted, active } = useSceneGate<HTMLDivElement>();
  const [accent, setAccent] = useState<string | null>(null);
  const [painted, setPainted] = useState(false);
  const pointerRef = useRef<PolePointer>({ x: 0, y: 0 });
  const onReady = useCallback(() => setPainted(true), []);

  useEffect(() => {
    const el = ref.current;
    if (el) setAccent(readCssColor(el, "--pole-accent", "#ffffff"));
  }, [ref]);

  const live = !reduce && webgl && mounted && accent !== null;
  const Scene = SCENES[model];

  /* Inclinaison vers le pointeur : pointer fine uniquement (au tactile,
     l'objet vit son idle : le gyro reste la signature /vr et pano /360). */
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!fine) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerRef.current.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
  };
  const onPointerLeave = () => {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
  };

  return (
    <div
      ref={ref}
      className={cx(styles.root, className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className={styles.fallback} data-painted={painted ? "true" : undefined}>
        {fallback}
      </div>
      {live ? (
        <Scene
          accent={accent}
          pointerRef={pointerRef}
          dpr={fine ? 1.5 : 1}
          active={active}
          onReady={onReady}
        />
      ) : null}
    </div>
  );
}
