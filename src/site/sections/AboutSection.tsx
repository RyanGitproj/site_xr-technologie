import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { aboutSection } from "@/site/config/content";
import styles from "./AboutSection.module.css";

/** Qui est XR Technologie : réassurance sobre, sans cards (séparateurs
    fins), portée par la photo équipe + matériel (lot C). */
export function AboutSection() {
  return (
    <section className={styles.section}>
      <SectionHeading
        kicker={aboutSection.kicker}
        title={aboutSection.title}
        subtitle={aboutSection.body}
      />
      {aboutSection.image !== null && (
        <Reveal className={styles.visual}>
          <Image
            src={aboutSection.image.src}
            alt={aboutSection.image.alt}
            width={aboutSection.image.width}
            height={aboutSection.image.height}
            sizes="(max-width: 1024px) 100vw, 1024px"
            className={styles.visualImg}
          />
        </Reveal>
      )}
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
