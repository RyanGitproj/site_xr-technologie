import type { Metadata } from "next";
import { AuroraField } from "@/components/fx/AuroraField";
import styles from "./lidar.module.css";

export const metadata: Metadata = {
  title: "XR LiDAR Opérationnel | Relevé 3D & reality capture à Madagascar",
  description:
    "Le terrain ne devrait pas rester une approximation : relevé 3D, nuage de points, plans 2D, scan-to-CAD et scan-to-BIM. Vos bâtiments et sites existants transformés en données exploitables. XR Technologie, Antananarivo.",
};

/** Thème du pôle LiDAR (data-theme, tokens charte graphite/vert laser) +
    fond animé aux aurores du pôle (fallback statique reduced-motion). */
export default function LidarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="lidar" className={styles.theme}>
      <AuroraField className={styles.aurora} />
      {children}
    </div>
  );
}
