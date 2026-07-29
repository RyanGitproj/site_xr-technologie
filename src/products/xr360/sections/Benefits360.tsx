import { benefits360 } from "@/products/xr360/config/content";
import styles from "./Benefits360.module.css";

/** Bande atouts (respiration façon ReassuranceBar /vr) : 4 bénéfices en
    labels courts, lisibles d'un coup d'œil. La preuve se vit dans la
    fenêtre 360 juste en dessous : aucun paragraphe ne la redit. */
export function Benefits360() {
  return (
    <section
      id={benefits360.id}
      aria-label={benefits360.ariaLabel}
      className={`fx-section ${styles.section}`}
    >
      <ul className={styles.list}>
        {benefits360.items.map((item) => (
          <li key={item.label} className={styles.item}>
            <item.icon aria-hidden="true" className={styles.icon} />
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
