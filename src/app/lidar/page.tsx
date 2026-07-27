import { ViewContentTracker } from "@/components/tracking/ViewContentTracker";
import { FooterLidar } from "@/products/lidar/layout/FooterLidar";
import { HeaderLidar } from "@/products/lidar/layout/HeaderLidar";
import { ApplicationsLidar } from "@/products/lidar/sections/ApplicationsLidar";
import { BenefitsLidar } from "@/products/lidar/sections/BenefitsLidar";
import { BriefFormSectionLidar } from "@/products/lidar/sections/BriefFormSectionLidar";
import { DefinitionLidar } from "@/products/lidar/sections/DefinitionLidar";
import { DeliverablesLidar } from "@/products/lidar/sections/DeliverablesLidar";
import { FinalCtaLidar } from "@/products/lidar/sections/FinalCtaLidar";
import { HeroLidar } from "@/products/lidar/sections/HeroLidar";
import { MissionLidar } from "@/products/lidar/sections/MissionLidar";
import { TrustLidar } from "@/products/lidar/sections/TrustLidar";
import { ZoneLidar } from "@/products/lidar/sections/ZoneLidar";

/** Le récit LiDAR : problème (l'approximation) → définition + cibles →
    bénéfices → applications → mission (confiance) → livrables →
    engagements + limites légales → zone → appel + mention → brief. */
export default function LidarPage() {
  return (
    <>
      <ViewContentTracker product="lidar" />
      <HeaderLidar />
      <main id="contenu">
        <HeroLidar />
        <DefinitionLidar />
        <BenefitsLidar />
        <ApplicationsLidar />
        <MissionLidar />
        <DeliverablesLidar />
        <TrustLidar />
        <ZoneLidar />
        <FinalCtaLidar />
        <BriefFormSectionLidar />
      </main>
      <FooterLidar />
    </>
  );
}
