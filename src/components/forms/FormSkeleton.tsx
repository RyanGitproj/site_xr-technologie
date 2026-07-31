import styles from "./FormSkeleton.module.css";

/**
 * Encombrement fantôme affiché pendant que le chunk d'un formulaire lazy
 * (react-phone-number-input + Zod) arrive. Statique et purement décoratif :
 * le formulaire monte à l'hydratation, bien avant que le lecteur descende
 * jusqu'à la section.
 */
export function FormSkeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.bar} />
      <div className={styles.bar} />
      <div className={styles.bar} />
      <div className={styles.bar} />
    </div>
  );
}
