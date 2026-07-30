"use client";

import Image from "next/image";
import Link from "next/link";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { scrollToSection } from "@/lib/scrollToSection";
import { hero360, logo360, nav360 } from "@/products/xr360/config/content";
import styles from "./Header360.module.css";

/** Navbar du funnel 360 dans la coquille commune : lockup du pôle (lien
    accueil site, convention logo = accueil), nav interne par scrollTo, CTA
    signature « Créer une visite virtuelle ». Le funnel oriente, sans piéger. */
export function Header360() {
  return (
    <HeaderShell>
      <Link href="/" className={styles.logo}>
        <Image
          src={logo360.src}
          alt={logo360.alt}
          width={logo360.width}
          height={logo360.height}
          priority
          unoptimized
          className={styles.logoImg}
        />
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
    </HeaderShell>
  );
}
