import type { Metadata } from "next";
import Link from "next/link";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { CookiePreferencesLink } from "@/components/tracking/CookiePreferencesLink";
import { privacyPolicy } from "@/config/consent";
import { siteConfig } from "@/config/site";
import { SiteFooter } from "@/site/layout/SiteFooter";
import { SiteHeader } from "@/site/layout/SiteHeader";
import styles from "./confidentialite.module.css";

export const metadata: Metadata = {
  title: "Politique de confidentialité | XR Technologie",
  description:
    "Données collectées sur le site XR Technologie, finalités, cookies de mesure et de publicité, et gestion de votre consentement.",
};

/** Page transverse du SITE (socle neutre, pas un pôle) : header/footer
    XR Technologie, thème « site » comme l'accueil. */
export default function ConfidentialitePage() {
  return (
    <div data-theme="site" className={styles.shell}>
      <SiteHeader />
      <main id="contenu" className={styles.main}>
        <GlassPanel className={styles.panel}>
          <p className={styles.updated}>{privacyPolicy.updated}</p>
          <h1 className={styles.title}>{privacyPolicy.title}</h1>
          <p className={styles.intro}>{privacyPolicy.intro}</p>

          {privacyPolicy.sections.map((section) => (
            <section key={section.heading} className={styles.section}>
              <h2 className={styles.heading}>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section className={styles.section}>
            <h2 className={styles.heading}>{privacyPolicy.manage.heading}</h2>
            <p className={styles.paragraph}>{privacyPolicy.manage.body}</p>
            <CookiePreferencesLink className={styles.manageButton} />
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>{privacyPolicy.contact.heading}</h2>
            <p className={styles.paragraph}>
              {privacyPolicy.contact.body}{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className={styles.mail}
              >
                {siteConfig.contactEmail}
              </a>
              .
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>{privacyPolicy.credits.heading}</h2>
            <p className={styles.paragraph}>
              {privacyPolicy.credits.body}{" "}
              <a
                href={privacyPolicy.credits.licenseHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mail}
              >
                {privacyPolicy.credits.licenseLabel}
              </a>
              .
            </p>
          </section>

          <div className={styles.back}>
            <Link href="/" className={styles.backLink}>
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </GlassPanel>
      </main>
      <SiteFooter />
    </div>
  );
}
