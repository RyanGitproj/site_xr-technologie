import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ParallaxLayer } from "@/components/fx/ParallaxLayer";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRODUCT_BY_ID } from "@/config/products";
import { objectivesSection } from "@/site/config/content";
import styles from "./ObjectivesSection.module.css";

/** Orientation par objectif (Funnel V2) : six cartes, chacune portée par
    l'accent de son pôle cible ; la carte entière est le lien vers le pôle.
    En repli, le lecteur qui hésite est envoyé vers le contact. */
export function ObjectivesSection() {
  return (
    <section id={objectivesSection.id} data-below-fold="" className={styles.section}>
      <SectionHeading
        kicker={objectivesSection.kicker}
        title={objectivesSection.title}
        subtitle={objectivesSection.subtitle}
      />
      <RevealGroup className={styles.grid}>
        {objectivesSection.items.map((item) => {
          const Icon = item.icon;
          return (
            <RevealItem key={item.title} className={styles.cell}>
              <Link
                href={PRODUCT_BY_ID[item.productId].route}
                className={styles.card}
                data-pole-accent={item.productId}
              >
                {item.image !== null && (
                  /* Micro-profondeur : la photo de la carte traîne (inset,
                     auto-coupé au tactile par ParallaxLayer). */
                  <ParallaxLayer depth={-0.25} mode="inset" className={styles.photo}>
                    <Image
                      src={item.image.src}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      className={styles.photoImg}
                    />
                  </ParallaxLayer>
                )}
                <span className={styles.icon}>
                  <Icon size={20} strokeWidth={1.6} aria-hidden />
                </span>
                <span className={styles.text}>
                  <span className={styles.title}>{item.title}</span>
                  <span className={styles.note}>{item.note}</span>
                </span>
                <ArrowRight size={18} strokeWidth={1.8} aria-hidden className={styles.arrow} />
              </Link>
            </RevealItem>
          );
        })}
      </RevealGroup>
      <div className={styles.hesitation}>
        <p className={styles.hesitationText}>{objectivesSection.hesitation}</p>
        <OutlineButton scrollTo={objectivesSection.hesitationTargetId}>
          {objectivesSection.hesitationCta}
        </OutlineButton>
      </div>
    </section>
  );
}
