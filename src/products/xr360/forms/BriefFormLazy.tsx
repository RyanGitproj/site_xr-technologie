"use client";

import dynamic from "next/dynamic";
import { FormSkeleton } from "@/components/forms/FormSkeleton";

/** Même politique que LeadFormLazy (vr) : le chunk du brief (PhoneInput +
    Zod) sort du bundle de route et du prefetch des liens de l'accueil. */
export const BriefFormLazy = dynamic(
  () => import("./BriefForm").then((mod) => mod.BriefForm),
  { ssr: false, loading: () => <FormSkeleton /> },
);
