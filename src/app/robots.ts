import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/fx-lab", "/vr/merci", "/360/merci"] },
    sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
  };
}
