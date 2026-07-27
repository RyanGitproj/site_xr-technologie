import type { Metadata } from "next";
import Link from "next/link";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CookiePreferencesLink } from "@/components/tracking/CookiePreferencesLink";
import { privacyPolicy } from "@/config/content";
import { siteConfig } from "@/config/site";
import styles from "./confidentialite.module.css";

export const metadata: Metadata = {
  title: "Politique de confidentialité | XR VR Discovery",
  description:
    "Données collectées sur XR VR Discovery, finalités, cookies de mesure et de publicité, et gestion de votre consentement.",
};

export default function ConfidentialitePage() {
  return (
    <>
      <Header />
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

          <div className={styles.back}>
            <Link href="/" className={styles.backLink}>
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </GlassPanel>
      </main>
      <Footer />
    </>
  );
}
