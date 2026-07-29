"use client";

import Camera360Model from "./Camera360Model";
import PoleObjectScene, { type PolePointer } from "./PoleObjectScene";

/** Bande 360 de l'accueil : caméra 360 sur perche (procédurale). */
export default function CameraPoleScene(props: {
  accent: string;
  pointerRef: React.RefObject<PolePointer>;
  dpr?: number;
  active?: boolean;
}) {
  return (
    <PoleObjectScene {...props}>
      <Camera360Model accent={props.accent} />
    </PoleObjectScene>
  );
}
