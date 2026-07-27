import { ViewContentTracker } from "@/components/tracking/ViewContentTracker";
import { Footer360 } from "@/products/xr360/layout/Footer360";
import { Header360 } from "@/products/xr360/layout/Header360";
import { Benefits360 } from "@/products/xr360/sections/Benefits360";
import { BriefFormSection } from "@/products/xr360/sections/BriefFormSection";
import { Clarification360 } from "@/products/xr360/sections/Clarification360";
import { Deliverables360 } from "@/products/xr360/sections/Deliverables360";
import { FinalCta360 } from "@/products/xr360/sections/FinalCta360";
import { Hero360 } from "@/products/xr360/sections/Hero360";
import { Places360 } from "@/products/xr360/sections/Places360";
import { Process360 } from "@/products/xr360/sections/Process360";
import { Services360 } from "@/products/xr360/sections/Services360";

/** Le récit 360 : promesse (imaginer → visiter) → bénéfices → prestations →
    lieux (le lecteur se reconnaît) → déroulement (confiance) → livrables →
    périmètre clair (passerelle LiDAR) → appel → brief. */
export default function Xr360Page() {
  return (
    <>
      <ViewContentTracker product="xr360" />
      <Header360 />
      <main id="contenu">
        <Hero360 />
        <Benefits360 />
        <Services360 />
        <Places360 />
        <Process360 />
        <Deliverables360 />
        <Clarification360 />
        <FinalCta360 />
        <BriefFormSection />
      </main>
      <Footer360 />
    </>
  );
}
