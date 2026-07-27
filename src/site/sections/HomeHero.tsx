import { EnterRise } from "@/components/fx/EnterRise";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { homeHero } from "@/site/config/content";
import styles from "./HomeHero.module.css";

/** Hero corporate : un verbe par pôle, chacun dans sa couleur d'identité.
    Socle neutre, fort contraste d'échelle, aucune couleur de pôle en fond.
    Apparition en EnterRise (CSS pur) : le titre peint au premier paint,
    sans attendre l'hydration (LCP 3G), contrairement à Reveal (framer). */
export function HomeHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <EnterRise>
          <p className={styles.kicker}>{homeHero.kicker}</p>
        </EnterRise>
        <EnterRise delay={0.08}>
          <h1 className={styles.title}>
            {homeHero.titleWords.map(({ word, productId }) => (
              <span key={productId} className={styles.word} data-pole-accent={productId}>
                {word}
              </span>
            ))}
          </h1>
        </EnterRise>
        <EnterRise delay={0.16}>
          <p className={styles.subtitle}>{homeHero.subtitle}</p>
        </EnterRise>
        <EnterRise delay={0.24}>
          <OutlineButton scrollTo={homeHero.ctaTargetId}>{homeHero.cta}</OutlineButton>
        </EnterRise>
      </div>
    </section>
  );
}
