import Link from "next/link";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { ParallaxLayer } from "@/components/fx/ParallaxLayer";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { ScenePreloader } from "@/components/fx/ScenePreloader";
import { POLE_SCENES } from "@/components/fx/scenePreload";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRODUCTS } from "@/config/products";
import { cx } from "@/lib/cx";
import { polesSection, poleShowcase } from "@/site/config/content";
import { PoleObjectVisual } from "./PoleObjectVisual";
import styles from "./PolesShowcase.module.css";

/** Les 3 pôles en bandes éditoriales alternées : fond socle neutre, le pôle
    ne porte que SA couleur (accent, arête du verre, halo), et montre son
    VRAI objet en 3D (casque, caméra 360, scanner) à la place des décors
    abstraits. Les listes de points ont disparu : les faits vivent dans les
    pages pôles, la bande donne l'envie et la porte d'entrée. */
export function PolesShowcase() {
  return (
    <section id={polesSection.id} className={styles.section}>
      {/* Les 3 objets se téléchargent pendant que le lecteur est encore en
          haut : ils sont là quand la bande arrive, sans passage par le halo. */}
      <ScenePreloader scenes={POLE_SCENES} />
      <SectionHeading kicker={polesSection.kicker} title={polesSection.title} />
      <div className={styles.bands}>
        {PRODUCTS.map((product) => {
          const showcase = poleShowcase[product.id];
          return (
            <article
              key={product.id}
              className={styles.band}
              data-pole-accent={product.id}
            >
              <RevealGroup className={styles.bandGrid}>
                <RevealItem className={styles.bandContent}>
                  <p className={styles.baseline}>{product.baseline}</p>
                  <h3 className={styles.poleName}>{product.name}</h3>
                  <p className={styles.descriptor}>{product.descriptor}</p>
                  <GlassPanel thin className={styles.panel}>
                    <p className={styles.hook}>{showcase.hook}</p>
                    <p className={styles.body}>{showcase.body}</p>
                    {product.status === "live" && showcase.cta !== null ? (
                      <Link href={product.route} className={styles.cta}>
                        {showcase.cta} →
                      </Link>
                    ) : (
                      <p className={cx(styles.cta, styles.upcoming)}>
                        {polesSection.upcomingLabel}
                      </p>
                    )}
                  </GlassPanel>
                </RevealItem>
                <RevealItem className={styles.bandVisual}>
                  <ParallaxLayer
                    depth={0.12}
                    range={40}
                    touchRange={24}
                    className={styles.visualLayer}
                  >
                    <PoleObjectVisual productId={product.id} />
                  </ParallaxLayer>
                </RevealItem>
              </RevealGroup>
            </article>
          );
        })}
      </div>
    </section>
  );
}
