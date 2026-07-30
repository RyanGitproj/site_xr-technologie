import Image from "next/image";
import { HoloPanel } from "@/components/fx/HoloPanel";
import { PoleObjectLazy } from "@/components/fx/PoleObjectLazy";
import type { ProductId } from "@/config/products";
import { poleShowcase } from "@/site/config/content";
import styles from "./PoleObjectVisual.module.css";

/** Panneau holographique de la bande : les trois pôles partagent le MÊME
    cadre (HoloPanel : arête néon, trame, balayage, équerres) et n'y changent
    que la couleur et le contenu animé — immersion VR, visite 360, scan
    LiDAR (décision DA 30/07, réf. « trois panneaux »). Repli : packshot
    Codex (lot H), sinon halo + anneau discrets. */
export function PoleObjectVisual({ productId }: { productId: ProductId }) {
  const { packshot, panelLabel } = poleShowcase[productId];

  const fallback =
    packshot !== null ? (
      <div className={styles.fallback}>
        <span aria-hidden="true" className={styles.halo} />
        <Image
          src={packshot.src}
          alt={packshot.alt}
          fill
          sizes="(max-width: 900px) 80vw, 420px"
          className={styles.packshot}
        />
      </div>
    ) : (
      <div aria-hidden="true" className={styles.fallback}>
        <span className={styles.halo} />
        <span className={styles.ringThin} />
      </div>
    );

  return (
    <HoloPanel label={panelLabel ?? undefined} className={styles.panel}>
      <PoleObjectLazy model={productId} fallback={fallback} className={styles.root} />
    </HoloPanel>
  );
}
