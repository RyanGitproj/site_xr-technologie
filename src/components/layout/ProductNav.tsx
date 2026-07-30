"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { mainNav } from "@/config/nav";
import { PRODUCTS } from "@/config/products";
import { cx } from "@/lib/cx";
import { activeNavId, type NavEntryId } from "@/lib/nav/activeNavId";
import { useHeaderMenuHost } from "./HeaderShell";
import styles from "./ProductNav.module.css";

type NavEntriesProps = {
  active: NavEntryId | null;
};

/* Les mêmes entrées servent la nav en ligne (desktop) et le panneau mobile :
   le régime d'affichage des libellés (navLabel / shortName) se décide en CSS
   selon le conteneur. aria-current="page" porte l'état actif, la couleur de
   l'indicateur vient de data-pole-accent (Accueil retombe sur l'accent de
   marque). */
function NavEntries({ active }: NavEntriesProps) {
  return (
    <>
      <Link
        href={mainNav.homeRoute}
        className={styles.link}
        aria-current={active === "home" ? "page" : undefined}
      >
        {mainNav.homeLabel}
      </Link>
      {PRODUCTS.map((product) =>
        product.status === "live" ? (
          <Link
            key={product.id}
            href={product.route}
            className={styles.link}
            data-pole-accent={product.id}
            aria-label={product.name}
            aria-current={active === product.id ? "page" : undefined}
          >
            <span className={styles.labelFull}>{product.navLabel}</span>
            <span className={styles.labelShort}>{product.shortName}</span>
          </Link>
        ) : (
          <span key={product.id} className={styles.upcoming}>
            <span className={styles.labelFull}>{product.navLabel}</span>
            <span className={styles.labelShort}>{product.shortName}</span>
            <span className={styles.badge}>{mainNav.upcomingBadge}</span>
          </span>
        ),
      )}
    </>
  );
}

/**
 * Menu unifié de toutes les navbars (décision Ryan 30/07) : Accueil + les
 * 3 pôles, entrée active soulignée aux couleurs du pôle. Desktop : nav en
 * ligne ; mobile : hamburger + panneau de verre déroulant sous la barre
 * (téléporté hors du GlassPanel de la barre, voir HeaderShell).
 */
export function ProductNav() {
  const pathname = usePathname();
  const active = activeNavId(pathname);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuHost = useHeaderMenuHost();
  const menuId = useId();

  /* Naviguer ferme le panneau (le header est remonté par page, mais les
     transitions client conservent l'état du composant). Ajustement d'état
     pendant le rendu, pattern React officiel : pas d'effet, pas de re-rendu
     en cascade. */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <nav aria-label={mainNav.navLabel} className={styles.inlineNav}>
        <NavEntries active={active} />
      </nav>
      <button
        ref={toggleRef}
        type="button"
        className={cx(styles.toggle, open && styles.toggleOpen)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? mainNav.menuCloseLabel : mainNav.menuOpenLabel}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden className={styles.toggleIcon} />
      </button>
      {menuHost
        ? createPortal(
            <div ref={menuRef} id={menuId} className={cx(styles.menu, open && styles.menuOpen)}>
              <GlassPanel thin degradeOffscreen={false} className={styles.menuPanel}>
                <nav aria-label={mainNav.navLabel} className={styles.menuNav}>
                  <NavEntries active={active} />
                </nav>
              </GlassPanel>
            </div>,
            menuHost,
          )
        : null}
    </>
  );
}
