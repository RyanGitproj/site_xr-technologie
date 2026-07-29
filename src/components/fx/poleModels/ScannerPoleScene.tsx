"use client";

import PoleObjectScene, { type PolePointer } from "./PoleObjectScene";
import ScannerModel from "./ScannerModel";

/** Bande LiDAR de l'accueil : scanner sur trépied à balayage (procédural). */
export default function ScannerPoleScene(props: {
  accent: string;
  pointerRef: React.RefObject<PolePointer>;
  dpr?: number;
  active?: boolean;
}) {
  return (
    <PoleObjectScene {...props}>
      <ScannerModel accent={props.accent} />
    </PoleObjectScene>
  );
}
