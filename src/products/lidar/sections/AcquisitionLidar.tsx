import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { acquisitionLidar } from "@/products/lidar/config/content";
import styles from "./AcquisitionLidar.module.css";

/** Les trois modes d'acquisition, matériel nommé (arbitrage 28/07) ; la
    mention drone « selon mission et autorisations » est reprise fidèlement. */
export function AcquisitionLidar() {
  return (
    <section id={acquisitionLidar.id} className={styles.section}>
      <SectionHeading
        kicker={acquisitionLidar.kicker}
        title={acquisitionLidar.title}
        subtitle={acquisitionLidar.subtitle}
      />
      <RevealGroup className={styles.grid}>
        {acquisitionLidar.modes.map((mode) => (
          <RevealItem key={mode.title} className={styles.cell}>
            <article className={styles.mode}>
              <mode.icon aria-hidden="true" className={styles.icon} />
              <h3 className={styles.modeTitle}>{mode.title}</h3>
              <p className={styles.hardware}>{mode.hardware}</p>
              {mode.note !== null && <p className={styles.note}>{mode.note}</p>}
              <p className={styles.body}>{mode.body}</p>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
