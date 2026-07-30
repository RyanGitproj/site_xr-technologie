"use client";

import { OfferExplorer } from "@/components/offers/OfferExplorer";
import { offersSection } from "@/products/vr/config/content";
import { OFFERS } from "@/products/vr/config/offers";
import { chooseOfferPack } from "@/products/vr/lib/selection";

/**
 * Branchement du sélecteur partagé sur le catalogue VR : le store de
 * présélection est un module client, donc le câblage vit ici et la section
 * qui l'englobe reste un composant serveur.
 */
export function OfferExplorerVr() {
  return (
    <OfferExplorer
      groups={OFFERS}
      copy={offersSection}
      product="vr"
      formAnchor="devis"
      onChoose={chooseOfferPack}
    />
  );
}
