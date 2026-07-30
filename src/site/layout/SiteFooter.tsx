import Image from "next/image";
import Link from "next/link";
import { CookiePreferencesLink } from "@/components/tracking/CookiePreferencesLink";
import { WhatsAppFooterLink } from "@/components/tracking/WhatsAppFooterLink";
import { siteLogo } from "@/config/brand";
import { PRODUCTS } from "@/config/products";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/format/whatsapp";
import { contactSection, polesSection, siteFooter } from "@/site/config/content";
import styles from "./SiteFooter.module.css";

/** Footer du site : pôles, contact, confidentialité. Sobre, socle neutre. */
export function SiteFooter() {
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsappNumber,
    contactSection.whatsappMessage,
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <Image
            src={siteLogo.src}
            alt={siteLogo.alt}
            width={siteLogo.width}
            height={siteLogo.height}
            unoptimized
            className={styles.brandLogo}
          />
          <p className={styles.baseline}>{siteFooter.baseline}</p>
        </div>
        <div>
          <h2 className={styles.colTitle}>{siteFooter.polesTitle}</h2>
          <ul className={styles.list}>
            {PRODUCTS.map((product) => (
              <li key={product.id}>
                {product.status === "live" ? (
                  <Link href={product.route} className={styles.link} data-pole-accent={product.id}>
                    {product.name}
                  </Link>
                ) : (
                  <span className={styles.muted}>
                    {product.name} · {polesSection.upcomingLabel.toLowerCase()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className={styles.colTitle}>{siteFooter.contactTitle}</h2>
          <ul className={styles.list}>
            <li>
              <WhatsAppFooterLink href={whatsappHref} className={styles.link}>
                {contactSection.whatsappLabel}
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
        <p className={styles.muted}>{siteFooter.mentions}</p>
        <div className={styles.legalLinks}>
          <Link href="/mentions-legales" className={styles.link}>
            {siteFooter.legalLabel}
          </Link>
          <Link href="/confidentialite" className={styles.link}>
            {siteFooter.privacyLabel}
          </Link>
          <CookiePreferencesLink className={styles.link} />
        </div>
      </div>
    </footer>
  );
}
