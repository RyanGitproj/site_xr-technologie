import Image from "next/image";
import Link from "next/link";
import { siteLogo } from "@/config/brand";
import type { ImageSlot } from "@/lib/images";
import { cx } from "@/lib/cx";
import styles from "./HeaderBrand.module.css";

type HeaderBrandProps = {
  /** Lockup de la page courante : XR Technologie par défaut (socle site),
      lockup du pôle sur les pages produit (décision boss, 31/07). */
  logo?: ImageSlot;
  /** Cible du clic : accueil par défaut ; sur une page produit, le haut du
      funnel courant (« Accueil » du menu gère le retour au site). */
  href?: string;
  /** Halo clair statique pour les lockups pensés pour fond blanc (360),
      qui se perdraient sur le verre sombre. */
  halo?: boolean;
};

export function HeaderBrand({ logo = siteLogo, href = "/", halo = false }: HeaderBrandProps) {
  return (
    <Link href={href} className={styles.logo}>
      {/* Pas de `priority` : le preload du lockup passait AVANT l'image LCP
          du hero (mesure Lighthouse 31/07). Eager suffit, la navbar est
          au-dessus de la ligne de flottaison de toute façon. */}
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        unoptimized
        className={cx(styles.logoImg, halo && styles.logoHalo)}
      />
    </Link>
  );
}
