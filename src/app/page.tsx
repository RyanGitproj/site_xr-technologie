import { AuroraField } from "@/components/fx/AuroraField";
import { SiteFooter } from "@/site/layout/SiteFooter";
import { SiteHeader } from "@/site/layout/SiteHeader";
import { ContactSection } from "@/site/sections/ContactSection";
import { HomeHero } from "@/site/sections/HomeHero";
import { HomeReassurance } from "@/site/sections/HomeReassurance";
import { ObjectivesSection } from "@/site/sections/ObjectivesSection";
import { PolesShowcase } from "@/site/sections/PolesShowcase";
import { SectorsSection } from "@/site/sections/SectorsSection";
import styles from "./home.module.css";

/** Accueil XR Technologie : socle neutre, chaque pôle porte SA couleur dans
    sa zone (décision DA 27/07). Récit refonte : promesse (3 verbes) →
    orientation par objectif → les pôles avec leurs VRAIS objets 3D →
    secteurs (le lecteur se reconnaît) → réassurance en bande → contact.
    Navigation libre, funnels dans les pôles. */
export default function HomePage() {
  return (
    <div data-theme="site" data-page-theme="site" className={styles.site}>
      <AuroraField className={styles.aurora} />
      <SiteHeader />
      <main id="contenu">
        <HomeHero />
        <ObjectivesSection />
        <PolesShowcase />
        <SectorsSection />
        <HomeReassurance />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
