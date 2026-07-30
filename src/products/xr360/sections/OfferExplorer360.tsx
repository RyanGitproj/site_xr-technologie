"use client";

import { OfferExplorer } from "@/components/offers/OfferExplorer";
import { offers360 } from "@/products/xr360/config/content";
import { XR360_OFFERS } from "@/products/xr360/config/offers";
import { chooseXr360Offer } from "@/products/xr360/lib/selection";

/**
 * Branchement du sélecteur partagé sur le catalogue XR 360 : le store de
 * présélection est un module client, donc le câblage vit ici et la section
 * qui l'englobe reste un composant serveur.
 */
export function OfferExplorer360() {
  return (
    <OfferExplorer
      groups={XR360_OFFERS}
      copy={offers360}
      product="xr360"
      formAnchor="brief"
      onChoose={chooseXr360Offer}
    />
  );
}
