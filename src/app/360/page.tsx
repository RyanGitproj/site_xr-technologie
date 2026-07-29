import { ViewContentTracker } from "@/components/tracking/ViewContentTracker";
import { Footer360 } from "@/products/xr360/layout/Footer360";
import { Header360 } from "@/products/xr360/layout/Header360";
import { Benefits360 } from "@/products/xr360/sections/Benefits360";
import { BriefFormSection } from "@/products/xr360/sections/BriefFormSection";
import { Clarification360 } from "@/products/xr360/sections/Clarification360";
import { Deliverables360 } from "@/products/xr360/sections/Deliverables360";
import { Demo360 } from "@/products/xr360/sections/Demo360";
import { FinalCta360 } from "@/products/xr360/sections/FinalCta360";
import { Hero360 } from "@/products/xr360/sections/Hero360";
import { Hub360 } from "@/products/xr360/sections/Hub360";
import { Offers360 } from "@/products/xr360/sections/Offers360";
import { Places360 } from "@/products/xr360/sections/Places360";
import { Process360 } from "@/products/xr360/sections/Process360";
import { Series360 } from "@/products/xr360/sections/Series360";
import { Services360 } from "@/products/xr360/sections/Services360";

/** Le récit 360 (enrichi Funnel V2) : promesse (imaginer → visiter) →
    bénéfices → prestations → hub des formats → démo exploration → série
    immersive → lieux (le lecteur se reconnaît) → déroulement (confiance) →
    livrables → offres sur devis → périmètre clair (passerelle LiDAR) →
    appel → brief. */
export default function Xr360Page() {
  return (
    <>
      <ViewContentTracker product="xr360" />
      <Header360 />
      <main id="contenu">
        <Hero360 />
        <Benefits360 />
        <Services360 />
        <Hub360 />
        <Demo360 />
        <Series360 />
        <Places360 />
        <Process360 />
        <Deliverables360 />
        <Offers360 />
        <Clarification360 />
        <FinalCta360 />
        <BriefFormSection />
      </main>
      <Footer360 />
    </>
  );
}
