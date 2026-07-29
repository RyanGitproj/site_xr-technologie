import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { applicationsLidar, audienceLidar } from "@/products/lidar/config/content";
import styles from "./ApplicationsLidar.module.css";

/** Usages : la définition (kicker, titre, intro) + les 7 applications
    (tuiles techniques) + « à qui » en chips scannables. Absorbe l'ancienne
    section définition, dont les 6 usages étaient des doublons 1:1. */
export function ApplicationsLidar() {
  return (
    <section id={applicationsLidar.id} className={styles.section}>
      <SectionHeading
        kicker={applicationsLidar.kicker}
        title={applicationsLidar.title}
        subtitle={applicationsLidar.subtitle}
      />
      <RevealGroup className={styles.grid}>
        {applicationsLidar.items.map((item) => (
          <RevealItem key={item.title} className={styles.tile}>
            <item.icon aria-hidden="true" className={styles.tileIcon} />
            <h3 className={styles.tileTitle}>{item.title}</h3>
            <p className={styles.tileBody}>{item.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>
      <div className={styles.audience}>
        <p className={styles.audienceLabel}>{audienceLidar.title}</p>
        {audienceLidar.items.map((item) => (
          <span key={item} className={styles.audienceChip}>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
