import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx } from "@/lib/cx";
import { pipelineLidar } from "@/products/lidar/config/content";
import styles from "./PipelineLidar.module.css";

/** Variante visuelle par étape du pipeline (placeholder tant que le lot F
    n'est pas livré) : réel → nuage de points → jumeau filaire. */
const STAGE_VISUALS = [styles.visualReal, styles.visualCloud, styles.visualTwin] as const;

/** Taux de remplissage des 3 états d'avancement (même cadrage, seule la
    jauge change : l'avancement se lit d'un coup d'œil). */
const PROGRESS_LEVELS = [0.25, 0.6, 1] as const;

/** Pipeline « du réel au jumeau numérique » + comparaison d'avancement.
    Les visuels réels (lot F Codex ou captures studio) se branchent par la
    config ; les mentions du PDF sont reprises fidèlement. */
export function PipelineLidar() {
  return (
    <section id={pipelineLidar.id} className={styles.section}>
      <SectionHeading kicker={pipelineLidar.kicker} title={pipelineLidar.title} />
      <RevealGroup className={styles.stages}>
        {pipelineLidar.stages.map((stage, index) => (
          <RevealItem key={stage.title} className={styles.cell}>
            <article className={styles.stage}>
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
          </RevealItem>
        ))}
      </RevealGroup>
      <div className={styles.actions}>
        {pipelineLidar.actions.map((action) => (
          <span key={action} className={styles.action}>
            {action}
          </span>
        ))}
      </div>
      <RevealGroup className={styles.progress}>
        <RevealItem>
          <h3 className={styles.progressTitle}>{pipelineLidar.progressTitle}</h3>
          <p className={styles.progressBody}>{pipelineLidar.progressBody}</p>
        </RevealItem>
        <RevealItem className={styles.states}>
          {pipelineLidar.progressStates.map((state, index) => (
            <div key={state.label} className={styles.state}>
              <div
                className={cx(styles.stateVisual, state.image !== null && styles.statePhoto)}
                style={{ "--progress": PROGRESS_LEVELS[index] } as React.CSSProperties}
              >
                {state.image !== null && (
                  <Image
                    src={state.image.src}
                    alt={state.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className={styles.photo}
                  />
                )}
              </div>
              <p className={styles.stateLabel}>{state.label}</p>
            </div>
          ))}
        </RevealItem>
        <RevealItem className={styles.mentions}>
          {pipelineLidar.mentions.map((mention) => (
            <p key={mention} className={styles.mention}>
              {mention}
            </p>
          ))}
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
