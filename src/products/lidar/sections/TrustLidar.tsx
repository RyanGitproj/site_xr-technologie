import { AlertTriangle, Check } from "lucide-react";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { trustLidar } from "@/products/lidar/config/content";
import styles from "./TrustLidar.module.css";

/** Le bloc confiance : engagements avant intervention, pourquoi XR LiDAR,
    et les LIMITES (texte légal repris fidèlement de la brochure). Dire ce
    que la prestation ne fait PAS est un argument de sérieux, pas un aveu. */
export function TrustLidar() {
  return (
    <section className={styles.section}>
      <RevealGroup className={styles.columns}>
        <RevealItem className={styles.col}>
          <h3 className={styles.colTitle}>{trustLidar.engagementsTitle}</h3>
          <ul className={styles.engagements}>
            {trustLidar.engagements.map((item) => (
              <li key={item.title} className={styles.engagement}>
                <Check aria-hidden="true" className={styles.checkIcon} />
                <div>
                  <p className={styles.engagementTitle}>{item.title}</p>
                  <p className={styles.engagementBody}>{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </RevealItem>
        <RevealItem className={styles.col}>
          <h3 className={styles.colTitle}>{trustLidar.whyTitle}</h3>
          <ul className={styles.whyList}>
            {trustLidar.why.map((item) => (
              <li key={item.title} className={styles.why}>
                <item.icon aria-hidden="true" className={styles.whyIcon} />
                <div>
                  <p className={styles.engagementTitle}>{item.title}</p>
                  <p className={styles.engagementBody}>{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </RevealItem>
      </RevealGroup>
      <RevealGroup className={styles.limitsWrap}>
        <RevealItem>
          <GlassPanel thin className={styles.limitsPanel}>
            <h3 className={styles.limitsTitle}>{trustLidar.limitsTitle}</h3>
            <ul className={styles.limits}>
              {trustLidar.limits.map((limit) => (
                <li key={limit} className={styles.limit}>
                  {limit}
                </li>
              ))}
            </ul>
            <p className={styles.adaptNote}>
              <AlertTriangle aria-hidden="true" className={styles.adaptIcon} />
              {trustLidar.adaptNote}
            </p>
          </GlassPanel>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
