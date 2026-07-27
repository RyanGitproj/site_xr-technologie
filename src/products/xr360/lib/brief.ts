import { z } from "zod";

/**
 * Brief projet XR 360 (« Créer une visite virtuelle ») : le lieu, le
 * projet, les coordonnées. Schéma UNIQUE client + serveur. Les libellés
 * vivent dans config/briefForm.ts. Ids kebab-case = valeurs DB : NE JAMAIS
 * renommer après mise en production.
 */

export const TYPE_LIEU_VALUES = [
  "hotel-hebergement",
  "immobilier",
  "restaurant",
  "commerce-showroom",
  "ecole-formation",
  "site-culturel-patrimonial",
  "entreprise",
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

/** E.164, le format que produit PhoneField (react-phone-number-input). */
const PHONE_E164_REGEX = /^\+[1-9]\d{6,14}$/;

export const briefSchema = z.object({
  typeLieu: z.enum(TYPE_LIEU_VALUES, "Indiquez le type de lieu."),
  objectif: z.enum(OBJECTIF_VALUES, "Choisissez votre objectif principal."),
  /** Multi-choix optionnel : un prospect peut ne pas encore savoir. */
  supports: z.array(z.enum(SUPPORT_VALUES)).max(SUPPORT_VALUES.length),
  message: z.string().trim().max(1000, "1000 caractères maximum."),
  nom: z.string().trim().min(2, "Indiquez votre nom.").max(120, "120 caractères maximum."),
  telephone: z
    .string("Indiquez votre numéro de téléphone.")
    .min(1, "Indiquez votre numéro de téléphone.")
    .regex(PHONE_E164_REGEX, "Numéro invalide."),
  email: z.string().trim().min(1, "Indiquez votre email.").pipe(z.email("Email invalide.")),
});

export type Brief = z.infer<typeof briefSchema>;

export { attributionSchema, type Attribution } from "@/lib/validations/attribution";
