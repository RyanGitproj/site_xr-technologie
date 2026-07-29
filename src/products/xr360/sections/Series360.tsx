import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { series360 } from "@/products/xr360/config/content";
import styles from "./Series360.module.css";

/** Série immersive : le canal vidéo 360 récurrent. Cartes photo pleines :
    les vignettes (lot E) sont composées avec des zones sombres, le texte
    se pose DESSUS (numéro en haut, titre + accroche sur le bas voilé). */
export function Series360() {
  return (
    <section id={series360.id} className={styles.section}>
      <SectionHeading
        kicker={series360.kicker}
        title={series360.title}
        subtitle={series360.subtitle}
      />
      <RevealGroup className={styles.episodes}>
        {series360.episodes.map((episode, index) => (
          <RevealItem key={episode.title} className={styles.cell}>
            {/* Même pattern que les cartes objectifs de l'accueil :
                pastille (numéro) + titre + accroche, photo voilée derrière. */}
            <article className={styles.episode}>
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
              <span className={styles.episodeText}>
                <h3 className={styles.episodeTitle}>{episode.title}</h3>
                <p className={styles.episodeBody}>{episode.body}</p>
              </span>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
      <div className={styles.diffusion}>
        <p className={styles.diffusionTitle}>{series360.diffusionTitle}</p>
        <div className={styles.channels}>
          {series360.diffusion.map((channel) => (
            <span key={channel.label} className={styles.channel}>
              <channel.icon aria-hidden="true" className={styles.channelIcon} />
              {channel.label}
            </span>
          ))}
        </div>
        <OutlineButton scrollTo={series360.ctaTargetId}>{series360.cta}</OutlineButton>
      </div>
    </section>
  );
}
