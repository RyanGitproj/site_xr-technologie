"use client";

import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { HeaderBrand } from "@/components/layout/HeaderBrand";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { PoleSubBar } from "@/components/layout/PoleSubBar";
import { ProductNav } from "@/components/layout/ProductNav";
import { PRODUCT_BY_ID } from "@/config/products";
import { hero, navLinks } from "@/products/vr/config/content";
import { logoImage } from "@/products/vr/config/images";

/** Navbar VR : lockup du pôle + menu unifié, capsule du sommaire interne
    avec le CTA devis. */
export function Header() {
  return (
    <HeaderShell
      brand={<HeaderBrand logo={logoImage} href={PRODUCT_BY_ID.vr.route} />}
      nav={<ProductNav />}
      subBar={
        <PoleSubBar
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
