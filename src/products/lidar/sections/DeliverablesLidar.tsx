"use client";

import { useRef, useState } from "react";
import { m } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx } from "@/lib/cx";
import { EASE_OUT, fadeReduced, fadeUp } from "@/lib/motion/variants";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";
import { deliverablesLidar, type DeliverableFamily } from "@/products/lidar/config/content";
import styles from "./DeliverablesLidar.module.css";

type FamilyId = DeliverableFamily["id"];

/** Les 11 livrables derrière un sélecteur à 3 familles (disclosure façon
    /vr : une famille visible à la fois, le mur de tuiles disparaît). Tabs
    a11y : activation automatique aux flèches, roving tabindex. La mention
    fidèle « validés avant devis » clôt la section (occurrence unique). */
export function DeliverablesLidar() {
  const reduce = useReducedMotionPref();
  const [activeId, setActiveId] = useState<FamilyId>(deliverablesLidar.families[0].id);
  const tabRefs = useRef(new Map<FamilyId, HTMLButtonElement>());
  const active =
    deliverablesLidar.families.find((family) => family.id === activeId) ??
    deliverablesLidar.families[0];

  function onTablistKeyDown(event: React.KeyboardEvent) {
    const families = deliverablesLidar.families;
    const currentIndex = families.findIndex((family) => family.id === activeId);
    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % families.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (currentIndex - 1 + families.length) % families.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = families.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const next = families[nextIndex];
    setActiveId(next.id);
    tabRefs.current.get(next.id)?.focus();
  }

  return (
    <section id={deliverablesLidar.id} data-below-fold="" className={styles.section}>
      <SectionHeading
        kicker={deliverablesLidar.kicker}
        title={deliverablesLidar.title}
        subtitle={deliverablesLidar.subtitle}
      />
      <div className={styles.inner}>
        <div
          role="tablist"
          aria-label={deliverablesLidar.selectorLabel}
          className={styles.tabs}
          onKeyDown={onTablistKeyDown}
        >
          {deliverablesLidar.families.map((family) => {
            const selected = family.id === activeId;
            return (
              <button
                key={family.id}
                ref={(node) => {
                  if (node === null) tabRefs.current.delete(family.id);
                  else tabRefs.current.set(family.id, node);
                }}
                type="button"
                role="tab"
                id={`livrable-tab-${family.id}`}
                aria-selected={selected}
                aria-controls="livrable-panel"
                tabIndex={selected ? 0 : -1}
                className={cx(styles.tab, selected && styles.tabActive)}
                onClick={() => setActiveId(family.id)}
              >
                {family.label}
              </button>
            );
          })}
        </div>

        <m.div
          key={active.id}
          id="livrable-panel"
          role="tabpanel"
          aria-labelledby={`livrable-tab-${active.id}`}
          className={styles.grid}
          variants={reduce ? fadeReduced : fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.32, ease: EASE_OUT }}
        >
          {active.items.map((item) => (
            <div key={item.title} className={styles.tile}>
              <h3 className={styles.tileTitle}>{item.title}</h3>
              <p className={styles.tileBody}>{item.body}</p>
            </div>
          ))}
        </m.div>

        <p className={styles.mention}>{deliverablesLidar.mention}</p>
      </div>
    </section>
  );
}
