"use client";

import Image from "next/image";
import { subNav } from "@/config/nav";
import type { ImageSlot } from "@/lib/images";
import { scrollToSection } from "@/lib/scrollToSection";
import styles from "./PoleSubBar.module.css";

type PoleSubBarProps = {
  /** Lockup du pôle (logoImage / logo360 / logoLidar), masqué <768px. */
  logo: ImageSlot;
  /** Ancres internes du pôle (navLinks / nav360 / navLidar), scrollTo sans #hash. */
  links: readonly { readonly label: string; readonly id: string }[];
  /** ShimmerCTA du pôle, épinglé en fin de rangée, toujours visible. */
  cta: React.ReactNode;
};

/**
 * Sous-barre permanente des pages produit (directive boss 30/07) : le
 * sommaire interne du pôle et son CTA vivent sous la barre principale,
 * dans le même verre (slot subBar de HeaderShell). Sur mobile, les ancres
 * défilent au doigt pendant que le CTA reste épinglé.
 */
export function PoleSubBar({ logo, links, cta }: PoleSubBarProps) {
  return (
    <div className={styles.subBar}>
      <span className={styles.logo}>
        <Image
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          unoptimized
          className={styles.logoImg}
        />
      </span>
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
    </div>
  );
}
