"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { navLinks } from "@/products/vr/config/content";
import { cx } from "@/lib/cx";
import { logoImage } from "@/products/vr/config/images";
import { scrollToSection } from "@/lib/scrollToSection";
import styles from "./Header.module.css";

/** Navbar flottante en verre fin, se compacte au scroll. ScrollProgress au bord bas. */
export function Header() {
  const [compact, setCompact] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCompact(latest > 24);
  });

  return (
    <header className={styles.header}>
      <GlassPanel thin degradeOffscreen={false} className={styles.panel}>
        <div className={cx(styles.bar, compact && styles.compact)}>
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
        </div>
        <ScrollProgress />
      </GlassPanel>
    </header>
  );
}
