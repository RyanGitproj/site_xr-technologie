"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Vector3,
  type LineBasicMaterial,
  type Mesh,
  type MeshBasicMaterial,
  type LineSegments,
  type PerspectiveCamera as PerspectiveCameraImpl,
  type Points,
  type ShaderMaterial,
} from "three";
import { clamp01, ramp } from "@/lib/motion/sceneRamp";
import {
  SCANNER_POSITION,
  buildPointCloud,
  buildSolidSurfaces,
  buildWireframe,
  scanBirthRange,
  scanBounds,
  scanFitDistance,
} from "@/lib/lidar/scanModel";
import type { PolePointer } from "./PoleObjectScene";
import ScannerModel from "./ScannerModel";
import styles from "./ScanBandScene.module.css";

/**
 * Bande LiDAR de l'accueil : au lieu de présenter le scanner posé sur son
 * trépied, on montre CE QU'IL PRODUIT. Le bâtiment réel est là, l'onde le
 * balaye depuis le scanner, et derrière le front il ne reste que la donnée :
 * nuage de points puis jumeau filaire. La boucle rend le réel et repart —
 * l'avant/après se lit sans scroll ni interaction.
 *
 * Cousine de la scène /lidar (LidarScanScene, même géométrie via scanModel),
 * mais autonome : horloge interne au lieu du progress du ScrollStage, et
 * surfaces pleines (le « avant ») que /lidar n'a pas.
 */

/** Repères de lecture du cycle. Décoratif (aria-hidden) : le discours
    éditorial vit dans le texte de la bande, pas ici. */
const STEPS = ["Le réel", "Balayage LiDAR", "Nuage de points", "Jumeau numérique"] as const;

/** Durée d'un aller-retour réel → jumeau → réel (s). */
const CYCLE = 12;

const BOUNDS = scanBounds();
const TARGET: [number, number, number] = [
  (BOUNDS.min[0] + BOUNDS.max[0]) / 2,
  1.15,
  (BOUNDS.min[2] + BOUNDS.max[2]) / 2,
];

const FOV = 40;
const ELEVATION = 0.42;
const AZIMUT_BASE = 0.22;
const AZIMUT_AMPLITUDE = 0.5;

const SURFACE = "#767d87";
const SURFACE_DEEP = "#2f343b";

const POINTS_VERTEX = /* glsl */ `
  uniform float uWave;
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
    gl_PointSize = clamp(uSize * uPixelRatio * (10.0 / -mv.z), 1.0, 5.0);
    /* Né quand le front radial a dépassé le seuil du point. */
    vAlpha = smoothstep(aBirth - 0.05, aBirth, uWave);
    vHot = (1.0 - smoothstep(0.0, 0.09, uWave - aBirth)) * vAlpha;
    vShade = aShade;
  }
`;

const POINTS_FRAGMENT = /* glsl */ `
  uniform vec3 uColorBase;
  uniform vec3 uColorHot;
  uniform float uFade;
  varying float vAlpha;
  varying float vHot;
  varying float vShade;

  void main() {
    float m = smoothstep(0.5, 0.3, length(gl_PointCoord - 0.5));
    float a = vAlpha * uFade;
    if (m < 0.01 || a < 0.01) discard;
    vec3 color = mix(uColorBase * (0.75 + 0.35 * vShade), uColorHot, vHot);
    gl_FragColor = vec4(color, a * m * (0.5 + 0.5 * vHot));
  }
`;

const SOLID_VERTEX = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vNormal;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

/**
 * Le « avant » : matière neutre, effacée là où le front radial est déjà
 * passé — même naissance (distance au scanner normalisée par scanBirthRange)
 * que le nuage, donc la matière s'efface EXACTEMENT là où les points
 * naissent. uReturn ramène le réel entier pour reboucler.
 */
const SOLID_FRAGMENT = /* glsl */ `
  uniform vec3 uScanner;
  uniform float uMinD;
  uniform float uSpan;
  uniform float uWave;
  uniform float uReturn;
  uniform vec3 uSurface;
  uniform vec3 uSurfaceDeep;
  uniform vec3 uAccent;
  varying vec3 vWorld;
  varying vec3 vNormal;

  const vec3 LIGHT = vec3(0.44, 0.78, 0.44);

  void main() {
    float birth = clamp((distance(vWorld, uScanner) - uMinD) / uSpan, 0.0, 1.0);
    float ahead = smoothstep(uWave - 0.015, uWave + 0.02, birth);
    float alpha = max(ahead, uReturn);
    if (alpha < 0.02) discard;

    float lambert = 0.42 + 0.58 * abs(dot(normalize(vNormal), LIGHT));
    vec3 color = mix(uSurfaceDeep, uSurface, lambert);

    /* Trame de 1 m au sol : on lit un relevé, pas un décor. */
    if (abs(normalize(vNormal).y) > 0.9) {
      vec2 g = abs(fract(vWorld.xz) - 0.5);
      float line = 1.0 - smoothstep(0.44, 0.5, max(g.x, g.y));
      color = mix(color * 0.82, color, line);
    }

    /* Liseré chaud sur le front : on voit la matière se faire manger. */
    float edge = smoothstep(0.055, 0.0, abs(birth - uWave)) * (1.0 - uReturn);
    color = mix(color, uAccent, edge * 0.85);

    gl_FragColor = vec4(color, min(1.0, alpha + edge));
  }
`;

