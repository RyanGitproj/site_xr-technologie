"use client";

import { GlassPanel } from "@/components/fx/GlassPanel";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx } from "@/lib/cx";
import { offers360 } from "@/products/xr360/config/content";
import { chooseOffer360 } from "@/products/xr360/lib/selection";
import styles from "./Offers360.module.css";

/** Trois niveaux d'offre sur devis : choisir un niveau présélectionne le
    brief (supports + mention de l'offre) et y descend. La visite pilote
    reste la porte d'entrée pour qui veut d'abord voir. */
export function Offers360() {
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
        <OutlineButton scrollTo={offers360.pilotTargetId}>{offers360.pilotCta}</OutlineButton>
      </div>
    </section>
  );
}
