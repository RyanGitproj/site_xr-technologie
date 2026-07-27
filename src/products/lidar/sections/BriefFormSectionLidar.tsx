import { GlassPanel } from "@/components/fx/GlassPanel";
import { Reveal } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { briefFormSection } from "@/products/lidar/config/briefForm";
import { BriefFormLidar } from "@/products/lidar/forms/BriefFormLidar";
import styles from "./BriefFormSectionLidar.module.css";

/** Le brief mission : la conversion du funnel LiDAR, sur verre. */
export function BriefFormSectionLidar() {
  return (
    <section id={briefFormSection.id} className={styles.section}>
      <SectionHeading
        kicker={briefFormSection.kicker}
        title={briefFormSection.title}
        subtitle={briefFormSection.subtitle}
      />
      <Reveal className={styles.inner}>
        <GlassPanel className={styles.panel}>
          <BriefFormLidar />
        </GlassPanel>
      </Reveal>
    </section>
  );
}
