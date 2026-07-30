import { GlassPanel } from "@/components/fx/GlassPanel";
import { Reveal } from "@/components/fx/Reveal";
import { WhatsAppFooterLink } from "@/components/tracking/WhatsAppFooterLink";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/format/whatsapp";
import { contactSection } from "@/site/config/content";
import styles from "./ContactSection.module.css";

/** Contact général léger : email + WhatsApp. Les formulaires restent la
    propriété des funnels (le pôle VR est mis en avant vers son devis). */
export function ContactSection() {
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsappNumber,
    contactSection.whatsappMessage,
  );
  return (
    <section id={contactSection.id} className={styles.section}>
      <Reveal className={styles.inner}>
        <GlassPanel className={styles.panel}>
          <p className={styles.kicker}>{contactSection.kicker}</p>
          <h2 className={styles.title}>{contactSection.title}</h2>
          <p className={styles.body}>{contactSection.body}</p>
          <div className={styles.actions}>
            <OutlineButton href={`mailto:${siteConfig.contactEmail}`}>
              {contactSection.emailLabel}
            </OutlineButton>
            <WhatsAppFooterLink href={whatsappHref} className={styles.whatsapp}>
              {contactSection.whatsappLabel}
            </WhatsAppFooterLink>
          </div>
        </GlassPanel>
      </Reveal>
    </section>
  );
}
