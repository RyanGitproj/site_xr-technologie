"use client";

import { LidarScanSceneLazy } from "@/components/fx/LidarScanSceneLazy";
import { ScenePreloader } from "@/components/fx/ScenePreloader";
import { ScrollStage, useScrollStage } from "@/components/fx/ScrollStage";
import { StageLayer } from "@/components/fx/StageLayer";
import { pipelineLidar } from "@/products/lidar/config/content";
import { PipelineStages } from "./PipelineStages";
import styles from "./PipelineScanStage.module.css";

/** Fenêtres d'apparition des 3 phases (fractions du stage épinglé) :
    synchronisées avec les rampes de la scène (onde 0.12→0.55, filaire
    0.60→0.78). La phase 3 reste affichée jusqu'à la fin. */
const PHASES = [
  { at: [0.06, 0.14, 0.3, 0.38], y: [24, 0, 0, -18], opacity: [0, 1, 1, 0] },
  { at: [0.36, 0.44, 0.56, 0.64], y: [24, 0, 0, -18], opacity: [0, 1, 1, 0] },
  { at: [0.62, 0.72, 1], y: [24, 0, 0], opacity: [0, 1, 1] },
] as const;

/** Le nuage de points se télécharge pendant la lecture des sections du
    dessus : la scène est prête quand le stage s'épingle. */
const SCAN_SCENES = ["lidar-scan"] as const;

function StageContent() {
  const stage = useScrollStage();
  if (stage === null) return null;

  return (
    <>
      <div className={styles.canvas}>
        <LidarScanSceneLazy
          progress={stage.progress}
          tiltX={stage.tiltX}
          tiltY={stage.tiltY}
          fallback={pipelineLidar.stages[1]?.image ?? null}
        />
      </div>

      {/* Affordance d'entrée : on comprend que le scroll pilote le scan. */}
      <StageLayer at={[0, 0.08, 0.16]} y={[0, 0, -24]} opacity={[1, 1, 0]} className={styles.hint}>
        <p className={styles.hintText}>{pipelineLidar.stageHint}</p>
      </StageLayer>

      {/* Les 3 phases du pipeline, calées sur la scène. */}
      {pipelineLidar.stages.map((phase, index) => (
        <StageLayer
          key={phase.title}
          at={PHASES[index].at}
          y={PHASES[index].y}
          opacity={PHASES[index].opacity}
          decorative={false}
          className={styles.phase}
        >
          <p aria-hidden="true" className={styles.phaseNumber}>
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className={styles.phaseTitle}>{phase.title}</h3>
          <p className={styles.phaseBody}>{phase.body}</p>
        </StageLayer>
      ))}

      {/* HUD : équerres de visée AUX COINS, gyro léger. AUCUNE valeur
          chiffrée (règle charte : pas de promesse de précision). */}
      <StageLayer at={[0.12, 0.2, 1]} opacity={[0, 1, 1]} tiltRange={8} className={styles.hud}>
        <span className={styles.corner} data-corner="tl" />
        <span className={styles.corner} data-corner="tr" />
        <span className={styles.corner} data-corner="bl" />
        <span className={styles.corner} data-corner="br" />
      </StageLayer>

      {/* Mention fidèle, STATIQUE (jamais animée). */}
      <span className={styles.mention}>{pipelineLidar.mentions[1]}</span>
    </>
  );
}

/** Scrollytelling « le scan construit le jumeau » : 3 écrans épinglés, la
    scène 3D est pilotée par la progression ; reduced-motion = les 3 cartes
    images à plat (contenu complet, zéro canvas monté). Pas de
    backdrop-filter dans le stage (contain: paint). */
export function PipelineScanStage() {
  return (
    <>
      <ScenePreloader scenes={SCAN_SCENES} />
      <ScrollStage screens={3} fallback={<PipelineStages />} className={styles.wrapper}>
        <StageContent />
      </ScrollStage>
    </>
  );
}
