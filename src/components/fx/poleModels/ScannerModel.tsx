"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, AdditiveBlending, type Group } from "three";

/**
 * Scanner 3D sur trépied, procédural premium (forme générique sans marque) :
 * trépied 3 jambes, colonne, corps cylindrique à arête, tourelle qui TOURNE
 * en émettant un fin plan de balayage laser (couleur du pôle en prop).
 * Contrat PoleObject : groupe centré, plus grande dimension ~2.2, face +Z.
 */

const LEG_GRAY = "#363c44";
const BODY_GRAY = "#4a515b";
const BODY_DARK = "#282d34";

const LEG_ANGLES = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];

type ScannerModelProps = {
  accent: string;
};

export default function ScannerModel({ accent }: ScannerModelProps) {
  const head = useRef<Group>(null);

  /* La tourelle balaye en continu (l'idle du groupe est géré par la scène). */
  useFrame((_, delta) => {
    const g = head.current;
    if (g) g.rotation.y += delta * 0.55;
  });

  return (
    <group position={[0, 0.28, 0]} scale={1.12}>
      {/* Trépied : 3 jambes évasées depuis le moyeu. */}
      {LEG_ANGLES.map((angle) => (
        <group key={angle} rotation={[0, angle, 0]}>
          <mesh position={[0.27, -0.68, 0]} rotation={[0, 0, 0.4]}>
            <cylinderGeometry args={[0.024, 0.03, 1.28, 14]} />
            <meshStandardMaterial color={LEG_GRAY} roughness={0.5} metalness={0.5} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.08, 20]} />
        <meshStandardMaterial color={BODY_DARK} roughness={0.45} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.28, 20]} />
        <meshStandardMaterial color={LEG_GRAY} roughness={0.5} metalness={0.55} />
      </mesh>

      {/* Corps : cylindre à arête lumineuse discrète. */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.21, 0.23, 0.3, 32]} />
        <meshStandardMaterial color={BODY_GRAY} roughness={0.35} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.205, 0.014, 12, 48]} />
        <meshStandardMaterial color={BODY_DARK} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Tourelle rotative + fente optique émissive + plan de balayage. */}
      <group ref={head} position={[0, 0.62, 0]}>
        <mesh>
          <cylinderGeometry args={[0.155, 0.175, 0.16, 32]} />
          <meshStandardMaterial color={BODY_DARK} roughness={0.32} metalness={0.6} />
        </mesh>
        <mesh position={[0.13, 0, 0]}>
          <boxGeometry args={[0.06, 0.09, 0.05]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2.4} />
        </mesh>
        <mesh position={[0.72, 0, 0]}>
          <planeGeometry args={[1.15, 0.016]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0.4}
            side={DoubleSide}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}
