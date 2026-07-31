"use client";

import { GlassPanel } from "@/components/fx/GlassPanel";
import { subNav } from "@/config/nav";
import { scrollToSection } from "@/lib/scrollToSection";
import styles from "./PoleSubBar.module.css";

type PoleSubBarProps = {
  /** Ancres internes du pôle (navLinks / nav360 / navLidar), scrollTo sans #hash. */
  links: readonly { readonly label: string; readonly id: string }[];
  /** ShimmerCTA du pôle, épinglé en embout droit, toujours visible. */
  cta: React.ReactNode;
};

/**
 * Capsule du sous-menu des pages produit : le sommaire interne du pôle et
 * son CTA, dans une bulle de verre qui pend de l'onglet actif (slot subBar
 * de HeaderShell). L'identité du pôle vit dans la barre principale (lockup)
 * et la teinte de la capsule. Sur mobile, les ancres défilent au doigt
 * pendant que le CTA reste épinglé.
 */
export function PoleSubBar({ links, cta }: PoleSubBarProps) {
  return (
    <GlassPanel thin degradeOffscreen={false} className={styles.subBar}>
      <nav aria-label={subNav.navLabel} className={styles.scroller}>
        {links.map((link) => (
          <button
            key={link.id}
            type="button"
            className={styles.anchor}
            onClick={() => scrollToSection(link.id)}
          >
            {link.label}
          </button>
        ))}
      </nav>
      <div className={styles.cta}>{cta}</div>
    </GlassPanel>
  );
}
