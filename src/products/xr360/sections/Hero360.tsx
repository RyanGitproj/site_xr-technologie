import { EnterRise } from "@/components/fx/EnterRise";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { hero360 } from "@/products/xr360/config/content";
import styles from "./Hero360.module.css";

/** Hero 360 : promesse en deux temps (imaginer → visiter), anneau
    panoramique en décor (langage de formes de la charte), chips des
    capacités. Apparition en EnterRise (CSS pur) : le titre peint au
    premier paint, sans attendre l'hydration (LCP 3G). */
export function Hero360() {
  return (
    <section className={styles.hero}>
      <div aria-hidden="true" className={styles.ringField}>
        <div className={styles.ring} />
        <div className={styles.ringInner} />
      </div>
      <div className={styles.inner}>
        <EnterRise>
          <p className={styles.kicker}>{hero360.kicker}</p>
        </EnterRise>
        <EnterRise delay={0.08}>
          <h1 className={styles.title}>
            <span>{hero360.titleLead}</span>
            <span className={styles.titleAccent}>{hero360.titleAccent}</span>
          </h1>
        </EnterRise>
        <EnterRise delay={0.16}>
          <p className={styles.subtitle}>{hero360.subtitle}</p>
        </EnterRise>
        <EnterRise delay={0.24} className={styles.ctaRow}>
          <ShimmerCTA scrollTo={hero360.ctaTargetId}>{hero360.cta}</ShimmerCTA>
          <p className={styles.baseline}>{hero360.baseline}</p>
        </EnterRise>
        <EnterRise delay={0.32}>
          <ul className={styles.chips}>
            {hero360.chips.map((chip) => (
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
