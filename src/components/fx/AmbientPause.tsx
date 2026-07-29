"use client";

import { useRef, type ReactNode } from "react";
import { useOffscreenPause } from "@/lib/motion/useOffscreenPause";

type AmbientPauseProps = {
  className?: string;
  children: ReactNode;
};

/** Enveloppe une animation CSS ambiante et la met en pause hors écran : la
 * classe globale `is-offscreen` est posée sur ce wrapper (useOffscreenPause),
 * le CSS module consommateur cible `:global(.is-offscreen)` pour figer ses
 * `animation-play-state`. Budget chap. 8 : aucune animation ne tourne hors
 * viewport. */
export function AmbientPause({ className, children }: AmbientPauseProps) {
  const ref = useRef<HTMLDivElement>(null);
  useOffscreenPause(ref);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
