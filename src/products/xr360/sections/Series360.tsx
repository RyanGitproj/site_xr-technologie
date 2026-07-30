import Image from "next/image";
import type { CSSProperties } from "react";
import { AmbientPause } from "@/components/fx/AmbientPause";
import { DeckRail } from "@/components/fx/DeckRail";
import { EnterRise } from "@/components/fx/EnterRise";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { series360 } from "@/products/xr360/config/content";
import styles from "./Series360.module.css";

/** Série immersive : le canal vidéo 360 récurrent. Cartes photo pleines
    (texte SUR les zones sombres) qui PANOTENT lentement : l'image glisse
    comme si la caméra pivotait (animation 360 signature), badge « 360° » à
    anneau rotatif. Pause hors écran (AmbientPause), coupé sous
    reduced-motion. Ces cartes possèdent leur transform : jamais de
    parallax par-dessus. */
export function Series360() {
  return (
    <section id={series360.id} className={styles.section}>
      <SectionHeading
        kicker={series360.kicker}
        title={series360.title}
        subtitle={series360.subtitle}
      />
      <AmbientPause className={styles.episodesWrap}>
        <DeckRail label={series360.title} autoplay className={styles.episodes}>
          {series360.episodes.map((episode, index) => (
            /* EnterRise et non RevealItem : il anime `translate`, donc il se
               compose avec le `transform` de pile du rail (deux animateurs sur
               le même transform se seraient écrasés). */
            <EnterRise key={episode.title} delay={index * 0.06}>
              {/* Même pattern que les cartes objectifs de l'accueil :
                  pastille (numéro) + titre + accroche, photo voilée derrière. */}
              <article className={styles.episode} style={{ "--i": index } as CSSProperties}>
                {episode.image !== null && (
                  <Image
                    src={episode.image.src}
                    alt={episode.image.alt}
                    fill
                    sizes="(max-width: 767px) 78vw, 380px"
                    className={styles.episodeImg}
                  />
                )}
                <span aria-hidden="true" className={styles.episodeVeil} />
                <span aria-hidden="true" className={styles.episodeNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className={styles.badge360}>
                  <span className={styles.badgeRing} />
                  360°
                </span>
                <span className={styles.episodeText}>
                  <h3 className={styles.episodeTitle}>{episode.title}</h3>
                  <p className={styles.episodeBody}>{episode.body}</p>
                </span>
              </article>
            </EnterRise>
          ))}
        </DeckRail>
      </AmbientPause>
      <div className={styles.ctaRow}>
        <OutlineButton scrollTo={series360.ctaTargetId}>{series360.cta}</OutlineButton>
      </div>
    </section>
  );
}
