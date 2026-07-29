import { ViewContentTracker } from "@/components/tracking/ViewContentTracker";
import { FooterLidar } from "@/products/lidar/layout/FooterLidar";
import { HeaderLidar } from "@/products/lidar/layout/HeaderLidar";
import { AcquisitionLidar } from "@/products/lidar/sections/AcquisitionLidar";
import { ApplicationsLidar } from "@/products/lidar/sections/ApplicationsLidar";
import { BenefitsLidar } from "@/products/lidar/sections/BenefitsLidar";
import { BriefFormSectionLidar } from "@/products/lidar/sections/BriefFormSectionLidar";
import { DataFlowLidar } from "@/products/lidar/sections/DataFlowLidar";
import { DefinitionLidar } from "@/products/lidar/sections/DefinitionLidar";
import { DeliverablesLidar } from "@/products/lidar/sections/DeliverablesLidar";
import { FinalCtaLidar } from "@/products/lidar/sections/FinalCtaLidar";
import { HeroLidar } from "@/products/lidar/sections/HeroLidar";
import { MissionLidar } from "@/products/lidar/sections/MissionLidar";
import { PipelineLidar } from "@/products/lidar/sections/PipelineLidar";
import { TrustLidar } from "@/products/lidar/sections/TrustLidar";
import { ZoneLidar } from "@/products/lidar/sections/ZoneLidar";

/** Le récit LiDAR (enrichi Funnel V2) : problème (l'approximation) →
    définition + cibles → bénéfices → acquisition (comment on capture) →
    pipeline (ce que ça devient) → applications → mission (confiance) →
    livrables → flux de données (formats, remise) → engagements + limites
    légales → zone → appel + mention → brief. */
export default function LidarPage() {
  return (
    <>
      <ViewContentTracker product="lidar" />
      <HeaderLidar />
      <main id="contenu">
        <HeroLidar />
        <DefinitionLidar />
        <BenefitsLidar />
        <AcquisitionLidar />
        <PipelineLidar />
        <ApplicationsLidar />
        <MissionLidar />
        <DeliverablesLidar />
        <DataFlowLidar />
        <TrustLidar />
        <ZoneLidar />
        <FinalCtaLidar />
        <BriefFormSectionLidar />
      </main>
      <FooterLidar />
    </>
  );
}
