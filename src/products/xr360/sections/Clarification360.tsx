import Link from "next/link";
import { Info } from "lucide-react";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { Reveal } from "@/components/fx/Reveal";
import { PRODUCTS } from "@/config/products";
import { clarification360 } from "@/products/xr360/config/content";
import styles from "./Clarification360.module.css";

/** Clarification de périmètre (règle centrale de la charte) + passerelle
    vers le pôle LiDAR : le lien s'active tout seul quand le pôle sera live. */
export function Clarification360() {
  const lidar = PRODUCTS.find((product) => product.id === "lidar");

  return (
    <section className={styles.section}>
      <Reveal className={styles.inner}>
        <GlassPanel thin className={styles.panel}>
          <Info aria-hidden="true" className={styles.icon} />
          <div className={styles.text}>
            <h2 className={styles.title}>{clarification360.title}</h2>
            <p className={styles.body}>{clarification360.body}</p>
            <p className={styles.bridge} data-pole-accent="lidar">
              {clarification360.bridge}{" "}
              {lidar !== undefined &&
                (lidar.status === "live" ? (
                  <Link href={lidar.route} className={styles.bridgeLink}>
                    Découvrir {lidar.name} →
                  </Link>
                ) : (
                  <span className={styles.bridgeUpcoming}>({lidar.name}, bientôt en ligne)</span>
                ))}
            </p>
          </div>
        </GlassPanel>
      </Reveal>
    </section>
  );
}
