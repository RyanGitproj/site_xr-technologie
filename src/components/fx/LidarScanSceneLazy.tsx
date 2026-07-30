"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { MotionValue } from "framer-motion";
import type { ImageSlot } from "@/lib/images";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import { readCssColor } from "./readCssColor";
import { useSceneGate } from "./useSceneGate";
import { useWebGLSupport } from "./webglSupport";
import type { LidarScanPalette } from "./LidarScanScene";
import styles from "./LidarScanScene.module.css";

/** Le chunk three.js n'est téléchargé qu'à l'approche de la scène. */
const LidarScanScene = dynamic(() => import("./LidarScanScene"), { ssr: false });

type LidarScanSceneLazyProps = {
  progress: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  /** Repli 2D (WebGL absent / chunk en vol) : le nuage de points du lot F. */
  fallback: ImageSlot | null;
};

/**
 * Porte de la scène scan : montage à l'approche (IO 60 %), frameloop coupé
 * hors écran, détection WebGL durcie, palette lue des tokens du thème
 * lidar UNE fois au montage (pont tokens-only → uniforms). Le repli
 * reduced-motion est géré en amont (le ScrollStage ne monte pas). */
export function LidarScanSceneLazy({ progress, tiltX, tiltY, fallback }: LidarScanSceneLazyProps) {
  const { ref, mounted, active } = useSceneGate<HTMLDivElement>();
  const webgl = useWebGLSupport();
  const fine = usePointerFine();
  const [palette, setPalette] = useState<LidarScanPalette | null>(null);
  const [painted, setPainted] = useState(false);
  const onReady = useCallback(() => setPainted(true), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setPalette({
      base: readCssColor(el, "--color-accent", "#00e5a8"),
      hot: readCssColor(el, "--color-accent-hot", "#4df2c6"),
      tech: readCssColor(el, "--color-accent-deep", "#00a8c6"),
    });
  }, [ref]);

  return (
    <div ref={ref} className={styles.root}>
      {/* Le nuage de points 2D tient l'écran SOUS le canvas jusqu'à la
          première frame dessinée (chunk puis géométrie). */}
      {fallback !== null ? (
        <div
          className={styles.fallback2d}
          data-painted={painted ? "true" : undefined}
          aria-hidden="true"
        >
          <Image src={fallback.src} alt="" fill sizes="100vw" className={styles.fallbackImg} />
        </div>
      ) : null}
      {webgl && mounted && palette !== null ? (
        <LidarScanScene
          progress={progress}
          tiltX={tiltX}
          tiltY={tiltY}
          palette={palette}
          pointCount={fine ? 22000 : 14000}
          dpr={fine ? 1.5 : 1}
          active={active}
          onReady={onReady}
        />
      ) : null}
    </div>
  );
}
