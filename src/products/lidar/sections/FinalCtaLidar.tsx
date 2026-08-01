import { GeoFrame } from "@/components/fx/GeoFrame";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { finalCtaLidar } from "@/products/lidar/config/content";
import styles from "./FinalCtaLidar.module.css";

/** Vitrine vidéo finale du nuage de points avant le brief.
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
      </RevealGroup>
    </section>
  );
}
