"use client";

import Link from "next/link";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { siteConfig } from "@/config/site";
import { scrollToSection } from "@/lib/scrollToSection";
import { heroLidar, navLidar } from "@/products/lidar/config/content";
import styles from "./HeaderLidar.module.css";

/** Navbar du funnel LiDAR : verre fin aux angles nets (identité technique),
    wordmark du pôle (lien accueil site), nav interne, CTA signature
    « Présenter mon site ». */
export function HeaderLidar() {
  return (
    <header className={styles.header}>
      <GlassPanel thin degradeOffscreen={false} className={styles.panel}>
        <div className={styles.bar}>
          <Link href="/" className={styles.wordmark}>
            <span className={styles.wordmarkPole}>XR LiDAR</span>
            <span className={styles.wordmarkCompany}>{siteConfig.name}</span>
          </Link>
          <nav aria-label="Navigation du funnel" className={styles.nav}>
            {navLidar.map((link) => (
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
          <ShimmerCTA scrollTo={heroLidar.ctaTargetId} size="sm" pulse={false}>
            {heroLidar.cta}
          </ShimmerCTA>
        </div>
        <ScrollProgress />
      </GlassPanel>
    </header>
  );
}
