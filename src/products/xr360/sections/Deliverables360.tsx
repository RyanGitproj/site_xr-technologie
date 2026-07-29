import Image from "next/image";
import { ParallaxLayer } from "@/components/fx/ParallaxLayer";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { deliverables360 } from "@/products/xr360/config/content";
import styles from "./Deliverables360.module.css";

/** Diffusion et partage : mockups devices (les panoramas du lot D dans les
    écrans, preuve que la même captation vit sur tous les supports) +
    devices + canaux. LA seule liste « où ça se voit » de la page : les
    livrables détaillés vivent avec leur famille de prestation. */
export function Deliverables360() {
  return (
    <section id={deliverables360.id} className={styles.section}>
      <SectionHeading kicker={deliverables360.kicker} title={deliverables360.title} />
      <RevealGroup className={styles.inner}>
        <RevealItem className={styles.mockups}>
          {/* Profondeur entre devices : le laptop traîne, le phone devance
              (calques séparés : jamais fusionnés avec le Reveal parent). */}
          <ParallaxLayer depth={-0.12} range={48} touchRange={24}>
            <div className={styles.laptop}>
              <div className={styles.laptopScreen}>
                <span className={styles.screen}>
                  {deliverables360.mockups.laptop !== null && (
                    <Image
                      src={deliverables360.mockups.laptop.src}
                      alt={deliverables360.mockups.laptop.alt}
                      fill
                      sizes="(max-width: 767px) 90vw, 420px"
                      className={styles.screenImg}
                    />
                  )}
                </span>
              </div>
              <div aria-hidden="true" className={styles.laptopBase} />
              <p className={styles.deviceLabel}>{deliverables360.mockupLaptopLabel}</p>
            </div>
          </ParallaxLayer>
          <ParallaxLayer depth={0.16} range={48} touchRange={24}>
            <div className={styles.phone}>
              <div className={styles.phoneScreen}>
                <span className={styles.screen}>
                  {deliverables360.mockups.phone !== null && (
                    <Image
                      src={deliverables360.mockups.phone.src}
                      alt={deliverables360.mockups.phone.alt}
                      fill
                      sizes="90px"
                      className={styles.screenImg}
                    />
                  )}
                </span>
              </div>
              <p className={styles.deviceLabel}>{deliverables360.mockupPhoneLabel}</p>
            </div>
          </ParallaxLayer>
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
