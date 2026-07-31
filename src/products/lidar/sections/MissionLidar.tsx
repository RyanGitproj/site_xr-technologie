import { ChevronDown } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { missionLidar } from "@/products/lidar/config/content";
import styles from "./MissionLidar.module.css";

/** La mission en 5 étapes (timeline technique resserrée) + les engagements
    avant intervention en accordéon natif (disclosure façon Objections /vr)
    + les LIMITES LÉGALES, toujours VISIBLES (jamais en accordéon : c'est
    un engagement, pas un détail), texte fidèle à la brochure. */
export function MissionLidar() {
  return (
    <section id={missionLidar.id} data-below-fold="" className={styles.section}>
      <SectionHeading kicker={missionLidar.kicker} title={missionLidar.title} />
      <RevealGroup className={styles.timeline}>
        {missionLidar.steps.map((step, index) => (
          <RevealItem key={step.title} className={styles.step}>
            <div className={styles.marker}>
              <span className={styles.number}>{index + 1}</span>
            </div>
            <div className={styles.content}>
              <step.icon aria-hidden="true" className={styles.icon} />
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Engagements : le détail contractuel se déplie à la demande. */}
      <div className={styles.engagements}>
        <details className={styles.details}>
          <summary className={styles.summary}>
            {missionLidar.engagementsTitle}
            <ChevronDown aria-hidden="true" className={styles.chevron} />
          </summary>
          <ul className={styles.engagementsList}>
            {missionLidar.engagements.map((engagement) => (
              <li key={engagement.title} className={styles.engagement}>
                <p className={styles.engagementTitle}>{engagement.title}</p>
                <p className={styles.engagementBody}>{engagement.body}</p>
              </li>
            ))}
          </ul>
        </details>
      </div>

      {/* LÉGAL : bloc visible, texte fidèle, ancre du renvoi du CTA final. */}
      <div id={missionLidar.limitsId} className={styles.limits}>
        <h3 className={styles.limitsTitle}>{missionLidar.limitsTitle}</h3>
        <ul className={styles.limitsList}>
          {missionLidar.limits.map((limit) => (
            <li key={limit} className={styles.limit}>
              {limit}
            </li>
          ))}
        </ul>
        <p className={styles.adaptNote}>{missionLidar.adaptNote}</p>
      </div>
    </section>
  );
}
