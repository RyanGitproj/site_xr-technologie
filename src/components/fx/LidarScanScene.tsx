"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  type LineBasicMaterial,
  type Mesh,
  type MeshBasicMaterial,
  type LineSegments,
  type PerspectiveCamera as PerspectiveCameraImpl,
  type Points,
  type ShaderMaterial,
} from "three";
import { ramp } from "@/lib/motion/sceneRamp";
import {
  SCANNER_POSITION,
  SCAN_FIT_ASPECT_MIN,
  buildPointCloud,
  buildWireframe,
  scanFitDistance,
  scanFraming,
} from "@/lib/lidar/scanModel";
import ScannerModel from "./poleModels/ScannerModel";
import { SceneReady } from "./SceneReady";
import styles from "./LidarScanScene.module.css";

/** Couleurs du thème lidar, lues des tokens par le wrapper (readCssColor). */
export type LidarScanPalette = {
  base: string;
  hot: string;
  tech: string;
};

type LidarScanSceneProps = {
  progress: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  palette: LidarScanPalette;
  /** 22k desktop / 14k tactile (fill-rate). */
  pointCount: number;
  dpr?: number;
  active?: boolean;
  /** Première frame dessinée : le wrapper efface alors son repli 2D. */
  onReady: () => void;
};

const DEG = Math.PI / 180;

const POINTS_VERTEX = /* glsl */ `
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform float uSize;
  attribute float aBirth;
  attribute float aShade;
  varying float vAlpha;
  varying float vHot;
  varying float vShade;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uSize * uPixelRatio * (10.0 / -mv.z), 1.0, 6.0);
    /* Né quand l'onde radiale (uProgress) a dépassé le seuil du point.
       Bornes CROISSANTES obligatoires : smoothstep(e0 > e1) est indéfini
       en GLSL (et s'évaluait à l'envers ici). */
    vAlpha = smoothstep(aBirth - 0.06, aBirth, uProgress);
    /* Front chaud : les points qui viennent de naître brillent. */
    vHot = (1.0 - smoothstep(0.0, 0.1, uProgress - aBirth)) * vAlpha;
    vShade = aShade;
  }
`;

const POINTS_FRAGMENT = /* glsl */ `
  uniform vec3 uColorBase;
  uniform vec3 uColorTech;
  uniform vec3 uColorHot;
  varying float vAlpha;
  varying float vHot;
  varying float vShade;

  void main() {
    float m = smoothstep(0.5, 0.32, length(gl_PointCoord - 0.5));
    if (m < 0.01 || vAlpha < 0.01) discard;
    vec3 color = mix(mix(uColorBase, uColorTech, vShade * 0.35), uColorHot, vHot);
    gl_FragColor = vec4(color, vAlpha * m * (0.55 + 0.45 * vHot));
  }
`;

type RigProps = Omit<LidarScanSceneProps, "dpr" | "active" | "onReady">;

/** Rig : l'onde révèle le nuage (0.03→0.60), le filaire du jumeau se fige
    (0.66→0.82), la caméra orbite pendant toute la traversée. La progression
    reçue démarre à l'ENTRÉE du stage dans le viewport (ScrollStage entry,
    épinglage à p=1/3) : le scan tourne déjà pendant l'arrivée de la
    section, demande client. Zéro état React : uniforms et matériaux mutés
    dans useFrame. */
