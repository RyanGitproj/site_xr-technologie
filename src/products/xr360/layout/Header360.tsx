"use client";

import Link from "next/link";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { siteConfig } from "@/config/site";
import { scrollToSection } from "@/lib/scrollToSection";
import { hero360, nav360 } from "@/products/xr360/config/content";
import styles from "./Header360.module.css";

/** Navbar du funnel 360 : verre fin, wordmark du pôle (lien accueil site,
    convention logo = accueil), nav interne par scrollTo, CTA signature
    « Créer une visite virtuelle ». Le funnel oriente, sans piéger. */
export function Header360() {
  return (
    <header className={styles.header}>
      <GlassPanel thin degradeOffscreen={false} className={styles.panel}>
        <div className={styles.bar}>
          <Link href="/" className={styles.wordmark}>
            <span className={styles.wordmarkPole}>XR 360</span>
            <span className={styles.wordmarkCompany}>{siteConfig.name}</span>
          </Link>
          <nav aria-label="Navigation du funnel" className={styles.nav}>
            {nav360.map((link) => (
              <button
                key={link.id}
                type="button"
                className={styles.navLink}
                onClick={() => scrollToSection(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>
          <ShimmerCTA scrollTo={hero360.ctaTargetId} size="sm" pulse={false}>
            {hero360.cta}
          </ShimmerCTA>
        </div>
        <ScrollProgress />
      </GlassPanel>
    </header>
  );
}
