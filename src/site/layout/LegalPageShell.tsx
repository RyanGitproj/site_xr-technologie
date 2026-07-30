import Link from "next/link";
import type { ReactNode } from "react";
import { GlassPanel } from "@/components/fx/GlassPanel";
import type { PolicySection } from "@/config/consent";
import { SiteFooter } from "@/site/layout/SiteFooter";
import { SiteHeader } from "@/site/layout/SiteHeader";
import styles from "./LegalPage.module.css";

type LegalPageShellProps = {
  updated: string;
  title: string;
  intro: string;
  sections: readonly PolicySection[];
  /** Sections supplémentaires nécessitant du JSX (liens, boutons) : les pages
      les composent avec les classes de LegalPage.module.css. */
  children?: ReactNode;
};

/** Coquille des pages légales transverses du SITE (socle neutre, pas un
    pôle) : header/footer XR Technologie, thème « site » comme l'accueil. */
export function LegalPageShell({
  updated,
  title,
  intro,
  sections,
  children,
}: LegalPageShellProps) {
  return (
    <div data-theme="site" data-page-theme="site" className={styles.shell}>
      <SiteHeader withContact={false} />
      <main id="contenu" className={styles.main}>
        <GlassPanel className={styles.panel}>
          <p className={styles.updated}>{updated}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.intro}>{intro}</p>

          {sections.map((section) => (
            <section key={section.heading} className={styles.section}>
              <h2 className={styles.heading}>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          {children}

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
