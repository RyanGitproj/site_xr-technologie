"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { VideoSlot } from "@/lib/images";
import { cx } from "@/lib/cx";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";
import { VIDEO_VISIBLE_RATIO, isVideoVisibleEnough } from "@/lib/motion/videoVisibility";
import styles from "./AmbientVideo.module.css";

type AmbientVideoProps = {
  video: VideoSlot;
  soundOnLabel: string;
  soundOffLabel: string;
  className?: string;
};

/**
 * Vidéo d'ambiance : autoplay muet en boucle qui ne se charge et ne joue
 * QUE tant qu'elle occupe vraiment l'écran (IntersectionObserver +
 * preload=none), et qui se met en pause dès que l'utilisateur scrolle hors
 * de sa section, change d'onglet ou quitte la page. Sous
 * `prefers-reduced-motion`, aucune lecture auto : poster figé + contrôles
 * natifs pour lancer à la demande (la mise en pause hors écran, elle,
 * s'applique quand même : le son ne doit jamais suivre le lecteur).
 * Un bouton coupe/active le son (démarrage muet obligatoire pour
 * l'autoplay). Ratio réservé par le poster (zéro CLS).
 */
export function AmbientVideo({ video, soundOnLabel, soundOffLabel, className }: AmbientVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotionPref();
  const [muted, setMuted] = useState(true);
  const { poster } = video;

  // Un seul juge : « assez visible ». Pas de rootMargin ici (une marge
  // laissait la vidéo parler alors qu'elle avait quitté l'écran), et des
  // seuils échelonnés pour que la sortie de section déclenche la pause.
  useEffect(() => {
    const el = ref.current;
    if (el === null) return;

    let visible = false;
    const sync = () => {
      if (visible && !document.hidden && !reduce) {
        void el.play().catch(() => {});
      } else if (!el.paused) {
        el.pause();
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry === undefined) return;
        visible = isVideoVisibleEnough({
          intersectionHeight: entry.intersectionRect.height,
          elementHeight: entry.boundingClientRect.height,
          rootHeight: entry.rootBounds?.height ?? null,
        });
        sync();
      },
      { threshold: [0, 0.25, VIDEO_VISIBLE_RATIO, 0.75, 1] },
    );
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);
    // pagehide couvre ce que visibilitychange rate sur iOS (retour arrière,
    // bascule d'app) : la bande-son ne survit pas à la page.
    window.addEventListener("pagehide", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pagehide", sync);
      el.pause();
    };
  }, [reduce]);

  function toggleSound() {
    const el = ref.current;
    if (el === null) return;
    const next = !muted;
    setMuted(next);
    el.muted = next;
    if (!next) void el.play().catch(() => {});
  }

  return (
    <div className={cx(styles.root, className)}>
      <video
        ref={ref}
        className={styles.video}
        poster={poster.src}
        width={poster.width}
        height={poster.height}
        aria-label={poster.alt}
        muted={muted}
        loop
        playsInline
        preload="none"
        controls={reduce}
      >
        <source src={video.webm} type="video/webm" />
        <source src={video.mp4} type="video/mp4" />
      </video>

      {!reduce && (
        <button
          type="button"
          className={styles.sound}
          onClick={toggleSound}
          aria-pressed={!muted}
          aria-label={muted ? soundOnLabel : soundOffLabel}
        >
          {muted ? (
            <VolumeX aria-hidden="true" className={styles.soundIcon} />
          ) : (
            <Volume2 aria-hidden="true" className={styles.soundIcon} />
          )}
        </button>
      )}
    </div>
  );
}
