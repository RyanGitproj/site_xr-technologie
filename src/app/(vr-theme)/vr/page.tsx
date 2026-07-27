import type { Metadata } from "next";
import { Footer } from "@/products/vr/layout/Footer";
import { Header } from "@/products/vr/layout/Header";
import { ArgumentSection } from "@/products/vr/sections/ArgumentSection";
import { BenefitsSection } from "@/products/vr/sections/BenefitsSection";
import { DeploymentSection } from "@/products/vr/sections/DeploymentSection";
import { DiveSection } from "@/products/vr/sections/DiveSection";
import { FinalCtaSection } from "@/products/vr/sections/FinalCtaSection";
import { GallerySection } from "@/products/vr/sections/GallerySection";
import { Hero } from "@/products/vr/sections/Hero";
import { LeadFormSection } from "@/products/vr/sections/LeadFormSection";
import { ObjectionsSection } from "@/products/vr/sections/ObjectionsSection";
import { OffersSection } from "@/products/vr/sections/OffersSection";
import { ReassuranceBar } from "@/products/vr/sections/ReassuranceBar";

export const metadata: Metadata = {
  title: "XR VR Discovery | Animation VR clé en main à Antananarivo",
  description:
    "XR Technologie déplace la VR jusqu'à vous : 10 casques dernière génération, animateurs XR et 8 offres (retail, entreprises, écoles, universités, tourisme, fondations, immobilier, évènementiel). Packs à partir de 750 000 Ar.",
};

/** Le récit : promesse → confiance → immersion (plongée) → preuve → offre
    (8 univers) → bénéfices → objections → process → action. */
export default function VrLandingPage() {
  return (
    <>
      <Header />
      <main id="contenu">
        <Hero />
        <ReassuranceBar />
        <DiveSection />
        <GallerySection />
        <OffersSection />
        <BenefitsSection />
        <ArgumentSection />
        <ObjectionsSection />
        <DeploymentSection />
        <FinalCtaSection />
        <LeadFormSection />
      </main>
      <Footer />
    </>
  );
}
