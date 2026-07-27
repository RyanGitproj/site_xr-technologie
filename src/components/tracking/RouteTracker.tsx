"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";

/**
 * page_view GA4 pour les navigations App Router. Le page_view initial est émis
 * par la balise GA4 « config » de GTM au chargement de la page ; ce tracker ne
 * couvre que les navigations SPA suivantes (ex. redirect de la Server Action
 * vers /merci, qui est une navigation RSC sans rechargement). On saute donc le
 * premier rendu (lastPath initialisé à l'URL courante) pour ne pas doubler le
 * page_view d'atterrissage.
 */
export function RouteTracker() {
  const pathname = usePathname();
  const lastPath = useRef(pathname);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    pushDataLayerEvent("page_view", { page_path: pathname });
  }, [pathname]);

  return null;
}
