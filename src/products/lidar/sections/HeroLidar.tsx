import { EnterRise } from "@/components/fx/EnterRise";
import { GridPulse } from "@/components/fx/GridPulse";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { heroLidar } from "@/products/lidar/config/content";
import styles from "./HeroLidar.module.css";

/** Hero LiDAR : le problème (l'approximation) puis la réponse (la donnée),
    sur trame technique + réticule de visée : le langage de la charte.
    Apparition en EnterRise (CSS pur) : le titre peint au premier paint,
    sans attendre l'hydration (LCP 3G). */
export function HeroLidar() {
  return (
    <section className={styles.hero}>
      <div aria-hidden="true" className={styles.decor}>
        <GridPulse intensity="ambient" patternId="grid-pulse-lidar-hero" />
        <div className={styles.reticle} />
      </div>
      <div className={styles.inner}>
        <EnterRise>
          <p className={styles.kicker}>{heroLidar.kicker}</p>
        </EnterRise>
        <EnterRise delay={0.08}>
          <h1 className={styles.title}>
            <span>{heroLidar.titleLead}</span>
            <span className={styles.titleAccent}>{heroLidar.titleAccent}</span>
          </h1>
        </EnterRise>
        <EnterRise delay={0.16}>
          <p className={styles.subtitle}>{heroLidar.subtitle}</p>
        </EnterRise>
        <EnterRise delay={0.24} className={styles.ctaRow}>
          <ShimmerCTA scrollTo={heroLidar.ctaTargetId}>{heroLidar.cta}</ShimmerCTA>
          <p className={styles.baseline}>{heroLidar.baseline}</p>
        </EnterRise>
        <EnterRise delay={0.32}>
          <ul className={styles.chips}>
            {heroLidar.chips.map((chip) => (
              <li key={chip.label} className={styles.chip}>
                <chip.icon aria-hidden="true" className={styles.chipIcon} />
                {chip.label}
              </li>
            ))}
          </ul>
        </EnterRise>
      </div>
    </section>
  );
}
