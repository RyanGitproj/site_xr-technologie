"use client";

import PoleObjectScene, { type PoleModelSceneProps } from "./PoleObjectScene";
import ScannerModel from "./ScannerModel";

/** Bande LiDAR de l'accueil : scanner sur trépied à balayage (procédural). */
export default function ScannerPoleScene(props: PoleModelSceneProps) {
  return (
    <PoleObjectScene {...props}>
      <ScannerModel accent={props.accent} />
    </PoleObjectScene>
  );
}
