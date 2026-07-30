"use client";

/**
 * Caméra 360 sur perche, procédurale premium (aucun GLB, zéro logo) :
 * corps capsule, deux objectifs fisheye dos-à-dos en verre PBR, LED accent.
 * Contrat PoleObject : groupe centré, plus grande dimension ~2.3, face +Z.
 * Les gris techniques sont des constantes matériau (précédent HeadsetScene) ;
 * la couleur du pôle arrive en prop (lue des tokens en amont).
 * Proportions : le CORPS domine (la perche n'est qu'un support court),
 * sinon l'objet lit comme un trait sombre dans la bande.
 */

const BODY_DARK = "#2d333d";
const BODY_SOFT = "#434b57";
const POLE_GRAY = "#4c545f";
const LENS_GLASS = "#161c25";

type Camera360ModelProps = {
  accent: string;
};

export default function Camera360Model({ accent }: Camera360ModelProps) {
  return (
    <group position={[0, 0.15, 0]} scale={1.25}>
      {/* Perche courte, prise conique sous le corps. */}
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.022, 0.028, 0.95, 20]} />
        <meshStandardMaterial color={POLE_GRAY} roughness={0.4} metalness={0.65} envMapIntensity={1.3} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.06, 0.034, 0.18, 20]} />
        <meshStandardMaterial color={BODY_DARK} roughness={0.45} metalness={0.4} envMapIntensity={1.2} />
      </mesh>

      {/* Corps capsule vertical : l'objet principal. */}
      <mesh position={[0, 0.36, 0]}>
        <capsuleGeometry args={[0.19, 0.34, 8, 28]} />
        <meshStandardMaterial color={BODY_DARK} roughness={0.32} metalness={0.5} envMapIntensity={1.4} />
      </mesh>
      {/* Ceinture médiane (langage produit). */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.193, 0.193, 0.06, 32]} />
        <meshStandardMaterial color={BODY_SOFT} roughness={0.25} metalness={0.65} envMapIntensity={1.5} />
      </mesh>

      {/* Deux objectifs fisheye dos-à-dos (verre : le cœur du produit). */}
      <mesh position={[0, 0.5, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.165, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={LENS_GLASS}
          roughness={0.05}
          metalness={0.92}
          envMapIntensity={2.0}
        />
      </mesh>
      <mesh position={[0, 0.5, -0.18]} rotation={[-Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.165, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={LENS_GLASS}
          roughness={0.05}
          metalness={0.92}
          envMapIntensity={2.0}
        />
      </mesh>

      {/* LED d'enregistrement : la touche accent du pôle. */}
      <mesh position={[0, 0.08, 0.19]}>
        <sphereGeometry args={[0.026, 12, 12]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2.4} />
      </mesh>
    </group>
  );
}
