"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, useTexture } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import type { Mesh, MeshBasicMaterial, Texture } from "three";
import { CylinderGeometry, SphereGeometry, SRGBColorSpace, ClampToEdgeWrapping, Vector3 } from "three";
import { clamp01 } from "@/lib/motion/sceneRamp";
import {
  PANO_FOV_DEG,
  PANO_RADIUS,
  cylinderDims,
  horizontalFov,
  hotspotPosition,
  pitchLimit,
  yawLimit,
  SPHERE_PITCH_LIMIT,
} from "@/lib/pano/panoMath";
import type { PanoMotor } from "@/lib/pano/panoMotor";
import styles from "./Pano360Window.module.css";

/** Spécification d'une scène panoramique, côté fx (produit-agnostique). */
export type PanoSceneSpec = {
  id: string;
  src: string;
  width: number;
  height: number;
  projection: "cylinder" | "sphere";
  arcDeg: number;
  hotspots: readonly { u: number; v: number }[];
};

type Pano360SceneProps = {
  scenes: readonly PanoSceneSpec[];
  activeId: string;
  /** Moteur d'interaction porté par ref : muté par le wrapper (gestes),
      consommé ici dans useFrame ; jamais lu ni muté pendant un rendu. */
  motorRef: React.RefObject<PanoMotor>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  /** true quand le gyroscope pilote déjà le regard (auto-pan coupé). */
  gyroActive: boolean;
  /** Boutons hotspot DOM, projetés à la main chaque frame (clé `id:i`). */
  hotspotEls: React.RefObject<Map<string, HTMLButtonElement | null>>;
  dpr?: number;
  active?: boolean;
};

/** Fondu de changement de scène (s). */
const FADE_S = 0.45;
/** Auto-pan : déclenché après ce délai sans geste. */
const IDLE_MS = 4000;
/** Auto-pan : période complète du balancement (règle ambient ≥ 22 s). */
const AUTO_PERIOD_S = 44;

function surfaceGeometry(spec: PanoSceneSpec) {
  const ratio = spec.height / spec.width;
  if (spec.projection === "sphere") {
    const geo = new SphereGeometry(PANO_RADIUS, 64, 32);
    geo.scale(-1, 1, 1);
    /* Aligne la texture sur la convention hotspots (u=0.5 face caméra,
       vue initiale = centre composé de l'équirectangulaire) : SphereGeometry
       place sinon u=0.75 vers -Z. */
    geo.rotateY(-Math.PI / 2);
    return geo;
  }
  const dims = cylinderDims(spec.arcDeg, ratio);
  const geo = new CylinderGeometry(
    PANO_RADIUS,
    PANO_RADIUS,
    dims.height,
    96,
    1,
    true,
    dims.thetaStart,
    dims.thetaLength,
  );
  geo.scale(-1, 1, 1);
  return geo;
}

type PanoSurfaceProps = {
  spec: PanoSceneSpec;
  texture: Texture;
  /** 0 = dessous (opaque), 1 = dessus (c'est lui qui fond). */
  layer: 0 | 1;
  fadeRef: React.RefObject<number>;
};

/** Une surface = une scène. Deux surfaces coïncident pendant le fondu :
    depthTest coupé + renderOrder = ordre du peintre, zéro z-fight. */
function PanoSurface({ spec, texture, layer, fadeRef }: PanoSurfaceProps) {
  const mesh = useRef<Mesh>(null);
  const geometry = useMemo(() => surfaceGeometry(spec), [spec]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => {
    const mat = mesh.current?.material as MeshBasicMaterial | undefined;
    if (!mat) return;
    if (layer === 1) {
      const fade = clamp01(fadeRef.current);
      mat.opacity = fade;
      mat.transparent = fade < 1;
    } else {
      mat.opacity = 1;
      mat.transparent = false;
    }
  });

  return (
    <mesh ref={mesh} geometry={geometry} renderOrder={layer}>
      <meshBasicMaterial map={texture} toneMapped={false} depthTest={false} depthWrite={false} />
    </mesh>
  );
}

type RigProps = Omit<Pano360SceneProps, "dpr" | "active">;

