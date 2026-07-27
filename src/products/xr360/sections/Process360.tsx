import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { process360 } from "@/products/xr360/config/content";
import styles from "./Process360.module.css";

/** Le déroulement en 5 étapes : timeline verticale reliée par la ligne
    panoramique, du premier échange à la diffusion. */
export function Process360() {
  return (
    <section id={process360.id} className={styles.section}>
      <SectionHeading
        kicker={process360.kicker}
        title={process360.title}
        subtitle={process360.subtitle}
      />
      <RevealGroup className={styles.timeline}>
        {process360.steps.map((step, index) => (
          <RevealItem key={step.title} className={styles.step}>
            <div className={styles.marker}>
              <span className={styles.number}>{index + 1}</span>
            </div>
            <div className={styles.content}>
              <step.icon aria-hidden="true" className={styles.icon} />
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
