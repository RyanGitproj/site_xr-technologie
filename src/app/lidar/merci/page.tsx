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
  title: "Merci | XR LiDAR Opérationnel",
  robots: { index: false, follow: false },
};

/** Confirmation post-brief, accessible uniquement avec le cookie httpOnly (30 min). */
export default async function MerciLidarPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("xrlidar_brief") === undefined) redirect("/lidar");

  return (
    <main id="contenu" className={styles.main}>
      <LeadConversionTracker product="lidar" />
      <GlassPanel className={styles.panel}>
        <CheckCircle2 aria-hidden="true" className={styles.icon} />
        <h1 className={styles.title}>Demande bien reçue !</h1>
        <p className={styles.body}>
          Merci pour votre confiance. Notre équipe évalue votre site et vous recontacte
          rapidement par téléphone ou par email avec une intervention adaptée et les
          livrables confirmés.
        </p>
        <p className={styles.callHint}>Besoin d&apos;une réponse immédiate ?</p>
        <div className={styles.actions}>
          <PhoneLink e164={siteConfig.phone.e164} className={styles.call}>
            <Phone aria-hidden="true" className={styles.callIcon} />
            Appeler le {siteConfig.phone.display}
          </PhoneLink>
          <Link href="/lidar" className={styles.back}>
            ← Retour à XR LiDAR
          </Link>
        </div>
      </GlassPanel>
    </main>
  );
}
