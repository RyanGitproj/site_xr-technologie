"use client";

import dynamic from "next/dynamic";
import { FormSkeleton } from "@/components/forms/FormSkeleton";

/**
 * Sort le formulaire du bundle de route : son chunk (react-phone-number-input
 * avec ses métadonnées pays + Zod, ~128 Ko gzip) n'est plus tiré par le
 * prefetch des liens de l'accueil et sort du chemin critique d'hydratation
 * (mesure Lighthouse mobile du 31/07). `ssr: false` : un formulaire n'existe
 * qu'interactif, le HTML serveur n'y perd rien d'indexable.
 */
export const LeadFormLazy = dynamic(
  () => import("./LeadForm").then((mod) => mod.LeadForm),
  { ssr: false, loading: () => <FormSkeleton /> },
);
