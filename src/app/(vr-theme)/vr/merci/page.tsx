import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Phone } from "lucide-react";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { Meteors } from "@/components/fx/Meteors";
import { LeadConversionTracker } from "@/components/tracking/LeadConversionTracker";
import { PhoneLink } from "@/components/tracking/PhoneLink";
import { siteConfig } from "@/config/site";
import styles from "@/components/ui/merciShell.module.css";

export const metadata: Metadata = {
  title: "Merci | XR VR Discovery",
  robots: { index: false, follow: false },
};

/** Confirmation post-soumission, accessible uniquement avec le cookie httpOnly (30 min). */
export default async function MerciPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("xr_lead") === undefined) redirect("/vr");

  return (
    <main id="contenu" className={styles.main}>
      <LeadConversionTracker />
      <Meteors count={3} />
      <GlassPanel className={styles.panel}>
        <CheckCircle2 aria-hidden="true" className={styles.icon} />
        <h1 className={styles.title}>Demande bien reçue !</h1>
        <p className={styles.body}>
          Merci pour votre confiance. Notre équipe vous recontacte rapidement par téléphone
          ou par email avec la solution adaptée à votre projet.
        </p>
        <p className={styles.callHint}>Besoin d&apos;une réponse immédiate ?</p>
        <div className={styles.actions}>
          <PhoneLink e164={siteConfig.phone.e164} className={styles.call}>
            <Phone aria-hidden="true" className={styles.callIcon} />
            Appeler le {siteConfig.phone.display}
          </PhoneLink>
          <Link href="/vr" className={styles.back}>
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </GlassPanel>
    </main>
  );
}
