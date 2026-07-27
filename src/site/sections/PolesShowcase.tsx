import Link from "next/link";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { GridPulse } from "@/components/fx/GridPulse";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRODUCTS, type ProductId } from "@/config/products";
import { cx } from "@/lib/cx";
import { polesSection, poleShowcase } from "@/site/config/content";
import styles from "./PolesShowcase.module.css";

/** Objet signature de chaque pôle, en CSS pur teinté par --pole-accent
    (langage de formes : orbe VR, anneau 360, réticule LiDAR sur trame). */
function PoleDecor({ id }: { id: ProductId }) {
  if (id === "vr") {
    return (
      <div aria-hidden="true" className={styles.decor}>
        <div className={styles.orbVr} />
        <div className={styles.orbitVr} />
      </div>
    );
  }
  if (id === "xr360") {
    return (
      <div aria-hidden="true" className={styles.decor}>
        <div className={styles.ring360} />
        <div className={styles.ringInner360} />
      </div>
    );
  }
  return (
    <div aria-hidden="true" className={styles.decor}>
      <GridPulse intensity="ambient" patternId="grid-pulse-home-lidar" />
      <div className={styles.reticleLidar} />
    </div>
  );
}

/** Les 3 pôles en bandes éditoriales alternées : fond socle neutre, le pôle
    ne porte que SA couleur (accent, arête du verre, décor), jamais le fond. */
export function PolesShowcase() {
  return (
    <section id={polesSection.id} className={styles.section}>
      <SectionHeading kicker={polesSection.kicker} title={polesSection.title} />
      <div className={styles.bands}>
        {PRODUCTS.map((product) => {
          const showcase = poleShowcase[product.id];
          return (
            <article
              key={product.id}
              className={styles.band}
              data-pole-accent={product.id}
            >
              <RevealGroup className={styles.bandGrid}>
                <RevealItem className={styles.bandContent}>
                  <p className={styles.baseline}>{product.baseline}</p>
                  <h3 className={styles.poleName}>{product.name}</h3>
                  <p className={styles.descriptor}>{product.descriptor}</p>
                  <GlassPanel thin className={styles.panel}>
                    <p className={styles.hook}>{showcase.hook}</p>
                    <p className={styles.body}>{showcase.body}</p>
                    <ul className={styles.points}>
                      {showcase.points.map((point) => (
                        <li key={point} className={styles.point}>
                          {point}
                        </li>
                      ))}
                    </ul>
                    {product.status === "live" && showcase.cta !== null ? (
                      <Link href={product.route} className={styles.cta}>
                        {showcase.cta} →
                      </Link>
                    ) : (
                      <p className={cx(styles.cta, styles.upcoming)}>
                        {polesSection.upcomingLabel}
                      </p>
                    )}
                  </GlassPanel>
                </RevealItem>
                <RevealItem className={styles.bandVisual}>
                  <PoleDecor id={product.id} />
                </RevealItem>
              </RevealGroup>
            </article>
          );
        })}
      </div>
    </section>
  );
}
