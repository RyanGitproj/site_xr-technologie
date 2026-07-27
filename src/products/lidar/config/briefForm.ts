import {
  Box,
  Building2,
  Construction,
  Factory,
  FileText,
  Landmark,
  Map,
  MoreHorizontal,
  MousePointerClick,
  Mountain,
  type LucideIcon,
} from "lucide-react";
import type { Brief } from "@/products/lidar/lib/brief";

/** Libellés français du brief LiDAR (les valeurs vivent dans lib/brief.ts :
    ids kebab-case = colonnes DB). */

export const FORM_STEPS = [
  { title: "Votre site", fields: ["typeSite", "localisation", "surface"] },
  { title: "Votre mission", fields: ["objectif", "livrables", "logiciels", "precisions"] },
  { title: "Vos coordonnées", fields: ["nom", "entreprise", "telephone", "email"] },
] as const satisfies readonly { title: string; fields: readonly (keyof Brief)[] }[];

export const TYPE_SITE_LABELS: Record<Brief["typeSite"], string> = {
  batiment: "Bâtiment ou local",
  chantier: "Chantier en cours",
  "site-industriel": "Site industriel",
  patrimoine: "Patrimoine & bâtiment historique",
  "terrain-exterieur": "Terrain & site extérieur",
  autre: "Autre site",
};

export const TYPE_SITE_ICONS: Record<Brief["typeSite"], LucideIcon> = {
  batiment: Building2,
  chantier: Construction,
  "site-industriel": Factory,
  patrimoine: Landmark,
  "terrain-exterieur": Mountain,
  autre: MoreHorizontal,
};

export const OBJECTIF_LABELS: Record<Brief["objectif"], string> = {
  "releve-existant": "Relever l'existant avant une étude",
  "avant-travaux": "Préparer des travaux ou une rénovation",
  "documentation-chantier": "Documenter ou suivre un chantier",
  "patrimoine-conservation": "Conserver un état numérique du site",
  autre: "Autre objectif",
};

export const LIVRABLE_LABELS: Record<Brief["livrables"][number], string> = {
  "nuage-de-points": "Nuage de points",
  "plans-2d": "Plans 2D",
  "modeles-3d-bim": "Modèles 3D / BIM",
  "visite-3d": "Visite 3D",
  "a-definir": "À définir ensemble",
};

export const LIVRABLE_ICONS: Record<Brief["livrables"][number], LucideIcon> = {
  "nuage-de-points": Box,
  "plans-2d": Map,
  "modeles-3d-bim": FileText,
  "visite-3d": MousePointerClick,
  "a-definir": MoreHorizontal,
};

export const FIELD_LABELS = {
  typeSite: "Quel type de site faut-il relever ?",
  localisation: "Où se trouve le site ?",
  localisationPlaceholder: "Ex. : Antananarivo, Analakely",
  surface: "Surface estimée",
  surfacePlaceholder: "Ex. : 800 m², 3 niveaux",
  objectif: "Quel est l'objectif du relevé ?",
  livrables: "Quels livrables attendez-vous ?",
  livrablesHint: "Plusieurs choix possibles ; les formats sont confirmés avant la mission.",
  logiciels: "Logiciels utilisés",
  logicielsPlaceholder: "Ex. : AutoCAD, Revit, ArchiCAD",
  precisions: "Zones concernées, contraintes, précisions",
  precisionsPlaceholder: "Ex. : intérieur + façades, accès de nuit uniquement…",
  nom: "Votre nom",
  entreprise: "Votre structure",
  entreprisePlaceholder: "Ex. : cabinet, entreprise, collectivité",
  email: "Votre email",
  telephone: "Votre téléphone",
  submit: "Envoyer ma demande",
  next: "Continuer",
  back: "Retour",
} as const;

export const briefFormSection = {
  id: "brief",
  kicker: "Présenter mon site",
  title: "Préparons votre mission",
  subtitle:
    "Type de site, localisation, objectif, livrables : plus le besoin est clair, plus les données seront utiles et exploitables. Notre équipe évalue votre demande et revient vers vous rapidement.",
} as const;
