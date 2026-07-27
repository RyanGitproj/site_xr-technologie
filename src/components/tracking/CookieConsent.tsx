"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { cookieConsent } from "@/config/consent";
import { saveConsentChoice, useConsentChoice } from "@/lib/tracking/consent";
import styles from "./CookieConsent.module.css";

/**
 * Charge le conteneur GTM uniquement après consentement, et affiche le bandeau
 * tant qu'aucun choix n'a été fait. Sans consentement stocké, aucun script GTM
 * n'est injecté : aucun cookie de mesure ou de publicité n'est posé (CNIL).
 *
 * Le choix vit dans le store partagé src/lib/tracking/consent.ts : ce bandeau
 * l'écrit, GTM (ici) et le Meta Pixel (MetaPixelGate) s'y abonnent. Source
 * unique, jamais de second mécanisme par pixel.
 */
export function CookieConsent({ gtmId }: { gtmId?: string }) {
  const consent = useConsentChoice();
  const bannerRef = useRef<HTMLDivElement>(null);
  const showBanner = consent === null;

  // Le bandeau est fixé en bas : tant qu'il est affiché, on réserve sa hauteur
  // en bas du body pour ne pas masquer le dernier CTA (LeadForm). Recalcul au
  // resize (la hauteur change quand le bandeau passe en colonne sur mobile).
  useEffect(() => {
    if (!showBanner) return;
    const banner = bannerRef.current;
    if (!banner) return;
    const apply = () => {
      document.body.style.paddingBottom = `${banner.offsetHeight}px`;
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(banner);
    return () => {
      observer.disconnect();
      document.body.style.paddingBottom = "";
    };
  }, [showBanner]);

  return (
    <>
      {gtmId && consent === "granted" && (
        <>
          <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      )}

      {showBanner && (
        <div
          ref={bannerRef}
          role="dialog"
          aria-label={cookieConsent.ariaLabel}
          className={styles.banner}
        >
          <div className={styles.inner}>
            <p className={styles.text}>
              {cookieConsent.text}{" "}
              <Link href="/confidentialite" className={styles.policyLink}>
                {cookieConsent.policyLabel}
              </Link>
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => saveConsentChoice("denied")}
                className={styles.refuse}
              >
                {cookieConsent.refuse}
              </button>
              <button
                type="button"
                onClick={() => saveConsentChoice("granted")}
                className={styles.accept}
              >
                {cookieConsent.accept}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
