import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Dev uniquement : Next 16 bloque les ressources /_next servies à une
     origine autre que localhost, et le refus casse le WebSocket HMR (« Error
     during WebSocket handshake »). On autorise le LAN pour tester le site
     depuis un téléphone, et 127.0.0.1 qui n'est PAS couvert par localhost. */
  allowedDevOrigins: ["127.0.0.1", "192.168.0.*", "192.168.1.*"],
  experimental: {
    /* CSS inliné dans le HTML : supprime les ~600 ms de requêtes CSS
       bloquantes mesurées par Lighthouse mobile (31/07). Expérimental :
       rendu des 4 pages vérifié à l'activation ; retirer le flag au
       moindre écart visuel après un bump de Next. */
    inlineCss: true,
  },
};

export default nextConfig;
