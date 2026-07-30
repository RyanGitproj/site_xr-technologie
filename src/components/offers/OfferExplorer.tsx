"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { TapHint } from "@/components/fx/TapHint";
import type { ProductId } from "@/config/products";
import { cx } from "@/lib/cx";
import { formatAriary } from "@/lib/format/ariary";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";
import { EASE_OUT, fadeReduced, fadeUp, staggerChildren } from "@/lib/motion/variants";
import { fbEvent, META_CATEGORIES } from "@/lib/tracking/fpixel";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";
import { getGroup, groupPriceFrom, selectorColumns } from "./catalog";
import { PackCard } from "./PackCard";
import { useOfferDemo } from "./useOfferDemo";
import type { OfferCopy, OfferGroup, OfferPack } from "./types";
import styles from "./OfferExplorer.module.css";

type OfferExplorerProps<Id extends string> = {
  groups: readonly OfferGroup<Id>[];
  copy: OfferCopy;
  /** Pôle : tracking (dataLayer + Meta) et clé de démo, jamais du style. */
  product: ProductId;
  /** Id de la section formulaire de la page (« devis », « brief »). */
  formAnchor: string;
  /** Libellé du bloc d'options chiffrées, quand des packs en portent. */
  optionsLabel?: string;
  /** Présélection engagée : écriture du store de la page. Le tracking et le
      scroll sont pris en charge ici et par le bouton. */
  onChoose: (groupId: Id, packId: string) => void;
};

/**
 * Interaction signature des trois funnels : une grille de tuiles (pattern
 * tabs, donc un commutateur de contenu et pas une saisie) pilote les 3 packs
 * affichés. La tuile ACTIVE est un état local d'affichage ; la sélection
 * ENGAGÉE (groupe + pack → formulaire) n'est écrite qu'au clic sur le CTA.
 * Seul le groupe actif est monté, jamais tout le catalogue.
 */
