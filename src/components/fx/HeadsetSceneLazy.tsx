"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { MotionValue } from "framer-motion";
import { diveImages } from "@/products/vr/config/images";
import { useSceneGate } from "./useSceneGate";
import { useWebGLSupport } from "./webglSupport";
import styles from "./HeadsetScene.module.css";

/** Le chunk three.js/R3F n'est téléchargé qu'au montage de ce composant. */
const HeadsetScene = dynamic(() => import("./HeadsetScene").then((m) => m.HeadsetScene), {
  ssr: false,
});

/** Image 2D de repli (Codex) : WebGL absent, ou tant que la scène n'a pas
    peint (chunk et GLB en vol). */
function Fallback2D({ painted }: { painted: boolean }) {
  return (
    <div className={styles.fallback2d} data-painted={painted ? "true" : undefined} aria-hidden="true">
      <Image
        src={diveImages.headsetFront.src}
        alt=""
        width={diveImages.headsetFront.width}
        height={diveImages.headsetFront.height}
        unoptimized
      />
    </div>
  );
}

type HeadsetSceneLazyProps = {
  progress: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  dpr?: number;
};

/**
 * Monte la scène 3D UNIQUEMENT près du viewport (IntersectionObserver, ~1
 * écran de marge), ce qui diffère le chunk three.js hors first-view, et coupe
 * son frameloop quand elle sort de l'écran (zéro GPU au repos). Sans WebGL :
 * image 2D de repli. Le fallback reduced-motion est géré en amont (DiveSection ne
 * monte pas ScrollStage sous reduced-motion).
 */
export function HeadsetSceneLazy({ progress, tiltX, tiltY, dpr }: HeadsetSceneLazyProps) {
  const { ref, mounted, active } = useSceneGate<HTMLDivElement>();
  const webgl = useWebGLSupport();
  const [painted, setPainted] = useState(false);
  const onReady = useCallback(() => setPainted(true), []);

  return (
    <div ref={ref} className={styles.root}>
      {/* L'image tient l'écran SOUS le canvas jusqu'à la première frame. */}
      <Fallback2D painted={painted} />
      {webgl && mounted ? (
        <HeadsetScene
          progress={progress}
          tiltX={tiltX}
          tiltY={tiltY}
          dpr={dpr}
          active={active}
          onReady={onReady}
        />
      ) : null}
    </div>
  );
}
