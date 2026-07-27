import { Check } from "lucide-react";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { Reveal } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { audienceLidar, definitionLidar } from "@/products/lidar/config/content";
import styles from "./DefinitionLidar.module.css";

/** Ce qu'est la prestation (6 usages validés) + à qui elle s'adresse. */
export function DefinitionLidar() {
  return (
    <section className={styles.section}>
      <SectionHeading
        kicker={definitionLidar.kicker}
        title={definitionLidar.title}
        subtitle={definitionLidar.body}
      />
      <Reveal className={styles.inner}>
        <GlassPanel thin className={styles.panel}>
          <ul className={styles.usages}>
            {definitionLidar.usages.map((usage) => (
              <li key={usage} className={styles.usage}>
                <Check aria-hidden="true" className={styles.checkIcon} />
                {usage}
              </li>
            ))}
          </ul>
        </GlassPanel>
      </Reveal>
      <Reveal className={styles.audience}>
        <h3 className={styles.audienceTitle}>{audienceLidar.title}</h3>
        <ul className={styles.audienceList}>
          {audienceLidar.items.map((item) => (
            <li key={item} className={styles.audienceItem}>
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
