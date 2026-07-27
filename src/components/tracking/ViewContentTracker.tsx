"use client";

import { useEffect } from "react";
import { PRODUCTS, type ProductId } from "@/config/products";
import { fbEventOnce, META_CATEGORIES } from "@/lib/tracking/fpixel";

/**
 * ViewContent Meta à l'arrivée sur la page d'un pôle : alimente les
 * audiences publicitaires PAR PRODUIT (retargeting « a vu XR 360 »…).
 * Dédupliqué par session et par pôle ; comme tout event Meta, il ne part
 * qu'après consentement (file locale de fpixel sinon). Le funnel VR pousse
 * déjà un ViewContent plus précis à la sélection d'offre (OfferExplorer).
 */
export function ViewContentTracker({ product }: { product: ProductId }) {
  useEffect(() => {
    const name = PRODUCTS.find((entry) => entry.id === product)?.name;
    fbEventOnce(`view_content_${product}`, "ViewContent", {
      content_category: META_CATEGORIES[product].view,
      ...(name !== undefined && { content_name: name }),
    });
  }, [product]);

  return null;
}
