import { useEffect, useRef, useState } from "react";

/** Avance de montage : la scène se charge et peint sa première frame environ
    un écran et demi avant d'arriver, pour être là quand le lecteur y est. */
const MOUNT_MARGIN = "150% 0px";

/** Deux portes, deux marges : `mounted` prend de l'avance (une fois pour
 * toutes, l'observateur se coupe ensuite), `active` colle au viewport réel
 * pour que le frameloop ne tourne QUE devant les yeux (zéro GPU au repos).
 * Les confondre reviendrait à animer un écran et demi trop tôt. */
export function useSceneGate<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mountGate = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setMounted(true);
        mountGate.disconnect();
      },
      { rootMargin: MOUNT_MARGIN },
    );
    const activeGate = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));

    mountGate.observe(el);
    activeGate.observe(el);
    return () => {
      mountGate.disconnect();
      activeGate.disconnect();
    };
  }, []);

  return { ref, mounted, active };
}
