import { GeoFrame } from "@/components/fx/GeoFrame";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { finalCta360 } from "@/products/xr360/config/content";
import styles from "./FinalCta360.module.css";

/** Dernier appel avant le formulaire : la montée en trois lignes, puis la
    vitrine vidéo en carte HUD (remplace l'ambiance lodge du lot D), même
    système que la vitrine VR : autoplay muet pausé hors écran/onglet, son à
    la demande, poster + contrôles sous prefers-reduced-motion. */
export function FinalCta360() {
  return (
    <section data-below-fold="" className={`fx-section ${styles.section}`}>
      <RevealGroup className={styles.inner}>
        <RevealItem>
          <h2 className={styles.title}>
            <span>{finalCta360.title}</span>
            {finalCta360.lines.map((line) => (
              <span key={line} className={styles.line}>
                {line}
              </span>
            ))}
          </h2>
        </RevealItem>
        <RevealItem>
          <p className={styles.subtitle}>{finalCta360.subtitle}</p>
        </RevealItem>
        <RevealItem className={styles.showcase}>
          <GeoFrame variant="frame" shape="hud" chamfer={24} trace>
            <GlassPanel className={styles.panel}>
              <AmbientVideo
                video={finalCta360.video}
                soundOnLabel={finalCta360.soundOnLabel}
                soundOffLabel={finalCta360.soundOffLabel}
              />
            </GlassPanel>
          </GeoFrame>
        </RevealItem>
        <RevealItem>
          <ShimmerCTA scrollTo={finalCta360.ctaTargetId}>{finalCta360.cta}</ShimmerCTA>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
