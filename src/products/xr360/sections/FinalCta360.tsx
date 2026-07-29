import Image from "next/image";
import { ParallaxLayer } from "@/components/fx/ParallaxLayer";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { finalCta360 } from "@/products/xr360/config/content";
import styles from "./FinalCta360.module.css";

/** Dernier appel avant le formulaire : la montée en trois lignes, sur une
    ambiance chambre de lodge fortement voilée (lot D). */
export function FinalCta360() {
  return (
    <section className={styles.section}>
      {finalCta360.image !== null && (
        <ParallaxLayer depth={-0.3} mode="inset" insetRange={6} className={styles.bg}>
          <Image
            src={finalCta360.image.src}
            alt=""
            fill
            sizes="100vw"
            className={styles.bgImg}
          />
          <div aria-hidden="true" className={styles.bgVeil} />
        </ParallaxLayer>
      )}
      <RevealGroup className={styles.inner}>
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
