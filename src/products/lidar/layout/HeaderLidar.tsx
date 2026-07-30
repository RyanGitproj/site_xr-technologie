"use client";

import Image from "next/image";
import Link from "next/link";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { scrollToSection } from "@/lib/scrollToSection";
import { heroLidar, logoLidar, navLidar } from "@/products/lidar/config/content";
import styles from "./HeaderLidar.module.css";

/** Navbar du funnel LiDAR dans la coquille commune : lockup du pôle (lien
    accueil site), nav interne, CTA signature « Présenter mon site ». */
export function HeaderLidar() {
  return (
    <HeaderShell>
      <Link href="/" className={styles.logo}>
        <Image
          src={logoLidar.src}
          alt={logoLidar.alt}
          width={logoLidar.width}
          height={logoLidar.height}
          priority
          unoptimized
          className={styles.logoImg}
        />
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
    </HeaderShell>
  );
}
