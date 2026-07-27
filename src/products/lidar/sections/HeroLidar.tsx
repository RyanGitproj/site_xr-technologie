import { GridPulse } from "@/components/fx/GridPulse";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { heroLidar } from "@/products/lidar/config/content";
import styles from "./HeroLidar.module.css";

/** Hero LiDAR : le problème (l'approximation) puis la réponse (la donnée),
    sur trame technique + réticule de visée : le langage de la charte. */
export function HeroLidar() {
  return (
    <section className={styles.hero}>
      <div aria-hidden="true" className={styles.decor}>
        <GridPulse intensity="ambient" patternId="grid-pulse-lidar-hero" />
        <div className={styles.reticle} />
      </div>
      <RevealGroup className={styles.inner}>
        <RevealItem>
          <p className={styles.kicker}>{heroLidar.kicker}</p>
        </RevealItem>
        <RevealItem>
          <h1 className={styles.title}>
            <span>{heroLidar.titleLead}</span>
            <span className={styles.titleAccent}>{heroLidar.titleAccent}</span>
          </h1>
        </RevealItem>
        <RevealItem>
          <p className={styles.subtitle}>{heroLidar.subtitle}</p>
        </RevealItem>
        <RevealItem className={styles.ctaRow}>
          <ShimmerCTA scrollTo={heroLidar.ctaTargetId}>{heroLidar.cta}</ShimmerCTA>
          <p className={styles.baseline}>{heroLidar.baseline}</p>
        </RevealItem>
        <RevealItem>
          <ul className={styles.chips}>
            {heroLidar.chips.map((chip) => (
              <li key={chip.label} className={styles.chip}>
                <chip.icon aria-hidden="true" className={styles.chipIcon} />
                {chip.label}
              </li>
            ))}
          </ul>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
