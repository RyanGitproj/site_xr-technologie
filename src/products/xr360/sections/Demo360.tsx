import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { Pano360Window } from "@/components/fx/Pano360Window";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { demo360 } from "@/products/xr360/config/content";
import styles from "./Demo360.module.css";

/** La preuve par l'exploration : fenêtre 360 interactive (drag + gyro +
    hotspots + scènes) sur images illustratives, chips « pour qui »
    au-dessus (ex-section Lieux), features et visite pilote en dessous.
    L'iframe de la VRAIE visite (embedUrl) reste prioritaire le jour où la
    captation studio existe. Jamais de fausse visite présentée comme réelle. */
export function Demo360() {
  return (
    <section id={demo360.id} className={styles.section}>
      <SectionHeading kicker={demo360.kicker} title={demo360.title} subtitle={demo360.subtitle} />
      <RevealGroup className={styles.inner}>
        <RevealItem className={styles.placesRow}>
          <span className={styles.placesLabel}>{demo360.placesLabel}</span>
          {demo360.places.map((place) => (
            <span key={place} className={styles.placeChip}>
              {place}
            </span>
          ))}
        </RevealItem>
        <RevealItem>
          <div className={styles.viewer}>
            {demo360.embedUrl !== null ? (
              <iframe
                src={demo360.embedUrl}
                title={demo360.placeholderTitle}
                allowFullScreen
                loading="lazy"
                className={styles.viewerFrame}
              />
            ) : (
              <Pano360Window
                scenes={demo360.panoScenes}
                hint={demo360.panoHint}
                gyroLabel={demo360.panoGyroCta}
              />
            )}
            <span className={styles.mention}>{demo360.mention}</span>
          </div>
        </RevealItem>
        <RevealItem className={styles.under}>
          <div className={styles.features}>
            {demo360.features.map((feature) => (
              <p key={feature.label} className={styles.feature}>
                <feature.icon aria-hidden="true" className={styles.featureIcon} />
                {feature.label}
              </p>
            ))}
          </div>
          <div className={styles.pilot}>
            <p className={styles.pilotNote}>{demo360.placeholderNote}</p>
            <OutlineButton scrollTo={demo360.ctaTargetId}>{demo360.cta}</OutlineButton>
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
