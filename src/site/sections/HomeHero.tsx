import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { homeHero } from "@/site/config/content";
import styles from "./HomeHero.module.css";

/** Hero corporate : un verbe par pôle, chacun dans sa couleur d'identité.
    Socle neutre, fort contraste d'échelle, aucune couleur de pôle en fond. */
export function HomeHero() {
  return (
    <section className={styles.hero}>
      <RevealGroup className={styles.inner}>
        <RevealItem>
          <p className={styles.kicker}>{homeHero.kicker}</p>
        </RevealItem>
        <RevealItem>
          <h1 className={styles.title}>
            {homeHero.titleWords.map(({ word, productId }) => (
              <span key={productId} className={styles.word} data-pole-accent={productId}>
                {word}
              </span>
            ))}
          </h1>
        </RevealItem>
        <RevealItem>
          <p className={styles.subtitle}>{homeHero.subtitle}</p>
        </RevealItem>
        <RevealItem>
          <OutlineButton scrollTo={homeHero.ctaTargetId}>{homeHero.cta}</OutlineButton>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
