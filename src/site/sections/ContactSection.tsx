import Link from "next/link";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { Reveal } from "@/components/fx/Reveal";
import { WhatsAppFooterLink } from "@/components/tracking/WhatsAppFooterLink";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { LIVE_PRODUCTS } from "@/config/products";
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
  const vrProduct = LIVE_PRODUCTS.find((product) => product.id === "vr");

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
          {vrProduct !== undefined && (
            <p className={styles.vrNote} data-pole-accent={vrProduct.id}>
              {contactSection.vrFormNote}{" "}
              <Link href={vrProduct.route} className={styles.vrLink}>
                {contactSection.vrFormCta} →
              </Link>
            </p>
          )}
        </GlassPanel>
      </Reveal>
    </section>
  );
}
