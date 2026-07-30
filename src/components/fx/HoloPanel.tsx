import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type HoloPanelProps = {
  /** Contenu animé du panneau (scène 3D, repli image…). */
  children: ReactNode;
  /**
   * Libellé du bandeau de lecture. Les bandes dont le contenu raconte
   * plusieurs étapes (LiDAR) écrivent le leur depuis la scène : elles ne
   * passent rien ici.
   */
  label?: string;
  className?: string;
};

/**
 * Cadre holographique commun aux trois bandes pôles : même arête néon, même
 * trame, même balayage, mêmes équerres — seule la couleur du pôle
 * (--pole-accent, posée par la bande) et le contenu changent. Les styles
 * vivent dans holo-panel.css (classes globales) pour que les scènes puissent
 * réutiliser le bandeau de lecture.
 */
export function HoloPanel({ children, label, className }: HoloPanelProps) {
  return (
    <div className={cx("holo-panel", className)}>
      {children}
      <span aria-hidden="true" className="holo-corner" data-corner="tl" />
      <span aria-hidden="true" className="holo-corner" data-corner="tr" />
      <span aria-hidden="true" className="holo-corner" data-corner="bl" />
      <span aria-hidden="true" className="holo-corner" data-corner="br" />
      {label !== undefined ? (
        <div aria-hidden="true" className="holo-readout holo-readout--idle">
          <p className="holo-caption">{label}</p>
          <span className="holo-track">
            <span className="holo-bar" />
          </span>
        </div>
      ) : null}
    </div>
  );
}
