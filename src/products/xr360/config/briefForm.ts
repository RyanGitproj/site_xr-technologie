import {
  Building2,
  GraduationCap,
  Headset,
  Hotel,
  Landmark,
  Link2,
  Mail,
  MoreHorizontal,
  Share2,
  Store,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { Brief } from "@/products/xr360/lib/brief";

/** Libellés français du formulaire de brief 360 (les valeurs vivent dans
    lib/brief.ts : ids kebab-case = colonnes DB). */

export const FORM_STEPS = [
  { title: "Votre lieu", fields: ["typeLieu"] },
  { title: "Votre projet", fields: ["objectif", "supports", "message"] },
  { title: "Vos coordonnées", fields: ["nom", "telephone", "email"] },
] as const satisfies readonly { title: string; fields: readonly (keyof Brief)[] }[];

export const TYPE_LIEU_LABELS: Record<Brief["typeLieu"], string> = {
  "hotel-hebergement": "Hôtel & hébergement",
  immobilier: "Immobilier",
  restaurant: "Restaurant",
  "commerce-showroom": "Commerce & showroom",
  "ecole-formation": "École & formation",
  "site-culturel-patrimonial": "Site culturel & patrimonial",
  entreprise: "Entreprise",
  autre: "Autre lieu",
};

export const TYPE_LIEU_ICONS: Record<Brief["typeLieu"], LucideIcon> = {
  "hotel-hebergement": Hotel,
  immobilier: Building2,
  restaurant: UtensilsCrossed,
  "commerce-showroom": Store,
  "ecole-formation": GraduationCap,
  "site-culturel-patrimonial": Landmark,
  entreprise: Building2,
  autre: MoreHorizontal,
};

export const OBJECTIF_LABELS: Record<Brief["objectif"], string> = {
  "faire-decouvrir": "Faire découvrir mon lieu à distance",
  "vendre-louer": "Vendre ou louer un bien",
  "attirer-reservations": "Attirer des réservations ou des clients",
  "presenter-partenaires": "Présenter à des partenaires ou investisseurs",
  autre: "Autre objectif",
};

export const SUPPORT_LABELS: Record<Brief["supports"][number], string> = {
  "site-internet": "Mon site internet",
  "reseaux-sociaux": "Réseaux sociaux",
  "email-qr": "Email & QR code",
  "casque-vr": "Casque VR",
};

export const SUPPORT_ICONS: Record<Brief["supports"][number], LucideIcon> = {
  "site-internet": Link2,
  "reseaux-sociaux": Share2,
  "email-qr": Mail,
  "casque-vr": Headset,
};

export const FIELD_LABELS = {
  typeLieu: "Quel lieu souhaitez-vous faire visiter ?",
  objectif: "Quel est votre objectif principal ?",
  supports: "Où diffuser la visite ?",
  supportsHint: "Plusieurs choix possibles ; nous vous conseillons si vous hésitez.",
  message: "Parlez-nous de votre lieu",
  messagePlaceholder: "Espaces à valoriser, surfaces, contraintes, délais…",
  nom: "Votre nom",
  email: "Votre email",
  telephone: "Votre téléphone",
  submit: "Envoyer mon brief",
  next: "Continuer",
  back: "Retour",
} as const;

export const briefFormSection = {
  id: "brief",
  kicker: "Créer une visite virtuelle",
  title: "Présentez-nous votre lieu",
  subtitle:
    "Trois étapes suffisent : votre lieu, votre projet, vos coordonnées. Nous préparons un parcours adapté et revenons vers vous rapidement.",
} as const;
