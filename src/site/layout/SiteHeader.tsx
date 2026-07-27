"use client";

import Link from "next/link";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { LIVE_PRODUCTS, PRODUCTS } from "@/config/products";
import { siteConfig } from "@/config/site";
import { contactSection, siteHeader } from "@/site/config/content";
import { scrollToSection } from "@/lib/scrollToSection";
import styles from "./SiteHeader.module.css";

/** Navbar du site : wordmark + pôles (les pôles à venir sont annoncés sans
    lien) + contact. Verre fin sur le socle neutre, navigation libre. */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <GlassPanel thin degradeOffscreen={false} className={styles.panel}>
        <div className={styles.bar}>
          <Link href="/" className={styles.wordmark}>
            {siteConfig.name}
          </Link>
          <nav aria-label={siteHeader.navLabel} className={styles.nav}>
            {PRODUCTS.map((product) =>
              product.status === "live" ? (
                <Link
                  key={product.id}
                  href={product.route}
                  className={styles.navLink}
                  data-pole-accent={product.id}
                >
                  {product.name}
                </Link>
              ) : (
                <span key={product.id} className={styles.navUpcoming}>
                  {product.name}
                  <span className={styles.badge}>{siteHeader.upcomingBadge}</span>
                </span>
              ),
            )}
            <button
              type="button"
              className={styles.navLink}
              onClick={() => scrollToSection(contactSection.id)}
            >
              {siteHeader.contactLabel}
            </button>
          </nav>
          {/* Mobile : la nav complète vit dans le footer ; le header garde
              l'essentiel (wordmark + pôle actif + contact). */}
          <div className={styles.mobileActions}>
            {LIVE_PRODUCTS.map((product) => (
              <Link
                key={product.id}
                href={product.route}
                className={styles.navLink}
                data-pole-accent={product.id}
              >
                {product.name}
              </Link>
            ))}
          </div>
        </div>
      </GlassPanel>
    </header>
  );
}