function Rig({ progress, tiltX, tiltY, palette, pointCount }: RigProps) {
  const pointsRef = useRef<Points>(null);
  const wireRef = useRef<LineSegments>(null);
  const sweepRef = useRef<Mesh>(null);

  const pointsGeometry = useMemo(() => {
    const cloud = buildPointCloud(pointCount);
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(cloud.positions, 3));
    geometry.setAttribute("aBirth", new BufferAttribute(cloud.birth, 1));
    geometry.setAttribute("aShade", new BufferAttribute(cloud.shade, 1));
    return geometry;
  }, [pointCount]);

  const wireGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(buildWireframe(), 3));
    return geometry;
  }, []);

  useEffect(
    () => () => {
      pointsGeometry.dispose();
      wireGeometry.dispose();
    },
    [pointsGeometry, wireGeometry],
  );

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: 2.2 },
      uColorBase: { value: new Color(palette.base) },
      uColorTech: { value: new Color(palette.tech) },
      uColorHot: { value: new Color(palette.hot) },
    }),
    [palette],
  );

  useFrame((state) => {
    const p = progress.get();
    const gx = tiltX.get();
    const gy = tiltY.get();

    /* Onde de scan → uniform des points + anneau au sol. */
    const wave = ramp(p, 0.03, 0.6, 0, 1);
    const material = pointsRef.current?.material as ShaderMaterial | undefined;
    if (material) {
      material.uniforms.uProgress.value = wave;
      material.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    }
    const sweep = sweepRef.current;
    if (sweep) {
      const scale = ramp(p, 0.03, 0.6, 0.4, 15);
      sweep.scale.setScalar(scale);
      const mat = sweep.material as MeshBasicMaterial;
      mat.opacity = 0.4 * ramp(p, 0.02, 0.07, 0, 1) * (1 - ramp(p, 0.6, 0.7, 0, 1));
    }

    /* Le jumeau se fige. */
    const wire = wireRef.current;
    if (wire) {
      const mat = wire.material as LineBasicMaterial;
      mat.opacity = ramp(p, 0.66, 0.82, 0, 0.85);
    }

    /* Orbite caméra (état du callback : jamais mutée en portée de rendu).
       scanFraming adapte fov et cible à la FORME du canvas (recentrage
       scanner en portrait) ; la distance est RÉSOLUE sur la boîte englobante
       (scanFitDistance, comme la bande accueil) au lieu d'un rayon à l'œil :
       la pièce remplit le cadre dès p=0 au lieu de flotter au fond. L'aspect
       du fit est plancher à SCAN_FIT_ASPECT_MIN : sous ce ratio les côtés de
       la pièce (12 m de large) débordent volontairement, sinon le fit
       horizontal ferait reculer la caméra et recréerait le vide. */
    const aspect = state.size.width / state.size.height;
    const framing = scanFraming(aspect, p);
    const camera = state.camera as PerspectiveCameraImpl;
    if (Math.abs(camera.fov - framing.fovDeg) > 0.01) {
      camera.fov = framing.fovDeg;
      camera.updateProjectionMatrix();
    }
    const azimut = ramp(p, 0, 1, -40 * DEG, 38 * DEG) + gx * 0.06;
    /* Élévation et marge reproduisent l'approche de l'ancien rayon 15→10.5. */
    const elevation = ramp(p, 0, 0.7, 0.27, 0.22);
    const margin = ramp(p, 0, 0.7, 1.06, 0.92);
    const distance = scanFitDistance(
      azimut,
      elevation,
      framing.fovDeg,
      Math.max(aspect, SCAN_FIT_ASPECT_MIN),
      [framing.targetX, framing.targetY, 0],
      margin,
    );
    /* Pan vertical d'entrée : pendant l'arrivée du stage (p < 1/3, mode
       entry), seule sa partie HAUTE est visible ; viser plus bas remonte la
       pièce dans cette zone, donc le sol qui s'illumine est vu dès les
       premiers centimètres de scroll. L'ampleur suit la hauteur monde du
       cadre (tanV × distance : ~36 % du cadre) pour rester juste quel que
       soit le format ; l'offset s'annule à l'épinglage. */
    const entryShift =
      ramp(p, 0, 0.34, 0.85, 0) *
      Math.tan(((framing.fovDeg / 2) * Math.PI) / 180) *
      distance;
    const targetY = framing.targetY - entryShift;
    camera.position.set(
      framing.targetX + Math.sin(azimut) * Math.cos(elevation) * distance,
      targetY + Math.sin(elevation) * distance + gy * 0.4,
      Math.cos(azimut) * Math.cos(elevation) * distance,
    );
    camera.lookAt(framing.targetX, targetY, 0);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 6, 4]} intensity={0.8} color="#dfe8ee" />

      {/* Le scanner (modèle partagé avec l'accueil) émet le balayage. */}
      <group position={[SCANNER_POSITION[0], 0.98, SCANNER_POSITION[2]]} scale={0.75}>
        <ScannerModel accent={palette.base} />
      </group>

      {/* Onde au sol, centrée sur le scanner. */}
      <mesh
        ref={sweepRef}
        position={[SCANNER_POSITION[0], 0.03, SCANNER_POSITION[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.94, 1, 64]} />
        <meshBasicMaterial
          color={palette.base}
          transparent
          opacity={0}
          side={DoubleSide}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Le nuage naît là où l'onde est passée. */}
      <points ref={pointsRef} geometry={pointsGeometry}>
        <shaderMaterial
          vertexShader={POINTS_VERTEX}
          fragmentShader={POINTS_FRAGMENT}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>

      {/* Le jumeau filaire se fige sur les mêmes surfaces. */}
      <lineSegments ref={wireRef} geometry={wireGeometry}>
        <lineBasicMaterial color={palette.tech} transparent opacity={0} />
      </lineSegments>
    </>
  );
}

/**
 * Scène « le scan construit le jumeau » : état réel suggéré (scanner en
 * place) → l'onde balaye, le nuage de points vert laser se densifie → les
 * arêtes filaires se figent. Pilotée par le progress du ScrollStage
 * (contrat HeadsetScene), lazy-montée par LidarScanSceneLazy.
 */
export default function LidarScanScene({
  progress,
  tiltX,
  tiltY,
  palette,
  pointCount,
  dpr = 1.5,
  active = true,
  onReady,
}: LidarScanSceneProps) {
  const [painted, setPainted] = useState(false);
  const handleReady = useCallback(() => {
    setPainted(true);
    onReady();
  }, [onReady]);

  return (
    <div className={styles.root} aria-hidden="true">
      <Canvas
        dpr={[1, dpr]}
        /* Tant que le nuage n'a pas peint, la scène rend même hors écran :
           sinon il n'existe à l'image qu'une fois le stage épinglé. Une fois
           peint, retour à la règle : zéro GPU hors écran. */
        frameloop={active || !painted ? "always" : "never"}
        gl={{
          antialias: dpr >= 1.5,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: true,
        }}
        onCreated={({ gl }) => gl.setClearAlpha(0)}
      >
        <PerspectiveCamera makeDefault position={[0, 5.2, 15]} fov={42} />
        <SceneReady onReady={handleReady} />
        <Rig
          progress={progress}
          tiltX={tiltX}
          tiltY={tiltY}
          palette={palette}
          pointCount={pointCount}
        />
      </Canvas>
    </div>
  );
}
