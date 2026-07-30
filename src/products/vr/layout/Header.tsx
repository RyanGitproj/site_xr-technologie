"use client";

import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { HeaderBrand } from "@/components/layout/HeaderBrand";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { PoleSubBar } from "@/components/layout/PoleSubBar";
import { ProductNav } from "@/components/layout/ProductNav";
import { hero, navLinks } from "@/products/vr/config/content";
import { logoImage } from "@/products/vr/config/images";

/** Navbar VR : barre principale unifiée (lockup + menu pôles) + sous-barre
    du pôle (logo, sommaire interne, CTA devis). */
export function Header() {
  return (
    <HeaderShell
      brand={<HeaderBrand />}
      nav={<ProductNav />}
      subBar={
        <PoleSubBar
          logo={logoImage}
          links={navLinks}
          cta={
            <ShimmerCTA scrollTo="devis" size="sm" pulse={false}>
              {hero.ctaPrimary}
            </ShimmerCTA>
          }
        />
      }
    />
  );
}
