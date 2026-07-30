"use client";

import { useSyncExternalStore } from "react";
import type { Xr360OfferId } from "@/products/xr360/config/offers";

/**
 * Sélection « Choisir cette offre » partagée entre la section Offres et le
 * brief (présélection type de lieu + offre). Même pattern module-scope que
 * le pôle VR (selection.ts) : deux consommateurs client montés en
 * permanence, pas besoin de context.
 * null tant qu'aucun CTA d'offre n'a été cliqué (brief vierge).
 */

export type Xr360Selection = {
  typeLieu: Xr360OfferId;
  offre: string;
};

let selection: Xr360Selection | null = null;
const listeners = new Set<() => void>();

export function chooseXr360Offer(typeLieu: Xr360OfferId, offre: string): void {
  selection = { typeLieu, offre };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => selection;
const getServerSnapshot = () => null;

export function useXr360Selection(): Xr360Selection | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
