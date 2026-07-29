"use client";

import { useCallback, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Compass, Move } from "lucide-react";
import type { ImageSlot } from "@/lib/images";
import { useDeviceTilt } from "@/lib/motion/useDeviceTilt";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import { createPanoMotor } from "@/lib/pano/panoMotor";
import { PANO_ARC_DEG_DEFAULT } from "@/lib/pano/panoMath";
import { cx } from "@/lib/cx";
import type { PanoSceneSpec } from "./Pano360Scene";
import { useSceneGate } from "./useSceneGate";
import { useWebGLSupport } from "./webglSupport";
import styles from "./Pano360Window.module.css";

/** Le chunk three.js n'est téléchargé qu'à l'approche du viewer. */
const Pano360Scene = dynamic(() => import("./Pano360Scene"), { ssr: false });

export type PanoWindowHotspot = { u: number; v: number; label: string };

export type PanoWindowScene = {
  id: string;
  label: string;
  image: ImageSlot;
  projection?: "cylinder" | "sphere";
  arcDeg?: number;
  hotspots: readonly PanoWindowHotspot[];
};

type Pano360WindowProps = {
  scenes: readonly PanoWindowScene[];
  /** Affordance : « Glissez pour regarder autour ». */
  hint: string;
  /** CTA gyroscope iOS (status prompt). */
  gyroLabel: string;
  className?: string;
};

/**
 * Fenêtre 360 interactive : panorama incurvé dans lequel on regarde autour
 * (drag, inertie, gyroscope mobile), hotspots pulsants, sélecteur de scènes.
 * L'image statique de la scène active est TOUJOURS montée sous le canvas :
 * premier paint immédiat, repli intégral (reduced-motion, WebGL absent,
 * chunk en vol) avec sélecteur fonctionnel sans three.js.
 */
