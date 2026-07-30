"use client";

import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { HeaderBrand } from "@/components/layout/HeaderBrand";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { PoleSubBar } from "@/components/layout/PoleSubBar";
import { ProductNav } from "@/components/layout/ProductNav";
import { hero360, logo360, nav360 } from "@/products/xr360/config/content";

/** Navbar du funnel 360 : barre principale unifiée + sous-barre du pôle
    (logo, sommaire interne, CTA signature « Créer une visite virtuelle »). */
export function Header360() {
  return (
    <HeaderShell
      brand={<HeaderBrand />}
      nav={<ProductNav />}
      subBar={
        <PoleSubBar
          logo={logo360}
          links={nav360}
          cta={
            <ShimmerCTA scrollTo={hero360.ctaTargetId} size="sm" pulse={false}>
              {hero360.cta}
            </ShimmerCTA>
          }
        />
      }
    />
  );
}
