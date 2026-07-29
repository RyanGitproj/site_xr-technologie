import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx } from "@/lib/cx";
import { pipelineLidar } from "@/products/lidar/config/content";
import { PipelineScanStage } from "./PipelineScanStage";
import styles from "./PipelineLidar.module.css";

/** Pipeline « du réel au jumeau numérique » : la scène scroll FAIT VIVRE
    les 3 étapes (le scan construit le jumeau sous les yeux du lecteur ;
    repli reduced-motion = les 3 cartes images à plat), puis le flux de
    données 01-05 (ex-section fusionnée : la sortie concrète du jumeau),
    la comparaison d'avancement et les mentions fidèles. */
export function PipelineLidar() {
  return (
    <section id={pipelineLidar.id} className={styles.section}>
      <SectionHeading kicker={pipelineLidar.kicker} title={pipelineLidar.title} />

      <PipelineScanStage />

      {/* Flux de données : du terrain à vos logiciels, en 5 repères. */}
      <RevealGroup className={styles.flow}>
        <RevealItem>
          <h3 className={styles.flowTitle}>{pipelineLidar.flow.title}</h3>
        </RevealItem>
        <RevealItem className={styles.flowSteps}>
          {pipelineLidar.flow.steps.map((step, index) => (
            <div key={step.title} className={styles.flowStep}>
              <span aria-hidden="true" className={styles.flowNumber}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className={styles.flowStepTitle}>{step.title}</p>
              {step.note !== undefined && <p className={styles.flowNote}>{step.note}</p>}
            </div>
          ))}
        </RevealItem>
      </RevealGroup>

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
                style={{ "--progress": [0.25, 0.6, 1][index] } as React.CSSProperties}
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
