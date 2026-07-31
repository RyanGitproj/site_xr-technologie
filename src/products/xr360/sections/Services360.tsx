"use client";

import { useRef, useState } from "react";
import { m } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx } from "@/lib/cx";
import { EASE_OUT, fadeReduced, fadeUp } from "@/lib/motion/variants";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";
import { services360, type ServiceFamily } from "@/products/xr360/config/content";
import styles from "./Services360.module.css";

type FamilyId = ServiceFamily["id"];

/** Les 8 prestations derrière un sélecteur à 3 familles (disclosure façon
    OfferExplorer, sans démo auto ni tracking) : une famille visible à la
    fois, ses livrables avec elle. Tabs a11y : activation automatique aux
    flèches, roving tabindex. */
export function Services360() {
  const reduce = useReducedMotionPref();
  const [activeId, setActiveId] = useState<FamilyId>(services360.families[0].id);
  const tabRefs = useRef(new Map<FamilyId, HTMLButtonElement>());
  const active =
    services360.families.find((family) => family.id === activeId) ?? services360.families[0];

  function onTablistKeyDown(event: React.KeyboardEvent) {
    const families = services360.families;
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
    <section id={services360.id} data-below-fold="" className={styles.section}>
      <SectionHeading
        kicker={services360.kicker}
        title={services360.title}
        subtitle={services360.subtitle}
      />
      <div className={styles.inner}>
        <div
          role="tablist"
          aria-label={services360.selectorLabel}
          className={styles.tabs}
          onKeyDown={onTablistKeyDown}
        >
          {services360.families.map((family) => {
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
                id={`prestation-tab-${family.id}`}
                aria-selected={selected}
                aria-controls="prestation-panel"
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
          id="prestation-panel"
          role="tabpanel"
          aria-labelledby={`prestation-tab-${active.id}`}
          className={styles.panel}
          variants={reduce ? fadeReduced : fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.32, ease: EASE_OUT }}
        >
          <p className={styles.intro}>{active.intro}</p>
          <div className={styles.rows}>
            {active.items.map((item) => (
              <div key={item.title} className={styles.row}>
                <item.icon aria-hidden="true" className={styles.icon} />
                <div>
                  <h3 className={styles.rowTitle}>{item.title}</h3>
                  <p className={styles.rowBody}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.deliverables}>
            <span className={styles.deliverablesLabel}>{services360.deliverablesLabel}</span>
            {active.deliverables.map((deliverable) => (
              <span key={deliverable} className={styles.chip}>
                {deliverable}
              </span>
            ))}
          </p>
        </m.div>
      </div>
    </section>
  );
}
