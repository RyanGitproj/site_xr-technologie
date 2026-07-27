import type { Metadata } from "next";
// Socle typographique commun aux pôles (charte : Space Grotesk / Inter).
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "./globals.css";
import { MotionProvider } from "@/components/fx/MotionProvider";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { AttributionCapture } from "@/components/tracking/AttributionCapture";
import { CookieConsent } from "@/components/tracking/CookieConsent";
import { MetaPixelGate } from "@/components/tracking/MetaPixelGate";
import { RouteTracker } from "@/components/tracking/RouteTracker";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: "XR Technologie | Expériences immersives, visites virtuelles & relevés 3D à Madagascar",
  description:
    "Trois pôles, une même exigence XR : animations VR Meta Quest 3 qui se déplacent jusqu'à vous, visites virtuelles 360 qui font découvrir votre lieu à distance, relevés 3D LiDAR qui transforment votre site en données exploitables.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="fr">
      <body>
        {/* data-native-anchor : saut instantané + sémantique de focus native
            (un skip-link ne doit pas être animé). */}
        <a href="#contenu" className="skip-link" data-native-anchor>
          Aller au contenu
        </a>
        <AttributionCapture />
        <RouteTracker />
        <MetaPixelGate />
        <MotionProvider>
          <SmoothScroll />
          {children}
        </MotionProvider>
        {/* Le consentement est un objet transverse du SITE : thème neutre
            sur toutes les pages (jamais les couleurs d'un pôle, la charte
            interdit le mélange de codes). */}
        <div data-theme="site">
          <CookieConsent gtmId={gtmId} />
        </div>
      </body>
    </html>
  );
}