type RigProps = {
  accent: string;
  pointerRef: React.RefObject<PolePointer>;
  pointCount: number;
  captionRef: React.RefObject<HTMLParagraphElement | null>;
  barRef: React.RefObject<HTMLSpanElement | null>;
};

function Rig({ accent, pointerRef, pointCount, captionRef, barRef }: RigProps) {
  const pointsRef = useRef<Points>(null);
  const solidRef = useRef<Mesh>(null);
  const wireRef = useRef<LineSegments>(null);
  const sweepRef = useRef<Mesh>(null);
  const clock = useRef(0);
  const lean = useRef({ x: 0, y: 0 });
  const step = useRef(-1);

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

  const solidGeometry = useMemo(() => {
    const solid = buildSolidSurfaces();
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(solid.positions, 3));
    geometry.setAttribute("normal", new BufferAttribute(solid.normals, 3));
    return geometry;
  }, []);

  useEffect(
    () => () => {
      pointsGeometry.dispose();
      wireGeometry.dispose();
      solidGeometry.dispose();
    },
    [pointsGeometry, wireGeometry, solidGeometry],
  );

  const pointsUniforms = useMemo(
    () => ({
      uWave: { value: 0 },
      uFade: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: 2 },
      uColorBase: { value: new Color(accent) },
      uColorHot: { value: new Color(accent).lerp(new Color("#ffffff"), 0.55) },
    }),
    [accent],
  );

  const solidUniforms = useMemo(() => {
    const { minD, span } = scanBirthRange();
    return {
      uScanner: { value: new Vector3(...SCANNER_POSITION) },
      uMinD: { value: minD },
      uSpan: { value: span },
      uWave: { value: 0 },
      uReturn: { value: 0 },
      uSurface: { value: new Color(SURFACE) },
      uSurfaceDeep: { value: new Color(SURFACE_DEEP) },
      uAccent: { value: new Color(accent) },
    };
  }, [accent]);

  useFrame((state, delta) => {
    /* Horloge interne (le frameloop est coupé hors écran : on repart où on
       s'était arrêté, sans saut). */
    clock.current = (clock.current + Math.min(delta, 0.1)) % CYCLE;
    const c = clock.current / CYCLE;

    /* Front radial : le réel s'efface, le nuage naît. Puis retour au réel
       (uReturn) pendant que la donnée s'estompe → boucle sans couture. */
    /* Départ sous -0.05 (l'épaisseur du front côté points) : au rebouclage,
       AUCUN point ne subsiste devant le réel revenu. */
    const wave = ramp(c, 0.1, 0.62, -0.08, 1.05);
    const back = ramp(c, 0.88, 1, 0, 1);
    const dataFade = 1 - ramp(c, 0.86, 0.99, 0, 1);

    const pointsMaterial = pointsRef.current?.material as ShaderMaterial | undefined;
    if (pointsMaterial) {
      pointsMaterial.uniforms.uWave.value = wave;
      pointsMaterial.uniforms.uFade.value = dataFade;
      pointsMaterial.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    }
    const solidMaterial = solidRef.current?.material as ShaderMaterial | undefined;
    if (solidMaterial) {
      solidMaterial.uniforms.uWave.value = wave;
      solidMaterial.uniforms.uReturn.value = back;
    }
    const wire = wireRef.current;
    if (wire) {
      (wire.material as LineBasicMaterial).opacity =
        ramp(c, 0.64, 0.8, 0, 0.85) * dataFade;
    }
    /* L'onde au sol s'éteint AVANT de sortir de la pièce : au-delà, son arc
       traversait le cadre dans le vide. */
    const sweep = sweepRef.current;
    if (sweep) {
      sweep.scale.setScalar(ramp(c, 0.1, 0.62, 0.4, 10));
      (sweep.material as MeshBasicMaterial).opacity =
        0.45 * ramp(c, 0.07, 0.13, 0, 1) * (1 - ramp(c, 0.4, 0.58, 0, 1));
    }

    /* Orbite : une sinusoïde par cycle, donc la caméra revient à son point
       de départ en même temps que la matière. Le pointeur ne fait
       qu'incliner (fine only : le wrapper n'écrit rien au tactile). */
    const p = pointerRef.current;
    const follow = 1 - Math.exp(-5 * Math.min(delta, 0.1));
    lean.current.x += ((p?.x ?? 0) - lean.current.x) * follow;
    lean.current.y += ((p?.y ?? 0) - lean.current.y) * follow;

    const azimut =
      AZIMUT_BASE + AZIMUT_AMPLITUDE * Math.sin(2 * Math.PI * c) + lean.current.x * 0.22;
    const elevation = ELEVATION + 0.05 * Math.sin(2 * Math.PI * c) - lean.current.y * 0.12;
    /* Marge de cadrage : de l'air quand la bande est large (desktop), un
       cadrage serré — les coins du sol débordent à peine — quand elle est
       presque carrée (mobile), sinon la pièce flotte au milieu du vide. */
    const aspect = state.size.width / Math.max(1, state.size.height);
    const margin = 0.94 + 0.2 * clamp01((aspect - 1.1) / 0.8);
    const distance = scanFitDistance(azimut, elevation, FOV, aspect, TARGET, margin);

    const camera = state.camera as PerspectiveCameraImpl;
    camera.position.set(
      TARGET[0] + Math.sin(azimut) * Math.cos(elevation) * distance,
      TARGET[1] + Math.sin(elevation) * distance,
      TARGET[2] + Math.cos(azimut) * Math.cos(elevation) * distance,
    );
    camera.lookAt(TARGET[0], TARGET[1], TARGET[2]);

    /* HUD : écrit dans le DOM depuis la frame (zéro re-render React). */
    const bar = barRef.current;
    if (bar) bar.style.transform = `scaleX(${clamp01(c)})`;
    const index = c < 0.1 ? 0 : c < 0.62 ? 1 : c < 0.8 ? 2 : 3;
    if (index !== step.current) {
      step.current = index;
      const caption = captionRef.current;
      if (caption) {
        caption.textContent = STEPS[index];
        caption.dataset.step = String(index);
      }
    }
  });

  return (
    <>
      <group position={[SCANNER_POSITION[0], 0.98, SCANNER_POSITION[2]]} scale={0.7}>
        <ScannerModel accent={accent} />
      </group>

      {/* Le bâtiment réel : effacé par le front, rendu à la boucle. */}
      <mesh ref={solidRef} geometry={solidGeometry} renderOrder={0}>
        <shaderMaterial
          vertexShader={SOLID_VERTEX}
          fragmentShader={SOLID_FRAGMENT}
          uniforms={solidUniforms}
          transparent
          side={DoubleSide}
        />
      </mesh>

      {/* Onde au sol, centrée sur le scanner. */}
      <mesh
        ref={sweepRef}
        position={[SCANNER_POSITION[0], 0.04, SCANNER_POSITION[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={1}
      >
        <ringGeometry args={[0.94, 1, 64]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0}
          side={DoubleSide}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* La donnée : nuage puis jumeau filaire. */}
      <points ref={pointsRef} geometry={pointsGeometry} renderOrder={2}>
        <shaderMaterial
          vertexShader={POINTS_VERTEX}
          fragmentShader={POINTS_FRAGMENT}
          uniforms={pointsUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
      <lineSegments ref={wireRef} geometry={wireGeometry} renderOrder={3}>
        <lineBasicMaterial color={accent} transparent opacity={0} depthWrite={false} />
      </lineSegments>
    </>
  );
}

type ScanBandSceneProps = {
  accent: string;
  pointerRef: React.RefObject<PolePointer>;
  dpr?: number;
  active?: boolean;
};

export default function ScanBandScene({
  accent,
  pointerRef,
  dpr = 1.5,
  active = true,
}: ScanBandSceneProps) {
  const captionRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  return (
    <div className={styles.root} aria-hidden="true">
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
        <PerspectiveCamera makeDefault fov={FOV} near={0.5} far={120} position={[0, 6, 20]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 7, 5]} intensity={0.9} color="#dfe8ee" />
        <Rig
          accent={accent}
          pointerRef={pointerRef}
          pointCount={dpr >= 1.5 ? 13000 : 8000}
          captionRef={captionRef}
          barRef={barRef}
        />
      </Canvas>

      {/* Repères de lecture du cycle : étape courante + avancement. */}
      <div className={styles.hud}>
        <p ref={captionRef} className={styles.caption} data-step="0">
          {STEPS[0]}
        </p>
        <span className={styles.track}>
          <span ref={barRef} className={styles.bar} />
        </span>
      </div>
    </div>
  );
}
