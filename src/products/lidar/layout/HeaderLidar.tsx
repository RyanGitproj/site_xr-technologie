"use client";

import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { HeaderBrand } from "@/components/layout/HeaderBrand";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { PoleSubBar } from "@/components/layout/PoleSubBar";
import { ProductNav } from "@/components/layout/ProductNav";
import { heroLidar, logoLidar, navLidar } from "@/products/lidar/config/content";

/** Navbar du funnel LiDAR : barre principale unifiée + sous-barre du pôle
    (logo, sommaire interne, CTA signature « Présenter mon site »). */
export function HeaderLidar() {
  return (
    <HeaderShell
      brand={<HeaderBrand />}
      nav={<ProductNav />}
      subBar={
        <PoleSubBar
          logo={logoLidar}
          links={navLidar}
          cta={
            <ShimmerCTA scrollTo={heroLidar.ctaTargetId} size="sm" pulse={false}>
              {heroLidar.cta}
            </ShimmerCTA>
          }
        />
      }
    />
  );
}
