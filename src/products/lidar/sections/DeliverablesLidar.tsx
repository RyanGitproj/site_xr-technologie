import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { deliverablesLidar } from "@/products/lidar/config/content";
import styles from "./DeliverablesLidar.module.css";

/** Les 11 livrables envisageables : grille technique dense mais lisible. */
export function DeliverablesLidar() {
  return (
    <section id={deliverablesLidar.id} className={styles.section}>
      <SectionHeading
        kicker={deliverablesLidar.kicker}
        title={deliverablesLidar.title}
        subtitle={deliverablesLidar.subtitle}
      />
      <RevealGroup className={styles.grid}>
        {deliverablesLidar.items.map((item) => (
          <RevealItem key={item.title} className={styles.tile}>
            <h3 className={styles.tileTitle}>{item.title}</h3>
            <p className={styles.tileBody}>{item.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
