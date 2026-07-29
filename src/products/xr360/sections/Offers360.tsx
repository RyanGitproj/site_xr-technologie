"use client";

import Image from "next/image";
import Link from "next/link";
import { Info } from "lucide-react";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRODUCTS } from "@/config/products";
import { cx } from "@/lib/cx";
import { offers360 } from "@/products/xr360/config/content";
import { chooseOffer360 } from "@/products/xr360/lib/selection";
import styles from "./Offers360.module.css";

/** Trois niveaux d'offre sur devis : choisir un niveau présélectionne le
    brief (supports + mention de l'offre) et y descend. En pied : le
    périmètre (règle charte, ex-Clarification360) + passerelle LiDAR, près
    des offres où la question se pose, sans casser l'élan du CTA final. */
export function Offers360() {
  const lidar = PRODUCTS.find((product) => product.id === "lidar");

  return (
    <section id={offers360.id} className={styles.section}>
      <SectionHeading
        kicker={offers360.kicker}
        title={offers360.title}
        subtitle={offers360.subtitle}
      />
      <RevealGroup className={styles.grid}>
        {offers360.items.map((offer) => (
          <RevealItem key={offer.id} className={styles.cell}>
            <GlassPanel
              thin
              className={cx(styles.card, offer.featured === true && styles.cardFeatured)}
            >
              {offer.visual !== null && (
                <div className={styles.visual}>
                  <span aria-hidden="true" className={styles.visualHalo} />
                  <Image
                    src={offer.visual.src}
                    alt={offer.visual.alt}
                    fill
                    sizes="(max-width: 900px) 90vw, 360px"
                    className={styles.visualImg}
                  />
                </div>
              )}
              <h3 className={styles.offerName}>{offer.name}</h3>
              <p className={styles.tagline}>{offer.tagline}</p>
              <ul className={styles.features}>
                {offer.features.map((feature) => (
                  <li key={feature} className={styles.feature}>
                    {feature}
                  </li>
                ))}
              </ul>
              <p className={styles.price}>{offers360.priceLabel}</p>
              <OutlineButton
                scrollTo="brief"
                onClick={() => chooseOffer360(offer.id)}
                className={styles.choose}
              >
                {offers360.chooseCta}
              </OutlineButton>
            </GlassPanel>
          </RevealItem>
        ))}
      </RevealGroup>
      <div className={styles.footer}>
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
