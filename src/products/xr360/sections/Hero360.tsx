import Image from "next/image";
import { EnterRise } from "@/components/fx/EnterRise";
import { ParallaxLayer } from "@/components/fx/ParallaxLayer";
import { ParallaxScene } from "@/components/fx/ParallaxScene";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { hero360 } from "@/products/xr360/config/content";
import styles from "./Hero360.module.css";

/** Hero 360 : promesse en deux temps (imaginer → visiter) posée sur la
    photo de captation (lot D, sujet à droite), anneau panoramique en décor
    par-dessus (langage de formes de la charte), chips des capacités.
    Apparition en EnterRise (CSS pur, LCP 3G intact). Profondeur au scroll :
    la photo traîne (inset), l'anneau devance (flow) ; neutral 0 = état
    initial posé, et les chips (transform d'overlap) restent HORS calques. */
export function Hero360() {
  return (
    <section className={styles.hero}>
      <ParallaxScene
        offset={["start start", "end start"]}
        neutral={0}
        className={styles.decorScene}
      >
        {hero360.image !== null && (
          <ParallaxLayer depth={-0.3} mode="inset" insetRange={6} className={styles.bg}>
            <Image
              src={hero360.image.src}
              alt={hero360.image.alt}
              fill
              priority
              sizes="100vw"
              className={styles.bgImg}
            />
            <div aria-hidden="true" className={styles.veil} />
          </ParallaxLayer>
        )}
        <ParallaxLayer depth={0.14} range={48} touchRange={24} className={styles.ringField}>
          <div aria-hidden="true" className={styles.ring} />
          <div aria-hidden="true" className={styles.ringInner} />
        </ParallaxLayer>
      </ParallaxScene>
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
        <EnterRise delay={0.24} className={styles.ctaRow}>
          <ShimmerCTA scrollTo={hero360.ctaTargetId}>{hero360.cta}</ShimmerCTA>
          <p className={styles.baseline}>{hero360.baseline}</p>
        </EnterRise>
      </div>
      {/* Chips en chevauchement du bord bas du hero (moitié photo, moitié
          section suivante) : plus de désert vertical. */}
      <EnterRise delay={0.32} className={styles.chipsRow}>
        <ul className={styles.chips}>
          {hero360.chips.map((chip) => (
            <li key={chip.label} className={styles.chip}>
              <chip.icon aria-hidden="true" className={styles.chipIcon} />
              {chip.label}
            </li>
          ))}
        </ul>
      </EnterRise>
    </section>
  );
}
