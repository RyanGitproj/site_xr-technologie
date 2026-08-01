import Image from "next/image";
import Link from "next/link";
import { GridPulse } from "@/components/fx/GridPulse";
import { WhatsAppFooterLink } from "@/components/tracking/WhatsAppFooterLink";
import { CookiePreferencesLink } from "@/components/tracking/CookiePreferencesLink";
import { footerContent } from "@/products/vr/config/content";
import { logoImage } from "@/products/vr/config/images";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/format/whatsapp";
import styles from "./Footer.module.css";

/** Section 11 du blueprint : footer sur trame circuit animée (GridPulse). */
export function Footer() {
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsappNumber,
    "Bonjour XR Technologie ! J'ai une question sur XR VR Discovery.",
  );

  return (
    <footer className={`fx-section ${styles.footer}`}>
      <GridPulse intensity="ambient" patternId="grid-pulse-footer" />
      <div className={styles.grid}>
        <div>
          <Image
            src={logoImage.src}
            alt={logoImage.alt}
            width={logoImage.width}
            height={logoImage.height}
            unoptimized
            className={styles.brandLogo}
          />
          <p className={styles.baseline}>{footerContent.baseline}</p>
        </div>
        <div>
          <h2 className={styles.colTitle}>{footerContent.universesTitle}</h2>
          <ul className={styles.list}>
            {footerContent.universes.map((universe) => (
              <li key={universe} className={styles.universe}>
                <span className={styles.muted}>{universe}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className={styles.colTitle}>{footerContent.contactTitle}</h2>
          <ul className={styles.list}>
            <li>
              <WhatsAppFooterLink href={whatsappHref} className={styles.link}>
                WhatsApp
              </WhatsAppFooterLink>
            </li>
            <li>
              <a href={`tel:+${siteConfig.whatsappNumber}`} className={styles.link}>
                {siteConfig.phone.display}
              </a>
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
        <p className={styles.mentions}>{footerContent.mentions}</p>
        <div className={styles.legalLinks}>
          <Link href="/mentions-legales" className={styles.link}>
            {footerContent.legalLabel}
          </Link>
          <Link href="/confidentialite" className={styles.link}>
            {footerContent.privacyLabel}
          </Link>
          <CookiePreferencesLink className={styles.link} />
        </div>
      </div>
    </footer>
  );
}
