import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Dev uniquement : Next 16 bloque les ressources /_next servies à une
     origine autre que localhost, et le refus casse le WebSocket HMR (« Error
     during WebSocket handshake »). On autorise le LAN pour tester le site
     depuis un téléphone, et 127.0.0.1 qui n'est PAS couvert par localhost. */
  allowedDevOrigins: ["127.0.0.1", "192.168.0.*", "192.168.1.*"],
  /* experimental.inlineCss : testé puis RETIRÉ le 31/07/2026, par prudence.
     Innocenté du bug des heros (cause réelle : dépendance à l'ordre des
     chunks CSS, corrigée par custom property dans ParallaxScene.module.css),
     mais l'inlining rebat lui aussi l'ordre des règles et le flag est
     expérimental. Re-tenter = gain ~600 ms de FCP mobile, à condition de
     re-vérifier les heros des 4 pages sur un BUILD DE PROD (le dev
     n'inline pas, il ne peut pas montrer ce genre d'écart). */
};

export default nextConfig;
