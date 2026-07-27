import { GlassPanel } from "@/components/fx/GlassPanel";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { benefitsLidar } from "@/products/lidar/config/content";
import styles from "./BenefitsLidar.module.css";

/** Les 4 bénéfices : Mesurer, Comprendre, Documenter, Coordonner. */
export function BenefitsLidar() {
  return (
    <section id={benefitsLidar.id} className={styles.section}>
      <SectionHeading kicker={benefitsLidar.kicker} title={benefitsLidar.title} />
      <RevealGroup className={styles.grid}>
        {benefitsLidar.items.map((item) => (
          <RevealItem key={item.title}>
            <GlassPanel thin className={styles.card}>
              <item.icon aria-hidden="true" className={styles.icon} />
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardBody}>{item.body}</p>
            </GlassPanel>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
