import Image from "next/image";
import { cx } from "@/lib/cx";
import { pipelineLidar } from "@/products/lidar/config/content";
import styles from "./PipelineLidar.module.css";

/** Variante visuelle par étape (placeholder si une image manquait). */
const STAGE_VISUALS = [styles.visualReal, styles.visualCloud, styles.visualTwin] as const;

/** Les 3 étapes du pipeline en cartes images : c'est le REPLI complet de la
    scène scroll (reduced-motion : tout le contenu, zéro canvas), extrait
    verbatim de l'ancienne section. */
export function PipelineStages() {
  return (
    <div className={styles.stages}>
      {pipelineLidar.stages.map((stage, index) => (
        <article key={stage.title} className={styles.stage}>
          <p aria-hidden="true" className={styles.stageNumber}>
            {String(index + 1).padStart(2, "0")}
          </p>
          <div className={cx(styles.visual, stage.image === null && STAGE_VISUALS[index])}>
            {stage.image !== null && (
              <Image
                src={stage.image.src}
                alt={stage.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 380px"
                className={styles.photo}
              />
            )}
          </div>
          <h3 className={styles.stageTitle}>{stage.title}</h3>
          <p className={styles.stageBody}>{stage.body}</p>
        </article>
      ))}
    </div>
  );
}
