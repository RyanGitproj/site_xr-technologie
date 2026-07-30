import Image from "next/image";
import Link from "next/link";
import { siteLogo } from "@/config/brand";
import styles from "./HeaderBrand.module.css";

/** Lockup XR Technologie de toutes les navbars : logo = retour à l'accueil
    (convention site, actée le 27/07 et généralisée le 30/07). */
export function HeaderBrand() {
  return (
    <Link href="/" className={styles.logo}>
      <Image
        src={siteLogo.src}
        alt={siteLogo.alt}
        width={siteLogo.width}
        height={siteLogo.height}
        priority
        unoptimized
        className={styles.logoImg}
      />
    </Link>
  );
}
