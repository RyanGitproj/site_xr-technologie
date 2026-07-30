"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cx } from "@/lib/cx";
import {
  railNearestPage,
  railPageOffsets,
  railPerView,
  railSlideState,
} from "@/lib/motion/deckRailMath";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";
import styles from "./DeckRail.module.css";

/** Au-delà de ce déplacement cumulé, le relâchement du bouton était un glissé :
    le clic qui suit ne doit pas activer le lien de la carte. */
const DRAG_CLICK_PX = 6;
/** Sous cette part visible, un clic recentre la carte au lieu de l'activer. */
const FOCUS_DEPTH = 0.85;
/** Vitesse (px/s) au-delà de laquelle un relâchement est un flick, pas un dépôt. */
const FLICK_PX_PER_S = 320;
const AUTOPLAY_MS = 6000;

interface RailGeometry {
  slides: HTMLElement[];
  offsets: number[];
  depths: number[];
  slideWidth: number;
  viewWidth: number;
  maxScroll: number;
  perView: number;
  pageOffsets: number[];
}

type DeckRailProps = {
  /** Nom du carrousel pour les lecteurs d'écran (ex. « Épisodes de la série »). */
  label: string;
  /** Fait tourner la pile tant que personne n'y a touché. */
  autoplay?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Rail de cartes en pile : les cartes pleinement visibles sont à l'identité,
 * celles qui débordent glissent sous leur voisine, rétrécissent et pivotent
 * (tokens `--deck-*`). Le pivot suit le défilement image par image, d'où
 * l'impression que la pile tourne quand on slide.
 *
 * Perf : la géométrie est mesurée au montage et au redimensionnement, JAMAIS
 * pendant le défilement. Lire le layout à chaque frame d'un défilement lissé
 * force un reflow par événement (mesuré à ~32 fps sous CPU×4 sur le rail de
 * réservation du projet Liberty Roots, d'où vient cette mécanique). Le
 * handler de scroll ne fait que du calcul pur, throttlé en rAF.
 *
 * Le transform vit sur `.slideInner` et jamais sur `.slide` : `.slide` porte
 * `scroll-snap-align`, le transformer déplacerait la zone d'accroche et
 * casserait le défilement programmatique.
 *
 * Largeur des cartes : décidée en CSS via `--deck-slide` (surchargeable par
 * la section), le nombre de cartes par vue en est DÉDUIT. Un breakpoint
 * dupliqué en JS finirait par diverger du CSS.
 */
export function DeckRail({ label, autoplay = false, className, children }: DeckRailProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const geomRef = useRef<RailGeometry | null>(null);
  const rafRef = useRef(0);
  const activePageRef = useRef(0);
  const reduce = useReducedMotionPref();

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);
  /* Le défilement auto s'arrête définitivement au premier geste : il donne
     l'affordance, il ne dispute pas la main à l'utilisateur. */
  const [engaged, setEngaged] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);

  const slides = Children.toArray(children);

  /* Synchronisation : calcul pur depuis scrollLeft et la géométrie en cache. */
  const sync = useCallback(() => {
    const el = trackRef.current;
    const geom = geomRef.current;
    if (!el || !geom) return;
    const scrollLeft = el.scrollLeft;

    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft < geom.maxScroll - 4);

    const page = railNearestPage(geom.pageOffsets, scrollLeft);
    activePageRef.current = page;
    setActivePage(page);

    for (let i = 0; i < geom.slides.length; i++) {
      const { depth, side } = railSlideState(
        geom.offsets[i],
        geom.slideWidth,
        scrollLeft,
        geom.viewWidth,
      );
      geom.depths[i] = depth;
      const slide = geom.slides[i];
      slide.style.setProperty("--depth", depth.toFixed(3));
      slide.style.setProperty("--side", String(side));
      /* Les cartes en retrait passent SOUS leurs voisines : c'est ce qui fait
         lire la pile, le décalage seul ne suffirait pas. */
      slide.style.zIndex = String(Math.round(depth * 100));
    }
  }, []);

  const scheduleSync = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      sync();
    });
  }, [sync]);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const found = [...el.querySelectorAll<HTMLElement>("[data-slide]")];
    if (found.length === 0) return;
    const slideWidth = found[0].offsetWidth;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
    const offsets = found.map((slide) => slide.offsetLeft - found[0].offsetLeft);
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const perView = railPerView(el.clientWidth, slideWidth, gap);
    const pageOffsets = railPageOffsets(offsets, perView, maxScroll);
    geomRef.current = {
      slides: found,
      offsets,
      depths: found.map(() => 1),
      slideWidth,
      viewWidth: el.clientWidth,
      maxScroll,
      perView,
      pageOffsets,
    };
    setPageCount(pageOffsets.length);
    sync();
  }, [sync]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    /* Neutralise la restauration de scroll du navigateur : un rechargement ne
       doit jamais laisser le rail posé au milieu d'une carte. */
    el.scrollLeft = 0;
    measure();
    el.addEventListener("scroll", scheduleSync, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      el.removeEventListener("scroll", scheduleSync);
      observer.disconnect();
    };
  }, [measure, scheduleSync]);

  /* Visibilité réelle : le défilement auto ne doit pas dérouler la série
     avant que l'utilisateur n'arrive dessus. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !autoplay) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [autoplay]);

  const scrollToPage = useCallback(
    (page: number) => {
      const el = trackRef.current;
      const geom = geomRef.current;
      if (!el || !geom) return;
      const index = Math.min(geom.pageOffsets.length - 1, Math.max(0, page));
      el.scrollTo({ left: geom.pageOffsets[index], behavior: reduce ? "auto" : "smooth" });
    },
    [reduce],
  );

  const navigate = useCallback(
    (page: number) => {
      setEngaged(true);
      scrollToPage(page);
    },
    [scrollToPage],
  );

  /* Défilement auto en va-et-vient : un retour brutal au début après la
     dernière page se lit comme un bug, pas comme une boucle. */
  const autoplayDir = useRef<1 | -1>(1);

  useEffect(() => {
    if (!autoplay || reduce || engaged || hovered || !inView || pageCount < 2) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      const current = activePageRef.current;
      if (current + autoplayDir.current >= pageCount) autoplayDir.current = -1;
      else if (current + autoplayDir.current < 0) autoplayDir.current = 1;
      scrollToPage(current + autoplayDir.current);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoplay, reduce, engaged, hovered, inView, pageCount, scrollToPage]);

  /* Glissé à la souris : framer-motion tourne en LazyMotion strict/domAnimation
     dans ce projet, la feature `drag` n'y est pas chargée. Pointer Events
     manuels, comme la fenêtre pano. Le tactile garde le défilement natif. */
  const drag = useRef({ armed: false, dragging: false, x: 0, t: 0, vx: 0, moved: 0 });

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    /* Armé seulement : la capture du pointeur attend le franchissement du
       seuil. La poser dès maintenant retargeterait le `click` qui suit sur la
       piste, et une carte cliquée ne serait plus la cible de l'événement
       (mesuré : event.target = la piste, jamais la carte). */
    drag.current = {
      armed: true,
      dragging: false,
      x: event.clientX,
      t: performance.now(),
      vx: 0,
      moved: 0,
    };
    setEngaged(true);
  }, []);

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state.armed) return;
    const now = performance.now();
    const dx = event.clientX - state.x;
    state.moved += Math.abs(dx);

    if (!state.dragging) {
      if (state.moved <= DRAG_CLICK_PX) {
        state.x = event.clientX;
        return;
      }
      state.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      /* Le snap `mandatory` ramènerait la carte à chaque écriture de
         scrollLeft : coupé le temps du geste, il reprend au relâcher. */
      event.currentTarget.dataset.dragging = "true";
    }

    const dt = Math.max(1, now - state.t);
    event.currentTarget.scrollLeft -= dx;
    /* Vitesse instantanée lissée (EMA 80 ms) pour juger le flick au relâcher. */
    state.vx = state.vx * 0.8 + (dx / dt) * 1000 * 0.2;
    state.x = event.clientX;
    state.t = now;
  }, []);

  const endDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const state = drag.current;
      if (!state.armed) return;
      state.armed = false;
      if (!state.dragging) return;
      state.dragging = false;
      const el = event.currentTarget;
      if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
      delete el.dataset.dragging;
      const flick = performance.now() - state.t < 120 ? state.vx : 0;
      const step = Math.abs(flick) > FLICK_PX_PER_S ? (flick < 0 ? 1 : -1) : 0;
      scrollToPage(activePageRef.current + step);
    },
    [scrollToPage],
  );

  /* Phase de capture : la cible est souvent un lien (les portes du hero
     d'accueil). Une carte en retrait se recentre au lieu de naviguer, et un
     clic qui conclut un glissé est annulé. */
  const onClickCapture = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (drag.current.moved > DRAG_CLICK_PX) {
        drag.current.moved = 0;
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      const geom = geomRef.current;
      if (!geom) return;
      const slide = (event.target as HTMLElement).closest<HTMLElement>("[data-slide]");
      if (slide === null) return;
      const index = Number(slide.dataset.index);
      if (geom.depths[index] >= FOCUS_DEPTH) return;
      event.preventDefault();
      navigate(Math.floor(index / geom.perView));
    },
    [navigate],
  );

  const showControls = pageCount > 1;

  return (
    <div
      ref={rootRef}
      className={cx(styles.rail, className)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div
        ref={trackRef}
        className={styles.track}
        role="group"
        aria-roledescription="carrousel"
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        /* Sorti de la piste avant d'avoir franchi le seuil : il n'y a pas de
           capture, donc pas de pointerup à venir. On désarme. */
        onPointerLeave={() => {
          if (!drag.current.dragging) drag.current.armed = false;
        }}
        onClickCapture={onClickCapture}
      >
        {/* La clé est la position : c'est bien l'identité du slot dans le
            rail, les enfants portent déjà leur propre clé. */}
        {slides.map((slide, index) => (
          <div key={index} className={styles.slide} data-slide data-index={index}>
            <div className={styles.slideInner}>{slide}</div>
          </div>
        ))}
      </div>

      {/* Barre de contrôle SOUS le rail, identique mobile et desktop : des
          flèches posées sur les cartes masqueraient le contenu justement
          composé pour l'overlay (zones sombres porteuses du texte). */}
      {showControls && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.arrow}
            disabled={!canPrev}
            onClick={() => navigate(activePage - 1)}
            aria-label={`${label} : précédent`}
          >
            <ChevronLeft size={20} strokeWidth={1.8} aria-hidden="true" />
          </button>

          <div className={styles.dots} role="tablist" aria-label={`${label} : pages`}>
            {Array.from({ length: pageCount }, (_, page) => (
              <button
                key={page}
                type="button"
                role="tab"
                className={styles.dot}
                aria-selected={page === activePage}
                aria-label={`Page ${page + 1} sur ${pageCount}`}
                onClick={() => navigate(page)}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.arrow}
            disabled={!canNext}
            onClick={() => navigate(activePage + 1)}
            aria-label={`${label} : suivant`}
          >
            <ChevronRight size={20} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
