import { GeoFrame } from "@/components/fx/GeoFrame";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { finalCtaLidar } from "@/products/lidar/config/content";
import styles from "./FinalCtaLidar.module.css";

/** Dernier appel avant le brief : la vitrine vidéo du nuage de points en
    carte HUD (même système que la vitrine VR : autoplay muet pausé hors
    écran/onglet, son à la demande, poster + contrôles sous
    prefers-reduced-motion), la portée géographique (ex-section zone) au
    moment de la décision, puis le CTA signature. La mention légale complète
    vit UNE fois dans la mission (bloc limites) : ici, un simple renvoi.
    Aucun parallax : section porteuse d'un contenu contractuel. */
export function FinalCtaLidar() {
  return (
    <section data-below-fold="" className={`fx-section ${styles.section}`}>
      <RevealGroup className={styles.inner}>
        <RevealItem>
          <p className={styles.kicker}>{finalCtaLidar.kicker}</p>
        </RevealItem>
        <RevealItem>
          <h2 className={styles.title}>{finalCtaLidar.title}</h2>
        </RevealItem>
        <RevealItem>
          <p className={styles.subtitle}>{finalCtaLidar.subtitle}</p>
        </RevealItem>
        <RevealItem className={styles.showcase}>
          <GeoFrame variant="frame" shape="hud" chamfer={24} trace>
            <GlassPanel className={styles.panel}>
              <AmbientVideo
                video={finalCtaLidar.video}
                soundOnLabel={finalCtaLidar.soundOnLabel}
                soundOffLabel={finalCtaLidar.soundOffLabel}
              />
            </GlassPanel>
          </GeoFrame>
        </RevealItem>
        <RevealItem className={styles.zones}>
          <p className={styles.zonesTitle}>{finalCtaLidar.zonesTitle}</p>
          <div className={styles.zoneChips}>
            {finalCtaLidar.zones.map((zone) => (
              <span key={zone} className={styles.zoneChip}>
                {zone}
              </span>
            ))}
          </div>
          <p className={styles.zonesNote}>{finalCtaLidar.zonesNote}</p>
        </RevealItem>
        <RevealItem>
          <ShimmerCTA scrollTo={finalCtaLidar.ctaTargetId}>{finalCtaLidar.cta}</ShimmerCTA>
        </RevealItem>
        <RevealItem>
          <p className={styles.mention}>{finalCtaLidar.limitsNote}</p>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
