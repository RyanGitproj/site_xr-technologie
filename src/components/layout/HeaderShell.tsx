"use client";

import { GlassPanel } from "@/components/fx/GlassPanel";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { cx } from "@/lib/cx";
import { useCompactHeader } from "@/lib/motion/useCompactHeader";
import styles from "./HeaderShell.module.css";

type HeaderShellProps = {
  children: React.ReactNode;
};

/**
 * Navbar de référence du site (celle du pôle VR, généralisée) : bandeau de
 * verre fixe, pleine largeur, collé au haut de l'écran, qui se compacte au
 * scroll et porte le filet de progression sur son arête basse. Chaque pôle
 * n'apporte que son CONTENU (wordmark, liens, CTA) et sa palette, héritée
 * de son [data-theme] : la forme, elle, ne se re-décide pas par page.
 */
export function HeaderShell({ children }: HeaderShellProps) {
  const compact = useCompactHeader();

  return (
    <header className={styles.header}>
      <GlassPanel thin degradeOffscreen={false} className={styles.panel}>
        <div className={cx(styles.bar, compact && styles.compact)}>{children}</div>
        <ScrollProgress />
      </GlassPanel>
    </header>
  );
}
