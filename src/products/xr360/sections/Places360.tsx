import { Check } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { places360 } from "@/products/xr360/config/content";
import styles from "./Places360.module.css";

/** Types de lieux (tuiles compactes) + ce que le visiteur peut faire
    (liste à cocher aérée) : le lecteur se reconnaît, puis se projette. */
export function Places360() {
  return (
    <section id={places360.id} className={styles.section}>
      <SectionHeading kicker={places360.kicker} title={places360.title} />
      <RevealGroup className={styles.grid}>
        {places360.items.map((item) => (
          <RevealItem key={item.title} className={styles.tile}>
            <item.icon aria-hidden="true" className={styles.tileIcon} />
            <h3 className={styles.tileTitle}>{item.title}</h3>
            <p className={styles.tileBody}>{item.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>
      <RevealGroup className={styles.visitor}>
        <RevealItem>
          <h3 className={styles.visitorTitle}>{places360.visitorTitle}</h3>
        </RevealItem>
        <RevealItem>
          <ul className={styles.visitorList}>
            {places360.visitorItems.map((item) => (
              <li key={item} className={styles.visitorItem}>
                <Check aria-hidden="true" className={styles.checkIcon} />
                {item}
              </li>
            ))}
          </ul>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
