import Image from "next/image";
import { PoleObjectLazy } from "@/components/fx/PoleObjectLazy";
import type { ProductId } from "@/config/products";
import { poleShowcase } from "@/site/config/content";
import styles from "./PoleObjectVisual.module.css";

/** Le VRAI objet du pôle en 3D dans sa bande (remplace les décors abstraits
    du 27/07, dont l'orbe « Jupiter ») — sauf LiDAR, où la bande montre le
    RÉSULTAT : le bâtiment balayé qui devient nuage puis jumeau. Repli :
    packshot Codex (lot H) dès qu'il est branché dans la config, sinon halo
    + anneau discrets. */
export function PoleObjectVisual({ productId }: { productId: ProductId }) {
  const packshot = poleShowcase[productId].packshot;

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

  return <PoleObjectLazy model={productId} fallback={fallback} className={styles.root} />;
}
