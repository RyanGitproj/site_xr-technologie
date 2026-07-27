import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { finalCta360 } from "@/products/xr360/config/content";
import styles from "./FinalCta360.module.css";

/** Dernier appel avant le formulaire : la montée en trois lignes. */
export function FinalCta360() {
  return (
    <section className={styles.section}>
      <RevealGroup className={styles.inner}>
        <RevealItem>
          <p className={styles.kicker}>{finalCta360.kicker}</p>
        </RevealItem>
        <RevealItem>
          <h2 className={styles.title}>
            <span>{finalCta360.title}</span>
            {finalCta360.lines.map((line) => (
              <span key={line} className={styles.line}>
                {line}
              </span>
            ))}
          </h2>
        </RevealItem>
        <RevealItem>
          <p className={styles.subtitle}>{finalCta360.subtitle}</p>
        </RevealItem>
        <RevealItem>
          <ShimmerCTA scrollTo={finalCta360.ctaTargetId}>{finalCta360.cta}</ShimmerCTA>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
