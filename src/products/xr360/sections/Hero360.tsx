import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { hero360 } from "@/products/xr360/config/content";
import styles from "./Hero360.module.css";

/** Hero 360 : promesse en deux temps (imaginer → visiter), anneau
    panoramique en décor (langage de formes de la charte), chips des
    capacités. Aéré : la respiration fait partie de l'identité du pôle. */
export function Hero360() {
  return (
    <section className={styles.hero}>
      <div aria-hidden="true" className={styles.ringField}>
        <div className={styles.ring} />
        <div className={styles.ringInner} />
      </div>
      <RevealGroup className={styles.inner}>
        <RevealItem>
          <p className={styles.kicker}>{hero360.kicker}</p>
        </RevealItem>
        <RevealItem>
          <h1 className={styles.title}>
            <span>{hero360.titleLead}</span>
            <span className={styles.titleAccent}>{hero360.titleAccent}</span>
          </h1>
        </RevealItem>
        <RevealItem>
          <p className={styles.subtitle}>{hero360.subtitle}</p>
        </RevealItem>
        <RevealItem className={styles.ctaRow}>
          <ShimmerCTA scrollTo={hero360.ctaTargetId}>{hero360.cta}</ShimmerCTA>
          <p className={styles.baseline}>{hero360.baseline}</p>
        </RevealItem>
        <RevealItem>
          <ul className={styles.chips}>
            {hero360.chips.map((chip) => (
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
