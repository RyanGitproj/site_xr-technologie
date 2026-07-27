import Link from "next/link";
import { CookiePreferencesLink } from "@/components/tracking/CookiePreferencesLink";
import { WhatsAppFooterLink } from "@/components/tracking/WhatsAppFooterLink";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/format/whatsapp";
import { footerLidar } from "@/products/lidar/config/content";
import styles from "./FooterLidar.module.css";

/** Footer du funnel LiDAR : baseline, contact, retour discret vers le site. */
export function FooterLidar() {
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsappNumber,
    "Bonjour XR Technologie ! J'ai une question sur XR LiDAR Opérationnel.",
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <p className={styles.wordmark}>XR LiDAR Opérationnel</p>
          <p className={styles.baseline}>{footerLidar.baseline}</p>
        </div>
        <div>
          <h2 className={styles.colTitle}>{footerLidar.contactTitle}</h2>
          <ul className={styles.list}>
            <li>
              <WhatsAppFooterLink href={whatsappHref} className={styles.link}>
                WhatsApp
              </WhatsAppFooterLink>
            </li>
            <li>
              <a href={`mailto:${siteConfig.contactEmail}`} className={styles.link}>
                {siteConfig.contactEmail}
              </a>
            </li>
            <li className={styles.muted}>{siteConfig.city}, Madagascar</li>
          </ul>
        </div>
      </div>
      <div className={styles.legal}>
        <p className={styles.muted}>{footerLidar.mentions}</p>
        <div className={styles.legalLinks}>
          <Link href="/" className={styles.link}>
            {footerLidar.homeLabel}
          </Link>
          <Link href="/confidentialite" className={styles.link}>
            {footerLidar.privacyLabel}
          </Link>
          <CookiePreferencesLink className={styles.link} />
        </div>
      </div>
    </footer>
  );
}
