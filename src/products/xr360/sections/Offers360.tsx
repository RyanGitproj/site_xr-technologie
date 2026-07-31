import Link from "next/link";
import { Info } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRODUCTS } from "@/config/products";
import { offers360 } from "@/products/xr360/config/content";
import { OfferExplorer360 } from "@/products/xr360/sections/OfferExplorer360";
import styles from "./Offers360.module.css";

/** Trois offres chiffrées (brochure XR 360) derrière le sélecteur partagé
    avec /vr et /lidar : 8 tuiles par type de lieu, chaque cible mettant en
    avant son format recommandé. Choisir une offre présélectionne le brief
    (type de lieu + offre) et y descend. En pied : options complémentaires
    sans prix, réassurance, et le périmètre (règle charte : jamais de
    promesse de mesure côté 360) + passerelle LiDAR, près des offres où la
    question se pose, sans casser l'élan du CTA final. */
export function Offers360() {
  const lidar = PRODUCTS.find((product) => product.id === "lidar");

  return (
    <section id={offers360.id} data-below-fold="" className={styles.section}>
      <SectionHeading
        kicker={offers360.kicker}
        title={offers360.title}
        subtitle={offers360.subtitle}
      />
      <div className={styles.explorer}>
        <OfferExplorer360 />
      </div>
      <div className={styles.footer}>
        <p className={styles.optionsLine}>
          <strong className={styles.optionsTitle}>{offers360.optionsTitle} : </strong>
          {offers360.options.join(" · ")}.
        </p>
        <div className={styles.reassurance}>
          {offers360.reassurance.map((item) => (
            <span key={item.label} className={styles.reassuranceItem}>
              <item.icon aria-hidden="true" className={styles.reassuranceIcon} />
              {item.label}
            </span>
          ))}
        </div>
        <p className={styles.note} data-pole-accent="lidar">
          <Info aria-hidden="true" className={styles.noteIcon} />
          <span>
            <strong className={styles.noteTitle}>{offers360.note.title} : </strong>
            {offers360.note.body} {offers360.note.bridge}{" "}
            {lidar !== undefined &&
              (lidar.status === "live" ? (
                <Link href={lidar.route} className={styles.noteLink}>
                  {lidar.name} →
                </Link>
              ) : (
                <span>{lidar.name} (bientôt en ligne)</span>
              ))}
          </span>
        </p>
      </div>
    </section>
  );
}
