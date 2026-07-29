import Image from "next/image";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRODUCT_BY_ID } from "@/config/products";
import { sectorsSection } from "@/site/config/content";
import styles from "./SectorsSection.module.css";

/** Secteurs à forte valeur (Funnel V2) : le lecteur se reconnaît dans une
    carte, les chips l'emmènent vers les pôles pertinents. Un secteur sert
    souvent plusieurs pôles : la carte n'impose pas un choix, elle oriente.
    Fil rouge de réassurance : chaque mission commence par un diagnostic. */
export function SectorsSection() {
  return (
    <section id={sectorsSection.id} className={styles.section}>
      <SectionHeading kicker={sectorsSection.kicker} title={sectorsSection.title} />
      <RevealGroup className={styles.grid}>
        {sectorsSection.items.map((sector) => (
          <RevealItem key={sector.label}>
            <article className={styles.card} data-pole-accent={sector.accent}>
              {sector.image !== null && (
                <Image
                  src={sector.image.src}
                  alt={sector.image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  className={styles.photo}
                />
              )}
              <p className={styles.label}>{sector.label}</p>
              <div className={styles.chips}>
                {sector.poles.map((poleId) => (
                  <Link
                    key={poleId}
                    href={PRODUCT_BY_ID[poleId].route}
                    className={styles.chip}
                    data-pole-accent={poleId}
                  >
                    {sectorsSection.poleChipLabels[poleId]}
                  </Link>
                ))}
              </div>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
      <div className={styles.diagnostic}>
        <p className={styles.diagnosticText}>{sectorsSection.diagnosticNote}</p>
        <OutlineButton scrollTo={sectorsSection.ctaTargetId}>{sectorsSection.cta}</OutlineButton>
      </div>
    </section>
  );
}
