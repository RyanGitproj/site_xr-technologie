import Image from "next/image";
import { EnterRise } from "@/components/fx/EnterRise";
import { GridPulse } from "@/components/fx/GridPulse";
import { ParallaxLayer } from "@/components/fx/ParallaxLayer";
import { ParallaxScene } from "@/components/fx/ParallaxScene";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { heroLidar } from "@/products/lidar/config/content";
import styles from "./HeroLidar.module.css";

/** Hero LiDAR : le problème (l'approximation) puis la réponse (la donnée),
    posés sur la photo du scan en cours (lot F), trame technique +
    réticule de visée par-dessus : le langage de la charte. Apparition en
    EnterRise (CSS pur, LCP intact). Profondeur au scroll : la photo traîne
    (inset), la trame/réticule devance (flow) ; chips d'overlap HORS
    calques. */
export function HeroLidar() {
  return (
    <section className={styles.hero}>
      <ParallaxScene
        offset={["start start", "end start"]}
        neutral={0}
        className={styles.decorScene}
      >
        {heroLidar.image !== null && (
          <ParallaxLayer depth={-0.3} mode="inset" insetRange={6} className={styles.bg}>
            <Image
              src={heroLidar.image.src}
              alt={heroLidar.image.alt}
              fill
              priority
              sizes="100vw"
              className={styles.bgImg}
            />
            <div aria-hidden="true" className={styles.veil} />
          </ParallaxLayer>
        )}
        <ParallaxLayer depth={0.14} range={48} touchRange={24} className={styles.decor}>
          <GridPulse intensity="ambient" patternId="grid-pulse-lidar-hero" />
          <div aria-hidden="true" className={styles.reticle} />
        </ParallaxLayer>
      </ParallaxScene>
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
        <EnterRise delay={0.24} className={styles.ctaRow}>
          <ShimmerCTA scrollTo={heroLidar.ctaTargetId}>{heroLidar.cta}</ShimmerCTA>
          <p className={styles.baseline}>{heroLidar.baseline}</p>
        </EnterRise>
      </div>
      {/* Chips en chevauchement du bord bas du hero (moitié photo, moitié
          section suivante) : plus de désert vertical. */}
      <EnterRise delay={0.32} className={styles.chipsRow}>
        <ul className={styles.chips}>
          {heroLidar.chips.map((chip) => (
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
