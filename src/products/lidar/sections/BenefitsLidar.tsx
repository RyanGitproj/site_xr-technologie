import { benefitsLidar } from "@/products/lidar/config/content";
import styles from "./BenefitsLidar.module.css";

/** Bande réassurance (respiration façon /vr) : les 5 raisons de la
    brochure en labels courts. FUSION TRIPLE des anciennes listes bénéfices
    + améliorations + « pourquoi » (redites quasi mot pour mot) : la preuve
    se vit dans la scène scan, plus dans des paragraphes. */
export function BenefitsLidar() {
  return (
    <section
      id={benefitsLidar.id}
      aria-label={benefitsLidar.ariaLabel}
      className={`fx-section ${styles.section}`}
    >
      <ul className={styles.list}>
        {benefitsLidar.items.map((item) => (
          <li key={item.label} className={styles.item}>
            <item.icon aria-hidden="true" className={styles.icon} />
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
