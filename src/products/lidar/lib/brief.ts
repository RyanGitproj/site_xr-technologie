import { z } from "zod";
import { LIDAR_OFFERS, LIDAR_OFFER_IDS } from "@/products/lidar/config/offers";
import { packBelongsToGroup } from "@/components/offers/catalog";

/**
 * Brief mission XR LiDAR (« Présenter mon site ») : le besoin (famille +
 * solution), le site, la mission, les coordonnées : les questions des
 * brochures (type, localisation, surface, objectif, zones, livrables,
 * logiciels, budget, période). Schéma UNIQUE client + serveur. Ids
 * kebab-case = valeurs DB : NE JAMAIS renommer après prod.
 */

export const TYPE_SITE_VALUES = [
  "batiment",
  "chantier",
  "site-industriel",
  "patrimoine",
  "terrain-exterieur",
  "autre",
] as const;

export const OBJECTIF_VALUES = [
  "releve-existant",
  "avant-travaux",
  "documentation-chantier",
  "patrimoine-conservation",
  "valorisation-commerciale",
  "autre",
] as const;

/** Livrables attendus (multi) : confirmés avant mission (brochure). */
export const LIVRABLE_VALUES = [
  "nuage-de-points",
  "plans-2d",
  "modeles-3d-bim",
  "visite-3d",
  "a-definir",
] as const;

/** Tranches calées sur les prix réels du catalogue (450 k à 7 M Ar/mois). */
export const BUDGET_VALUES = ["moins-1m", "1-3m", "3-7m", "plus-7m", "a-definir"] as const;

/** E.164, le format que produit PhoneField (react-phone-number-input). */
const PHONE_E164_REGEX = /^\+[1-9]\d{6,14}$/;

const briefObject = z.object({
  famille: z.enum(LIDAR_OFFER_IDS, "Indiquez votre besoin."),
  /** "" = pas encore choisie ; sinon une solution de la famille. */
  offre: z.string(),
  typeSite: z.enum(TYPE_SITE_VALUES, "Indiquez le type de site."),
  localisation: z
    .string()
    .trim()
    .min(2, "Indiquez la localisation du site.")
    .max(150, "150 caractères maximum."),
  /** Optionnel : texte libre (m², nombre de niveaux…). */
  surface: z.string().trim().max(60, "60 caractères maximum."),
  objectif: z.enum(OBJECTIF_VALUES, "Choisissez l'objectif du relevé."),
  livrables: z.array(z.enum(LIVRABLE_VALUES)).max(LIVRABLE_VALUES.length),
  /** Optionnel : logiciels dans lesquels les données seront exploitées. */
  logiciels: z.string().trim().max(150, "150 caractères maximum."),
  budget: z.enum(BUDGET_VALUES, "Choisissez une fourchette de budget."),
  periode: z
    .string()
    .trim()
    .min(2, "Indiquez la période envisagée.")
    .max(120, "120 caractères maximum."),
  /** Optionnel : zones concernées, contraintes, précisions. */
  precisions: z.string().trim().max(1000, "1000 caractères maximum."),
  nom: z.string().trim().min(2, "Indiquez votre nom.").max(120, "120 caractères maximum."),
  entreprise: z.string().trim().max(150, "150 caractères maximum."),
  telephone: z
    .string("Indiquez votre numéro de téléphone.")
    .min(1, "Indiquez votre numéro de téléphone.")
    .regex(PHONE_E164_REGEX, "Numéro invalide."),
  email: z.string().trim().min(1, "Indiquez votre email.").pipe(z.email("Email invalide.")),
});

/** Une solution cochée doit appartenir à la famille choisie (même garde que
    le couple secteur/pack du funnel VR). */
export const briefSchema = briefObject.superRefine((brief, ctx) => {
  if (brief.offre === "") return;
  if (!packBelongsToGroup(LIDAR_OFFERS, brief.famille, brief.offre)) {
    ctx.addIssue({ code: "custom", path: ["offre"], message: "Solution invalide pour ce besoin." });
  }
});

export type Brief = z.infer<typeof briefSchema>;

export { attributionSchema, type Attribution } from "@/lib/validations/attribution";
