import { ViewContentTracker } from "@/components/tracking/ViewContentTracker";
import { FooterLidar } from "@/products/lidar/layout/FooterLidar";
import { HeaderLidar } from "@/products/lidar/layout/HeaderLidar";
import { AcquisitionLidar } from "@/products/lidar/sections/AcquisitionLidar";
import { ApplicationsLidar } from "@/products/lidar/sections/ApplicationsLidar";
import { BenefitsLidar } from "@/products/lidar/sections/BenefitsLidar";
import { BriefFormSectionLidar } from "@/products/lidar/sections/BriefFormSectionLidar";
import { DeliverablesLidar } from "@/products/lidar/sections/DeliverablesLidar";
import { FinalCtaLidar } from "@/products/lidar/sections/FinalCtaLidar";
import { HeroLidar } from "@/products/lidar/sections/HeroLidar";
import { MissionLidar } from "@/products/lidar/sections/MissionLidar";
import { PipelineLidar } from "@/products/lidar/sections/PipelineLidar";

/** Le récit LiDAR (refonte immersive) : problème (l'approximation) →
    réassurance en bande → usages (définition + applications + cibles) →
    acquisition (comment on capture) → LE SCAN CONSTRUIT LE JUMEAU (scène
    scroll : pipeline + flux + avancement) → livrables (sélecteur) →
    mission (timeline + engagements + LIMITES visibles) → appel + zone →
    brief. */
export default function LidarPage() {
  return (
    <>
      <ViewContentTracker product="lidar" />
      <HeaderLidar />
      <main id="contenu">
        <HeroLidar />
        <BenefitsLidar />
        <ApplicationsLidar />
        <AcquisitionLidar />
        <PipelineLidar />
        <DeliverablesLidar />
        <MissionLidar />
        <FinalCtaLidar />
        <BriefFormSectionLidar />
      </main>
      <FooterLidar />
    </>
  );
}
