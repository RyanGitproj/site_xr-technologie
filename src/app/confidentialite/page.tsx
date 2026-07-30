import type { Metadata } from "next";
import { CookiePreferencesLink } from "@/components/tracking/CookiePreferencesLink";
import { privacyPolicy } from "@/config/consent";
import { siteConfig } from "@/config/site";
import styles from "@/site/layout/LegalPage.module.css";
import { LegalPageShell } from "@/site/layout/LegalPageShell";

export const metadata: Metadata = {
  title: "Politique de confidentialité | XR Technologie",
  description:
    "Données collectées sur le site XR Technologie, finalités, cookies de mesure et de publicité, et gestion de votre consentement.",
};

export default function ConfidentialitePage() {
  return (
    <LegalPageShell
      updated={privacyPolicy.updated}
      title={privacyPolicy.title}
      intro={privacyPolicy.intro}
      sections={privacyPolicy.sections}
    >
      <section className={styles.section}>
        <h2 className={styles.heading}>{privacyPolicy.manage.heading}</h2>
        <p className={styles.paragraph}>{privacyPolicy.manage.body}</p>
        <CookiePreferencesLink className={styles.manageButton} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>{privacyPolicy.contact.heading}</h2>
        <p className={styles.paragraph}>
          {privacyPolicy.contact.body}{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className={styles.mail}>
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
    </LegalPageShell>
  );
}
