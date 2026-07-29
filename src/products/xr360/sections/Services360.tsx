import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services360 } from "@/products/xr360/config/content";
import styles from "./Services360.module.css";

/** Les prestations (8 depuis Funnel V2 : FPV, vidéo en ligne et formats
    sociaux ajoutés), en liste éditoriale numérotée : un langage différent
    des cards, la ligne panoramique de la charte en séparateur. */
export function Services360() {
  return (
    <section id={services360.id} className={styles.section}>
      <SectionHeading
        kicker={services360.kicker}
        title={services360.title}
        subtitle={services360.subtitle}
      />
      <RevealGroup className={styles.list}>
        {services360.items.map((item, index) => (
          <RevealItem key={item.title} className={styles.row}>
            <span aria-hidden="true" className={styles.number}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <item.icon aria-hidden="true" className={styles.icon} />
            <div className={styles.text}>
              <h3 className={styles.rowTitle}>{item.title}</h3>
              <p className={styles.rowBody}>{item.body}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
