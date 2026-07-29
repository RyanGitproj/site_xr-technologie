import { Reveal } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { hub360 } from "@/products/xr360/config/content";
import styles from "./Hub360.module.css";

/** Positions des satellites (en % du cadre 16/9, desktop uniquement) :
    l'ordre suit hub360.satellites. Layout, pas contenu : elles vivent ici. */
const SATELLITE_POSITIONS = [
  { x: 16, y: 14 },
  { x: 84, y: 14 },
  { x: 11, y: 52 },
  { x: 89, y: 52 },
  { x: 20, y: 88 },
  { x: 80, y: 88 },
] as const;

/** Hub des formats : une captation au centre, les usages en satellites
    reliés. Pattern validé sur /fx-lab ; pile grille en mobile. */
export function Hub360() {
  return (
    <section id={hub360.id} className={styles.section}>
      <SectionHeading kicker={hub360.kicker} title={hub360.title} subtitle={hub360.subtitle} />
      <Reveal>
        <div className={styles.hub}>
          <svg className={styles.lines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {SATELLITE_POSITIONS.slice(0, hub360.satellites.length).map((position) => (
              <line
                key={`${position.x}-${position.y}`}
                x1={50}
                y1={50}
                x2={position.x}
                y2={position.y}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
          <div className={styles.node} style={{ left: "50%", top: "50%" }}>
            <span className={styles.center}>{hub360.center}</span>
          </div>
          {hub360.satellites.map((label, index) => {
            const position = SATELLITE_POSITIONS[index];
            return (
              <div
                key={label}
                className={styles.node}
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
              >
                <span className={styles.satellite}>{label}</span>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
