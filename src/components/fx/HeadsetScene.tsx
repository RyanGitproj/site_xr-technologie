"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, PerspectiveCamera } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import type { Group } from "three";
import { ramp } from "@/lib/motion/sceneRamp";
import { Quest3Gltf } from "./Quest3Gltf";
import { SceneReady } from "./SceneReady";
import styles from "./HeadsetScene.module.css";

const AMBER = "#ffc24d";
const ORANGE = "#f5661e";
const RED = "#e82818";
const TEAL = "#2fbfa8"; /* contre-jour froid : la pointe turquoise */

type Choreography = {
  progress: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
};

/**
 * Rig : lit la progression du scroll (et le gyro) à chaque frame et joue la
 * mise du casque. Trois temps : (1) la FAÇADE (capteurs, logo Meta) fait face
 * au spectateur, au loin ; (2) le casque s'approche et PIVOTE de 180°, on le
 * retourne vers soi pour découvrir les lentilles ; (3) plongée dans les
 * œilletons (z file vers la caméra à z=4, centré entre les deux lentilles).
 * Aucun état React : mutation directe de l'objet three. Le relais plein écran
 * (voile + embrasement CSS) prend la suite après ~0.66.
 */
function Rig({ progress, tiltX, tiltY, onReady }: Choreography & { onReady: () => void }) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = progress.get();
    const gx = tiltX.get();
    const gy = tiltY.get();
    const idle = Math.sin(state.clock.elapsedTime * 0.6) * 0.05;

    g.rotation.y = ramp(p, 0.12, 0.52, 0, Math.PI) + idle + gx * 0.3;
    g.rotation.x = ramp(p, 0.1, 0.5, 0.04, -0.05) + gy * 0.22;
    g.position.z = ramp(p, 0, 0.66, -2.8, 3.7);
    g.position.x = gx * 0.1;
    g.position.y = ramp(p, 0, 0.6, 0.02, 0.06) + gy * 0.05;
  });

  return (
    <group ref={group}>
      {/* La sonde vit DANS la frontière Suspense : elle ne signale la scène
          prête qu'une fois le GLB résolu, jamais avant. */}
      <Suspense fallback={null}>
        <SceneReady onReady={onReady} />
        <Quest3Gltf />
      </Suspense>
    </group>
  );
}

type HeadsetSceneProps = Choreography & {
  /** DPR max (mobile : 1 ; desktop : 1.5). */
  dpr?: number;
  /** Anime uniquement quand actif (hors écran → une frame, zéro GPU ensuite). */
  active?: boolean;
  /** Première frame dessinée : le wrapper efface alors son image de repli. */
  onReady: () => void;
};

/**
 * Scène WebGL du casque (Immersion v2.1) en react-three-fiber. Vrai Meta
 * Quest 3 (GLB Sketchfab CC-BY optimisé, chargé en Suspense), réflexions par
 * Lightformers locaux (pas d'HDR distant). Fond transparent : le
 * LiquidBackground / l'univers respirent derrière. Lazy-montée près du
 * viewport (voir HeadsetSceneLazy).
 */
export function HeadsetScene({
  progress,
  tiltX,
  tiltY,
  dpr = 1.5,
  active = true,
  onReady,
}: HeadsetSceneProps) {
  const [painted, setPainted] = useState(false);
  const handleReady = useCallback(() => {
    setPainted(true);
    onReady();
  }, [onReady]);

  return (
    <div className={styles.root} aria-hidden="true">
      <Canvas
        dpr={[1, dpr]}
        /* Tant que le casque n'a pas peint, la scène rend même hors écran :
           sinon il n'existe à l'image qu'une fois la plongée épinglée. Une
           fois peint, retour à la règle : zéro GPU hors écran. */
        frameloop={active || !painted ? "always" : "never"}
        gl={{
          // GPU dédié (et non l'iGPU basse conso) ; MSAA sur desktop (dpr≥1.5),
          // coupé sur mobile (dpr 1) ; refus du rendu logiciel (SwiftShader) →
          // les machines sans vrai GPU basculent sur l'image de repli.
          antialias: dpr >= 1.5,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: true,
        }}
        onCreated={({ gl }) => gl.setClearAlpha(0)}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={42} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 3, 4]} intensity={1.1} color="#ffe9d6" />
        <pointLight position={[-3.2, -1, 2.5]} intensity={40} distance={14} color={ORANGE} />
        <pointLight position={[3.2, 1.4, 1.5]} intensity={34} distance={14} color={TEAL} />
        {/* Cubemap de réflexions rendu UNE fois (frames={1}) : glossy néon
            sur la visière, sans HDR distant. */}
        <Environment resolution={128} frames={1}>
          <Lightformer intensity={2.4} color={AMBER} position={[-3, 1, 3]} scale={[5, 5, 1]} />
          <Lightformer intensity={2.4} color={RED} position={[3, -1, 3]} scale={[5, 5, 1]} />
          <Lightformer intensity={1.2} color="#fff4e8" position={[0, 3, 2]} scale={[3, 2, 1]} />
        </Environment>
        <Rig progress={progress} tiltX={tiltX} tiltY={tiltY} onReady={handleReady} />
      </Canvas>
    </div>
  );
}
