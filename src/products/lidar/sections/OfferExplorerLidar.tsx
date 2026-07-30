"use client";

import { OfferExplorer } from "@/components/offers/OfferExplorer";
import { offersLidar } from "@/products/lidar/config/content";
import { LIDAR_OFFERS } from "@/products/lidar/config/offers";
import { chooseLidarOffer } from "@/products/lidar/lib/selection";

/**
 * Branchement du sélecteur partagé sur le catalogue LiDAR : le store de
 * présélection est un module client, donc le câblage vit ici et la section
 * qui l'englobe reste un composant serveur.
 */
export function OfferExplorerLidar() {
  return (
    <OfferExplorer
      groups={LIDAR_OFFERS}
      copy={offersLidar}
      product="lidar"
      formAnchor="brief"
      optionsLabel={offersLidar.optionsLabel}
      onChoose={chooseLidarOffer}
    />
  );
}
