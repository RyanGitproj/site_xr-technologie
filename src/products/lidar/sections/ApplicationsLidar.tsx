import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { applicationsLidar } from "@/products/lidar/config/content";
import styles from "./ApplicationsLidar.module.css";

/** Les 7 applications : tuiles techniques aux angles nets. */
export function ApplicationsLidar() {
  return (
    <section id={applicationsLidar.id} className={styles.section}>
      <SectionHeading kicker={applicationsLidar.kicker} title={applicationsLidar.title} />
      <RevealGroup className={styles.grid}>
        {applicationsLidar.items.map((item) => (
          <RevealItem key={item.title} className={styles.tile}>
            <item.icon aria-hidden="true" className={styles.tileIcon} />
            <h3 className={styles.tileTitle}>{item.title}</h3>
            <p className={styles.tileBody}>{item.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
