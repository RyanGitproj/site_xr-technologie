import { AuroraField } from "@/components/fx/AuroraField";
import { SiteFooter } from "@/site/layout/SiteFooter";
import { SiteHeader } from "@/site/layout/SiteHeader";
import { AboutSection } from "@/site/sections/AboutSection";
import { ContactSection } from "@/site/sections/ContactSection";
import { HomeHero } from "@/site/sections/HomeHero";
import { ObjectivesSection } from "@/site/sections/ObjectivesSection";
import { PolesShowcase } from "@/site/sections/PolesShowcase";
import { SectorsSection } from "@/site/sections/SectorsSection";
import styles from "./home.module.css";

/** Accueil XR Technologie : socle neutre, chaque pôle porte SA couleur dans
    sa zone (décision DA 27/07). Récit : promesse (3 verbes) → orientation
    par objectif (Funnel V2) → les pôles → secteurs (le lecteur se
    reconnaît) → qui nous sommes → contact. Navigation libre, funnels dans
    les pôles. */
export default function HomePage() {
  return (
    <div data-theme="site" className={styles.site}>
      <AuroraField className={styles.aurora} />
      <SiteHeader />
      <main id="contenu">
        <HomeHero />
        <ObjectivesSection />
        <PolesShowcase />
        <SectorsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
