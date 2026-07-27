import Link from "next/link";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { PRODUCTS } from "@/config/products";
import { siteConfig } from "@/config/site";
import styles from "./home.module.css";

/** Accueil PROVISOIRE : liste des pôles (config/products.ts) en attendant la
    vraie home XR Technologie (TODO.md, phase 3 du chantier multi-produits). */
export default function HomePage() {
  return (
    <main id="contenu" className={styles.main}>
      <h1 className={styles.brand}>{siteConfig.name}</h1>
      <p className={styles.lead}>
        L&apos;immersion au service de votre projet, depuis {siteConfig.city} : vivez la
        réalité virtuelle là où vous êtes, faites visiter vos lieux à distance et
        transformez vos sites en données 3D exploitables.
      </p>
      <div className={styles.grid}>
        {PRODUCTS.map((product) => {
          const card = (
            <GlassPanel thin className={styles.card}>
              <p className={styles.cardBaseline}>{product.baseline}</p>
              <h2 className={styles.cardName}>{product.name}</h2>
              <p className={styles.cardDescriptor}>{product.descriptor}</p>
              <p className={styles.cardAction}>
                {product.status === "live" ? (
                  <>Découvrir →</>
                ) : (
                  <span className={styles.upcoming}>Bientôt en ligne</span>
                )}
              </p>
            </GlassPanel>
          );
          return product.status === "live" ? (
            <Link key={product.id} href={product.route} className={styles.cardLink}>
              {card}
            </Link>
          ) : (
            <div key={product.id}>{card}</div>
          );
        })}
      </div>
    </main>
  );
}
