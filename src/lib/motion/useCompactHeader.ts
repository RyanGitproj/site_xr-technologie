"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

/** Seuil de bascule : quelques pixels suffisent, la navbar se resserre dès
    que la page quitte le haut (valeur d'origine de la navbar VR). */
const COMPACT_AFTER_PX = 24;

/**
 * Vrai dès que la page a quitté le haut : la navbar se compacte.
 * Extrait de la navbar VR pour que les quatre navbars partagent LE même
 * comportement (et le même seuil) plutôt que quatre copies dérivantes.
 */
export function useCompactHeader(): boolean {
  const [compact, setCompact] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCompact(latest > COMPACT_AFTER_PX);
  });

  return compact;
}
