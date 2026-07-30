import { LIVE_PRODUCTS, type ProductId } from "@/config/products";

export type NavEntryId = ProductId | "home";

/**
 * Entrée active de la nav unifiée pour un pathname donné. Match exact pour
 * l'accueil, préfixe de route pour les pôles (couvre leurs sous-routes).
 * Les pages transverses (ex. /confidentialite) n'activent aucune entrée :
 * un indicateur « Accueil » y mentirait.
 */
export function activeNavId(pathname: string): NavEntryId | null {
  if (pathname === "/") return "home";
  const product = LIVE_PRODUCTS.find(
    (p) => pathname === p.route || pathname.startsWith(`${p.route}/`),
  );
  return product?.id ?? null;
}
