"use client";

import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { HeaderBrand } from "@/components/layout/HeaderBrand";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { PoleSubBar } from "@/components/layout/PoleSubBar";
import { ProductNav } from "@/components/layout/ProductNav";
import { PRODUCT_BY_ID } from "@/config/products";
import { hero360, logo360, nav360 } from "@/products/xr360/config/content";

/** Navbar du funnel 360 : lockup du pôle (halo : visuel pensé pour fond
    blanc) + menu unifié, capsule du sommaire avec le CTA signature. */
export function Header360() {
  return (
    <HeaderShell
      brand={<HeaderBrand logo={logo360} href={PRODUCT_BY_ID.xr360.route} halo />}
      nav={<ProductNav />}
      subBar={
        <PoleSubBar
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
