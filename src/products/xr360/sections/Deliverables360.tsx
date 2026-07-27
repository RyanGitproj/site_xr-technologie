import { Check } from "lucide-react";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { deliverables360 } from "@/products/xr360/config/content";
import styles from "./Deliverables360.module.css";

/** Livrables + diffusion + partage : la preuve que la captation sert tous
    les supports. Panneau verre unique, trois registres. */
export function Deliverables360() {
  return (
    <section id={deliverables360.id} className={styles.section}>
      <SectionHeading kicker={deliverables360.kicker} title={deliverables360.title} />
      <RevealGroup className={styles.inner}>
        <RevealItem>
          <GlassPanel thin className={styles.panel}>
            <ul className={styles.items}>
              {deliverables360.items.map((item) => (
                <li key={item} className={styles.item}>
                  <Check aria-hidden="true" className={styles.checkIcon} />
                  {item}
                </li>
              ))}
            </ul>
          </GlassPanel>
        </RevealItem>
        <RevealItem className={styles.columns}>
          <div>
            <h3 className={styles.colTitle}>{deliverables360.diffusionTitle}</h3>
            <ul className={styles.devices}>
              {deliverables360.diffusion.map((device) => (
                <li key={device.label} className={styles.device}>
                  <device.icon aria-hidden="true" className={styles.deviceIcon} />
                  <span className={styles.deviceLabel}>{device.label}</span>
                  <span className={styles.deviceNote}>{device.note}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={styles.colTitle}>{deliverables360.shareTitle}</h3>
            <ul className={styles.shares}>
              {deliverables360.share.map((item) => (
                <li key={item.label} className={styles.share}>
                  <item.icon aria-hidden="true" className={styles.deviceIcon} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
