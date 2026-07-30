import Image from "next/image";
import { ParallaxLayer } from "@/components/fx/ParallaxLayer";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx } from "@/lib/cx";
import { acquisitionLidar } from "@/products/lidar/config/content";
import styles from "./AcquisitionLidar.module.css";

/** Les trois modes d'acquisition, matériel nommé (arbitrage 28/07), la
    mention drone reprise fidèlement. Dès livraison du lot I, chaque fiche
    devient une carte PHOTO (l'image est le fond, le texte se pose sur la
    zone sombre). Vague de profondeur légère au scroll (±0.10). */
export function AcquisitionLidar() {
  return (
    <section id={acquisitionLidar.id} className={styles.section}>
      <SectionHeading
        kicker={acquisitionLidar.kicker}
        title={acquisitionLidar.title}
        subtitle={acquisitionLidar.subtitle}
      />
      <RevealGroup className={styles.grid}>
        {acquisitionLidar.modes.map((mode, index) => (
          <RevealItem key={mode.title} className={styles.cell}>
            <ParallaxLayer depth={index % 2 === 0 ? -0.1 : 0.1} range={32} touchRange={24}>
              <article className={cx(styles.mode, mode.image !== null && styles.modePhoto)}>
                {mode.image !== null && (
                  <>
                    <Image
                      src={mode.image.src}
                      alt={mode.image.alt}
                      fill
                      sizes="(max-width: 900px) 100vw, 380px"
                      className={styles.photo}
                    />
                    <span aria-hidden="true" className={styles.veil} />
                    {mode.spotlight !== undefined && (
                      <span
                        aria-hidden="true"
                        className={styles.spotlight}
                        style={{
                          left: mode.spotlight.x,
                          top: mode.spotlight.y,
                        }}
                      >
                        <Image
                          src={mode.image.src}
                          alt=""
                          fill
                          sizes="7rem"
                          className={styles.spotlightPhoto}
                          style={{ objectPosition: `${mode.spotlight.x} ${mode.spotlight.y}` }}
                        />
                      </span>
                    )}
                  </>
                )}
                <mode.icon aria-hidden="true" className={styles.icon} />
                <h3 className={styles.modeTitle}>{mode.title}</h3>
                <p className={styles.hardware}>{mode.hardware}</p>
                {mode.note !== null && <p className={styles.note}>{mode.note}</p>}
                <p className={styles.body}>{mode.body}</p>
              </article>
            </ParallaxLayer>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
