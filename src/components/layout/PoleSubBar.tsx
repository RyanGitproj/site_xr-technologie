"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { subNav } from "@/config/nav";
import { cx } from "@/lib/cx";
import { scrollToSection } from "@/lib/scrollToSection";
import { useHeaderMenuHost } from "./HeaderShell";
import styles from "./PoleSubBar.module.css";

type PoleSubBarProps = {
  /** Ancres internes du pôle (navLinks / nav360 / navLidar), scrollTo sans #hash. */
  links: readonly { readonly label: string; readonly id: string }[];
  /** ShimmerCTA du pôle, épinglé en embout droit, toujours visible. */
  cta: React.ReactNode;
};

/* Repli mobile : dès 4 ancres, seules les 2 premières restent en ligne
   (masquage CSS via data-collapsed), le reste passe dans le menu déroulant.
   À 3 ancres et moins, un menu d'une seule entrée n'aurait pas de sens : la
   rangée défilable actuelle suffit. */
const INLINE_COUNT = 2;

/**
 * Capsule du sous-menu des pages produit : le sommaire interne du pôle et
 * son CTA, dans une bulle de verre qui pend de l'onglet actif (slot subBar
 * de HeaderShell). L'identité du pôle vit dans la barre principale (lockup)
 * et la teinte de la capsule. Sur mobile, 2 ancres restent visibles et un
 * chevron déroule les autres dans un panneau sous la capsule.
 */
export function PoleSubBar({ links, cta }: PoleSubBarProps) {
  const overflowLinks = links.length > INLINE_COUNT + 1 ? links.slice(INLINE_COUNT) : [];
  const collapsed = overflowLinks.length > 0;

  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuHost = useHeaderMenuHost();
  const menuId = useId();

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

  const onMenuLink = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <GlassPanel thin degradeOffscreen={false} className={styles.subBar}>
      {/* Le chevron vit HORS de la rangée défilable : dedans, il partirait
          au scroll et le fondu du mask l'effacerait sur écran étroit. */}
      <nav aria-label={subNav.navLabel} className={styles.navArea}>
        <div className={styles.scroller} data-collapsed={collapsed ? "" : undefined}>
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              className={styles.anchor}
              onClick={() => scrollToSection(link.id)}
            >
              {link.label}
            </button>
          ))}
        </div>
        {collapsed ? (
          <button
            ref={toggleRef}
            type="button"
            className={styles.moreToggle}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? subNav.moreCloseLabel : subNav.moreOpenLabel}
            onClick={() => setOpen((value) => !value)}
          >
            <ChevronDown aria-hidden className={cx(styles.chevron, open && styles.chevronOpen)} />
          </button>
        ) : null}
      </nav>
      <div className={styles.cta}>{cta}</div>
      {/* Panneau téléporté hors de la capsule : un backdrop-filter parent
          devient la racine de backdrop de ses descendants, le verre du menu
          ne flouterait plus la page (même contrainte que ProductNav, voir
          HeaderShell). */}
      {collapsed && menuHost
        ? createPortal(
            <div ref={menuRef} id={menuId} className={cx(styles.menu, open && styles.menuOpen)}>
              <GlassPanel thin degradeOffscreen={false} className={styles.menuPanel}>
                {overflowLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    className={styles.menuItem}
                    onClick={() => onMenuLink(link.id)}
                  >
                    {link.label}
                  </button>
                ))}
              </GlassPanel>
            </div>,
            menuHost,
          )
        : null}
    </GlassPanel>
  );
}
