import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Phone } from "lucide-react";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { LeadConversionTracker } from "@/components/tracking/LeadConversionTracker";
import { PhoneLink } from "@/components/tracking/PhoneLink";
import { siteConfig } from "@/config/site";
import styles from "@/components/ui/merciShell.module.css";

export const metadata: Metadata = {
  title: "Merci | XR 360",
  robots: { index: false, follow: false },
};

/** Confirmation post-brief, accessible uniquement avec le cookie httpOnly (30 min). */
export default async function Merci360Page() {
  const cookieStore = await cookies();
  if (cookieStore.get("xr360_brief") === undefined) redirect("/360");

  return (
    <main id="contenu" className={styles.main}>
      <LeadConversionTracker product="xr360" />
      <GlassPanel className={styles.panel}>
        <CheckCircle2 aria-hidden="true" className={styles.icon} />
        <h1 className={styles.title}>Brief bien reçu !</h1>
        <p className={styles.body}>
          Merci pour votre confiance. Notre équipe étudie votre lieu et vous recontacte
          rapidement par téléphone ou par email avec un parcours de visite adapté.
        </p>
        <p className={styles.callHint}>Besoin d&apos;une réponse immédiate ?</p>
        <div className={styles.actions}>
          <PhoneLink e164={siteConfig.phone.e164} className={styles.call}>
            <Phone aria-hidden="true" className={styles.callIcon} />
            Appeler le {siteConfig.phone.display}
          </PhoneLink>
          <Link href="/360" className={styles.back}>
            ← Retour à XR 360
          </Link>
        </div>
      </GlassPanel>
    </main>
  );
}
