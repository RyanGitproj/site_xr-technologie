"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, useTexture } from "@react-three/drei";
import {
  ClampToEdgeWrapping,
  SRGBColorSpace,
  SphereGeometry,
  type PerspectiveCamera as PerspectiveCameraImpl,
} from "three";
import { PANO_FOV_DEG, PANO_RADIUS, SPHERE_PITCH_LIMIT } from "@/lib/pano/panoMath";
import type { PoleModelSceneProps, PolePointer } from "./PoleObjectScene";
import { SceneReady } from "../SceneReady";
import styles from "./PoleObjectScene.module.css";

/**
 * Panneau 360 de l'accueil : au lieu de la caméra posée sur sa perche, on
 * est DEDANS — un vrai panorama équirectangulaire que le regard traverse en
 * continu, comme dans la visite du pôle. Version 2048×1024 de la photo
 * (celle de /360 fait 4096, inutile pour un panneau de bande).
 *
 * Mêmes props que les autres scènes de bande : le wrapper (PoleObjectLazy)
 * gère montage à l'approche, frameloop hors écran, repli et reduced-motion.
 */

const PANORAMA = "/images/funnel-v2/xr360-equi-chambre-2048.webp";

/** Période du balayage du regard (s) : règle ambient ≥ 22 s. */
const PAN_PERIOD_S = 38;
/** Amplitude du balayage (rad) : on reste dans la partie nette de la photo. */
const PAN_AMPLITUDE = 0.62;

function Rig({ pointerRef }: { pointerRef: React.RefObject<PolePointer> }) {
  const gl = useThree((state) => state.gl);
  const clock = useRef(0);
  const lean = useRef({ x: 0, y: 0 });

  const texture = useTexture(PANORAMA, (loaded) => {
    const map = Array.isArray(loaded) ? loaded[0] : loaded;
    map.colorSpace = SRGBColorSpace;
    map.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    map.wrapS = ClampToEdgeWrapping;
    map.wrapT = ClampToEdgeWrapping;
  });

  /* Sphère retournée : la caméra est à l'intérieur, u=0.5 face à elle
     (même convention que la fenêtre 360 du pôle). */
  const geometry = useMemo(() => {
    const geo = new SphereGeometry(PANO_RADIUS, 64, 32);
    geo.scale(-1, 1, 1);
    geo.rotateY(-Math.PI / 2);
    return geo;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    clock.current += Math.min(delta, 0.1);
    const p = pointerRef.current;
    const follow = 1 - Math.exp(-5 * Math.min(delta, 0.1));
    lean.current.x += ((p?.x ?? 0) - lean.current.x) * follow;
    lean.current.y += ((p?.y ?? 0) - lean.current.y) * follow;

    const yaw =
      Math.sin((2 * Math.PI * clock.current) / PAN_PERIOD_S) * PAN_AMPLITUDE -
      lean.current.x * 0.2;
    const pitch = Math.max(
      -SPHERE_PITCH_LIMIT,
      Math.min(SPHERE_PITCH_LIMIT, -lean.current.y * 0.14),
    );

    const camera = state.camera as PerspectiveCameraImpl;
    camera.rotation.set(pitch, yaw, 0, "YXZ");
  });

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial map={texture} toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

export default function PanoPoleScene({
  pointerRef,
  dpr = 1.5,
  active = true,
  onReady,
}: PoleModelSceneProps) {
  const [painted, setPainted] = useState(false);
  const handleReady = useCallback(() => {
    setPainted(true);
    onReady();
  }, [onReady]);

  return (
    <div className={styles.canvas} aria-hidden="true">
      <Canvas
        dpr={[1, dpr]}
        /* Tant que la scène n'a pas peint, elle rend même hors écran (contrat
           PoleObjectLazy : le repli 2D s'efface à la première frame). */
        frameloop={active || !painted ? "always" : "never"}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: true,
        }}
        onCreated={({ gl }) => gl.setClearAlpha(0)}
      >
        <PerspectiveCamera makeDefault fov={PANO_FOV_DEG} position={[0, 0, 0]} near={0.1} far={20} />
        {/* La sonde vit DANS la frontière Suspense : le panorama suspend le
            rendu le temps de son upload GPU, et le repli 2D ne doit s'effacer
            qu'une fois la photo réellement à l'écran. */}
        <Suspense fallback={null}>
          <SceneReady onReady={handleReady} />
          <Rig pointerRef={pointerRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
