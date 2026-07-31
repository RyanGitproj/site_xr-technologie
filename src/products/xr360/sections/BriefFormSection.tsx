import { GlassPanel } from "@/components/fx/GlassPanel";
import { Reveal } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { briefFormSection } from "@/products/xr360/config/briefForm";
import { BriefFormLazy } from "@/products/xr360/forms/BriefFormLazy";
import styles from "./BriefFormSection.module.css";

/** Le brief projet : la conversion du funnel 360, sur verre. */
export function BriefFormSection() {
  return (
    <section id={briefFormSection.id} className={styles.section}>
      <SectionHeading
        kicker={briefFormSection.kicker}
        title={briefFormSection.title}
        subtitle={briefFormSection.subtitle}
      />
      <Reveal className={styles.inner}>
        <GlassPanel className={styles.panel}>
          <BriefFormLazy />
        </GlassPanel>
      </Reveal>
    </section>
  );
}
