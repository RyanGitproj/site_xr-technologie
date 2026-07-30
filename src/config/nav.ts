/**
 * Libellés de la navigation unifiée (décision Ryan 30/07) : toutes les
 * navbars affichent le même menu Accueil + 3 pôles, quelle que soit la page.
 * Les entrées produit viennent de PRODUCTS (config/products.ts).
 */
export const mainNav = {
  navLabel: "Navigation principale",
  homeLabel: "Accueil",
  homeRoute: "/",
  menuOpenLabel: "Ouvrir le menu",
  menuCloseLabel: "Fermer le menu",
  upcomingBadge: "Bientôt",
} as const;

/** Sous-barre des pages produit (PoleSubBar) : sommaire interne du pôle
    (scrollTo, aucune ancre d'URL) + CTA. */
export const subNav = {
  navLabel: "Sections de la page",
} as const;
