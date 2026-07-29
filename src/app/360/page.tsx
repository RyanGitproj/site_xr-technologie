import { ViewContentTracker } from "@/components/tracking/ViewContentTracker";
import { Footer360 } from "@/products/xr360/layout/Footer360";
import { Header360 } from "@/products/xr360/layout/Header360";
import { Benefits360 } from "@/products/xr360/sections/Benefits360";
import { BriefFormSection } from "@/products/xr360/sections/BriefFormSection";
import { Deliverables360 } from "@/products/xr360/sections/Deliverables360";
import { Demo360 } from "@/products/xr360/sections/Demo360";
import { FinalCta360 } from "@/products/xr360/sections/FinalCta360";
import { Hero360 } from "@/products/xr360/sections/Hero360";
import { Offers360 } from "@/products/xr360/sections/Offers360";
import { Process360 } from "@/products/xr360/sections/Process360";
import { Series360 } from "@/products/xr360/sections/Series360";
import { Services360 } from "@/products/xr360/sections/Services360";

/** Le récit 360 (refonte immersive) : promesse (imaginer → visiter) →
    bande atouts (respiration) → LA PREUVE (fenêtre 360 interactive, chips
    lieux) → prestations en 3 familles (sélecteur, livrables inclus) →
    diffusion (mockups, la seule liste « où ça se voit ») → série immersive
    → déroulement → offres sur devis (+ périmètre LiDAR en note) → appel →
    brief. */
export default function Xr360Page() {
  return (
    <>
      <ViewContentTracker product="xr360" />
      <Header360 />
      <main id="contenu">
        <Hero360 />
        <Benefits360 />
        <Demo360 />
        <Services360 />
        <Deliverables360 />
        <Series360 />
        <Process360 />
        <Offers360 />
        <FinalCta360 />
        <BriefFormSection />
      </main>
      <Footer360 />
    </>
  );
}
