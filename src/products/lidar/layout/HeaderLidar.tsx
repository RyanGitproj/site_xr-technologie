"use client";

import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { HeaderBrand } from "@/components/layout/HeaderBrand";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { PoleSubBar } from "@/components/layout/PoleSubBar";
import { ProductNav } from "@/components/layout/ProductNav";
import { PRODUCT_BY_ID } from "@/config/products";
import { heroLidar, logoLidar, navLidar } from "@/products/lidar/config/content";

/** Navbar du funnel LiDAR : lockup du pôle + menu unifié, capsule du
    sommaire avec le CTA signature. */
export function HeaderLidar() {
  return (
    <HeaderShell
      brand={<HeaderBrand logo={logoLidar} href={PRODUCT_BY_ID.lidar.route} />}
      nav={<ProductNav />}
      subBar={
        <PoleSubBar
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
