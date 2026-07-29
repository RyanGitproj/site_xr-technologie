"use client";

import { useSyncExternalStore } from "react";
import type { Offer360Id } from "@/products/xr360/config/content";

/**
 * Sélection « Choisir ce niveau » partagée entre la section Offres et le
 * brief (présélection des supports + mention de l'offre dans le message).
 * Même pattern module-scope que le pôle VR (selection.ts) : deux
 * consommateurs client montés en permanence, pas besoin de context.
 * null tant qu'aucun CTA d'offre n'a été cliqué (brief vierge).
 */

let selection: Offer360Id | null = null;
const listeners = new Set<() => void>();

export function chooseOffer360(offerId: Offer360Id): void {
  selection = offerId;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => selection;
const getServerSnapshot = () => null;

export function useOffer360Selection(): Offer360Id | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
