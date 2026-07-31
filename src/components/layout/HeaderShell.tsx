"use client";

import { createContext, useContext, useState } from "react";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { cx } from "@/lib/cx";
import { useCompactHeader } from "@/lib/motion/useCompactHeader";
import styles from "./HeaderShell.module.css";

type HeaderShellProps = {
  /** Lockup XR Technologie, lien accueil (HeaderBrand). */
  brand: React.ReactNode;
  /** Menu unifié Accueil + pôles (ProductNav). */
  nav: React.ReactNode;
  /** Action propre à la page dans la barre principale (Contact du site). */
  actions?: React.ReactNode;
  /** Sous-barre de pôle (PoleSubBar) : logo + ancres + CTA, pages produit.
      Sa présence pose data-subnav sur le header, qui étend --header-h
      (règle html:has de globals.css). */
  subBar?: React.ReactNode;
};

/* Le panneau du menu mobile doit vivre HORS du GlassPanel de la barre : un
   backdrop-filter parent devient la racine de backdrop de ses descendants,
   et le blur du menu ne verrait plus la page derrière lui. ProductNav
   téléporte donc son panneau vers ce point d'ancrage, sous la barre. */
const MenuHostContext = createContext<HTMLDivElement | null>(null);

export function useHeaderMenuHost(): HTMLDivElement | null {
  return useContext(MenuHostContext);
}

/**
 * Navbar de référence du site : bandeau de verre fixe, pleine largeur, collé
 * au haut de l'écran, qui se compacte au scroll et porte le filet de
 * progression sur son arête basse. Chaque page n'apporte que son CTA : le
 * lockup et le menu (Accueil + pôles) sont les mêmes partout, la palette
 * vient du [data-theme] ambiant.
 */
export function HeaderShell({ brand, nav, actions, subBar }: HeaderShellProps) {
  const compact = useCompactHeader();
  const [menuHost, setMenuHost] = useState<HTMLDivElement | null>(null);

  return (
    <header
      className={cx(styles.header, compact && styles.compact)}
      data-subnav={subBar ? "" : undefined}
    >
      <MenuHostContext.Provider value={menuHost}>
        {/* Le verre ne couvre QUE la barre : la rangée du sous-menu est
            transparente, seule la capsule (PoleSubBar) y flotte. */}
        <GlassPanel thin degradeOffscreen={false} className={styles.panel}>
          <div className={styles.bar}>
            <div className={styles.brand}>{brand}</div>
            <div className={styles.nav}>{nav}</div>
            {actions ? <div className={styles.actions}>{actions}</div> : null}
          </div>
          <ScrollProgress />
        </GlassPanel>
        {subBar ? <div className={styles.subRow}>{subBar}</div> : null}
        <div ref={setMenuHost} />
      </MenuHostContext.Provider>
    </header>
  );
}
