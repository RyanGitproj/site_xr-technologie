"use client";

import Link from "next/link";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { LIVE_PRODUCTS, PRODUCTS } from "@/config/products";
import { siteConfig } from "@/config/site";
import { contactSection, siteHeader } from "@/site/config/content";
import { scrollToSection } from "@/lib/scrollToSection";
import styles from "./SiteHeader.module.css";

/** Navbar du site dans la coquille commune : wordmark + pôles (les pôles à
    venir sont annoncés sans lien) + contact. Navigation libre. */
export function SiteHeader() {
  return (
    <HeaderShell>
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
      {/* Mobile : la nav complète vit dans le footer ; le header garde les
          trois accès de pôle en libellé court (les noms officiels
          déborderaient d'une barre 390px), le nom complet restant lisible
          par les lecteurs d'écran. */}
      <div className={styles.mobileActions}>
        {LIVE_PRODUCTS.map((product) => (
          <Link
            key={product.id}
            href={product.route}
            className={styles.navLink}
            aria-label={product.name}
            data-pole-accent={product.id}
          >
            {product.shortName}
          </Link>
        ))}
      </div>
    </HeaderShell>
  );
}
