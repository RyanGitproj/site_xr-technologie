import { LampHeader } from "@/components/fx/LampHeader";
import { Reveal } from "@/components/fx/Reveal";
import { OfferExplorerVr } from "@/products/vr/sections/OfferExplorerVr";
import { offersSection } from "@/products/vr/config/content";
import styles from "./OffersSection.module.css";

/**
 * Section Offres : titre en Lamp Effect puis sélecteur des 10 secteurs qui
 * pilote les 3 packs affichés (OfferExplorer, interaction signature partagée
 * avec les pôles LiDAR et XR 360). Remplace les anciennes sections Audience
 * (4 profils retail) et Packs.
 */
export function OffersSection() {
  return (
    <section id="offres" className={`fx-section ${styles.section}`}>
      <div className={styles.container}>
        <Reveal>
          <LampHeader>
            <p className={styles.kicker}>{offersSection.kicker}</p>
            <h2 className={styles.title}>{offersSection.title}</h2>
            <p className={styles.subtitle}>{offersSection.subtitle}</p>
          </LampHeader>
        </Reveal>

        <Reveal>
          <OfferExplorerVr />
        </Reveal>
      </div>
    </section>
  );
}
