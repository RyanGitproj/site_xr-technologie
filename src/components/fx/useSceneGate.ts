import { useEffect, useRef, useState } from "react";

/** Porte d'entrée commune des scènes 3D lazy : `mounted` passe à true (une
 * fois pour toutes) quand l'élément approche du viewport (~1 écran de marge,
 * ce qui diffère le chunk three.js hors first-view), et `active` suit la
 * visibilité réelle (frameloop coupé hors écran, zéro GPU au repos).
 * Extrait de HeadsetSceneLazy. */
export function useSceneGate<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: "60% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, mounted, active };
}
