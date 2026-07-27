// Thème visuel du pôle VR : fond animé chaud, curseur réactif et fonts
// display de l'identité v3. Groupe (vr-theme) = /vr, /vr/merci, /fx-lab et
// /confidentialite (ces deux dernières basculeront sur le socle neutre quand
// le header/footer site existeront, voir TODO.md phase 3).
import "@fontsource/sora/latin-500.css";
import "@fontsource/sora/latin-600.css";
import "@fontsource/sora/latin-700.css";
import "@fontsource/sora/latin-800.css";
// Accent titres : Baloo 2 (mots ronds, façon « adventures » de la réf.).
import "@fontsource/baloo-2/latin-700.css";
import "@fontsource/baloo-2/latin-800.css";
import { GlowCursor } from "@/components/fx/GlowCursor";
import { LiquidBackground } from "@/components/fx/LiquidBackground";
import { LiquidRefractFilter } from "@/components/fx/LiquidRefractFilter";

export default function VrThemeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Fond fixe z-index -1 : la position DOM n'influe pas sur le rendu. */}
      <LiquidBackground />
      <LiquidRefractFilter />
      {children}
      <GlowCursor />
    </>
  );
}
