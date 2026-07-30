import Image from "next/image";
import { Check, Plus } from "lucide-react";
import { DecryptNumber } from "@/components/fx/DecryptNumber";
import { Embers } from "@/components/fx/Embers";
import { GeoFrame } from "@/components/fx/GeoFrame";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { TiltCard } from "@/components/fx/TiltCard";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { Pill } from "@/components/ui/Pill";
import { cx } from "@/lib/cx";
import type { OfferPack } from "./types";
import styles from "./PackCard.module.css";

/* Braises du tier premium, teintées par l'offre active (styles inline,
   donc les var() passent) ; pointe d'étincelle de marque en contrepoint. */
const EMBER_COLORS = [
  "var(--offer-accent, var(--color-accent))",
  "color-mix(in srgb, var(--offer-accent, var(--color-accent)) 60%, white)",
  "var(--color-fx-spark)",
] as const;

type PackCardProps = {
  pack: OfferPack;
  /** Position du pack dans la gamme (0 découverte, 1 vedette, 2 premium) ;
      l'ordre = prix croissants, invariant garanti par catalogAudit. */
  tier: number;
  pricePrefix: string;
  cta: string;
  /** Id de la section formulaire de la page (« devis », « brief »). */
  formAnchor: string;
  /** Libellé du bloc d'options chiffrées, quand le pack en porte. */
  optionsLabel?: string;
  /** Effet de bord du CTA (présélection groupe + pack, tracking) ; le scroll
      vers le formulaire est porté par le bouton lui-même. */
  onChoose: () => void;
};

/**
 * Card de pack : GlassPanel en TiltCard sous GeoFrame, pack vedette avec
 * chamfer élargi + trace + glow, prix en DecryptNumber (révélation
 * déchiffrement, car un compteur croissant ferait « grimper » le prix).
 * La gamme se lit à la matière : chaque tier a son fond d'ambiance DERRIÈRE
 * le verre (sœur du GlassPanel dans le conteneur clippé du GeoFrame, donc
 * réellement floutée par le backdrop-blur) : verre nu (découverte), halo
 * aurora (vedette), fond densifié + braises (premium).
 */
export function PackCard({
  pack,
  tier,
  pricePrefix,
  cta,
  formAnchor,
  optionsLabel,
  onChoose,
}: PackCardProps) {
  const featured = pack.featured === true;
  return (
    <TiltCard className={styles.tilt}>
      <GeoFrame
        variant="frame"
        shape="hud"
        chamfer={featured ? 22 : 14}
        trace={featured}
        className={styles.geo}
      >
        {tier === 1 && <div aria-hidden="true" className={styles.aurora} />}
        {tier === 2 && (
          <>
            <div aria-hidden="true" className={styles.deepFill} />
            <Embers count={14} colors={EMBER_COLORS} className={styles.embers} />
          </>
        )}
        <GlassPanel className={cx(styles.panel, featured && styles.panelFeatured)}>
          {pack.visual !== undefined && (
            <div className={styles.visual}>
              <span aria-hidden="true" className={styles.visualHalo} />
              <Image
                src={pack.visual.src}
                alt={pack.visual.alt}
                fill
                sizes="(max-width: 1024px) 90vw, 340px"
                className={styles.visualImg}
              />
            </div>
          )}
          <h3 className={styles.packName}>{pack.name}</h3>
          <p className={styles.tagline}>{pack.tagline}</p>
          <p className={styles.priceBlock}>
            <span className={styles.pricePrefix}>{pricePrefix}</span>
            <span className={styles.price}>
              <DecryptNumber value={pack.price} unit="ar" />
            </span>
          </p>
          <ul className={styles.features}>
            {pack.features.map((feature) => (
              <li key={feature} className={styles.feature}>
                <Check aria-hidden="true" className={styles.check} />
                {feature}
              </li>
            ))}
          </ul>
          {pack.options !== undefined && optionsLabel !== undefined && (
            <div className={styles.options}>
              <p className={styles.optionsLabel}>{optionsLabel}</p>
              <ul className={styles.optionList}>
                {pack.options.map((option) => (
                  <li key={option} className={styles.option}>
                    <Plus aria-hidden="true" className={styles.optionIcon} />
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Pas de trait lumineux ici : le rail affiche jusqu'à dix packs, et
              dix comètes qui tournent en même temps se neutralisent. */}
          <OutlineButton
            beam={false}
            scrollTo={formAnchor}
            onClick={onChoose}
            className={styles.cta}
          >
            {cta}
          </OutlineButton>
        </GlassPanel>
      </GeoFrame>
      {/* Hors du GeoFrame : à cheval sur le bord, il serait rogné par le clip. */}
      {pack.badge !== undefined && <Pill className={styles.badge}>{pack.badge}</Pill>}
    </TiltCard>
  );
}