export function Pano360Window({ scenes, hint, gyroLabel, className }: Pano360WindowProps) {
  const reduce = useReducedMotionPref();
  const webgl = useWebGLSupport();
  const fine = usePointerFine();
  const { ref, mounted, active } = useSceneGate<HTMLDivElement>();
  const [activeId, setActiveId] = useState(scenes[0]?.id ?? "");
  const [interacted, setInteracted] = useState(false);
  const [openHotspot, setOpenHotspot] = useState<string | null>(null);

  /* Moteur d'interaction porté par ref : muté UNIQUEMENT dans les handlers
     (jamais au rendu), consommé par la scène dans useFrame. */
  const motorRef = useRef(createPanoMotor());
  const tilt = useDeviceTilt({ maxDeg: 24 });
  const hotspotEls = useRef(new Map<string, HTMLButtonElement | null>());

  const specs = useMemo<readonly PanoSceneSpec[]>(
    () =>
      scenes.map((s) => ({
        id: s.id,
        src: s.image.src,
        width: s.image.width,
        height: s.image.height,
        projection: s.projection ?? "cylinder",
        arcDeg: s.arcDeg ?? PANO_ARC_DEG_DEFAULT,
        hotspots: s.hotspots,
      })),
    [scenes],
  );

  const activeScene = scenes.find((s) => s.id === activeId) ?? scenes[0];
  const live = !reduce && webgl && mounted;

  /* Drag manuel (pas de raycast R3F, pas de feature drag framer) : la
     surface écoute le pointeur, la scène consomme les deltas par frame.
     touch-action: pan-y → le glissé vertical continue de scroller la page. */
  const drag = useRef({ x: 0, y: 0, t: 0, vx: 0 });

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
    const motor = motorRef.current;
    motor.dragging = true;
    motor.lastInputAt = performance.now();
    drag.current = { x: event.clientX, y: event.clientY, t: performance.now(), vx: 0 };
    setInteracted(true);
    setOpenHotspot(null);
  }, []);

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const motor = motorRef.current;
    if (!motor.dragging) return;
    const now = performance.now();
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    const dt = Math.max(1, now - drag.current.t);
    motor.pendingDx += dx;
    motor.pendingDy += dy;
    motor.lastInputAt = now;
    /* Vitesse instantanée lissée (80 ms) pour l'inertie au relâcher. */
    drag.current.vx = drag.current.vx * 0.8 + (dx / dt) * 1000 * 0.2;
    drag.current.x = event.clientX;
    drag.current.y = event.clientY;
    drag.current.t = now;
  }, []);

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    delete event.currentTarget.dataset.dragging;
    const motor = motorRef.current;
    if (!motor.dragging) return;
    motor.dragging = false;
    motor.lastInputAt = performance.now();
    motor.releaseVx = performance.now() - drag.current.t < 120 ? drag.current.vx : 0;
  }, []);

  const registerHotspot = useCallback((key: string) => {
    return (el: HTMLButtonElement | null) => {
      hotspotEls.current.set(key, el);
    };
  }, []);

  if (!activeScene) return null;

  return (
    <div ref={ref} className={cx(styles.root, className)}>
      {/* Premier paint + repli : l'image de la scène active, toujours là. */}
      <Image
        key={activeScene.id}
        src={activeScene.image.src}
        alt={activeScene.image.alt}
        fill
        sizes="(max-width: 900px) 100vw, 720px"
        className={styles.still}
      />

      {live ? (
        <Pano360Scene
          scenes={specs}
          activeId={activeId}
          motorRef={motorRef}
          tiltX={tilt.x}
          tiltY={tilt.y}
          gyroActive={tilt.status === "granted"}
          hotspotEls={hotspotEls}
          dpr={fine ? 1.5 : 1}
          active={active}
        />
      ) : null}

      {live ? (
        <div
          className={styles.dragSurface}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />
      ) : null}

      {/* Hotspots : boutons réels (focusables) ; en mode vivant ils sont
          projetés par la scène, en repli ils restent posés en % image. */}
      {activeScene.hotspots.map((h, i) => {
        const key = `${activeScene.id}:${i}`;
        const open = openHotspot === key;
        return (
          <button
            key={key}
            ref={registerHotspot(key)}
            type="button"
            className={styles.hotspot}
            style={live ? undefined : { left: `${h.u * 100}%`, top: `${h.v * 100}%` }}
            data-visible={live ? undefined : "true"}
            data-static={live ? undefined : "true"}
            aria-expanded={open}
            onClick={() => {
              setInteracted(true);
              setOpenHotspot(open ? null : key);
            }}
          >
            <span className={styles.hotspotCore} aria-hidden="true" />
            <span className={cx(styles.hotspotBubble, open && styles.hotspotBubbleOpen)}>{h.label}</span>
          </button>
        );
      })}

      {/* Affordance, une seule fois. */}
      {live && !interacted ? (
        <p className={styles.hint}>
          <Move aria-hidden="true" className={styles.hintIcon} />
          {hint}
        </p>
      ) : null}

      {/* iOS : le gyroscope se demande dans un geste utilisateur. */}
      {live && tilt.status === "prompt" ? (
        <button type="button" className={styles.gyroPill} onClick={() => void tilt.requestAccess()}>
          <Compass aria-hidden="true" className={styles.gyroIcon} />
          {gyroLabel}
        </button>
      ) : null}

      {/* Sélecteur de scènes : fonctionne aussi sans three.js (repli). */}
      {scenes.length > 1 ? (
        <div className={styles.selector} role="group">
          {scenes.map((s) => (
            <button
              key={s.id}
              type="button"
              className={styles.thumb}
              aria-pressed={s.id === activeId}
              onClick={() => {
                setInteracted(true);
                setOpenHotspot(null);
                motorRef.current.lastInputAt = performance.now();
                setActiveId(s.id);
              }}
            >
              <Image src={s.image.src} alt="" width={96} height={48} className={styles.thumbImg} />
              <span className={styles.thumbLabel}>{s.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
