import { GlassPanel } from "@/components/fx/GlassPanel";
import { Reveal } from "@/components/fx/Reveal";
import { PhoneLink } from "@/components/tracking/PhoneLink";
import { WhatsAppFooterLink } from "@/components/tracking/WhatsAppFooterLink";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/format/whatsapp";
import { contactSection } from "@/site/config/content";
import styles from "./ContactSection.module.css";

/** Contact général léger : email + appel direct + WhatsApp. Les formulaires
    restent la propriété des funnels (le pôle VR est mis en avant vers son devis). */
export function ContactSection() {
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsappNumber,
    contactSection.whatsappMessage,
  );
  return (
    <section id={contactSection.id} data-below-fold="" className={styles.section}>
      <Reveal className={styles.inner}>
        <GlassPanel className={styles.panel}>
          <p className={styles.kicker}>{contactSection.kicker}</p>
          <h2 className={styles.title}>{contactSection.title}</h2>
          <p className={styles.body}>{contactSection.body}</p>
          <div className={styles.actions}>
            <OutlineButton href={`mailto:${siteConfig.contactEmail}`}>
              {contactSection.emailLabel}
            </OutlineButton>
            <PhoneLink e164={siteConfig.phone.e164} className={styles.channel}>
              {contactSection.phoneLabel} {siteConfig.phone.display}
            </PhoneLink>
            <WhatsAppFooterLink href={whatsappHref} className={styles.channel}>
              {contactSection.whatsappLabel}
            </WhatsAppFooterLink>
          </div>
        </GlassPanel>
      </Reveal>
    </section>
  );
}
