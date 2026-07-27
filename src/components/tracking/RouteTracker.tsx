"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { fbEvent } from "@/lib/tracking/fpixel";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";

/**
 * page_view GA4 + PageView Meta pour les navigations App Router. Les hits
 * initiaux sont émis au chargement (balise GA4 « config » de GTM, init du
 * pixel) ; ce tracker ne couvre que les navigations SPA suivantes (ex.
 * redirect de la Server Action vers une page merci, ou navigation entre
 * pôles). On saute donc le premier rendu (lastPath initialisé à l'URL
 * courante) pour ne pas doubler les hits d'atterrissage.
 */
export function RouteTracker() {
  const pathname = usePathname();
  const lastPath = useRef(pathname);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    pushDataLayerEvent("page_view", { page_path: pathname });
    fbEvent("PageView");
  }, [pathname]);

  return null;
}
