"use client";

import { HeaderBrand } from "@/components/layout/HeaderBrand";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { ProductNav } from "@/components/layout/ProductNav";
import { contactSection, siteHeader } from "@/site/config/content";
import { scrollToSection } from "@/lib/scrollToSection";
import styles from "./SiteHeader.module.css";

type SiteHeaderProps = {
  /** false : pages sans section contact (ex. /confidentialite), où le
      bouton serait un défilement vers nulle part. */
  withContact?: boolean;
};

/** Navbar du socle site : lockup + menu unifié dans la coquille commune,
    plus l'accès contact quand la page porte la section. */
export function SiteHeader({ withContact = true }: SiteHeaderProps) {
  return (
    <HeaderShell
      brand={<HeaderBrand />}
      nav={<ProductNav />}
      actions={
        withContact ? (
          <button
            type="button"
            className={styles.contact}
            onClick={() => scrollToSection(contactSection.id)}
          >
            {siteHeader.contactLabel}
          </button>
        ) : undefined
      }
    />
  );
}
