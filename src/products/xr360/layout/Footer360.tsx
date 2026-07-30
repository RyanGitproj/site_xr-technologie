import Image from "next/image";
import Link from "next/link";
import { CookiePreferencesLink } from "@/components/tracking/CookiePreferencesLink";
import { WhatsAppFooterLink } from "@/components/tracking/WhatsAppFooterLink";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/format/whatsapp";
import { footer360, logo360 } from "@/products/xr360/config/content";
import styles from "./Footer360.module.css";

/** Footer du funnel 360 : baseline, contact, retour discret vers le site. */
export function Footer360() {
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsappNumber,
    "Bonjour XR Technologie ! J'ai une question sur XR 360.",
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <Image
            src={logo360.src}
            alt={logo360.alt}
            width={logo360.width}
            height={logo360.height}
            unoptimized
            className={styles.brandLogo}
          />
          <p className={styles.baseline}>{footer360.baseline}</p>
        </div>
        <div>
          <h2 className={styles.colTitle}>{footer360.contactTitle}</h2>
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
        <p className={styles.muted}>{footer360.mentions}</p>
        <div className={styles.legalLinks}>
          <Link href="/" className={styles.link}>
            {footer360.homeLabel}
          </Link>
          <Link href="/mentions-legales" className={styles.link}>
            {footer360.legalLabel}
          </Link>
          <Link href="/confidentialite" className={styles.link}>
            {footer360.privacyLabel}
          </Link>
          <CookiePreferencesLink className={styles.link} />
        </div>
      </div>
    </footer>
  );
}
