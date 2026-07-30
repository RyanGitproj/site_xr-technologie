import { z } from "zod";
import { XR360_PACK_IDS } from "@/products/xr360/config/offers";

/**
 * Brief projet XR 360 (« Créer une visite virtuelle ») : le lieu et l'offre,
 * le projet (objectif, supports, budget, période), les coordonnées. Schéma
 * UNIQUE client + serveur. Les libellés vivent dans config/briefForm.ts.
 * Ids kebab-case = valeurs DB : NE JAMAIS renommer après mise en production.
 */

export const TYPE_LIEU_VALUES = [
  "hotel-hebergement",
  "immobilier",
  "restaurant",
  "commerce-showroom",
  "site-touristique",
  "ecole-formation",
  "entreprise",
  "site-culturel-patrimonial",
  "autre",
] as const;

export const OBJECTIF_VALUES = [
  "faire-decouvrir",
  "vendre-louer",
  "attirer-reservations",
  "presenter-partenaires",
  "autre",
] as const;

/** Supports de diffusion souhaités (multi, brochure : diffusion & partage). */
export const SUPPORT_VALUES = [
  "site-internet",
  "reseaux-sociaux",
  "email-qr",
  "casque-vr",
] as const;

/** Tranches calées sur les prix réels du catalogue (700 k à 3,2 M Ar). */
export const BUDGET_VALUES = ["moins-1m", "1-2m", "2-4m", "plus-4m", "a-definir"] as const;

/** E.164, le format que produit PhoneField (react-phone-number-input). */
const PHONE_E164_REGEX = /^\+[1-9]\d{6,14}$/;

const briefObject = z.object({
  typeLieu: z.enum(TYPE_LIEU_VALUES, "Indiquez le type de lieu."),
  /** "" = pas encore choisie ; sinon une des 3 offres du catalogue. */
  offre: z.string(),
  objectif: z.enum(OBJECTIF_VALUES, "Choisissez votre objectif principal."),
  /** Multi-choix optionnel : un prospect peut ne pas encore savoir. */
  supports: z.array(z.enum(SUPPORT_VALUES)).max(SUPPORT_VALUES.length),
  budget: z.enum(BUDGET_VALUES, "Choisissez une fourchette de budget."),
  periode: z
    .string()
    .trim()
    .min(2, "Indiquez la période envisagée.")
    .max(120, "120 caractères maximum."),
  message: z.string().trim().max(1000, "1000 caractères maximum."),
  nom: z.string().trim().min(2, "Indiquez votre nom.").max(120, "120 caractères maximum."),
  telephone: z
    .string("Indiquez votre numéro de téléphone.")
    .min(1, "Indiquez votre numéro de téléphone.")
    .regex(PHONE_E164_REGEX, "Numéro invalide."),
  email: z.string().trim().min(1, "Indiquez votre email.").pipe(z.email("Email invalide.")),
});

/** Les 3 offres valent pour toutes les cibles : la cohérence se limite à
    « offre connue du catalogue » (contrairement à VR où le pack dépend du
    secteur). */
export const briefSchema = briefObject.superRefine((brief, ctx) => {
  if (brief.offre === "") return;
  if (!(XR360_PACK_IDS as readonly string[]).includes(brief.offre)) {
    ctx.addIssue({ code: "custom", path: ["offre"], message: "Offre inconnue." });
  }
});

export type Brief = z.infer<typeof briefSchema>;

export { attributionSchema, type Attribution } from "@/lib/validations/attribution";
