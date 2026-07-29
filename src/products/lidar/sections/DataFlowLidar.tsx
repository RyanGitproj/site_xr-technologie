import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { dataFlowLidar } from "@/products/lidar/config/content";
import styles from "./DataFlowLidar.module.css";

/** Flux de données 01-05, de la capture à la remise : formats nommés
    (E57, CAD/BIM en option) et mention fidèle « validés avant devis ». */
export function DataFlowLidar() {
  return (
    <section id={dataFlowLidar.id} className={styles.section}>
      <SectionHeading
        kicker={dataFlowLidar.kicker}
        title={dataFlowLidar.title}
        subtitle={dataFlowLidar.subtitle}
      />
      <RevealGroup className={styles.flow}>
        {dataFlowLidar.steps.map((step, index) => (
          <RevealItem key={step.title} className={styles.step}>
            <span aria-hidden="true" className={styles.badge}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            {step.note !== undefined && <p className={styles.stepNote}>{step.note}</p>}
          </RevealItem>
        ))}
      </RevealGroup>
      <p className={styles.mention}>{dataFlowLidar.mention}</p>
    </section>
  );
}
