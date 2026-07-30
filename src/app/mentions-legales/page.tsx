import type { Metadata } from "next";
import Link from "next/link";
import { legalNotice } from "@/config/legalNotice";
import styles from "@/site/layout/LegalPage.module.css";
import { LegalPageShell } from "@/site/layout/LegalPageShell";

export const metadata: Metadata = {
  title: "Mentions légales | XR Technologie",
  description:
    "Éditeur, hébergeur et informations légales du site XR Technologie, Antananarivo, Madagascar.",
};

export default function MentionsLegalesPage() {
  return (
    <LegalPageShell
      updated={legalNotice.updated}
      title={legalNotice.title}
      intro={legalNotice.intro}
      sections={legalNotice.sections}
    >
      <section className={styles.section}>
        <h2 className={styles.heading}>{legalNotice.privacy.heading}</h2>
        <p className={styles.paragraph}>
          {legalNotice.privacy.body}{" "}
          <Link href="/confidentialite" className={styles.mail}>
            {legalNotice.privacy.linkLabel}
          </Link>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
