"use client";

import Image from "next/image";
import Link from "next/link";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { navLinks } from "@/products/vr/config/content";
import { logoImage } from "@/products/vr/config/images";
import { scrollToSection } from "@/lib/scrollToSection";
import styles from "./Header.module.css";

/** Navbar VR : le lockup officiel, la nav interne et le CTA devis, dans la
    coquille commune (verre pleine largeur, compactage au scroll). */
export function Header() {
  return (
    <HeaderShell>
      {/* Logo = retour à l'accueil XR Technologie (convention site,
          actée le 27/07) ; le haut de page reste accessible au scroll. */}
      <Link href="/" className={styles.logo}>
        <Image
          src={logoImage.src}
          alt={logoImage.alt}
          width={logoImage.width}
          height={logoImage.height}
          priority
          unoptimized
          className={styles.logoImg}
        />
      </Link>
      <nav aria-label="Navigation principale" className={styles.nav}>
        {navLinks.map((link) => (
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
      <ShimmerCTA scrollTo="devis" size="sm" pulse={false}>
        Demander un devis
      </ShimmerCTA>
    </HeaderShell>
  );
}