export function OfferExplorer<Id extends string>({
  groups,
  copy,
  product,
  formAnchor,
  optionsLabel,
  onChoose,
}: OfferExplorerProps<Id>) {
  const [activeId, setActiveId] = useState<Id>(groups[0].id);
  // Souris sur les TUILES uniquement : un clic est imminent, la démo ne doit
  // pas changer la tuile sous le curseur. Le reste de la section ne suspend
  // pas : un curseur simplement posé au milieu de la page (position naturelle
  // au scroll molette) ne doit pas priver le visiteur de la démo.
  const [demoSuspended, setDemoSuspended] = useState(false);
  const tabRefs = useRef(new Map<Id, HTMLButtonElement>());
  const selectorWrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionPref();

  const activeGroup = getGroup(groups, activeId);
  const panelId = `${product}-offre-panel`;
  const tabId = (id: Id) => `${product}-offre-tab-${id}`;

  // Démo guidée « visite du catalogue » : activation réelle mais sans
  // tracking ni écriture du store ; boucle tant qu'aucune interaction,
  // condamnée au premier geste utilisateur (cancelDemo).
  const getTile = useCallback(
    (groupIndex: number) => {
      const group = groups[groupIndex];
      return group === undefined ? undefined : tabRefs.current.get(group.id);
    },
    [groups],
  );
  const onDemoSelect = useCallback(
    (groupIndex: number) => {
      const group = groups[groupIndex];
      if (group !== undefined) setActiveId(group.id);
    },
    [groups],
  );
  const { state: demo, cancel: cancelDemo } = useOfferDemo({
    wrapRef: selectorWrapRef,
    enabled: !reduce,
    suspended: demoSuspended,
    tileCount: groups.length,
    storageKey: `xr_offres_demo_${product}`,
    getTile,
    onDemoSelect,
  });
  const suspendDemo = () => setDemoSuspended(true);
  const resumeDemo = () => setDemoSuspended(false);

  function selectGroup(id: Id) {
    cancelDemo();
    if (id === activeId) return;
    setActiveId(id);
    pushDataLayerEvent("offer_select", { product, offre: id });
    // Meta ViewContent : la sélection d'offre est le seul « contenu produit »
    // consulté de ces landings mono-page. cancelDemo() ci-dessus garantit que
    // la démo auto (qui n'appelle jamais selectGroup) ne le déclenche pas.
    fbEvent("ViewContent", {
      content_name: getGroup(groups, id).name,
      content_category: META_CATEGORIES[product].view,
    });
  }

  /** Tabs avec activation automatique : les flèches déplacent focus ET sélection. */
  function onTablistKeyDown(event: React.KeyboardEvent) {
    cancelDemo();
    const currentIndex = groups.findIndex((group) => group.id === activeId);
    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % groups.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (currentIndex - 1 + groups.length) % groups.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = groups.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const next = groups[nextIndex];
    selectGroup(next.id);
    tabRefs.current.get(next.id)?.focus();
  }

  function choosePack(pack: OfferPack) {
    cancelDemo();
    onChoose(activeId, pack.id);
    pushDataLayerEvent("pack_choose", { product, offre: activeId, pack: pack.id });
  }

  // Mêmes variants que les Reveal (lib/motion/variants) : le switch de groupe
  // parle le langage motion du reste de la page.
  const packVariants = reduce ? fadeReduced : fadeUp;

  return (
    <div>
      <p className={styles.hint}>{copy.hint}</p>
      <div ref={selectorWrapRef} className={styles.selectorWrap}>
        <div
          role="tablist"
          aria-label={copy.selectorLabel}
          className={styles.selector}
          style={{ "--tile-cols": String(selectorColumns(groups.length)) } as React.CSSProperties}
          onKeyDown={onTablistKeyDown}
          onFocusCapture={cancelDemo}
          onPointerEnter={suspendDemo}
          onPointerLeave={resumeDemo}
        >
          {groups.map((group) => {
            const Icon = group.icon;
            const active = group.id === activeId;
            return (
              <button
                key={group.id}
                ref={(node) => {
                  if (node === null) tabRefs.current.delete(group.id);
                  else tabRefs.current.set(group.id, node);
                }}
                type="button"
                role="tab"
                id={tabId(group.id)}
                aria-selected={active}
                aria-controls={panelId}
                tabIndex={active ? 0 : -1}
                data-offer-accent={group.id}
                className={cx(styles.tile, active && styles.tileActive)}
                onClick={() => selectGroup(group.id)}
              >
                <Icon aria-hidden="true" className={styles.tileIcon} />
                <span className={styles.tileName}>{group.shortName}</span>
                <span className={styles.tilePrice}>
                  {copy.pricePrefix}{" "}
                  <strong className={styles.tilePriceValue}>
                    {formatAriary(groupPriceFrom(group))}
                  </strong>
                </span>
              </button>
            );
          })}
        </div>

        {demo.position !== null && (
          <m.div
            className={styles.demoHand}
            initial={false}
            animate={{ x: demo.position.x, y: demo.position.y }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <TapHint visible={demo.visible} tapCount={demo.tapCount} />
          </m.div>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={activeId}
          role="tabpanel"
          id={panelId}
          aria-labelledby={tabId(activeId)}
          data-offer-accent={activeId}
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, transition: { duration: 0.18 } }}
        >
          <m.p variants={packVariants} className={styles.panelIntro}>
            {copy.panelIntroPrefix}{" "}
            <strong className={styles.panelIntroOffer}>{activeGroup.name}</strong>
          </m.p>
          <m.p variants={packVariants} className={styles.tagline}>
            {activeGroup.tagline}
          </m.p>
          <div className={styles.packs}>
            {activeGroup.packs.map((pack) => (
              <m.div
                key={pack.id}
                variants={packVariants}
                className={cx(styles.packItem, pack.featured === true && styles.packItemFeatured)}
              >
                <PackCard
                  pack={pack}
                  pricePrefix={copy.pricePrefix}
                  cta={copy.cta}
                  formAnchor={formAnchor}
                  optionsLabel={optionsLabel}
                  onChoose={() => choosePack(pack)}
                />
              </m.div>
            ))}
          </div>
        </m.div>
      </AnimatePresence>
    </div>
  );
}
