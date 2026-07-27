import { Reveal } from "@/components/fx/Reveal";
import { zoneLidar } from "@/products/lidar/config/content";
import styles from "./ZoneLidar.module.css";

/** Zone d'intervention : Madagascar, océan Indien et au-delà (brochure). */
export function ZoneLidar() {
  return (
    <section className={styles.section}>
      <Reveal className={styles.inner}>
        <h2 className={styles.title}>
          <zoneLidar.zoneIcon aria-hidden="true" className={styles.titleIcon} />
          {zoneLidar.title}
        </h2>
        <ul className={styles.zones}>
          {zoneLidar.zones.map((zone) => (
            <li key={zone} className={styles.zone}>
              {zone}
            </li>
          ))}
        </ul>
        <p className={styles.note}>{zoneLidar.note}</p>
      </Reveal>
    </section>
  );
}
