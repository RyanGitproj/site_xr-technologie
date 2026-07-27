import type { ProductId } from "@/config/products";
import { getConsentChoice } from "./consent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Catégorie Meta stable, partagée entre ViewContent et Lead pour que les
 * événements s'agrègent sous les mêmes libellés dans Ads Manager. Le nom
 * précis de l'offre voyage dans `content_name`, pas dans la catégorie.
 */
export const META_CONTENT = {
  offre: "Offre XR VR Discovery",
  lead: "Lead XR VR Discovery",
} as const;

/**
 * Catégories par pôle pour les trackers multi-pôles (ViewContentTracker,
 * LeadConversionTracker). `vr` = les libellés historiques du funnel VR :
 * les campagnes déjà configurées ne voient aucun changement.
 */
export const META_CATEGORIES: Record<ProductId, { view: string; lead: string }> = {
  vr: { view: META_CONTENT.offre, lead: META_CONTENT.lead },
  xr360: { view: "Offre XR 360", lead: "Lead XR 360" },
  lidar: { view: "Offre XR LiDAR", lead: "Lead XR LiDAR" },
};

type PendingMetaEvent = {
  name: string;
  params?: Record<string, unknown>;
};

const PENDING_EVENTS_KEY = "xr_meta_pending";
const PENDING_EVENTS_MAX = 20;

function readPendingEvents(): PendingMetaEvent[] {
  try {
    const raw = window.sessionStorage.getItem(PENDING_EVENTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PendingMetaEvent[]) : [];
  } catch {
    return [];
  }
}

/**
 * Envoie un événement Meta si le pixel est monté ; sinon le met en attente
 * dans sessionStorage tant que le visiteur n'a pas refusé les cookies. Rien ne
 * part vers Meta avant consentement : la file est purement locale (aucune
 * requête, aucun cookie), vidée au montage du pixel, ou purgée sans envoi si le
 * visiteur refuse.
 *
 * Cas couvert : un `Lead` peut être atteint (page /merci) avant que le bandeau
 * n'ait été accepté. Sans file d'attente, cette conversion serait perdue.
 */
export function fbEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (window.fbq) {
    window.fbq("track", name, params);
    return;
  }
  if (getConsentChoice() === "denied") return;
  const pending = readPendingEvents();
  if (pending.length >= PENDING_EVENTS_MAX) return;
  pending.push({ name, params });
  window.sessionStorage.setItem(PENDING_EVENTS_KEY, JSON.stringify(pending));
}

/**
 * Comme fbEvent, mais au plus une fois par session (jalons non répétables :
 * conversion Lead). Dédup best-effort via sessionStorage ; si le stockage est
 * indisponible on laisse passer (un doublon rare vaut mieux qu'une conversion
 * perdue), cohérent avec pushDataLayerEventOnce.
 */
export function fbEventOnce(
  dedupKey: string,
  name: string,
  params?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;
  try {
    const key = `fb_once_${dedupKey}`;
    if (window.sessionStorage.getItem(key) !== null) return;
    window.sessionStorage.setItem(key, "1");
  } catch {
    // sessionStorage indisponible : on tombe volontairement sur l'envoi.
  }
  fbEvent(name, params);
}

/** Appelé au montage du pixel (consentement accordé) : envoie la file d'attente. */
export function flushPendingMetaEvents() {
  if (typeof window === "undefined" || !window.fbq) return;
  const pending = readPendingEvents();
  clearPendingMetaEvents();
  for (const event of pending) {
    window.fbq("track", event.name, event.params);
  }
}

/** Appelé au refus des cookies : la file ne doit jamais partir. */
export function clearPendingMetaEvents() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(PENDING_EVENTS_KEY);
}

const LEAD_CONTENT_KEY = "xr_lead_content";

/**
 * Mémorise le nom du secteur au submit pour enrichir le Lead Meta sur /merci :
 * le succès de la Server Action redirige côté serveur, il n'y a pas de callback
 * client pour porter cette donnée jusqu'à la page de conversion.
 */
export function stashLeadContentName(name: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(LEAD_CONTENT_KEY, name);
  } catch {
    // sessionStorage indisponible : le Lead partira sans content_name.
  }
}

/** Lit puis efface le nom de secteur mémorisé (évite tout report sur une visite suivante). */
export function takeLeadContentName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.sessionStorage.getItem(LEAD_CONTENT_KEY);
    if (value !== null) window.sessionStorage.removeItem(LEAD_CONTENT_KEY);
    return value;
  } catch {
    return null;
  }
}
