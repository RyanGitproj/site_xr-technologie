"use client";

import { Quest3Gltf } from "../Quest3Gltf";
import PoleObjectScene, { type PoleModelSceneProps } from "./PoleObjectScene";

/** Bande VR de l'accueil : le VRAI casque (GLB CC-BY réutilisé tel quel).
    Chunk dédié : le useGLTF.preload de Quest3Gltf ne se déclenche que pour
    cette bande, jamais pour les deux autres. */
export default function Quest3PoleScene(props: PoleModelSceneProps) {
  return (
    <PoleObjectScene {...props}>
      <Quest3Gltf />
    </PoleObjectScene>
  );
}
