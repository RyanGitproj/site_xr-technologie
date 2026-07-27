import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { aboutSection } from "@/site/config/content";
import styles from "./AboutSection.module.css";

/** Qui est XR Technologie : réassurance sobre, sans cards (séparateurs fins). */
export function AboutSection() {
  return (
    <section className={styles.section}>
      <SectionHeading
        kicker={aboutSection.kicker}
        title={aboutSection.title}
        subtitle={aboutSection.body}
      />
      <RevealGroup className={styles.items}>
        {aboutSection.items.map((item) => (
          <RevealItem key={item.title} className={styles.item}>
            <h3 className={styles.itemTitle}>{item.title}</h3>
            <p className={styles.itemBody}>{item.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
