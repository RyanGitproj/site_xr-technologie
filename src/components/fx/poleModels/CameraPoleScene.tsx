"use client";

import Camera360Model from "./Camera360Model";
import PoleObjectScene, { type PoleModelSceneProps } from "./PoleObjectScene";

/** Bande 360 de l'accueil : caméra 360 sur perche (procédurale). */
export default function CameraPoleScene(props: PoleModelSceneProps) {
  return (
    <PoleObjectScene {...props}>
      <Camera360Model accent={props.accent} />
    </PoleObjectScene>
  );
}
