import { SectionHeading } from "@/components/ui/SectionHeading";
import { offersLidar } from "@/products/lidar/config/content";
import { OfferExplorerLidar } from "@/products/lidar/sections/OfferExplorerLidar";
import styles from "./OffersLidar.module.css";

/** Deux familles d'offres chiffrées derrière le sélecteur partagé avec /vr et /360. */
export function OffersLidar() {
  return (
    <section id={offersLidar.id} className={`fx-section ${styles.section}`}>
      <div className={styles.container}>
        <SectionHeading
          kicker={offersLidar.kicker}
          title={offersLidar.title}
          subtitle={offersLidar.subtitle}
        />

        <OfferExplorerLidar />
      </div>
    </section>
  );
}
