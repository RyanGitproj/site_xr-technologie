import { ArrowRight } from "lucide-react";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { DeckRail } from "@/components/fx/DeckRail";
import { EnterRise } from "@/components/fx/EnterRise";
import { ParallaxLayer } from "@/components/fx/ParallaxLayer";
import { ParallaxScene } from "@/components/fx/ParallaxScene";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { PRODUCT_BY_ID } from "@/config/products";
import { homeHero } from "@/site/config/content";
import styles from "./HomeHero.module.css";

/** Fond du hero en art direction (recette officielle getImageProps +
    <picture>) : paysage équipe-à-droite dès 768 px, portrait équipe
    centrée en dessous. Un seul fichier téléchargé par viewport.
    Profondeur au scroll : la photo traîne (inset -0.3, neutral 0 = état
    posé au chargement, LCP intact) ; le texte EnterRise et les cartes
    portes (transform d'overlap) restent HORS calques. */
function HeroBackdrop() {
  if (homeHero.image === null) return null;
  const common = { alt: homeHero.image.alt, sizes: "100vw", priority: true };
  const desktop = getImageProps({
    ...common,
    src: homeHero.image.src,
    width: homeHero.image.width,
    height: homeHero.image.height,
  });
  const mobileSlot = homeHero.imageMobile ?? homeHero.image;
  const mobile = getImageProps({
    ...common,
    src: mobileSlot.src,
    width: mobileSlot.width,
    height: mobileSlot.height,
  });
  const { srcSet: mobileSrcSet, ...imgProps } = mobile.props;
  return (
    <ParallaxScene offset={["start start", "end start"]} neutral={0} className={styles.decorScene}>
      <ParallaxLayer depth={-0.3} mode="inset" insetRange={6} className={styles.bg}>
        <picture>
          <source media="(min-width: 768px)" srcSet={desktop.props.srcSet} />
          <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
          {/* fetchPriority explicite : c'est l'image LCP mobile, et
              getImageProps ne pose pas l'attribut dans le HTML servi
              (checklist « LCP request discovery » de Lighthouse). */}
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt vient de imgProps */}
          <img {...imgProps} fetchPriority="high" className={styles.bgImg} />
        </picture>
        <div aria-hidden="true" className={styles.veil} />
      </ParallaxLayer>
    </ParallaxScene>
  );
}

/** Hero corporate (réf. p1 du PDF boss) : la photo équipe + matériel est
    le FOND du hero (le lot C est composé pour ça : équipe à droite, tiers
    gauche sombre) et le texte se pose dessus, dans la zone laissée libre.
    Voile gauche + fondu bas vers le socle pour la lisibilité. Apparition
    en EnterRise (CSS pur) : le titre peint au premier paint, sans attendre
    l'hydration (LCP 3G), contrairement à Reveal (framer). */
export function HomeHero() {
  return (
    <section className={styles.hero}>
      <HeroBackdrop />
      <div className={styles.inner}>
        <EnterRise>
          <p className={styles.kicker}>{homeHero.kicker}</p>
        </EnterRise>
        <EnterRise delay={0.08}>
          <h1 className={styles.title}>
            {homeHero.titleSegments.map((segment) =>
              segment.productId !== undefined ? (
                <span
                  key={segment.text}
                  className={styles.highlight}
                  data-pole-accent={segment.productId}
                >
                  {segment.text}
                </span>
              ) : (
                segment.text
              ),
            )}
          </h1>
        </EnterRise>
        <EnterRise delay={0.16}>
          <OutlineButton scrollTo={homeHero.ctaTargetId}>{homeHero.cta}</OutlineButton>
        </EnterRise>
      </div>
      <EnterRise delay={0.26} className={styles.cardsRow}>
        <DeckRail label={homeHero.cardsLabel} className={styles.cards}>
          {homeHero.cards.map((card) => (
            <Link
              key={card.label}
              href={PRODUCT_BY_ID[card.productId].route}
              className={styles.card}
              data-pole-accent={card.productId}
            >
              {card.image !== null && (
                <Image
                  src={card.image.src}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 75vw, 380px"
                  className={styles.cardImg}
                />
              )}
              <span aria-hidden="true" className={styles.cardVeil} />
              <span className={styles.cardLabel}>{card.label}</span>
              <span aria-hidden="true" className={styles.cardArrow}>
                <ArrowRight size={16} strokeWidth={1.8} />
              </span>
            </Link>
          ))}
        </DeckRail>
      </EnterRise>
    </section>
  );
}