/** Rig : consomme le moteur (drag/inertie), le gyro et l'auto-pan, borne le
    regard aux limites de la surface, projette les hotspots DOM. Aucun état
    React : mutations directes caméra + styles, uniquement dans useFrame. */
function Rig({ scenes, activeId, motorRef, tiltX, tiltY, gyroActive, hotspotEls }: RigProps) {
  const gl = useThree((state) => state.gl);
  const size = useThree((state) => state.size);
  const projectV = useRef(new Vector3());

  /* Configuration AVANT le premier upload GPU (onLoad de useTexture). */
  const textures = useTexture(scenes.map((s) => s.src), (loaded) => {
    const maxAniso = gl.capabilities.getMaxAnisotropy();
    for (const texture of Array.isArray(loaded) ? loaded : [loaded]) {
      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = Math.min(8, maxAniso);
      texture.wrapS = ClampToEdgeWrapping;
      texture.wrapT = ClampToEdgeWrapping;
    }
  });

  /* Fondu de scène : `from` reste opaque dessous, `current` fond dessus. */
  const [display, setDisplay] = useState<{ current: string; from: string | null }>({
    current: activeId,
    from: null,
  });
  const fadeRef = useRef(1);
  useEffect(() => {
    setDisplay((d) => {
      if (d.current === activeId) return d;
      fadeRef.current = 0;
      return { current: activeId, from: d.current };
    });
  }, [activeId]);

  const view = useRef({ yaw: 0, yawTarget: 0, pitch: 0, pitchTarget: 0, yawVel: 0, autoWeight: 0 });

  useFrame((state, delta) => {
    /* La caméra vient de l'état du callback (jamais mutée en portée de
       rendu : contrat React Compiler, même esprit que le group ref du Rig
       casque). */
    const camera = state.camera;
    const dt = Math.min(delta, 0.1);
    const spec = scenes.find((s) => s.id === display.current) ?? scenes[0];
    if (!spec) return;
    const motor = motorRef.current;
    if (!motor) return;
    const v = view.current;
    const aspect = size.width / Math.max(1, size.height);
    const hFov = horizontalFov(PANO_FOV_DEG, aspect);
    const ratio = spec.height / spec.width;
    const yawMax =
      spec.projection === "sphere" ? Number.POSITIVE_INFINITY : yawLimit(spec.arcDeg, PANO_FOV_DEG, aspect);
    const pitchMax =
      spec.projection === "sphere"
        ? SPHERE_PITCH_LIMIT
        : pitchLimit(cylinderDims(spec.arcDeg, ratio).height, PANO_RADIUS, PANO_FOV_DEG);

    /* 1. Gestes : deltas px → radians (mapping « on attrape le décor »). */
    if (motor.pendingDx !== 0 || motor.pendingDy !== 0) {
      v.yawTarget += (motor.pendingDx / Math.max(1, size.width)) * hFov;
      v.pitchTarget += (motor.pendingDy / Math.max(1, size.height)) * ((PANO_FOV_DEG * Math.PI) / 180);
      motor.pendingDx = 0;
      motor.pendingDy = 0;
      v.yawVel = 0;
    }
    if (motor.releaseVx !== 0) {
      v.yawVel = (motor.releaseVx / Math.max(1, size.width)) * hFov;
      motor.releaseVx = 0;
    }

    /* 2. Inertie au relâcher, puis décroissance exponentielle. */
    if (!motor.dragging && v.yawVel !== 0) {
      v.yawTarget += v.yawVel * dt;
      v.yawVel *= Math.exp(-3.2 * dt);
      if (Math.abs(v.yawVel) < 0.002) v.yawVel = 0;
    }

    /* 3. Bornes de la surface. */
    if (Number.isFinite(yawMax)) {
      v.yawTarget = Math.min(yawMax, Math.max(-yawMax, v.yawTarget));
    }
    v.pitchTarget = Math.min(pitchMax, Math.max(-pitchMax, v.pitchTarget));

    /* 4. Convergence douce vers la cible. */
    const follow = 1 - Math.exp(-10 * dt);
    v.yaw += (v.yawTarget - v.yaw) * follow;
    v.pitch += (v.pitchTarget - v.pitch) * follow;

    /* 5. Auto-pan d'attente (coupé dès qu'on interagit ou que le gyro pilote).
       Même base de temps que le moteur : performance.now(). */
    const idle = !motor.dragging && !gyroActive && performance.now() - motor.lastInputAt > IDLE_MS;
    const autoTarget = idle ? 1 : 0;
    const autoRate = idle ? dt / 1.5 : dt / 0.2;
    v.autoWeight += (autoTarget - v.autoWeight) * Math.min(1, autoRate * 3);
    const autoAmp = Number.isFinite(yawMax) ? yawMax * 0.6 : Math.PI / 4;
    const auto =
      v.autoWeight * autoAmp * Math.sin((state.clock.elapsedTime * 2 * Math.PI) / AUTO_PERIOD_S);

    /* 6. Gyroscope additif (springé en amont par useDeviceTilt). */
    const gyroYaw = tiltX.get() * (10 * Math.PI) / 180;
    const gyroPitch = tiltY.get() * (5 * Math.PI) / 180;

    camera.rotation.order = "YXZ";
    camera.rotation.y = v.yaw + auto + gyroYaw;
    camera.rotation.x = Math.min(pitchMax, Math.max(-pitchMax, v.pitch + gyroPitch));

    /* 7. Fondu de scène. */
    if (display.from !== null) {
      fadeRef.current = clamp01(fadeRef.current + dt / FADE_S);
      if (fadeRef.current >= 1) {
        setDisplay((d) => (d.from === null ? d : { current: d.current, from: null }));
      }
    }

    /* 8. Hotspots DOM projetés (2-3 éléments : coût négligeable). */
    const els = hotspotEls.current;
    if (els) {
      const vec = projectV.current;
      spec.hotspots.forEach((h, i) => {
        const el = els.get(`${spec.id}:${i}`);
        if (!el) return;
        const [x, y, z] = hotspotPosition(h.u, h.v, spec.projection, spec.arcDeg, ratio);
        vec.set(x, y, z).project(camera);
        const visible = vec.z < 1 && Math.abs(vec.x) <= 1.02 && Math.abs(vec.y) <= 1.05;
        el.dataset.visible = visible ? "true" : "false";
        if (visible) {
          el.style.left = `${(vec.x * 0.5 + 0.5) * 100}%`;
          el.style.top = `${(-vec.y * 0.5 + 0.5) * 100}%`;
        }
      });
    }
  });

  const fromSpec = display.from === null ? null : scenes.find((s) => s.id === display.from);
  const currentSpec = scenes.find((s) => s.id === display.current);
  const textureOf = (spec: PanoSceneSpec) => textures[scenes.indexOf(spec)];

  return (
    <>
      {fromSpec ? <PanoSurface spec={fromSpec} texture={textureOf(fromSpec)} layer={0} fadeRef={fadeRef} /> : null}
      {currentSpec ? (
        <PanoSurface spec={currentSpec} texture={textureOf(currentSpec)} layer={1} fadeRef={fadeRef} />
      ) : null}
    </>
  );
}

/**
 * Scène WebGL de la fenêtre panoramique : la photo est le seul « éclairage »
 * (MeshBasicMaterial), aucune lumière ni Environment : bien plus légère que
 * la scène casque. Montée lazy par Pano360Window, frameloop coupé hors
 * écran.
 */
export default function Pano360Scene({
  scenes,
  activeId,
  motorRef,
  tiltX,
  tiltY,
  gyroActive,
  hotspotEls,
  dpr = 1.5,
  active = true,
}: Pano360SceneProps) {
  return (
    <div className={styles.canvas} aria-hidden="true">
      <Canvas
        dpr={[1, dpr]}
        frameloop={active ? "always" : "never"}
        gl={{
          antialias: dpr >= 1.5,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: true,
        }}
        onCreated={({ gl }) => gl.setClearAlpha(0)}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 0]} fov={PANO_FOV_DEG} />
        <Suspense fallback={null}>
          <Rig
            scenes={scenes}
            activeId={activeId}
            motorRef={motorRef}
            tiltX={tiltX}
            tiltY={tiltY}
            gyroActive={gyroActive}
            hotspotEls={hotspotEls}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
