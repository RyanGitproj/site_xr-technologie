"use client";

import { useSyncExternalStore } from "react";
import type { LidarOfferId } from "@/products/lidar/config/offers";

/**
 * Sélection « Choisir cette solution » partagée entre la section Offres et le
 * brief (présélection famille + offre). Store module-scope minimal : les deux
 * seuls consommateurs sont des client components montés en permanence sur la
 * page, donc pas besoin de context ni de lib d'état.
 * null tant qu'aucun CTA de solution n'a été cliqué (formulaire vierge).
 */

export type LidarSelection = {
  famille: LidarOfferId;
  offre: string;
};

let selection: LidarSelection | null = null;
const listeners = new Set<() => void>();

export function chooseLidarOffer(famille: LidarOfferId, offre: string): void {
  selection = { famille, offre };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => selection;
const getServerSnapshot = () => null;

export function useLidarSelection(): LidarSelection | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
