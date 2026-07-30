"use client";

import { Suspense, useCallback, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, PerspectiveCamera } from "@react-three/drei";
import type { Group } from "three";
import { SceneReady } from "../SceneReady";
import styles from "./PoleObjectScene.module.css";

/** Position pointeur normalisée (-1..1), écrite par le wrapper (handlers),
    lue ici dans useFrame : zéro re-render pendant le survol. */
export type PolePointer = { x: number; y: number };

/** Contrat commun aux 3 modèles de pôle (casque, caméra, scanner). */
export type PoleModelSceneProps = {
  /** Couleur du pôle (lue des tokens par le wrapper via readCssColor). */
  accent: string;
  pointerRef: React.RefObject<PolePointer>;
  dpr?: number;
  active?: boolean;
  /** Première frame dessinée : le wrapper efface alors son repli 2D. */
  onReady: () => void;
};

type PoleObjectSceneProps = PoleModelSceneProps & { children: ReactNode };

const WARM_WHITE = "#f4efe8";

type RigProps = {
  pointerRef: React.RefObject<PolePointer>;
  children: ReactNode;
};

/** Idle : un tour lent (24 s) + inclinaison douce vers le pointeur (fine
    only, le wrapper n'écrit rien au tactile). Mutations refs uniquement. */
function Rig({ pointerRef, children }: RigProps) {
  const group = useRef<Group>(null);
  const lean = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = pointerRef.current;
    const follow = 1 - Math.exp(-6 * Math.min(delta, 0.1));
    lean.current.x += ((p?.x ?? 0) - lean.current.x) * follow;
    lean.current.y += ((p?.y ?? 0) - lean.current.y) * follow;
    g.rotation.y =
      state.clock.elapsedTime * ((2 * Math.PI) / 24) + lean.current.x * 0.16;
    g.rotation.x = -lean.current.y * 0.1;
  });

  return <group ref={group}>{children}</group>;
}

/**
 * Vitrine 3D d'un objet de pôle (bandes de l'accueil) : petit canvas au
 * fond transparent, éclairage studio léger (Environment 1 frame), frameloop
 * coupé hors écran. Le modèle enfant respecte le contrat Quest3Gltf
 * (centré, plus grande dimension ~2.2, face +Z).
 */
export default function PoleObjectScene({
  accent,
  pointerRef,
  dpr = 1.5,
  active = true,
  onReady,
  children,
}: PoleObjectSceneProps) {
  const [painted, setPainted] = useState(false);
  const handleReady = useCallback(() => {
    setPainted(true);
    onReady();
  }, [onReady]);

  return (
    <div className={styles.canvas} aria-hidden="true">
      <Canvas
        dpr={[1, dpr]}
        /* Tant que la scène n'a pas peint, elle rend même hors écran : sinon
           l'objet n'existe à l'image qu'une fois le lecteur arrivé. Une fois
           peinte, retour à la règle : rien hors écran, zéro GPU au repos. */
        frameloop={active || !painted ? "always" : "never"}
        gl={{
          antialias: dpr >= 1.5,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: true,
        }}
        onCreated={({ gl }) => gl.setClearAlpha(0)}
      >
        {/* Recul calculé sur le PLUS ENCOMBRANT des modèles (le scanner sur
            trépied) : à 4,1 la marge basse tombait à ~0,01 unité et les pieds
            étaient rognés par le bord du cadre en mobile. */}
        <PerspectiveCamera makeDefault position={[0, 0.25, 4.75]} fov={38} />
        {/* Accent en RIM discret : l'objet reste métal/verre lisible, la
            couleur du pôle borde les arêtes sans teindre les corps. */}
        <ambientLight intensity={0.65} />
        <directionalLight position={[2, 3, 4]} intensity={1.5} color={WARM_WHITE} />
        <pointLight position={[-2.6, 1.4, 2.2]} intensity={16} distance={12} color={accent} />
        <Environment resolution={64} frames={1}>
          <Lightformer intensity={1.8} color={WARM_WHITE} position={[0, 3, 2]} scale={[4, 2, 1]} />
          <Lightformer intensity={1.1} color={accent} position={[-3, 0.5, 2.5]} scale={[4, 4, 1]} />
        </Environment>
        {/* La sonde vit DANS la frontière Suspense : elle ne signale la
            scène prête qu'une fois le modèle résolu (GLB du casque compris). */}
        <Suspense fallback={null}>
          <SceneReady onReady={handleReady} />
          <Rig pointerRef={pointerRef}>{children}</Rig>
        </Suspense>
      </Canvas>
    </div>
  );
}
