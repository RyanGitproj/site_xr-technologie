import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { finalCtaLidar } from "@/products/lidar/config/content";
import styles from "./FinalCtaLidar.module.css";

/** Dernier appel avant le brief, avec la mention essentielle (légale). */
export function FinalCtaLidar() {
  return (
    <section className={styles.section}>
      <RevealGroup className={styles.inner}>
        <RevealItem>
          <p className={styles.kicker}>{finalCtaLidar.kicker}</p>
        </RevealItem>
        <RevealItem>
          <h2 className={styles.title}>{finalCtaLidar.title}</h2>
        </RevealItem>
        <RevealItem>
          <p className={styles.subtitle}>{finalCtaLidar.subtitle}</p>
        </RevealItem>
        <RevealItem>
          <ShimmerCTA scrollTo={finalCtaLidar.ctaTargetId}>{finalCtaLidar.cta}</ShimmerCTA>
        </RevealItem>
        <RevealItem>
          <p className={styles.mention}>{finalCtaLidar.mention}</p>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
