import { Building2, Ruler } from "lucide-react";
import { allPackIds, getGroup, groupLabels, groupPriceFrom } from "@/components/offers/catalog";
import type { OfferGroup, OfferPack } from "@/components/offers/types";

/**
 * Les 2 familles d'offres XR Reality Capture et leurs 6 solutions. SOURCE DE
 * VÉRITÉ : docs/Nouvelle_brochure/OFFRES COMMERCIALES - LIDAR.pdf et OFFRES
 * TECHNIQUES - LIDAR.pdf (prix, contenus, délais).
 * Les ids (familles ET solutions) alimentent l'enum Zod du formulaire et les
 * colonnes `famille`/`offre` de funnel_xrlidar_leads : NE JAMAIS les renommer
 * après mise en prod. Prix toujours « à partir de », en ariary.
 *
 * Les brochures techniques chiffrent en fourchettes, au m² ou au mois : le
 * `price` porte le PLANCHER, et la fourchette complète avec son unité vit
 * dans les features, là où elle reste lisible sans induire en erreur.
 * Aucune promesse de précision chiffrée (règle de charte du pôle LiDAR) :
 * la brochure elle-même parle de « mesures indicatives ».
 */

export const LIDAR_OFFER_IDS = ["commerciale", "technique"] as const;

export type LidarOfferId = (typeof LIDAR_OFFER_IDS)[number];

export type LidarOffer = OfferGroup<LidarOfferId>;

export type { OfferPack };

export const LIDAR_OFFERS: readonly LidarOffer[] = [
  {
    id: "commerciale",
    name: "Solutions commerciales",
    shortName: "Commerciales",
    icon: Building2,
    tagline: "Un prospect hésite lorsqu'il doit imaginer. Il avance lorsqu'il peut explorer.",
    packs: [
      {
        id: "visite-3d-essentielle",
        name: "XR Visite 3D Essentielle",
        tagline: "Présenter un espace clairement et ouvrir les premières visites à distance.",
        price: 450_000,
        features: [
          "Visite 3D immersive et lien partageable",
          "10 à 20 photos HD",
          "Intégration sur votre site internet",
          "3 mois d'hébergement",
          "1 h 30 à 2 h 30 sur place, livraison en 24 à 48 h",
        ],
      },
      {
        id: "business-immersive",
        name: "XR Business Immersive",
        tagline: "Transformer la découverte de votre établissement en expérience commerciale.",
        price: 900_000,
        featured: true,
        features: [
          "Captation intérieure et extérieure",
          "Visite personnalisée à votre identité",
          "Points interactifs et 20 à 40 photos",
          "Liens de réservation ou de demande de devis",
          "6 à 12 mois d'hébergement, livraison en 2 à 4 jours ouvrés",
        ],
      },
      {
        id: "evenement-salle-3d",
        name: "XR Événement & Salle 3D",
        tagline: "Laisser vos clients se projeter avant de réserver leur événement.",
        price: 1_200_000,
        features: [
          "Parcours immersif de tous les espaces",
          "Capacités d'accueil et configurations mises en valeur",
          "Points d'information interactifs",
          "Formulaire de contact et lien de visite rapide",
          "Support commercial premium, livraison en 3 à 5 jours ouvrés",
        ],
      },
    ],
  },
  {
    id: "technique",
    name: "Solutions techniques",
    shortName: "Techniques",
    icon: Ruler,
    tagline: "Numérisez l'existant pour mieux comprendre, documenter et décider.",
    packs: [
      {
        id: "chantier-track",
        name: "XR Chantier Track",
        tagline: "Suivre l'évolution réelle de votre chantier, étape après étape.",
        price: 1_500_000,
        features: [
          "Scan initial du chantier : 1 500 000 à 3 000 000 Ar",
          "Mise à jour par passage : 900 000 à 2 000 000 Ar",
          "Historique visuel daté et comparatifs avant / après",
          "Annotations, réserves et accès à distance",
          "Rapport livré 24 à 72 h après chaque passage",
        ],
        options: [
          "Contrat mensuel chantier : 1 200 000 à 2 500 000 Ar par mois",
          "Formule 4 passages par mois : 3 500 000 à 7 000 000 Ar par mois",
        ],
      },
      {
        id: "releve-technique-lidar",
        name: "XR Relevé technique LiDAR",
        tagline: "Capturer l'existant pour préparer une étude, une rénovation ou une intervention.",
        price: 1_500_000,
        featured: true,
        features: [
          "3 500 à 6 000 Ar par m², minimum de mission 1 500 000 Ar",
          "Captation intérieure et extérieure, acquisition LiDAR",
          "Nuage de points et mesures indicatives",
          "Préparation des données pour CAD ou BIM",
          "Livraison en 3 à 8 jours ouvrés",
        ],
        options: [
          "Plan 2D : 250 000 à 700 000 Ar, 1 à 3 jours",
          "Export E57 : 600 000 à 1 500 000 Ar, 24 à 48 h",
          "Rapport annoté : 300 000 à 900 000 Ar, 1 à 2 jours",
          "Comparatif avant / après : sur devis, 1 à 2 jours",
        ],
      },
      {
        id: "scan-to-cad-bim",
        name: "XR Scan-to-CAD / BIM",
        tagline: "Transformer les données du terrain en modèles exploitables.",
        price: 4_000_000,
        features: [
          "Traitement du nuage de points",
          "Plans DWG et DXF",
          "Préparation Revit ou Archicad",
          "Modélisation BIM, niveau de détail LOD 200 à 300",
          "Livraison en 7 à 20 jours ouvrés",
        ],
      },
    ],
  },
];

export function getLidarOffer(id: LidarOfferId): LidarOffer {
  return getGroup(LIDAR_OFFERS, id);
}

/** Prix d'appel d'une famille (tuiles du sélecteur) : la solution la moins chère. */
export function lidarOfferPriceFrom(offer: LidarOffer): number {
  return groupPriceFrom(offer);
}

/** Libellés du champ « famille » du formulaire, dérivés et jamais dupliqués. */
export const LIDAR_OFFER_LABELS = groupLabels(LIDAR_OFFERS);

/** Ids de solutions (unicité globale, invariant testé) : enum Zod du champ « offre ». */
export const ALL_LIDAR_PACK_IDS: readonly string[] = allPackIds(LIDAR_OFFERS);
