import type { Metadata } from "next";
import { AuroraField } from "@/components/fx/AuroraField";
import styles from "./xr360.module.css";

export const metadata: Metadata = {
  title: "XR 360 | Visite virtuelle & valorisation immersive à Madagascar",
  description:
    "Votre client peut imaginer le lieu, ou déjà commencer à le visiter : captation photo et vidéo 360, visite virtuelle interactive et diffusion sur tous les supports (web, mobile, casque VR). XR Technologie, Antananarivo.",
};

/** Thème du pôle 360 (data-theme, tokens charte cyan/bleu profond) + fond
    animé aux aurores du pôle (fallback statique reduced-motion). */
export default function Xr360Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="xr360" data-page-theme="xr360" className={styles.theme}>
      <AuroraField className={styles.aurora} />
      {children}
    </div>
  );
}
