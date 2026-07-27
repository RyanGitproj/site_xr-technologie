import { Check } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { missionLidar } from "@/products/lidar/config/content";
import styles from "./MissionLidar.module.css";

/** La mission en 5 étapes (timeline technique) + ce que la captation
    améliore concrètement. */
export function MissionLidar() {
  return (
    <section id={missionLidar.id} className={styles.section}>
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
      <RevealGroup className={styles.improvements}>
        <RevealItem>
          <h3 className={styles.improvementsTitle}>{missionLidar.improvementsTitle}</h3>
        </RevealItem>
        <RevealItem>
          <ul className={styles.improvementsList}>
            {missionLidar.improvements.map((item) => (
              <li key={item} className={styles.improvement}>
                <Check aria-hidden="true" className={styles.checkIcon} />
                {item}
              </li>
            ))}
          </ul>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
