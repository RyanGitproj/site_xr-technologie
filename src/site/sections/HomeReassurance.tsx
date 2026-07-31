import { homeReassurance } from "@/site/config/content";
import styles from "./HomeReassurance.module.css";

/** Bande réassurance (respiration façon /vr) : qui nous sommes en 4 labels
    courts. Remplace l'ancienne section « à propos », qui concaténait les
    bandes pôles en paragraphes. */
export function HomeReassurance() {
  return (
    <section
      aria-label={homeReassurance.ariaLabel}
      data-below-fold=""
      className={`fx-section ${styles.section}`}
    >
      <ul className={styles.list}>
        {homeReassurance.items.map((item) => (
          <li key={item.label} className={styles.item}>
            <item.icon aria-hidden="true" className={styles.icon} />
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
