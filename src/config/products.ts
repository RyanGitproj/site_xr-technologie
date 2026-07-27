/**
 * SOURCE DE VÉRITÉ des pôles produits XR Technologie. La home, les
 * navigations et le sitemap itèrent sur PRODUCTS : ajouter un pôle = une
 * entrée ici + ses pages sous src/app/ + son dossier src/products/<id>/.
 * Noms et baselines : charte graphique officielle
 * (docs/Utils/XR_Madagascar_Charte_Graphique_3 produits.pdf).
 */

export type ProductId = "vr" | "xr360" | "lidar";

export type Product = {
  id: ProductId;
  /** Nom officiel du pôle (charte). */
  name: string;
  /** Sous-titre descriptif (charte). */
  descriptor: string;
  /** Signature en trois verbes (charte). */
  baseline: string;
  /** Route de la landing du pôle. */
  route: string;
  /** `upcoming` : pôle annoncé sur la home mais landing pas encore en ligne. */
  status: "live" | "upcoming";
};

export const PRODUCTS: readonly Product[] = [
  {
    id: "vr",
    name: "XR VR Madagascar",
    descriptor: "Réalité virtuelle mobile",
    baseline: "Vivre. Apprendre. Ressentir.",
    route: "/vr",
    status: "live",
  },
  {
    id: "xr360",
    name: "XR 360",
    descriptor: "Visite virtuelle & valorisation immersive",
    baseline: "Montrer. Visiter. Valoriser.",
    route: "/360",
    status: "upcoming",
  },
  {
    id: "lidar",
    name: "XR LiDAR Opérationnel",
    descriptor: "Relevé 3D · Reality capture",
    baseline: "Mesurer. Documenter. Exploiter.",
    route: "/lidar",
    status: "upcoming",
  },
] as const;

/** Pôles dont la landing est en ligne (navigation, sitemap). */
export const LIVE_PRODUCTS = PRODUCTS.filter((product) => product.status === "live");
