import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { demo360 } from "@/products/xr360/config/content";
import styles from "./Demo360.module.css";

/** Démo exploration 3D : le cadre du viewer attend la captation réelle
    (embedUrl) ; tant qu'elle n'existe pas, promesse honnête + CTA visite
    pilote. Jamais de fausse visite présentée comme réelle. */
export function Demo360() {
  return (
    <section id={demo360.id} className={styles.section}>
      <SectionHeading kicker={demo360.kicker} title={demo360.title} subtitle={demo360.subtitle} />
      <RevealGroup className={styles.inner}>
        <RevealItem className={styles.features}>
          {demo360.features.map((feature) => (
            <p key={feature.label} className={styles.feature}>
              <feature.icon aria-hidden="true" className={styles.featureIcon} />
              {feature.label}
            </p>
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
              <>
                {demo360.preview !== null && (
                  <Image
                    src={demo360.preview.src}
                    alt={demo360.preview.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 720px"
                    className={styles.previewImg}
                  />
                )}
                <div className={styles.placeholder}>
                  <p className={styles.placeholderTitle}>{demo360.placeholderTitle}</p>
                  <p className={styles.placeholderNote}>{demo360.placeholderNote}</p>
                  <OutlineButton scrollTo={demo360.ctaTargetId}>{demo360.cta}</OutlineButton>
                </div>
              </>
            )}
            <span className={styles.mention}>{demo360.mention}</span>
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
