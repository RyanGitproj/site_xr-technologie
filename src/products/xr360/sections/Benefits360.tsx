import { GlassPanel } from "@/components/fx/GlassPanel";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { benefits360 } from "@/products/xr360/config/content";
import styles from "./Benefits360.module.css";

/** Les 4 bénéfices : cards verre aérées, 2 colonnes. */
export function Benefits360() {
  return (
    <section id={benefits360.id} className={styles.section}>
      <SectionHeading kicker={benefits360.kicker} title={benefits360.title} />
      <RevealGroup className={styles.grid}>
        {benefits360.items.map((item) => (
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
