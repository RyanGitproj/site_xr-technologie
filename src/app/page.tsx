import { AuroraField } from "@/components/fx/AuroraField";
import { SiteFooter } from "@/site/layout/SiteFooter";
import { SiteHeader } from "@/site/layout/SiteHeader";
import { AboutSection } from "@/site/sections/AboutSection";
import { ContactSection } from "@/site/sections/ContactSection";
import { HomeHero } from "@/site/sections/HomeHero";
import { PolesShowcase } from "@/site/sections/PolesShowcase";
import styles from "./home.module.css";

/** Accueil XR Technologie : socle neutre, chaque pôle porte SA couleur dans
    sa zone (décision DA 27/07). Récit : promesse (3 verbes) → les pôles →
    qui nous sommes → contact. Navigation libre, funnels dans les pôles. */
export default function HomePage() {
  return (
    <div data-theme="site" className={styles.site}>
      <AuroraField className={styles.aurora} />
      <SiteHeader />
      <main id="contenu">
        <HomeHero />
        <PolesShowcase />
        <AboutSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
