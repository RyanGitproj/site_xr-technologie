import Link from "next/link";
import { Info } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRODUCTS } from "@/config/products";
import { offersLidar } from "@/products/lidar/config/content";
import { OfferExplorerLidar } from "@/products/lidar/sections/OfferExplorerLidar";
import styles from "./OffersLidar.module.css";

/** Deux familles d'offres chiffrées (brochures commerciales et techniques),
    derrière le sélecteur partagé avec /vr et /360. En pied, la note de
    périmètre : elle nomme la frontière avec XR 360 (scan 3D contre photo
    360°) pour que deux prix d'entrée voisins ne se lisent pas comme deux
    tarifs de la même prestation. */
export function OffersLidar() {
  const xr360 = PRODUCTS.find((product) => product.id === "xr360");

  return (
    <section id={offersLidar.id} className={`fx-section ${styles.section}`}>
      <div className={styles.container}>
        <SectionHeading
          kicker={offersLidar.kicker}
          title={offersLidar.title}
          subtitle={offersLidar.subtitle}
        />

        <OfferExplorerLidar />

        <p className={styles.note} data-pole-accent="xr360">
          <Info aria-hidden="true" className={styles.noteIcon} />
          <span>
            <strong className={styles.noteTitle}>{offersLidar.note.title} : </strong>
            {offersLidar.note.body} {offersLidar.note.bridge}{" "}
            {xr360 !== undefined &&
              (xr360.status === "live" ? (
                <Link href={xr360.route} className={styles.noteLink}>
                  {xr360.name} →
                </Link>
              ) : (
                <span>{xr360.name} (bientôt en ligne)</span>
              ))}
          </span>
        </p>
      </div>
    </section>
  );
}
